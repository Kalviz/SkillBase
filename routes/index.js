const express = require('express');
const router = express.Router();

const { ensureAuthenticated } = require('../config/auth');

const Qualification = require('../models/Qualification');


// Welcome Page
router.get('/', (req, res) => res.render('welcome', {user: req.user,nav:'false'}));


// Dashboard
router.get('/dashboard',ensureAuthenticated, (req, res) =>{
  Qualification.find({email:req.user.email}).then(qualifications=>{
    res.render('dashboard',{nav:'true',qualifications:qualifications});
  });
  
  });



module.exports = router;
