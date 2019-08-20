const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    email:{
        type: String,
        required: false
    },
    role_name: {
        type: String,
        unique: false
    },
    targets: {
        type: String,
        required: false,
        unique: false
    },
    skills_catagory: {
        type: Number,
        required: false,
        unique: false
    },
    organization:{
        type: String,
        required: false
    }
    
});


const Role = mongoose.model('Role', RoleSchema);

module.exports = Role;