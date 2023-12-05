const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    title:{
        type: String,
        default:null
    },
    description:{
        type: String,
        default:null
    },
    post_image:{
        type:String,
        default:null
    }
    
}, 

{ timestamps: true }

);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;