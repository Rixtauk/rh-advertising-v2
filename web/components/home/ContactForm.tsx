'use client';

import { useState } from 'react';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    institution: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('https://hook.eu2.make.com/89wylxlmbqlt48ky3eb7wumdneh61jis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
        setFormData({ name: '', email: '', institution: '', message: '' });
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-gray-100 rounded-xl p-8 md:p-12 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)]">
          {/* Header Text */}
          <div className="mb-10 space-y-5 text-gray-700 text-lg leading-relaxed">
            <p>
              These tools represent our ongoing commitment to helping education clients harness the potential of AI to create, analyse and optimise with confidence. Whether you're planning your next clearing campaign, shaping your postgraduate strategy or exploring student recruitment trends, RH's AI suite empowers your marketing to think and perform smarter.
            </p>
            <p className="font-semibold text-2xl text-gray-900 leading-tight">
              Get in touch if you're interested in using our tools & working together.
            </p>
          </div>

          {/* Success Message */}
          {isSuccess && (
            <div className="mb-8 p-5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/60 rounded-xl shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 text-base">Message sent successfully!</h3>
                  <p className="text-sm text-green-700 mt-1.5">
                    Thank you for your interest. We'll be in touch soon.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-8 p-5 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/60 rounded-xl shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-base font-medium text-gray-800 mb-2.5">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#55A2C3]/50 focus:border-[#55A2C3] transition-all duration-200 placeholder:text-gray-400 bg-white hover:border-gray-300"
                placeholder="Your full name"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-base font-medium text-gray-800 mb-2.5">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#55A2C3]/50 focus:border-[#55A2C3] transition-all duration-200 placeholder:text-gray-400 bg-white hover:border-gray-300"
                placeholder="your.email@institution.edu"
              />
            </div>

            {/* Institution Field */}
            <div>
              <label htmlFor="institution" className="block text-base font-medium text-gray-800 mb-2.5">
                Institution <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="institution"
                name="institution"
                required
                value={formData.institution}
                onChange={handleChange}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#55A2C3]/50 focus:border-[#55A2C3] transition-all duration-200 placeholder:text-gray-400 bg-white hover:border-gray-300"
                placeholder="Your university or college"
              />
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-base font-medium text-gray-800 mb-2.5">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#55A2C3]/50 focus:border-[#55A2C3] transition-all duration-200 resize-none placeholder:text-gray-400 bg-white hover:border-gray-300"
                placeholder="Tell us about your interest in our tools..."
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#55A2C3] to-[#4891b0] hover:from-[#4891b0] hover:to-[#3d7f9a] text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
