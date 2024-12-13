import mongoose, { Schema } from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

postSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id

    return object
});

const Post = mongoose.model('Post', postSchema)

export default Post