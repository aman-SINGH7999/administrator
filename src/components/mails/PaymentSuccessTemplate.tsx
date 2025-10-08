import BaseTemplate from "./BaseTemplate";

export default function PaymentSuccessTemplate(name: string, amount: string, txnId: string) {
  return BaseTemplate(`
    <p>Hi <b>${name}</b> 👋,</p>
    <p>We’ve received your payment successfully.</p>

    <div style="background:#f0f9ff; padding:15px 20px; border-radius:8px; margin:20px 0;">
      <p><b>Amount:</b> ₹${amount}</p>
      <p><b>Transaction ID:</b> ${txnId}</p>
      <p><b>Status:</b> Successful ✅</p>
    </div>

    <p style="font-size:14px; color:#64748b;">
      Thank you for your payment. Your subscription / package is now active.
    </p>
  `, "Payment Confirmation")
}
