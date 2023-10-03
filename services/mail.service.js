import nodemailer from 'nodemailer'

// TODO: configurate nodemailer

class MailService {
	constructor() {
		this.transporter = nodemailer.createTransport({
			host: '',
			port: '',
			secure: false,
			auth: {},
		})
	}
	async sendActivationMail(email, link) {}
}

export default new MailService()
