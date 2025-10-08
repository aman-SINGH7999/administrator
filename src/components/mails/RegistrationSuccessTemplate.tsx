import BaseTemplate from "./BaseTemplate";

export default function RegistrationSuccessTemplate(schoolName: string, ownerName: string) {
  return BaseTemplate(`
    <p>Hi <b>${ownerName}</b> 👋,</p>
    <p>Congratulations! Your school <b>${schoolName}</b> has been successfully registered with EduCloud.</p>

    <p style="font-size:14px; color:#64748b;">
      You can now <a href="https://yourapp.com/login" style="color:#2563eb; text-decoration:underline;">login to your account</a> and start managing your school.
    </p>
  `, "School Registration Successful")
}
