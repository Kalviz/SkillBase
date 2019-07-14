const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    location_name: {
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


const Location = mongoose.model('Location', LocationSchema);

module.exports = Location;