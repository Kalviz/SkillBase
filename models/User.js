const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({    
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    organization:{
        type: String,
        required: false
    },
    password1: {
        type: String,
        required: true
    },  
    team_name: {
        type: String,
        required: false
    },  
    city: {
        type: String,
        required: false
    }, 
    country: {
        type: String,
        required: false
    }, 
    certifications: {
        type: String,
        required: false
    }, 
    role_name: {
        type: String,
        required: false
    }, 
    skill_name: {
        type: String,
        required: false
    },
    main_user: {
        type: String,
        required: false
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    updated_at: {
        type: Date,
        required: false
    },
    skillset :[
        {
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
            skill_group: [
                {
                    skill_group_name: {
                        type: String,
                        required: false        
                    },
                    created_on: {
                        type: Date,
                        required: false,
                        default: Date.now      
                    },
                    skills:[
                        {
                            skill: {
                                type: String,
                                required: false        
                            },
                            proficiency:{
                                type: Number,
                                default: 1,
                                require:false
                            },
                            created_on: {
                                type: Date,
                                required: false,
                                default: Date.now      
                            }  
                        }
                    ]
                }
            ]
        }
    ]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;