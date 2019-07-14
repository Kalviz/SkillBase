const mongoose = require('mongoose');


const FileUploadSchema = new mongoose.Schema({
    case_id: {
        type: String,
        required: false,
        unique: false
    },
    file_name: {
        type: String,
        required: false,
        unique: false
    }
    
});


const FileUpload = mongoose.model('FileUpload', FileUploadSchema);

module.exports = FileUpload;