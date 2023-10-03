import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { UserDto } from '../dto/user.dto.js'
import UserModel from '../models/user.model.js'
import MailService from './mail.service.js'
import TokenService from './token.service.js'

class UserService {
	async registration(email, password) {
		const candidate = await UserModel.findOne({ email })

		if (candidate) throw new Error(`User with email ${email} already exists`)

		const hashPassword = await bcrypt.hash(password, 3)
		const activateLink = uuidv4()
		const user = await UserModel.create({
			email,
			password: hashPassword,
			activateLink,
		})

		await MailService.sendActivationMail(email, activateLink)

		const userDto = new UserDto(user)
		const tokens = TokenService.generateTokens({ ...userDto })

		await TokenService.saveToken(userDto.id, tokens.refreshToken)

		return {
			...tokens,
			user: userDto,
		}
	}
}

export default new UserService()
