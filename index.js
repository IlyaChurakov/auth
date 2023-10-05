import 'colors'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'

import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import errorMiddleware from './middlewares/error.middleware.js'
import { router } from './routes/index.js'

dotenv.config()

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use('/api', router)
app.use(errorMiddleware)

async function main() {
	if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

	const PORT = process.env.PORT || 5000

	try {
		await mongoose.connect(process.env.DB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		app.listen(
			PORT,
			console.log(
				`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
					.yellow.bold
			)
		)
	} catch (err) {
		throw new Error(err)
	}
}

main()
