const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
    organization_name: {
        type: String,
        required: false,
        unique: false
    },
    organization_industry: {
        type: String,
        required: false,
        unique: false
    },
    organization_size: {
        type: String,
        required: false        
    },    
    email: {
        type: String,
        required: false        
    },
    role: {
        type: String,
        required: false        
    },
    department: {
        type: String,
        required: false        
    },
    link: {
        type: String,
        required: false        
    }
});


const Organization = mongoose.model('Organization', OrganizationSchema);

module.exports = Organization;