import prisma from '../../prisma/prisma.js'
import asyncHandler from 'express-async-handler'

// @desc POST new workout
// @route POST /api/workouts
// @access Private
export const createNewWorkout = asyncHandler(async (req, res) => {
	const { name, exerciseIds } = req.body

	try {
		const workout = await prisma.workout.create({
			data: {
				name,
				exercises: {
					connect: exerciseIds.map(id => ({ id }))
				}
			}
		})
		res.json(workout)
	} catch (error) {
		res.status(500)
		throw new Error('Server error')
	}
})

// @desc Update new workout
// @route PUT /api/workout/:id
// @access Private
export const updateWorkout = asyncHandler(async (req, res) => {
	const { id } = req.params
	const { name, exerciseIds } = req.body

	try {
		const workout = await prisma.workout.update({
			where: { id: Number(id) },
			data: {
				name,
				exercises: {
					set: exerciseIds.map(id => ({ id }))
				}
			}
		})

		res.json(workout)
	} catch (error) {
		if (error.code === 'P2025') {
			res.status(404)
			throw new Error('Workout not found')
		} else {
			res.status(500)
			throw new Error('Server error')
		}
	}
})

// @desc Delete workout
// @route DELETE /api/workout/:id
// @access Private
export const deleteWorkout = asyncHandler(async (req, res) => {
	const { id } = req.params
	try {
		const workout = await prisma.workout.delete({
			where: { id: Number(id) }
		})

		res.json({ message: 'Workout deleted successfully' })
	} catch (error) {
		if (error.code === 'P2025') {
			res.status(404)
			throw new Error('Workout not found')
		} else {
			res.status(500)
			throw new Error('Server error')
		}
	}
})

// @desc Get workouts
// @route GET /api/workouts
// @access Private
export const getWorkouts = asyncHandler(async (req, res) => {
	const workouts = await prisma.workout.findMany({
		orderBy: {
			createdAt: 'desc'
		},
		include: {
			exercises: true
		}
	})

	res.json(workouts)
})

// @desc Get workout
// @route GET /api/workouts/:id
// @access Private
export const getWorkout = asyncHandler(async (req, res) => {
	const workout = await prisma.workout.findUnique({
		where: { id: Number(req.params.id) },
		include: {
			exercises: true
		}
	})

	// Проверяем, существует ли тренировка
	if (!workout) {
		res.status(404)
		throw new Error('Workout not found')
	}

	const minutes = Math.ceil(workout.exercises.length * 3.7)

	res.json({ ...workout, minutes })
})
