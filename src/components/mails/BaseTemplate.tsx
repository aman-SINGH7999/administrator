

export default function BaseTemplate(content: string, title = "EduCloud") {
  return (
    `
  <div style="
    font-family: 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background-color:#f8fafc;
    margin:0;
    padding:40px 16px;
  ">
    <div style="
      max-width:600px;
      margin:auto;
      background:#ffffff;
      border-radius:14px;
      box-shadow:0 6px 25px rgba(0,0,0,0.05);
      overflow:hidden;
      border:1px solid #e2e8f0;
    ">
      <!-- Header -->
      <div style="padding:24px 30px 16px; text-align:center;">
        <img 
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
          width="50" 
          height="50" 
          alt="EduCloud"
          style="margin-bottom:10px;"
        />
        <h2 style="
          margin:0;
          font-size:20px;
          font-weight:600;
          color:#1e293b;
          letter-spacing:0.2px;
        ">
          ${title}
        </h2>
        <div style="height:1px; background:#e2e8f0; margin-top:18px;"></div>
      </div>

      <!-- Body -->
      <div style="padding:28px 30px; color:#334155; font-size:15px; line-height:1.7;">
        ${content}
      </div>

      <!-- Footer -->
      <div style="
        padding:18px;
        text-align:center;
        font-size:12px;
        color:#94a3b8;
        border-top:1px solid #f1f5f9;
      ">
        <p style="margin:4px 0;">© ${new Date().getFullYear()} <b>Pariksha Bhawan</b>. All rights reserved.</p>
        <p style="margin:4px 0;">This is an automated message, please do not reply.</p>
      </div>
    </div>
  </div>
  `
  )
}
