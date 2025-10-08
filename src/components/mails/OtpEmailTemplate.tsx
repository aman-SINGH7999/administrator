import BaseTemplate from "./BaseTemplate";

export default function OtpEmailTemplate(otp: string) {
  return BaseTemplate(`
    <p>Hey 👋,</p>
    <p>We received a request to verify your account. Use the OTP below to proceed:</p>

    <div style="text-align:center; margin:30px 0;">
      <div style="
        display:inline-block;
        background:#f1f5ff;
        color:#1e40af;
        padding:14px 32px;
        border-radius:10px;
        font-size:28px;
        font-weight:700;
        letter-spacing:6px;
        border:1px solid #c7d2fe;
      ">
        ${otp}
      </div>
    </div>

    <p style="font-size:14px; color:#64748b;">
      This OTP is valid for <b>5 minutes</b>. Please don’t share it with anyone.
    </p>
  `, "Verify Your Account - Pariksha Bhawan")
}
