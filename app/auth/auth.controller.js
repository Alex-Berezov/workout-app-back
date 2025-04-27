import prisma from '../../prisma/prisma.js'
import asyncHandler from 'express-async-handler'
import { generateToken } from './generateToken.js'
import { faker } from '@faker-js/faker'
import { hash } from 'argon2'
import { UserFileds } from '../utils/user.utils.js'

// @desc Authenticate user
// @route POST /api/auth/login
// @access Public
export const authUser = asyncHandler(async (req, res) => {
	const user = await prisma.user.findMany({
		where: {
			email: req.body.email,
			password: req.body.password
		}
	})

	res.json(user)
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
