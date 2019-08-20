const mongoose = require('mongoose');

const QualificationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: false,
        unique: false
    },
    qualification_name: {
        type: String,
        required: false,
        unique: false
    },
    status: {
        type: String,
        required: false,
        unique: false
    },
    start_date: {
        type: Date,
        required: false        
    },    
    end_date: {
        type: Date,
        required: false        
    },
    organization:{
        type: String,
        required: false
    } 
});


const Qualification = mongoose.model('Qualification', QualificationSchema);

module.exports = Qualification;