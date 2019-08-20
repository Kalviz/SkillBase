const mongoose = require('mongoose');

const CertificationSchema = new mongoose.Schema({
    certification_name: {
        type: String,
        required: false,
        unique: false
    },
    email: {
        type: String,
        required: false,
        unique: false
    },
    organization:{
        type: String,
        required: false
    }
});


const Certification = mongoose.model('Certification', CertificationSchema);

module.exports = Certification;