# Data Configuration Examples

This directory contains YAML configuration files that define ad platform limits, asset specifications, and content taxonomies for the RH AI Assistant.

## Files

### `ad_limits.yaml`
Defines character and word limits for each advertising channel and field.

**Structure:**
```yaml
- channel: "ChannelName"
  subtype: null  # or specific subtype
  fields:
    - field: "field_name"
      max_chars: 100
      max_words: 0
      emojis_allowed: true
      count: 1  # optional, for multiple variations (e.g., Google Search headlines)
      notes: "Additional context"
```

**Adding a new channel:**
1. Copy an existing channel block
2. Update the `channel` name to match `taxonomies.yaml`
3. Define all required fields with their limits
4. Set `emojis_allowed: false` for non-social channels

### `asset_specs.yaml`
Defines creative asset specifications (image/video dimensions, formats, sizes) for each channel.

**Structure:**
```yaml
- channel: "ChannelName"
  placement_or_format: "Placement name"
  aspect_ratio: "16:9"
  recommended_px: "1920x1080"
  duration_seconds_max: 30
  file_types: ["jpg", "png", "mp4"]
  max_file_size_mb: 100
  caption_limit_chars: 2200
  notes: "Additional guidance"
```

**Adding a new placement:**
1. Add a new entry with the channel name
2. Specify format/placement details
3. Include all technical requirements
4. Add notes for creative best practices

### `taxonomies.yaml`
Defines the valid options for channels, tones, audiences, and communication types.

**Structure:**
```yaml
social_channels: [...]      # Channels that allow emojis
non_emoji_channels: [...]   # Channels that don't allow emojis
all_channels: [...]         # Complete list of all channels
tones: [...]                # Available tone options
audiences: [...]            # Target audience options
subtypes: [...]             # Communication type options
```

**Adding a new channel:**
1. Add to `all_channels`
2. Add to either `social_channels` or `non_emoji_channels`
3. Create corresponding entries in `ad_limits.yaml` and `asset_specs.yaml`

## Validation

The system validates all YAML files on startup using Zod schemas. If validation fails, the app will show an error.

## Cache Revalidation

After editing these files, you can force a reload by:
1. Restarting the development server, OR
2. Calling the revalidation endpoint: `POST /api/config/revalidate`

The system caches config data for 10 minutes by default.

## Best Practices

- Always use UK spelling in notes/guidance
- Keep limits aligned with platform documentation
- Test changes with `MOCK_MODE=true` before deploying
- Document any special cases in the `notes` field
- Maintain consistent naming across all three files
