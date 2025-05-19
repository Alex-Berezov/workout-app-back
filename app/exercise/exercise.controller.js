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

// @desc Update new exercise
// @route PUT /api/exercise/:id
// @access Private
export const updateExercise = asyncHandler(async (req, res) => {
	const { id } = req.params
	const { name, times, iconPath } = req.body

	try {
		const exercise = await prisma.exercise.update({
			where: { id: Number(id) },
			data: {
				name,
				times,
				iconPath
			}
		})

		res.json(exercise)
	} catch (error) {
		if (error.code === 'P2025') {
			res.status(404)
			throw new Error('Exercise not found')
		} else {
			res.status(500)
			throw new Error('Server error')
		}
	}
})

// @desc Delete exercise
// @route DELETE /api/exercise/:id
// @access Private
export const deleteExercise = asyncHandler(async (req, res) => {
	const { id } = req.params
	try {
		const exercise = await prisma.exercise.delete({
			where: { id: Number(id) }
		})

		res.json({ message: 'Exercise deleted successfully' })
	} catch (error) {
		if (error.code === 'P2025') {
			res.status(404)
			throw new Error('Exercise not found')
		} else {
			res.status(500)
			throw new Error('Server error')
		}
	}
})

// @desc Get exercises
// @route GET /api/exercise
// @access Private
export const getExercises = asyncHandler(async (req, res) => {
	const exercises = await prisma.exercise.findMany({
		orderBy: {
			createdAt: 'desc'
		}
	})

	res.json(exercises)
})
