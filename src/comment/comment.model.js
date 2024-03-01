import mongoose, { model, Schema } from 'mongoose';

const commentSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    text: {
        type: String,
        required: true
    }
}, {
    versionKey: false 
})

export default model('comment', commentSchema)