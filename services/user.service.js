import bcrypt, { compare } from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { UserDto } from '../dto/user.dto.js'
import ApiError from '../exceptions/api.error.js'
import UserModel from '../models/user.model.js'
import MailService from './mail.service.js'
import TokenService from './token.service.js'

class UserService {
	async registration(email, password) {
		const candidate = await UserModel.findOne({ email })

		if (candidate)
			throw ApiError.BadRequest(`User with email ${email} already exists`)

		const hashPassword = await bcrypt.hash(password, 3)
		const activationLink = uuidv4()
		const user = await UserModel.create({
			email,
			password: hashPassword,
			activationLink,
		})

		await MailService.sendActivationMail(
			email,
			`${process.env.API_URL}/api/activate/${activationLink}`
		)

		const userDto = new UserDto(user)
		const tokens = TokenService.generateTokens({ ...userDto })

		await TokenService.saveToken(userDto.id, tokens.refreshToken)

		return {
			...tokens,
			user: userDto,
		}
	}

	async activate(activationLink) {
		const user = await UserModel.findOne({ activationLink })

		if (!user) throw ApiError.BadRequest('Invalid activation link')

		user.isActivated = true
		await user.save()
	}

	async login(email, password) {
		const user = await UserModel.findOne({ email })
		if (!user) throw ApiError.BadRequest('User not found')

		const isPassEquals = await compare(password, user.password)
		if (!isPassEquals) throw ApiError.BadRequest('Invalid password')

		const userDto = new UserDto(user)
		const tokens = TokenService.generateTokens({ ...userDto })

		await TokenService.saveToken(userDto.id, tokens.refreshToken)

		return {
			...tokens,
			user: userDto,
		}
	}

	async logout(refreshToken) {
		const token = await TokenService.removeToken(refreshToken)
		return token
	}

	async refresh(refreshToken) {
		if (!refreshToken) {
			throw ApiError.UnauthorizedError()
		}
		const userData = TokenService.validateRefreshToken(refreshToken)
		const tokenFromDb = await TokenService.findToken(refreshToken)

		if (!userData || !tokenFromDb) {
			throw ApiError.UnauthorizedError()
		}

		const user = await UserModel.findById(userData.id)
		const userDto = new UserDto(user)
		const tokens = TokenService.generateTokens({ ...userDto })

		await TokenService.saveToken(userDto.id, tokens.refreshToken)

		return {
			...tokens,
			user: userDto,
		}
	}

	async getAllUsers() {
		const users = await UserModel.find()
		return users
	}
}

export default new UserService()
