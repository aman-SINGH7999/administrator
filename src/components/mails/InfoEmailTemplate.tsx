import BaseTemplate from "./BaseTemplate";

export default function InfoEmailTemplate(subject: string, message: string) {
  return BaseTemplate(`
    <p>Hello 👋,</p>
    <p>${message}</p>

    <p style="font-size:14px; color:#64748b;">
      For more information, please visit our website or contact support.
    </p>
  `, subject)
}
