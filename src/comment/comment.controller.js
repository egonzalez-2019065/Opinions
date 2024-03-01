'use strict'
import Comment from './comment.model.js'
import User from '../user/user.model.js'
import Publication from '../publication/publication.model.js'

export const test = (req, res) => {
    console.log('test is running')
    return res.send({ message: 'Test is running' })
}

export const createComment = async (req, res) => {
    try {
        let { publication } = req.params
        let data = req.body;
        let user = req.user.id; 
        data.user = user
        let comment = new Comment(data)
        await comment.save();
        const publicationPush = await Publication.findOne({_id: publication})
        console.log(publicationPush.comments)
        publicationPush.comments.push(comment._id)
        await publicationPush.save();
        return res.status(201).send({ message: `Comment created successfully ${comment.text}` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error creating comment' });
    }
}

export const editComment = async (req, res) => {
    try {
        let { id } = req.params;
        let { text } = req.body;
        let userID = req.user.id;
        let comment = await Comment.findOne({ _id: id});
        if (!comment) return res.status(404).send({ message: 'Comment not found or not exists'});

        let user = await User.findOne({_id: userID})
        if(!user || !comment.user.equals(userID)) {
            return res.status(403).send({message: 'You dont have permission to edit this comment'})
        }
        let commentUpdated  = await Comment.findOneAndUpdate(
            {_id: id},
            {text: text},
            {new: true}
        )
        return res.send({ message: 'Comment updated successfully', commentUpdated });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating comment'});
    }
}

export const deleteComment = async (req, res) => {
    try {
        let { id } = req.params;
        let userID = req.user.id; 
        let comment = await Comment.findOne({ _id: id});
        if (!comment) return res.status(404).send({ message: 'Comment not found or not exists'});
        let user = await User.findOne({_id: userID})
        if(!user || !comment.user.equals(userID)) {
            return res.status(403).send({message: 'You dont have permission to delet this comment'})
        }
        let deletedComment = await Comment.deleteOne({ _id: id })
        //Responder
        return res.send({ message: `Comment deleted ${deletedComment.text} was deleted successfully`});
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error deleting comment'});
    }
}
