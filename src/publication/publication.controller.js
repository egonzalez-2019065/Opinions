'use strict'
import Publication from './publication.model.js';
import User from '../user/user.model.js'

export const test = (req, res) => {
    console.log('test is running')
    return res.send({ message: 'Test is running' })
}

export const createPublication = async (req, res) => {
    try {
        let data = req.body
        let user = req.user.id
        data.user = user
        let publication = new Publication(data);
        console.log(data.user)
        await publication.save();
        return res.send({ message: 'Publication created succesfully', publication });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error creating post' });
    }
}

export const editPublication = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let userID = req.user.id
        let publication = await Publication.findOne({ _id: id});
        if (!publication) return res.status(404).send({ message: 'Publication not found or not exists'});
        let user = await User.findOne({_id: userID})
        if(!user || !publication.user.equals(userID)) {
            return res.status(403).send({message: 'You dont have permission to edit this publication'})
        }
        let publicationUpdated  = await Publication.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        return res.send({ message: 'Publication updated successfully', publicationUpdated });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating publication'});
    }
}

export const deletePublication = async (req, res) => {
    try {
        let { id } = req.params
        let userID = req.user.id
        let publication = await Publication.findOne({ _id: id});
        if (!publication) return res.status(404).send({ message: 'Post not found or not exist'});
        let user = await User.findOne({_id: userID})
        if(!user || !publication.user.equals(userID)) {
            return res.status(403).send({message: 'You dont have permission to delete this publication'})
        }
        await Publication.deleteOne({_id: id})    
        return res.send({ message: 'Publication deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error deleting publication'});
    }
}

export const getAllPublications = async(req, res) =>{
    try{
        let publications = await Publication.find().populate('user', ['name', 'surname']).populate('comments', 'text')
        return res.send({message: 'Publications found:', publications})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error getting publications'})
    }
}
