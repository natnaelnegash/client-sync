import nodemailer from 'nodemailer'

export async function sendUploadNotificationEmail(clientName: string, projectName: string) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    })

    await transporter.sendMail({
        from: process.env.SMTP_EMAIL,
        to: process.env.SMTP_EMAIL,
        subject: `New Asset Uploaded for ${projectName}`,
        text: `Great news! ${clientName} just uploaded a new file for ${projectName}.`
    })
}