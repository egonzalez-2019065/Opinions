import { Router } from 'express'
import { validateJwt } from '../middlewares/validate-jwt.js';
import { createPublication, deletePublication, editPublication, getAllPublications, test } from './publication.controller.js';

const api = Router();

api.get('/test', [validateJwt], test)
api.post('/createPublication', [validateJwt], createPublication) 
api.put('/editPublication/:id', [validateJwt], editPublication)
api.delete('/deletePublication/:id', [validateJwt], deletePublication)
api.get('/getAllPublications', getAllPublications)

export default api