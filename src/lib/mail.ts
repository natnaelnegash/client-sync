import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    }
});

const baseStyles = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
  color: #1e293b;
  line-height: 1.6;
`;

const buttonStyles = `
  display: inline-block;
  background-color: #4f46e5;
  color: #ffffff;
  font-weight: 600;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 8px;
  margin-top: 24px;
`;

export async function sendProjectWelcomeEmail(clientEmail: string, clientName: string, projectName: string, magicLink: string, portalPin?: string) {
  const pinHtml = portalPin ? `
    <div style="margin-top: 24px; padding: 16px; background-color: #f1f5f9; border-radius: 8px; border: 1px solid #e2e8f0;">
      <p style="margin: 0; font-size: 14px; color: #475569;">Your Secure Access PIN:</p>
      <p style="margin: 4px 0 0 0; font-size: 24px; font-weight: 700; color: #0f172a; letter-spacing: 2px;">${portalPin}</p>
    </div>
  ` : '';

  const html = `
    <div style="${baseStyles}">
      <h2 style="color: #0f172a; margin-bottom: 24px;">Welcome to your Client Portal</h2>
      <p>Hi ${clientName},</p>
      <p>Your secure client portal for <strong>${projectName}</strong> is ready. You can use this portal to sign your contract, upload assets, track our progress, and view invoices.</p>
      ${pinHtml}
      <a href="${magicLink}" style="${buttonStyles}">Access Portal</a>
      <p style="margin-top: 32px; font-size: 14px; color: #64748b;">
        If the button doesn't work, copy and paste this link into your browser:<br/>
        <a href="${magicLink}" style="color: #4f46e5;">${magicLink}</a>
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"ClientSync OS" <${process.env.SMTP_EMAIL}>`,
    to: clientEmail,
    subject: `Your Client Portal is Ready - ${projectName}`,
    html
  });
}

export async function sendReminderEmail(clientEmail: string, clientName: string, projectName: string, magicLink: string) {
  const html = `
    <div style="${baseStyles}">
      <h2 style="color: #0f172a; margin-bottom: 24px;">Action Required: ${projectName}</h2>
      <p>Hi ${clientName},</p>
      <p>This is a gentle reminder that there are pending items requiring your attention for <strong>${projectName}</strong>.</p>
      <p>Please check your client portal to see what's needed (such as signing the contract, uploading assets, or paying an invoice) so we can keep the project moving forward!</p>
      <a href="${magicLink}" style="${buttonStyles}">View Project Status</a>
    </div>
  `;

  await transporter.sendMail({
    from: `"ClientSync OS" <${process.env.SMTP_EMAIL}>`,
    to: clientEmail,
    subject: `Action Required: ${projectName}`,
    html
  });
}

export async function sendUploadNotificationEmail(clientName: string, projectName: string) {
  const html = `
    <div style="${baseStyles}">
      <h2 style="color: #0f172a; margin-bottom: 24px;">New Assets Uploaded</h2>
      <p><strong>${clientName}</strong> has just uploaded new files for <strong>${projectName}</strong>.</p>
      <p>Check the admin dashboard to review the new assets.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"ClientSync OS" <${process.env.SMTP_EMAIL}>`,
    to: process.env.SMTP_EMAIL, // Sends to the admin
    subject: `New Asset Uploaded for ${projectName}`,
    html
  });
}

export async function sendTeamInviteEmail(email: string, ownerName: string, inviteLink: string) {
  const html = `
    <div style="${baseStyles}">
      <h2 style="color: #0f172a; margin-bottom: 24px;">You've been invited!</h2>
      <p>Hi there,</p>
      <p><strong>${ownerName}</strong> has invited you to join their workspace on ClientSync OS.</p>
      <p>Click the button below to accept the invitation and access the dashboard.</p>
      <a href="${inviteLink}" style="${buttonStyles}">Accept Invitation</a>
    </div>
  `;

  await transporter.sendMail({
    from: `"ClientSync OS" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: `${ownerName} invited you to join their workspace`,
    html
  });
}

export async function sendSignatureReminderEmail(clientEmail: string, clientName: string, projectName: string, magicLink: string) {
  const html = `
    <div style="${baseStyles}">
      <h2 style="color: #0f172a; margin-bottom: 24px;">Signature Required</h2>
      <p>Hi ${clientName},</p>
      <p>This is an automated reminder that your contract for <strong>${projectName}</strong> is still awaiting your signature.</p>
      <p>Please click the button below to review and sign the contract so we can get started!</p>
      <a href="${magicLink}" style="${buttonStyles}">Sign Contract</a>
    </div>
  `;

  await transporter.sendMail({
    from: `"ClientSync OS" <${process.env.SMTP_EMAIL}>`,
    to: clientEmail,
    subject: `Reminder: Signature Required for ${projectName}`,
    html
  });
}

export async function sendOverdueInvoiceEmail(clientEmail: string, clientName: string, projectName: string, amount: string, magicLink: string) {
  const html = `
    <div style="${baseStyles}">
      <h2 style="color: #ef4444; margin-bottom: 24px;">Invoice Overdue</h2>
      <p>Hi ${clientName},</p>
      <p>This is an automated reminder that you have an outstanding invoice of <strong>${amount}</strong> for <strong>${projectName}</strong> that is now overdue.</p>
      <p>Please click the button below to view the invoice details and complete your payment as soon as possible.</p>
      <a href="${magicLink}" style="${buttonStyles}">Pay Invoice</a>
    </div>
  `;

  await transporter.sendMail({
    from: `"ClientSync OS" <${process.env.SMTP_EMAIL}>`,
    to: clientEmail,
    subject: `Overdue Invoice: ${projectName}`,
    html
  });
}