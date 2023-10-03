import UserService from '../services/user.service.js'

class UserController {
	async registration(req, res, next) {
		try {
			const { email, password } = req.body
			const userData = await UserService.registration(email, password)
			res.cookie('refreshToken', userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			})
			res.json(userData)
		} catch (err) {
			console.log(err)
		}
	}
	async login(req, res, next) {
		try {
		} catch (err) {}
	}
	async logout(req, res, next) {
		try {
		} catch (err) {}
	}
	async activate(req, res, next) {
		try {
		} catch (err) {}
	}
	async refresh(req, res, next) {
		try {
		} catch (err) {}
	}
	async getUsers(req, res, next) {
		try {
			res.json(['123'])
		} catch (err) {}
	}
}

export default new UserController()
