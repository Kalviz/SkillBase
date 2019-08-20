const express = require('express');
const router = express.Router();

const { ensureAuthenticated } = require('../config/auth');

const Qualification = require('../models/Qualification');
const User = require('../models/User');
const SkillSet = require('../models/SkillSet');
const Role = require('../models/Role');
const Location = require('../models/Location');
const Certification = require('../models/Certification');


// Welcome Page
router.get('/', (req, res) => {
  res.redirect('users/login');
});


// Dashboard
router.get('/dashboard',ensureAuthenticated, (req, res) =>{
  Qualification.find({organization:req.user.organization}).then(qualifications=>{
    User.find({organization:req.user.organization}).then(users=>{
      SkillSet.find({organization:req.user.organization}).then(skillsets=>{
        Role.find({organization:req.user.organization}).then(roles=>{
          Location.find({organization:req.user.organization}).then(locations=>{
            Certification.find({organization:req.user.organization}).then(certifications=>{
              User.find({organization:req.user.organization}).sort({skill_name:1}).then(users2=>{
                res.render('dashboard',{nav:'true',qualifications:qualifications,users:users,
                skillsets:skillsets,roles:roles,locations:locations,certifications:certifications,users2:users2});
              });
            });
          });          
        });        
      });      
    });    
  });  
  });



module.exports = router;
