const mongoose = require('mongoose');

const ProgressDetailSchema = new mongoose.Schema({
    progress_id: {
        type: String,
        required: false,
        unique: false
    },
    description: {
        type: String,
        required: false,
        unique: false
    },
    clocking_type: {
        type: String,
        required: false,
        unique: false
    },
    created_on: {
        type: Date,
        required: false,
        default: Date.now      
    }  
});

const ProgressDetail = mongoose.model('ProgressDetail', ProgressDetailSchema);

module.exports = ProgressDetail;
