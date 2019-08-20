const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    email:{
        type: String,
        required: false
    },
    team_name: {
        type: String,
        unique: false
    },
    targets: {
        type: String,
        required: false,
        unique: false
    },
    delegates: {
        type: String,
        required: false,
        unique: false
    },
    user_selectable: {
        type: String,
        required: false,
        unique: false
    },
    skill_catagory: {
        type: String,
        required: false
    },
    organization:{
        type: String,
        required: false
    }
    
});


const Team = mongoose.model('Team', TeamSchema);

module.exports = Team;