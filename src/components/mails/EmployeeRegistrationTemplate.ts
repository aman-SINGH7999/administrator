// src/components/mails/EmployeeRegistrationTemplate.ts
import BaseTemplate from "./BaseTemplate";

export default function EmployeeRegistrationTemplate(
  employeeName: string,
  role: string,
  temporaryPassword: string
) {
  return BaseTemplate(
    `
      <p style="font-size:16px;">Hi <b>${employeeName}</b> 👋,</p>

      <p style="font-size:15px; color:#334155;">
        Congratulations! You have been added as a <b>${role}</b> in <b>EduCloud</b>.
      </p>

      <div style="background:#f1f5f9; border-radius:8px; padding:12px 16px; margin:16px 0;">
        <p style="margin:0; font-size:14px; color:#1e293b;">
          <b>Login Email:</b> ${employeeName} (${role})
        </p>
        <p style="margin:4px 0 0 0; font-size:14px; color:#1e293b;">
          <b>Temporary Password:</b> <span style="color:#2563eb;">${temporaryPassword}</span>
        </p>
      </div>

      <p style="font-size:14px; color:#475569;">
        You can now 
        <a href="https://yourapp.com/login"
           style="color:#2563eb; text-decoration:underline;">
          log in to your account
        </a>
        and start managing your tasks.
      </p>

      <p style="font-size:14px; color:#dc2626; margin-top:16px;">
        ⚠️ For security, please change your password immediately after first login.
      </p>
    `,
    "🎉 Employee Account Created"
  );
}
