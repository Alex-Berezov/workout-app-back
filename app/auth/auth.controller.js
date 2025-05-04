import prisma from '../../prisma/prisma.js'
import asyncHandler from 'express-async-handler'
import { generateToken } from './generateToken.js'
import { faker } from '@faker-js/faker'
import { hash, verify } from 'argon2'
import { UserFileds } from '../utils/user.utils.js'

// @desc Authenticate user
// @route POST /api/auth/login
// @access Public
export const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body

	const user = await prisma.user.findUnique({
		where: { email }
	})

	// Проверяем существует ли пользователь и пароль
	if (!user || !user.password) {
		res.status(401)
		throw new Error('Invalid email or password')
	}

	// Проверка пароля с помощью argon2
	const isPasswordValid = await verify(user.password, password)

	if (isPasswordValid) {
		const token = generateToken(user.id)
		res.json({
			user: UserFileds,
			token
		})
	} else {
		res.status(401)
		throw new Error('Invalid email or password')
	}
})

// @desc Register user
// @route POST /api/auth/register
// @access Public
export const registerUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body

	const userExists = await prisma.user.findUnique({
		where: {
			email
		}
	})

	if (userExists) {
		res.status(400)
		throw new Error('User already exists')
	}

	const user = await prisma.user.create({
		data: {
			name: faker.internet.username(),
			email,
			password: await hash(password)
		},
		select: UserFileds
	})

	const token = generateToken(user.id)

	res.json({ user, token })
})
