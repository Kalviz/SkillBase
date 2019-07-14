const mongoose = require('mongoose');

const MessagesCaseSchema = new mongoose.Schema({
    case_id: {
        type: String,
        required: false,
        unique: false
    },
    created_by: {
        type: String,
        required: false,
        unique: false
    },
    to: {
        type: String,
        required: false,
        unique: false
    },
    message: {
        type: String,
        required: false        
    },
    created_on: {
        type: Date,
        required: false,
        default: Date.now      
    }  
});


const MessagesCase = mongoose.model('MessagesCase', MessagesCaseSchema);

module.exports = MessagesCase;