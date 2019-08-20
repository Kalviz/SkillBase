const mongoose = require('mongoose');


const SkillSchema = new mongoose.Schema({ 
    skill_name: {
        type: String,
        required: false,
        unique: false
    },
    skill_group_name: {
        type: String,
        required: false        
    },       
    skill: {
        type: String,
        required: false        
    },
    created_on: {
        type: Date,
        required: false,
        default: Date.now      
    },
    organization:{
        type: String,
        required: false
    }
});


const Skill = mongoose.model('Skill', SkillSchema);

module.exports = Skill;