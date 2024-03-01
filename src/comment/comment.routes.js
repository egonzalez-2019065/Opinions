import { Router } from 'express'
import { validateJwt } from '../middlewares/validate-jwt.js';
import { createComment, deleteComment, editComment, test } from './comment.controller.js';

const api = Router();
api.get('/test', [validateJwt], test)
api.post('/createComment/:publication', [validateJwt], createComment) 
api.put('/editComment/:id', [validateJwt], editComment)
api.delete('/deleteComment/:id', [validateJwt], deleteComment)

export default api