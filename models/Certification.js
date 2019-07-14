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
    }
});


const Certification = mongoose.model('Certification', CertificationSchema);

module.exports = Certification;