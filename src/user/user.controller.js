'use strict'

import User from "./user.model.js"
import { encrypt, checkPassword, checkUpdate } from "../utils/validator.js"
import { generateJwt } from "../utils/jwt.js" 


export const test = (req, res) =>{
    console.log('test is running')
    return res.send({message: 'Test user is running'})
}

export const register = async(req, res) => {
    try{
        // Capturar la informacion 
        let data = req.body 
        // Encriptar la contraseña 
        data.password = await encrypt(data.password)
        // Asignar rol por defecto 
        data.role = 'CLIENT'
        // Guardar la informacion 
        let user = new User(data)
        await user.save()
        //responder al usuario 
        return res.send({message: `Registrered succesfully, can be logged with user ${user.username}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error registering user'})
    }
}

export const login = async(req, res) => {
    try{
        // Capturar los datos del body
        let data = req.body 
        // Validar que el usuario exista 
        let user = await User.findOne({
            $or: [{username: data.user}, {email: data.user}],
        })
        // Verifico que la contraseña coincida 
        if(user && await checkPassword(data.password, user.password)){
            let loggedUser = { 
                uid: user._id,
                username: user.username,
                name: user.name,
                role: user.role
            }
            //Generar el token 
            let token = await generateJwt(loggedUser)
            // Responde al usuario
            return res.send({message: `Welcome ${user.name}`, loggedUser, token})
        }
        return res.status(404).send({message: 'Invalid Credentials'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to login'})
    }
}

export const updateUser = async(req, res) =>{
    // Obtener el id a actualizar 
    let { id } = req.params
    // Párametros a actualizar 
    let data = req.body 
    // Traer el token
    const token  = req.user.id;
    // Validar si trae datos
    let update = checkUpdate(data, token)
    if(!update) return res.status(400).send({message: 'You need to update something'})
    //Actualizar 
    let updateUser = await User.findOneAndUpdate(
        {_id: id }, 
        data, 
        {new:true} 
    )
    //Validar si se actualizó 
    if(!updateUser) return res.status(404).send({message: 'User not found and not update'})
    // Responder
    return res.send({message: 'Update user', updateUser})
}

export const updatePassword = async(req, res) => {
    try{
        // ID 
        let { id } = req.params
        // Contraseñas 
        let data = req.body
        // ID por medio del usuario
        let userID = req.user.id
        console.log(userID)
        // Existe
        let user = await User.findOne({_id: id})
        if(!user) return res.status(404).send({message: 'User not found or not exists'})
        // Comparar password
        if(await checkPassword(data.currentPassword, user.password)){
            // Actualizar password
            data.newPassword = await encrypt(data.newPassword)
            let passwordUpdated = await User.findOneAndUpdate(
                {_id: id},
                {password: data.newPassword},
                {new: true}
            )
            return res.send({message: 'Password updated succesfully', passwordUpdated})
        }else{
            return res.status(500).send({message: 'Wrong password'})
        }
        
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error updating password'})
    }
}

