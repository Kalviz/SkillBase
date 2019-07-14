const mongoose = require('mongoose');


const SkillSchema = new mongoose.Schema({        
    skill: {
        type: String,
        required: false        
    },
    created_on: {
        type: Date,
        required: false,
        default: Date.now      
    }  
});

const SkillGroupSchema = new mongoose.Schema({        
    skill_group_name: {
        type: String,
        required: false        
    },
    created_on: {
        type: Date,
        required: false,
        default: Date.now      
    },
    skills: [SkillSchema]

});


const SkillSetSchema = new mongoose.Schema({
    email:{
        type: String,
        required: false
    },
    catagory: {
        type: String,
        required: false,
        unique: false
    },
    skill_name: {
        type: String,
        required: false,
        unique: false
    },
    description: {
        type: String,
        required: false,
        unique: false
    },
    skill_group: [SkillGroupSchema]
    
});


const SkillSet = mongoose.model('SkillSet', SkillSetSchema);

module.exports = SkillSet;