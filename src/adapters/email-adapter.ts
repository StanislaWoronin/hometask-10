import nodemailer from "nodemailer";

export const emailAdapters = {
    async sendEmail(email: string, subject: string, message: string) {
        let transport = await nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'buckstabu030194@gmail.com',
                pass: 'czxfvurrxhdrghmz',
            }
        })

        let info = await transport.sendMail({
            from: 'MyBack-End <buckstabu030194@gmail.com>',
            to: email,
            subject: subject,
            html: message
        })

        return info
    }
}