import type React from "react";
interface EmailLayoutProps {
  children: React.ReactNode;
  preheader?: string;
}

export function EmailLayout({ children, preheader }: EmailLayoutProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>CleanPro</title>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', Arial, sans-serif;
            line-height: 1.6;
            color: #374151;
            background-color: #f9fafb;
          }
          
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
          }
          
          .header {
            background: linear-gradient(135deg, #059669 0%, #2563eb 100%);
            padding: 32px 24px;
            text-align: center;
          }
          
          .logo {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: white;
            text-decoration: none;
          }
          
          .logo-icon {
            width: 32px;
            height: 32px;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .logo-text {
            font-size: 24px;
            font-weight: 700;
            color: white;
          }
          
          .content {
            padding: 40px 24px;
          }
          
          .footer {
            background-color: #f3f4f6;
            padding: 32px 24px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
          }
          
          .button {
            display: inline-block;
            background: linear-gradient(135deg, #059669 0%, #2563eb 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            margin: 24px 0;
          }
          
          .button:hover {
            opacity: 0.9;
          }
          
          .social-links {
            margin-top: 16px;
          }
          
          .social-links a {
            display: inline-block;
            margin: 0 8px;
            color: #6b7280;
            text-decoration: none;
          }
          
          .divider {
            height: 1px;
            background-color: #e5e7eb;
            margin: 32px 0;
          }
          
          @media only screen and (max-width: 600px) {
            .content {
              padding: 24px 16px;
            }
            .header {
              padding: 24px 16px;
            }
            .footer {
              padding: 24px 16px;
            }
          }
        `}</style>
      </head>
      <body>
        {preheader && (
          <div
            style={{
              display: "none",
              fontSize: "1px",
              color: "#fefefe",
              lineHeight: "1px",
              maxHeight: "0px",
              maxWidth: "0px",
              opacity: 0,
              overflow: "hidden",
            }}
          >
            {preheader}
          </div>
        )}

        <div className="email-container">
          <div className="header">
            <a href="https://cleanpro.com" className="logo">
              <div className="logo-icon">
                <span style={{ color: "white", fontSize: "18px" }}>✨</span>
              </div>
              <span className="logo-text">CleanPro</span>
            </a>
          </div>

          <div className="content">{children}</div>

          <div className="footer">
            <p
              style={{
                margin: "0 0 16px 0",
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              © 2024 CleanPro. All rights reserved.
            </p>
            <p
              style={{
                margin: "0 0 16px 0",
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              123 Cleaning Street, London, UK | +44 20 1234 5678
            </p>
            <div className="social-links">
              <a href="https://facebook.com/cleanpro">Facebook</a>
              <a href="https://instagram.com/cleanpro">Instagram</a>
              <a href="https://twitter.com/cleanpro">Twitter</a>
            </div>
            <div className="divider"></div>
            <p style={{ margin: "0", fontSize: "12px", color: "#9ca3af" }}>
              You received this email because you have an account with CleanPro.
              <br />
              <a
                href="https://cleanpro.com/unsubscribe"
                style={{ color: "#059669" }}
              >
                Unsubscribe
              </a>{" "}
              |
              <a
                href="https://cleanpro.com/privacy"
                style={{ color: "#059669" }}
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
