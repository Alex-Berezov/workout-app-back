import prisma from '../../prisma/prisma.js'
import asyncHandler from 'express-async-handler'

// @desc POST new exercise
// @route POST /api/exercise
// @access Private
export const createNewExercise = asyncHandler(async (req, res) => {
	const { name, times, iconPath } = req.body

	const exercise = await prisma.exercise.create({
		data: {
			name,
			times,
			iconPath
		}
	})

	res.json(exercise)
})

// @desc Get exercises
// @route GET /api/exercise
// @access Private
export const getExercises = asyncHandler(async (req, res) => {
	const exercises = await prisma.exercise.findMany()

	res.json(exercises)
})
