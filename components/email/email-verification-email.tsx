// emails/email-verification-email.ts

export function getEmailVerificationHtml(
  userName: string,
  verificationLink: string
): string {
  return `
      <div style="text-align:center;">
        <div style="
          width: 80px; height: 80px; background-color: #dcfce7; border-radius: 50%; 
          display: flex; align-items: center; justify-content: center; margin: 0 auto 24px auto;
        ">
          <span style="font-size: 32px;">✉️</span>
        </div>
  
        <h1 style="
          font-size: 28px; font-weight: 700; color: #111827; margin: 0 0 16px 0;
        ">
          Welcome to CleanPro!
        </h1>
  
        <p style="
          font-size: 16px; color: #6b7280; margin: 0 0 32px 0;
        ">
          Hi ${userName}, thanks for signing up! Please verify your email address to get started with CleanPro.
        </p>
  
        <div style="text-align:center; margin: 32px 0;">
          <a href="${verificationLink}" style="
            display: inline-block; background: linear-gradient(135deg, #059669 0%, #2563eb 100%);
            color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px;
            font-weight: 600; font-size: 16px;
          ">
            Verify My Email
          </a>
        </div>
  
        <div style="
          background-color: #f0f9ff; padding: 24px; border-radius: 8px; margin: 32px 0; border: 1px solid #e0f2fe;
        ">
          <h3 style="
            font-size: 16px; font-weight: 600; color: #111827; margin: 0 0 12px 0;
          ">
            What's Next?
          </h3>
          <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280;">
            Once you verify your email, you'll be able to:
          </p>
          <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #6b7280;">
            <li>Book professional cleaning services</li>
            <li>Manage your appointments and preferences</li>
            <li>Access exclusive member discounts</li>
            <li>Rate and review your cleaners</li>
          </ul>
        </div>
  
        <div style="
          background-color: #fef3c7; padding: 16px; border-radius: 8px; margin: 24px 0; border: 1px solid #fde68a;
        ">
          <p style="margin: 0; font-size: 14px; color: #92400e; text-align: center;">
            ⚠️ This verification link will expire in 48 hours
          </p>
        </div>
  
        <p style="font-size: 14px; color: #6b7280; text-align: center; margin: 32px 0 0 0;">
          If the button doesn't work, copy and paste this link into your browser:<br/>
          <a href="${verificationLink}" style="color: #059669; word-break: break-all; font-size: 12px;">
            ${verificationLink}
          </a>
        </p>
  
        <div style="
          border-top: 1px solid #e5e7eb; padding-top: 24px; margin-top: 32px; text-align: center;
        ">
          <p style="font-size: 14px; color: #6b7280; margin: 0;">
            Didn't sign up for CleanPro? You can safely ignore this email.
          </p>
        </div>
      </div>
    `;
}
