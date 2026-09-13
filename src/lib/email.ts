type PasswordResetEmailInput = {
  to: string;
  name?: string | null;
  resetUrl: string;
};

const escapeHtml = (
  value: string
) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
}: PasswordResetEmailInput) {
  const apiKey =
    process.env.RESEND_API_KEY;

  const from =
    process.env.AUTH_EMAIL_FROM;

  if (!apiKey || !from) {
    if (
      process.env.NODE_ENV !==
      "production"
    ) {
      console.warn(
        "\n[AgriNova Password Reset]\n" +
          `Email: ${to}\n` +
          `Reset URL: ${resetUrl}\n` +
          "RESEND_API_KEY / AUTH_EMAIL_FROM are not configured.\n"
      );

      return;
    }

    throw new Error(
      "Password-reset email service is not configured"
    );
  }

  const safeName =
    escapeHtml(
      name?.trim() ||
        "AgriNova user"
    );

  const safeResetUrl =
    escapeHtml(
      resetUrl
    );

  const response =
    await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${apiKey}`,

          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({
            from,

            to: [
              to,
            ],

            subject:
              "Reset your AgriNova password",

            text:
              `Hello ${name || "AgriNova user"},\n\n` +
              "We received a request to reset your AgriNova password.\n\n" +
              `Reset your password: ${resetUrl}\n\n` +
              "This link expires in 60 minutes.\n\n" +
              "If you did not request this, you can ignore this email.\n\n" +
              "AgriNova",

            html: `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f6f8f7;font-family:Arial,sans-serif;color:#1e293b;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;background:#f6f8f7;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:18px;border:1px solid #e2e8f0;overflow:hidden;">
            <tr>
              <td style="background:#063B2B;padding:24px 28px;">
                <div style="font-size:24px;font-weight:700;color:#ffffff;">
                  AgriNova
                </div>
                <div style="margin-top:4px;font-size:13px;color:#bbf7d0;">
                  Smart Agriculture Platform
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:32px 28px;">
                <h1 style="margin:0 0 16px;font-size:23px;color:#0f172a;">
                  Reset your password
                </h1>

                <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#475569;">
                  Hello ${safeName},
                </p>

                <p style="margin:0 0 22px;font-size:15px;line-height:1.6;color:#475569;">
                  We received a request to reset the password for your AgriNova account.
                </p>

                <a
                  href="${safeResetUrl}"
                  style="display:inline-block;background:#0B513D;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:13px 22px;border-radius:10px;"
                >
                  Reset Password
                </a>

                <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#64748b;">
                  This password reset link expires in 60 minutes.
                </p>

                <p style="margin:12px 0 0;font-size:13px;line-height:1.6;color:#64748b;">
                  If you did not request a password reset, no action is required.
                </p>

                <div style="margin-top:26px;padding-top:20px;border-top:1px solid #e2e8f0;">
                  <p style="margin:0;font-size:11px;line-height:1.5;color:#94a3b8;word-break:break-all;">
                    If the button does not work, copy this URL into your browser:<br />
                    ${safeResetUrl}
                  </p>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
            `,
          }),
      }
    );

  if (!response.ok) {
    const responseText =
      await response
        .text()
        .catch(
          () => ""
        );

    console.error(
      "Resend password reset email failed:",
      response.status,
      responseText
    );

    throw new Error(
      "Password reset email could not be sent"
    );
  }
}