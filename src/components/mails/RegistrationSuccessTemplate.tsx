import BaseTemplate from "./BaseTemplate"; 

export default function RegistrationSuccessTemplate(
  schoolName: string,
  ownerName: string,
  email: string,
  password: string
) {
  return BaseTemplate(
    `
      <p style="font-size:16px;">Hi <b>${ownerName}</b> 👋,</p>

      <p style="font-size:15px; color:#334155;">
        Congratulations! Your school <b>${schoolName}</b> has been successfully registered with <b>EduCloud</b>.
      </p>

      <div style="background:#f1f5f9; border-radius:8px; padding:12px 16px; margin:16px 0;">
        <p style="margin:0; font-size:14px; color:#1e293b;">
          <b>Login Email:</b> ${email}
        </p>
        <p style="margin:4px 0 0 0; font-size:14px; color:#1e293b;">
          <b>Temporary Password:</b> <span style="color:#2563eb;">${password}</span>
        </p>
      </div>

      <p style="font-size:14px; color:#475569;">
        You can now 
        <a href="https://yourapp.com/login"
           style="color:#2563eb; text-decoration:underline;">
          log in to your account
        </a>
        and start managing your school.
      </p>

      <p style="font-size:14px; color:#dc2626; margin-top:16px;">
        ⚠️ For your security, please change your password immediately using the <b>“Forgot Password”</b> option.
      </p>
    `,
    "🎉 School Registration Successful"
  );
}
