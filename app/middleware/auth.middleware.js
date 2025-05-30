import jwt from 'jsonwebtoken'
import prisma from '../../prisma/prisma.js'
import { UserFileds } from '../utils/user.utils.js'
import asyncHandler from 'express-async-handler'

export const protect = asyncHandler(async (req, res, next) => {
	let token

	if (req?.headers?.authorization?.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1]
	}

	if (!token) {
		res.status(401)
		throw new Error('Not authorized, no token')
	}

	const decoded = jwt.verify(token, process.env.JWT_SECRET)

	const userFound = await prisma.user.findUnique({
		where: {
			id: decoded.id
		},
		select: UserFileds
	})

	if (userFound) {
		req.user = userFound
		next()
	} else {
		res.status(401)
		throw new Error('Not authorized, token failed')
	}
})
