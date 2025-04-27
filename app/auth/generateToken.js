import jwt from 'jsonwebtoken'

export const generateToken = userId => {
	const token = jwt.sign({ id: userId }, process.env.ACCESS_TOKEN, {
		expiresIn: '10d'
	})
	return token
}
