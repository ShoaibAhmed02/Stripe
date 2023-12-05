const Content = require('../../models/Content');

const getContent = async (req, res) => {
    if(!req.params.type){
        return res.status(400).send({
            status: 0, 
            message: 'Type is required.' 
        });
    }
    else {
        Content.find({ type: req.params.type })
        .exec()
        .then(content => {
            if(content.length > 0){
                const url = `https://server.appsstaging.com:3017/${req.params.type}`
                res.status(200).send({
                    status: 1, 
                    message: "Content found Sucessfully",
                    data: {content : content, 
                    url : url}
                });
            }
            else{
                res.status(404).send({
                    status: 0, 
                    message: 'Content not found.' 
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                status: 0, 
                message: err 
            });
        });
    }
}

module.exports = {
    getContent
}