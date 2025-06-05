export default function EmailVerificationTemplate() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Email Container */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-8 py-6">
            <h1 className="text-2xl font-bold text-white text-center">
              Your Company
            </h1>
          </div>

          {/* Main Content */}
          <div className="px-8 py-12">
            {/* Icon */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
              Verify Your Email Address
            </h2>

            {/* Message */}
            <p className="text-gray-600 text-center text-lg mb-8 leading-relaxed">
              Thanks for signing up! Please click the button below to verify
              your email address and complete your account setup.
            </p>

            {/* Verification Button */}
            <div className="text-center mb-8">
              <a
                href="#"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200 no-underline"
              >
                Verify Email Address
              </a>
            </div>

            {/* Alternative Link */}
            <div className="border-t border-gray-200 pt-8">
              <p className="text-sm text-gray-500 text-center mb-4">
                If the button above doesn't work, copy and paste this link into
                your browser:
              </p>
              <p className="text-sm text-blue-600 text-center break-all">
                https://yourcompany.com/verify?token=abc123xyz789
              </p>
            </div>

            {/* Security Note */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-8">
              <p className="text-sm text-yellow-800">
                <strong>Security Note:</strong> This verification link will
                expire in 24 hours. If you didn't create an account, you can
                safely ignore this email.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">
                This email was sent to <strong>user@example.com</strong>
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Your Company, 123 Business St, City, State 12345
              </p>
              <div className="flex justify-center space-x-4">
                <a
                  href="#"
                  className="text-sm text-gray-400 hover:text-gray-600 no-underline"
                >
                  Privacy Policy
                </a>
                <span className="text-gray-300">|</span>
                <a
                  href="#"
                  className="text-sm text-gray-400 hover:text-gray-600 no-underline"
                >
                  Terms of Service
                </a>
                <span className="text-gray-300">|</span>
                <a
                  href="#"
                  className="text-sm text-gray-400 hover:text-gray-600 no-underline"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Email Client Preview Note */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 text-center">
            <strong>Preview Note:</strong> This template is optimized for email
            clients. The actual email may appear slightly different depending on
            the recipient's email provider.
          </p>
        </div>
      </div>
    </div>
  );
}
