import prisma from '../../prisma/prisma.js'
import { UserFileds } from '../utils/user.utils.js'
import asyncHandler from 'express-async-handler'

// @desc Get user profile
// @route GET /api/user/profile
// @access Private
export const getUserProfile = asyncHandler(async (req, res) => {
	const user = await prisma.user.findUnique({
		where: {
			id: req.user.id
		},
		select: UserFileds
	})

	if (!user) {
		res.status(404)
		throw new Error('User not found')
	}

	res.json(user)
})
