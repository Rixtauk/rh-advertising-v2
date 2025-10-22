# Data Directory Flow Analysis - RH Advertising V2

## Current Problem

**Symptom**: Railway API returns error "Data directory not found" when trying to generate ad copy or fetch ad limits.

**Error Message**:
```json
{"detail":"Failed to generate copy: Data directory not found. Tried: //data, /app/data, and /app/data"}
```

**What Works**:
- Landing page optimizer (doesn't need YAML files)
- Health check endpoint

**What Fails**:
- Copy generation (needs `ad_limits.yaml`)
- Ad limits API (needs `ad_limits.yaml`)
- Asset specs API (needs `asset_specs.yaml`)
- Any endpoint requiring YAML configuration files

---

## Architecture Overview

### Repository Structure

```
RH Advertising V2/
├── api/                      # FastAPI backend
│   ├── app/
│   │   ├── main.py           # FastAPI app entry point
│   │   ├── config_loader.py  # YAML config loader (CRITICAL)
│   │   ├── routes/           # API endpoints
│   │   └── services/         # Business logic
│   └── pyproject.toml        # Python dependencies
├── web/                      # Next.js frontend
│   └── app/                  # React components
├── data/                     # YAML configuration (CRITICAL)
│   ├── ad_limits.yaml        # Character limits per channel
│   ├── asset_specs.yaml      # Creative specifications
│   └── taxonomies.yaml       # Controlled vocabularies
└── nixpacks.toml             # Railway build configuration
```

### Deployment Architecture

- **Frontend**: Vercel (Next.js) → https://rh-advertising-v2.vercel.app
- **Backend**: Railway (FastAPI) → https://rh-advertising-v2-production.up.railway.app
- **Data**: YAML files must be accessible to Railway backend

---

## Expected Build Flow (Railway)

### 1. Railway Build Process (Nixpacks)

**File**: `nixpacks.toml`

```toml
[phases.setup]
nixPkgs = ["python311", "python311Packages.pip"]

[phases.install]
cmds = [
  "cd api && python -m pip install --upgrade pip && python -m pip install -e ."
]

[phases.build]
cmds = [
  "ls -la data || echo 'Warning: data directory not found in root'",
  "cp -r data api/data && echo 'Successfully copied data to api/data' || echo 'ERROR: Failed to copy data directory'",
  "ls -la api/data || echo 'ERROR: api/data directory does not exist after copy'"
]

[start]
cmd = "cd api && python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT"
```

**Expected Steps**:

1. **Setup Phase**: Install Python 3.11 and pip
2. **Install Phase**:
   - `cd api` → changes to `/app/api/` directory
   - Install Python dependencies from `pyproject.toml`
   - **Working Directory**: `/app/api/`

3. **Build Phase** (CRITICAL):
   - **Working Directory**: `/app/` (root, NOT in api/)
   - `ls -la data` → Should show data directory contents
   - `cp -r data api/data` → Copies data/ to api/data/
   - `ls -la api/data` → Should verify data was copied successfully

4. **Start Phase**:
   - `cd api` → changes to `/app/api/`
   - Starts uvicorn server
   - **Running Directory**: `/app/api/`

**Expected File Structure After Build**:
```
/app/
├── api/
│   ├── app/
│   │   ├── main.py
│   │   └── config_loader.py
│   ├── data/              ← COPIED HERE during build phase
│   │   ├── ad_limits.yaml
│   │   ├── asset_specs.yaml
│   │   └── taxonomies.yaml
│   └── pyproject.toml
└── data/                  ← ORIGINAL location
    ├── ad_limits.yaml
    ├── asset_specs.yaml
    └── taxonomies.yaml
```

---

## Runtime Data Directory Detection

### File: `api/app/config_loader.py`

**Function**: `_get_data_path()` - Called every time YAML files need to be loaded

**Current Logic** (as of latest commit):

```python
def _get_data_path() -> Path:
    """Get path to data directory."""
    # List of possible data directory locations to try
    possible_paths = []

    # 1. Relative to project root (local development)
    # If __file__ is /project/api/app/config_loader.py, root is /project
    root = Path(__file__).parent.parent.parent
    possible_paths.append(root / "data")

    # 2. Current working directory + data (common deployment)
    possible_paths.append(Path.cwd() / "data")

    # 3. api/data relative to module location (Railway nixpacks build)
    # If __file__ is /app/api/app/config_loader.py, this is /app/api/data
    possible_paths.append(Path(__file__).parent.parent / "data")

    # 4. Absolute path /app/api/data (Railway production)
    possible_paths.append(Path("/app/api/data"))

    # 5. Absolute path /app/data (alternate deployment)
    possible_paths.append(Path("/app/data"))

    # Try each path and return the first one that exists
    for path in possible_paths:
        logger.debug(f"Checking data path: {path}")
        if path.exists() and path.is_dir():
            logger.info(f"Found data directory at: {path}")
            return path

    # If nothing found, log all attempts and raise error
    tried_paths = ", ".join(str(p) for p in possible_paths)
    raise FileNotFoundError(
        f"Data directory not found. Tried: {tried_paths}"
    )
```

**Expected Runtime Behavior**:

When `_get_data_path()` is called, assuming `__file__` is `/app/api/app/config_loader.py`:

1. **Path 1**: `/app/data` (root / "data")
   - `Path(__file__).parent.parent.parent` = `/app/api/app/` → `parent` → `/app/api/` → `parent` → `/app/` → `parent` → `/`
   - **WAIT - THIS IS WRONG!**
   - Actually: `/app/api/app/config_loader.py` → 3x parent → `/`
   - So path is `/ / data` → `//data` ← **THIS EXPLAINS THE ERROR!**

2. **Path 2**: `/app/api/data` (cwd / "data")
   - If `cwd()` is `/app/api/` then this is `/app/api/data` ✓

3. **Path 3**: `/app/api/data` (__file__.parent.parent / "data")
   - `/app/api/app/config_loader.py` → `parent.parent` → `/app/api/` + `data` → `/app/api/data` ✓

4. **Path 4**: `/app/api/data` (absolute) ✓

5. **Path 5**: `/app/data` (absolute) ✓

---

## ROOT CAUSE IDENTIFIED

### The `//data` Error Explained

The error shows: `"Tried: //data, /app/data, and /app/data"`

**Path 1 Calculation**:
```python
root = Path(__file__).parent.parent.parent
# If __file__ = "/app/api/app/config_loader.py"
# parent = "/app/api/app"
# parent.parent = "/app/api"
# parent.parent.parent = "/app"  ← SHOULD BE THIS
# BUT IT'S ACTUALLY GOING TO ROOT "/"
```

**The Issue**: If Railway's actual file structure is:
```
/app/
└── api/
    └── app/
        └── config_loader.py
```

Then `Path("/app/api/app/config_loader.py").parent.parent.parent` = `/app/` (CORRECT)

But the error shows `//data` which means `root` is resolving to `/` (filesystem root), not `/app/`.

**This means one of two things**:

1. **The file path in Railway is NOT `/app/api/app/config_loader.py`**
   - It might be `/api/app/config_loader.py` (missing `/app` prefix)
   - Then `.parent.parent.parent` would give `/` → `//data`

2. **The build phase data copy is failing silently**
   - Data is never copied to `/app/api/data`
   - All 5 paths fail to find the directory

---

## Why The Error Shows Same Path Twice

Error: `"Tried: //data, /app/data, and /app/data"`

Looking at the old code (before robust fix), it was checking:
1. `root / "data"` → `//data`
2. `Path.cwd() / "data"` → `/app/data`
3. `Path(__file__).parent.parent / "data"` → `/app/data` (duplicate)

**The old error persisting means Railway hasn't actually deployed the new code!**

---

## Verification Steps Needed

### 1. Check Railway Build Logs

In Railway dashboard, check the build logs for:

```
# Should see from build phase:
ls -la data
# Expected: list of ad_limits.yaml, asset_specs.yaml, taxonomies.yaml

Successfully copied data to api/data
# Expected: confirmation message

ls -la api/data
# Expected: list of YAML files in api/data
```

**If you see**:
- `Warning: data directory not found in root` → Data directory not in build context
- `ERROR: Failed to copy data directory` → Copy command failed
- `ERROR: api/data directory does not exist after copy` → Copy silently failed

### 2. Check Runtime Logs

In Railway logs (after deployment starts), look for:

```
Checking data path: <path>
```

Should see 5 debug log lines, one for each attempted path.

**If you DON'T see these logs**:
- Log level might be set to ERROR or WARNING instead of DEBUG
- Check `LOG_LEVEL` environment variable in Railway

### 3. Verify Deployed Code Version

The error message is the **old format**, not the new robust format.

**Old error**: `"Tried: //data, /app/data, and /app/data"` ← 3 paths
**New error should be**: `"Tried: //data, /app/api/data, /app/api/data, /app/api/data, /app/data"` ← 5 paths

**This suggests Railway is NOT running the latest code!**

### 4. Check Railway Deployment

Railway might be:
- Cached and not rebuilding
- Failed to pull latest from GitHub
- Using an old commit/deployment
- Not detecting the push properly

**Manual redeploy needed**:
- Go to Railway dashboard
- Click "Redeploy" or "Deploy" manually
- Make sure it's pulling from `main` branch
- Check the commit SHA matches latest GitHub commit: `83862ec`

---

## Environment Variables Required

### Railway Backend

```env
OPENAI_API_KEY=sk-...                                              # Required
JINA_API_KEY=jina_...                                              # Optional
MODEL_GENERATION=gpt-4o                                            # Default
MODEL_GENERATION_MINI=gpt-4o-mini                                  # Default
CORS_ALLOW_ORIGINS=https://rh-advertising-v2.vercel.app,https://rh-advertising-v2-*.vercel.app
REQUEST_TIMEOUT_SECONDS=20                                         # Default
LOG_LEVEL=DEBUG                                                    # Set to DEBUG for troubleshooting
CONFIG_CACHE_TTL_SECONDS=300                                       # Default
```

**CRITICAL**: Set `LOG_LEVEL=DEBUG` to see the path checking logs!

### Vercel Frontend

```env
NEXT_PUBLIC_API_URL=https://rh-advertising-v2-production.up.railway.app   # Client-side
API_URL=https://rh-advertising-v2-production.up.railway.app               # Server-side
```

---

## API Call Flow

### Example: Generate Copy

1. **User Action**: Fills form on https://rh-advertising-v2.vercel.app/copy
2. **Frontend**: Calls server action `generateCopy()` in `web/app/copy/actions.ts`
3. **Server Action**: Makes POST to `${API_URL}/v1/generate-copy`
4. **Railway API**: Receives request at `/v1/generate-copy` endpoint
5. **Route Handler**: `api/app/routes/generate.py` → `generate_copy()`
6. **Config Loader**: Calls `load_ad_limits()` in `config_loader.py`
7. **Data Path**: Calls `_get_data_path()` → **FAILS HERE**
8. **Error Response**: Returns 500 with "Data directory not found"

### Example: Landing Page Optimizer (WORKS)

1. **User Action**: Enters URL on https://rh-advertising-v2.vercel.app/optimize
2. **Frontend**: Calls server action `optimizeLandingPage()` in `web/app/optimize/actions.ts`
3. **Server Action**: Makes POST to `${API_URL}/v1/optimize-landing`
4. **Railway API**: Receives request at `/v1/optimize-landing` endpoint
5. **Route Handler**: `api/app/routes/optimize.py` → `optimize_landing_page()`
6. **Scraping Service**: Uses Jina.AI (doesn't need YAML files)
7. **LLM Service**: Uses OpenAI (doesn't need YAML files)
8. **Success Response**: Returns optimization results ✓

**Key Difference**: Landing page optimizer doesn't call `config_loader.py` at all!

---

## Possible Root Causes (Ranked by Likelihood)

### 1. Railway Not Deploying Latest Code (MOST LIKELY)

**Evidence**:
- Error message shows old format (3 paths instead of 5)
- Old error format was from commit `0c3f986`
- Latest commits: `176626e` and `83862ec` not being used

**Solution**:
- Manually trigger redeploy in Railway
- Verify commit SHA in Railway matches `83862ec`
- Check Railway is connected to correct GitHub repo/branch

### 2. Data Directory Not Being Copied During Build

**Evidence**:
- Error shows all paths failing
- Build phase `cp -r data api/data` might be failing

**Solution**:
- Check Railway build logs for copy errors
- Verify `data/` directory exists in GitHub repo root
- Check nixpacks.toml is being used (not Dockerfile)

### 3. Incorrect Working Directory in Railway

**Evidence**:
- Path calculations assuming `/app/` prefix
- Might actually be `/workspace/` or different root

**Solution**:
- Add diagnostic endpoint to Railway API:
  ```python
  @app.get("/debug/paths")
  def debug_paths():
      import os
      return {
          "__file__": __file__,
          "cwd": os.getcwd(),
          "exists_data": os.path.exists("data"),
          "exists_api_data": os.path.exists("api/data"),
          "listdir_root": os.listdir("/"),
          "listdir_app": os.listdir("/app") if os.path.exists("/app") else None,
      }
  ```

### 4. Python Package Installation Issue

**Evidence**:
- Package installed with `pip install -e .` in editable mode
- Might affect `__file__` path resolution

**Solution**:
- Change to non-editable install: `pip install .`
- Update nixpacks.toml install command

### 5. File Permissions or Symlink Issue

**Evidence**:
- Data copied but not readable
- Symlinks not followed

**Solution**:
- Change copy to: `cp -rL data api/data` (follow symlinks)
- Add permission check: `chmod -R 755 api/data`

---

## Debugging Commands to Add

### 1. Add Debug Endpoint to Railway API

Create `api/app/routes/debug.py`:

```python
from fastapi import APIRouter
import os
from pathlib import Path

router = APIRouter(prefix="/debug", tags=["debug"])

@router.get("/filesystem")
def debug_filesystem():
    """Debug endpoint to check filesystem structure."""

    file_location = Path(__file__).resolve()

    return {
        "config_loader_file": str(file_location),
        "cwd": str(Path.cwd()),
        "app_path_exists": Path("/app").exists(),
        "app_api_exists": Path("/app/api").exists(),
        "app_data_exists": Path("/app/data").exists(),
        "app_api_data_exists": Path("/app/api/data").exists(),
        "parent_parent_parent": str(file_location.parent.parent.parent),
        "listdir_root": os.listdir("/") if Path("/").exists() else None,
        "listdir_app": os.listdir("/app") if Path("/app").exists() else None,
        "listdir_app_api": os.listdir("/app/api") if Path("/app/api").exists() else None,
    }
```

Then test: `curl https://rh-advertising-v2-production.up.railway.app/debug/filesystem`

### 2. Enhanced Logging in config_loader.py

Add at top of `_get_data_path()`:

```python
logger.warning(f"DEBUG: __file__ = {__file__}")
logger.warning(f"DEBUG: Path(__file__) = {Path(__file__)}")
logger.warning(f"DEBUG: cwd = {Path.cwd()}")
```

Set `LOG_LEVEL=WARNING` or `LOG_LEVEL=DEBUG` in Railway to see these.

---

## Quick Test Commands

### Test Railway API Directly

```bash
# Health check (works)
curl https://rh-advertising-v2-production.up.railway.app/health

# Ad limits (fails)
curl "https://rh-advertising-v2-production.up.railway.app/v1/ad-limits?channel=Facebook"

# Generate copy (fails)
curl -X POST "https://rh-advertising-v2-production.up.railway.app/v1/generate-copy" \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "Facebook",
    "subtype": "Brand level recruitment",
    "university": "Test University",
    "tone": "Inspiring",
    "audience": "School Leavers",
    "usps": "Great teaching",
    "emojis_allowed": true,
    "landing_url": null
  }'
```

---

## Recommended Next Steps

### Option A: Debug Current Setup (Recommended First)

1. **Verify Railway is deploying latest code**:
   - Check commit SHA in Railway dashboard
   - Should be `83862ec` or later
   - If not, manually redeploy

2. **Check Railway build logs**:
   - Look for "Successfully copied data to api/data"
   - Look for YAML file listings
   - Save full build log for analysis

3. **Check Railway runtime logs**:
   - Set `LOG_LEVEL=DEBUG` in Railway environment variables
   - Redeploy
   - Make API request to `/v1/ad-limits`
   - Look for "Checking data path:" debug messages
   - Save full runtime log for analysis

4. **Add debug endpoint** (see above):
   - Shows actual filesystem structure in Railway
   - Shows actual `__file__` path
   - Shows actual working directory

### Option B: Simplify Data Loading (Alternative Approach)

Instead of copying files during build, embed them in the Python package:

1. **Move data into api package**:
   ```
   api/
   ├── app/
   │   ├── data/              ← Move here
   │   │   ├── ad_limits.yaml
   │   │   ├── asset_specs.yaml
   │   │   └── taxonomies.yaml
   │   └── config_loader.py
   ```

2. **Update config_loader.py**:
   ```python
   def _get_data_path() -> Path:
       # Data is now in same package as code
       return Path(__file__).parent / "data"
   ```

3. **Remove nixpacks build phase** - no copying needed

4. **Update .gitignore** - don't ignore app/data

### Option C: Use Environment Variables for Config (Nuclear Option)

Convert YAML to JSON and load from environment variables or external storage (S3, etc.). Most reliable but requires significant refactoring.

---

## Summary

**The Problem**: Railway cannot find the `data/` directory containing YAML configuration files.

**The Symptom**: All API endpoints that need YAML fail with "Data directory not found".

**The Mystery**: Error message shows OLD format, suggesting Railway isn't deploying latest code.

**The Fix**: Either Railway needs to properly deploy latest code, OR we need to debug the actual filesystem structure in Railway to understand where files actually are.

**Next Action**: Check Railway dashboard to verify:
1. Latest commit is deployed
2. Build logs show successful data copy
3. Runtime logs show path checking attempts
4. If all fails, add debug endpoint to see actual filesystem
