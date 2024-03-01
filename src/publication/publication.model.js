import mongoose, { Schema, model } from 'mongoose';

const publicationSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        uppercase: true,
        enum: ['EVERYTHING', 'FUN', 'EXPEDITION', 'ART', 'SCIENCE'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comment',
        required: false
    }]
}, {
    versionKey: false 
})

export default model('publication', publicationSchema)