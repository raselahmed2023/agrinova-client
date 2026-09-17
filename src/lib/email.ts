import { Resend } from "resend";

/* ============================================================
   HELPERS
============================================================ */

const escapeHtml = (
  value: string
) =>
  value
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

/* ============================================================
   RESEND CLIENT
============================================================ */

const getResendClient =
  () => {
    const apiKey =
      process.env
        .RESEND_API_KEY;

    if (
      !apiKey
    ) {
      throw new Error(
        "RESEND_API_KEY is not configured."
      );
    }

    return new Resend(
      apiKey
    );
  };

/* ============================================================
   PASSWORD RESET EMAIL
============================================================ */

export const sendPasswordResetEmail =
  async ({
    to,
    name,
    resetUrl,
  }: {
    to: string;

    name?: string | null;

    resetUrl: string;
  }) => {
    const resend =
      getResendClient();

    const from =
      process.env.AUTH_EMAIL_FROM ||
      "AgriNova <onboarding@resend.dev>";

    const safeName =
      escapeHtml(
        name?.trim() ||
        "AgriNova user"
      );

    const safeUrl =
      escapeHtml(
        resetUrl
      );

    const {
      data,
      error,
    } =
      await resend.emails.send(
        {
          from,

          to: [
            to,
          ],

          subject:
            "Reset your AgriNova password",

          text: [
            `Hello ${name?.trim() || "AgriNova user"},`,
            "",
            "We received a request to reset your AgriNova password.",
            "",
            `Reset your password: ${resetUrl}`,
            "",
            "This link expires in 60 minutes.",
            "",
            "If you did not request a password reset, you can ignore this email.",
            "",
            "AgriNova",
          ].join(
            "\n"
          ),

          html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#f4f7f5;
    font-family:Arial,Helvetica,sans-serif;
    color:#17211d;
  "
>
  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    role="presentation"
    style="
      background:#f4f7f5;
      padding:32px 16px;
    "
  >
    <tr>
      <td align="center">

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          role="presentation"
          style="
            max-width:560px;
            background:#ffffff;
            border-radius:18px;
            overflow:hidden;
            border:1px solid #e3ebe6;
          "
        >

          <tr>
            <td
              style="
                background:#063b2b;
                padding:24px 28px;
              "
            >
              <div
                style="
                  color:#ffffff;
                  font-size:24px;
                  line-height:1;
                  font-weight:800;
                "
              >
                AgriNova
              </div>

              <div
                style="
                  margin-top:7px;
                  color:#a7f3d0;
                  font-size:12px;
                  font-weight:600;
                "
              >
                Smart Agriculture Platform
              </div>
            </td>
          </tr>

          <tr>
            <td
              style="
                padding:30px 28px 28px;
              "
            >
              <div
                style="
                  font-size:22px;
                  font-weight:800;
                  color:#10231b;
                "
              >
                Reset your password
              </div>

              <p
                style="
                  margin:18px 0 0;
                  color:#52615a;
                  font-size:14px;
                  line-height:1.7;
                "
              >
                Hello ${safeName},
              </p>

              <p
                style="
                  margin:10px 0 0;
                  color:#52615a;
                  font-size:14px;
                  line-height:1.7;
                "
              >
                We received a request to reset the
                password for your AgriNova account.
              </p>

              <table
                role="presentation"
                cellpadding="0"
                cellspacing="0"
                style="
                  margin-top:24px;
                "
              >
                <tr>
                  <td
                    style="
                      border-radius:10px;
                      background:#07583f;
                    "
                  >
                    <a
                      href="${safeUrl}"
                      style="
                        display:inline-block;
                        padding:13px 22px;
                        color:#ffffff;
                        font-size:14px;
                        font-weight:700;
                        text-decoration:none;
                      "
                    >
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <div
                style="
                  margin-top:22px;
                  padding:14px 16px;
                  border-radius:10px;
                  background:#f0fdf4;
                  color:#356148;
                  font-size:12px;
                  line-height:1.6;
                "
              >
                This password reset link expires in
                <strong>60 minutes</strong>.
              </div>

              <p
                style="
                  margin:20px 0 0;
                  color:#76827c;
                  font-size:12px;
                  line-height:1.6;
                "
              >
                If you did not request this password
                reset, you can safely ignore this email.
                Your password will remain unchanged.
              </p>

              <p
                style="
                  margin:22px 0 0;
                  color:#94a09a;
                  font-size:11px;
                  line-height:1.6;
                  word-break:break-all;
                "
              >
                If the button does not work, copy and
                paste this link into your browser:
                <br />
                ${safeUrl}
              </p>
            </td>
          </tr>

          <tr>
            <td
              style="
                border-top:1px solid #edf1ee;
                padding:18px 28px;
                color:#87938d;
                font-size:11px;
              "
            >
              © ${new Date().getFullYear()} AgriNova
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
          `,
        }
      );

    if (
      error
    ) {
      console.error(
        "Resend password reset email error:",
        error
      );

      throw new Error(
        "Password reset email could not be sent."
      );
    }

    return data;
  };