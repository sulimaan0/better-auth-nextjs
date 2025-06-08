import { EmailLayout } from "./email-layout";

interface ForgotPasswordEmailProps {
  userName: string;
  resetLink: string;
}

export function ForgotPasswordEmail({
  userName,
  resetLink,
}: ForgotPasswordEmailProps) {
  return (
    <EmailLayout preheader="Reset your CleanPro password">
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: "80px",
            height: "80px",
            backgroundColor: "#fef3c7",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px auto",
          }}
        >
          <span style={{ fontSize: "32px" }}>🔐</span>
        </div>

        <h1
          style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#111827",
            margin: "0 0 16px 0",
          }}
        >
          Reset Your Password
        </h1>

        <p
          style={{
            fontSize: "16px",
            color: "#6b7280",
            margin: "0 0 32px 0",
          }}
        >
          Hi {userName}, we received a request to reset your password for your
          CleanPro account.
        </p>
      </div>

      <div style={{ textAlign: "center", margin: "32px 0" }}>
        <a
          href={resetLink}
          className="button"
          style={{
            display: "inline-block",
            background: "linear-gradient(135deg, #059669 0%, #2563eb 100%)",
            color: "white",
            textDecoration: "none",
            padding: "16px 32px",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "16px",
          }}
        >
          Reset My Password
        </a>
      </div>

      <div
        style={{
          backgroundColor: "#f3f4f6",
          padding: "24px",
          borderRadius: "8px",
          margin: "32px 0",
        }}
      >
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "#111827",
            margin: "0 0 12px 0",
          }}
        >
          Security Information
        </h3>
        <ul
          style={{
            margin: "0",
            paddingLeft: "20px",
            fontSize: "14px",
            color: "#6b7280",
          }}
        >
          <li>This link will expire in 24 hours for security reasons</li>
          <li>If you didn't request this reset, please ignore this email</li>
          <li>Your password won't change until you create a new one</li>
        </ul>
      </div>

      <p
        style={{
          fontSize: "14px",
          color: "#6b7280",
          textAlign: "center",
          margin: "32px 0 0 0",
        }}
      >
        If the button doesn't work, copy and paste this link into your browser:
        <br />
        <a
          href={resetLink}
          style={{
            color: "#059669",
            wordBreak: "break-all",
            fontSize: "12px",
          }}
        >
          {resetLink}
        </a>
      </p>

      <div
        style={{
          borderTop: "1px solid #e5e7eb",
          paddingTop: "24px",
          marginTop: "32px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "14px",
            color: "#6b7280",
            margin: "0",
          }}
        >
          Need help? Contact our support team at{" "}
          <a href="mailto:support@cleanpro.com" style={{ color: "#059669" }}>
            support@cleanpro.com
          </a>
        </p>
      </div>
    </EmailLayout>
  );
}
