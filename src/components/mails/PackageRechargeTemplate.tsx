import BaseTemplate from "./BaseTemplate";

export default function PackageRechargeTemplate(name: string, packageName: string, expiry: string) {
  return BaseTemplate(`
    <p>Hello <b>${name}</b> 👋,</p>
    <p>Your package has been successfully activated:</p>

    <div style="background:#f0fdf4; padding:15px 20px; border-radius:8px; margin:20px 0;">
      <p><b>Package Name:</b> ${packageName}</p>
      <p><b>Valid Until:</b> ${expiry}</p>
    </div>

    <p style="font-size:14px; color:#64748b;">
      Enjoy uninterrupted access to your features and services.
    </p>
  `, "Package Activated")
}
