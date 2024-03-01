import { Router } from 'express'
import { validateJwt, isOneSelf } from '../middlewares/validate-jwt.js'
import { test, register, login, updateUser, updatePassword } from './user.controller.js'

const api = Router()

api.get('/test', test)
api.post('/register', register)
api.post('/login', login)
api.put('/updateUser/:id', [validateJwt], [isOneSelf] , updateUser)
api.put('/updatePassword/:id', [validateJwt], [isOneSelf] , updatePassword)

export default api