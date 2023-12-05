const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    title: {
        type: String
    },
    content: {
        type: String
    },
    type: {
        type: String,
        enum: ['privacy_policy', 'terms_and_conditions', 'about_us','help_and_support']
    }
},
    { timestamps: true }
);

const Content = mongoose.model("Content", contentSchema); 
module.exports = Content;