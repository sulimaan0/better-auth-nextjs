import { EmailLayout } from "./email-layout";

interface BookingConfirmationEmailProps {
  customerName: string;
  bookingId: string;
  service: string;
  date: string;
  time: string;
  address: string;
  cleaner: {
    name: string;
    photo: string;
    rating: number;
    phone: string;
  };
  price: string;
  duration: string;
}

export function BookingConfirmationEmail({
  customerName,
  bookingId,
  service,
  date,
  time,
  address,
  cleaner,
  price,
  duration,
}: BookingConfirmationEmailProps) {
  return (
    <EmailLayout preheader={`Your ${service} is confirmed for ${date}`}>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: "80px",
            height: "80px",
            backgroundColor: "#dcfce7",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px auto",
          }}
        >
          <span style={{ fontSize: "32px" }}>✅</span>
        </div>

        <h1
          style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#111827",
            margin: "0 0 16px 0",
          }}
        >
          Booking Confirmed!
        </h1>

        <p
          style={{
            fontSize: "16px",
            color: "#6b7280",
            margin: "0 0 32px 0",
          }}
        >
          Hi {customerName}, your cleaning service has been successfully booked.
        </p>
      </div>

      {/* Booking Details Card */}
      <div
        style={{
          backgroundColor: "#f8fafc",
          border: "2px solid #e2e8f0",
          borderRadius: "12px",
          padding: "24px",
          margin: "32px 0",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#111827",
            margin: "0 0 20px 0",
            textAlign: "center",
          }}
        >
          Booking Details
        </h2>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tr>
            <td
              style={{
                padding: "12px 0",
                fontSize: "14px",
                color: "#6b7280",
                fontWeight: "500",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              Booking ID:
            </td>
            <td
              style={{
                padding: "12px 0",
                fontSize: "14px",
                color: "#111827",
                fontWeight: "600",
                textAlign: "right",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              #{bookingId}
            </td>
          </tr>
          <tr>
            <td
              style={{
                padding: "12px 0",
                fontSize: "14px",
                color: "#6b7280",
                fontWeight: "500",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              Service:
            </td>
            <td
              style={{
                padding: "12px 0",
                fontSize: "14px",
                color: "#111827",
                fontWeight: "600",
                textAlign: "right",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              {service}
            </td>
          </tr>
          <tr>
            <td
              style={{
                padding: "12px 0",
                fontSize: "14px",
                color: "#6b7280",
                fontWeight: "500",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              Date & Time:
            </td>
            <td
              style={{
                padding: "12px 0",
                fontSize: "14px",
                color: "#111827",
                fontWeight: "600",
                textAlign: "right",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              {date} at {time}
            </td>
          </tr>
          <tr>
            <td
              style={{
                padding: "12px 0",
                fontSize: "14px",
                color: "#6b7280",
                fontWeight: "500",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              Duration:
            </td>
            <td
              style={{
                padding: "12px 0",
                fontSize: "14px",
                color: "#111827",
                fontWeight: "600",
                textAlign: "right",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              {duration}
            </td>
          </tr>
          <tr>
            <td
              style={{
                padding: "12px 0",
                fontSize: "14px",
                color: "#6b7280",
                fontWeight: "500",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              Address:
            </td>
            <td
              style={{
                padding: "12px 0",
                fontSize: "14px",
                color: "#111827",
                fontWeight: "600",
                textAlign: "right",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              {address}
            </td>
          </tr>
          <tr>
            <td
              style={{
                padding: "12px 0",
                fontSize: "16px",
                color: "#059669",
                fontWeight: "700",
              }}
            >
              Total Price:
            </td>
            <td
              style={{
                padding: "12px 0",
                fontSize: "16px",
                color: "#059669",
                fontWeight: "700",
                textAlign: "right",
              }}
            >
              {price}
            </td>
          </tr>
        </table>
      </div>

      {/* Cleaner Information */}
      <div
        style={{
          backgroundColor: "#f0f9ff",
          border: "1px solid #e0f2fe",
          borderRadius: "12px",
          padding: "24px",
          margin: "32px 0",
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#111827",
            margin: "0 0 16px 0",
            textAlign: "center",
          }}
        >
          Your Cleaner
        </h3>

        <div style={{ textAlign: "center" }}>
          <img
            src={cleaner.photo || "/placeholder.svg"}
            alt={cleaner.name}
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              marginBottom: "12px",
              border: "3px solid #059669",
            }}
          />
          <h4
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#111827",
              margin: "0 0 8px 0",
            }}
          >
            {cleaner.name}
          </h4>
          <div style={{ marginBottom: "12px" }}>
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                style={{
                  color: i < cleaner.rating ? "#fbbf24" : "#d1d5db",
                  fontSize: "16px",
                }}
              >
                ★
              </span>
            ))}
            <span
              style={{
                fontSize: "14px",
                color: "#6b7280",
                marginLeft: "8px",
              }}
            >
              ({cleaner.rating}/5)
            </span>
          </div>
          <p
            style={{
              fontSize: "14px",
              color: "#6b7280",
              margin: "0",
            }}
          >
            Contact: {cleaner.phone}
            <br />
            <small>(Available 24 hours before your appointment)</small>
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ textAlign: "center", margin: "32px 0" }}>
        <a
          href={`https://cleanpro.com/bookings/${bookingId}`}
          style={{
            display: "inline-block",
            background: "linear-gradient(135deg, #059669 0%, #2563eb 100%)",
            color: "white",
            textDecoration: "none",
            padding: "16px 32px",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "16px",
            margin: "0 8px 16px 8px",
          }}
        >
          View Booking Details
        </a>

        <br />

        <a
          href={`https://cleanpro.com/bookings/${bookingId}/reschedule`}
          style={{
            display: "inline-block",
            background: "transparent",
            color: "#059669",
            textDecoration: "none",
            padding: "12px 24px",
            border: "2px solid #059669",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "14px",
            margin: "0 8px",
          }}
        >
          Reschedule
        </a>

        <a
          href={`https://cleanpro.com/bookings/${bookingId}/cancel`}
          style={{
            display: "inline-block",
            background: "transparent",
            color: "#dc2626",
            textDecoration: "none",
            padding: "12px 24px",
            border: "2px solid #dc2626",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "14px",
            margin: "0 8px",
          }}
        >
          Cancel
        </a>
      </div>

      {/* Important Information */}
      <div
        style={{
          backgroundColor: "#fef3c7",
          border: "1px solid #fde68a",
          borderRadius: "8px",
          padding: "20px",
          margin: "32px 0",
        }}
      >
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "#92400e",
            margin: "0 0 12px 0",
          }}
        >
          📋 Important Information
        </h3>
        <ul
          style={{
            margin: "0",
            paddingLeft: "20px",
            fontSize: "14px",
            color: "#92400e",
          }}
        >
          <li>Please ensure someone is available to provide access</li>
          <li>Clear any valuable or fragile items from cleaning areas</li>
          <li>Your cleaner will arrive within a 30-minute window</li>
          <li>Free cancellation up to 24 hours before your appointment</li>
        </ul>
      </div>

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
            margin: "0 0 16px 0",
          }}
        >
          Questions about your booking? We're here to help!
        </p>
        <p
          style={{
            fontSize: "14px",
            color: "#6b7280",
            margin: "0",
          }}
        >
          📞 Call us: +44 20 1234 5678 | 📧 Email:{" "}
          <a href="mailto:support@cleanpro.com" style={{ color: "#059669" }}>
            support@cleanpro.com
          </a>
        </p>
      </div>
    </EmailLayout>
  );
}
