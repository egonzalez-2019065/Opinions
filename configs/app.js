'use strict'

// Importaciones de servicios o ¿librerías?
import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import { config } from "dotenv"
import userRoutes from '../src/user/user.routes.js'
import publicationRoutes from '../src/publication/publication.routes.js'
import commentRoutes from '../src/comment/comment.routes.js'

// Configuraciones 
const app = express()
config()
const port = process.env.PORT || 3056

//Configuraciones del servidor 
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))

// Declaraciones de Rutas
app.use('/user', userRoutes)
app.use('/publication', publicationRoutes)
app.use('/comment', commentRoutes)

// Levantar el servidor 
export const initServer = () => {
    app.listen(port)
    console.log(`Server HTTP running in port ${port}`)
}
