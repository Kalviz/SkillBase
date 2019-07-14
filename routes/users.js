const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const { ensureAuthenticated } = require('../config/auth');
//User Model
const User = require('../models/User');
const Organization = require('../models/Organization');
const Team = require('../models/Team');
const SkillSet = require('../models/SkillSet');
const Role   = require('../models/Role');
const Location   = require('../models/Location');


router.get('/login', (req, res) => res.render('login',{user:req.user,nav:'false'}));

router.get('/register', (req, res) =>{
  Organization.find().then(orgs => {
   
    res.render('register', {
      user: req.user,
      orgs,
      nav:'false'
      
    });

  });
  
});

router.get('/orglogin',(req,res) =>{
  res.render('orglogin',{nav:'false'});
});

router.post('/reguser',(req,res) =>{
  res.render('dashboard',{nav:'true'});
});

router.get('/qualification',(req,res) =>{
  res.render('addqualification',{nav:'true'});

});

router.get('/privacy',(req,res) =>{
  res.render('privacypolacy',{nav:'false'});
});

router.get('/overview',(req,res)=>{
  User.find({},{username:1,firstName:1,lastName:1,email:1,type:1,organization:1}).then(users => { 
    res.render('userOverview',{users});    
  });
});


router.get('/details/:username',(req,res)=>{
  User.findOne({username:req.params.username},{username:1,firstName:1,lastName:1,email:1,type:1,organization:1}).then(user => { 
    res.render('userDetails',{user:user});    
  });
});

//register Handle

router.post('/register', (req, res) => {
    const { username, firstName, lastName, email, type,organization, password1, password2 } = req.body;
    let errors = [];

    if(!firstName || !lastName || !email || !password1 || !password2){
        errors.push({ msg: 'Please Fill in All Fields'});
    }
    
    if(password1 !== password2){
        errors.push({ msg: 'Passwords Do Not Match'});
    }

    if(password1.length < 6){
        errors.push({msg: 'Password Should be More Than 6 Characters'});        
    }

    if(errors.length > 0){
      Organization.find().then(orgs => {
        res.render('register',{
            errors,
            email,
            firstName,
            lastName,
            nav:'false'
            
            
        });
      });
    }else {
        User.findOne({ email: email }).then(user => {
          if (user) {            
            errors.push({ msg: 'Email already exists!' });
            Organization.find().then(orgs => {
            res.render('register', {
                errors,                
                firstName,
                lastName,
                email,
                type,
                organization,
                password1,
                password2,
                orgs:orgs,
                nav:'false'
            });
          });
          } else {
            const newUser = new User({
                errors,                
                firstName,
                lastName,
                email,
                type,                
                password1                
            });
    
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password1, salt, (err, hash) => {
                if (err) throw err;
                newUser.password1 = hash;
                newUser
                  .save()
                  .then(user => {
                    req.flash(
                      'success_msg',
                      'New User created!'
                    );
                    
                    Organization.find().then(orgs => {
                      req.flash(
                        'success_msg',
                        'New User Created'
                    );
                      res.render('login', {
                        user: req.user,
                        nav:'false'
                      });
                    });
                  })
                  .catch(err => console.log(err));
              });
            });
          }
    });    
    }
});

//Login Handle
router.get('/addPeople',ensureAuthenticated,(req,res)=>{
  Team.find({email:req.user.email}).then(teams =>{
    SkillSet.find({email:req.user.email}).then(skills =>{
      Role.find({email:req.user.email}).then(roles=>{
        Location.find({email:req.user.email}).then(locations=>{
          console.log('lcations : '+locations);
          res.render('addPeople',{nav:'true',skills:skills,teams:teams,roles:roles,locations:locations});
        });
        
      });
    });
  });
});

router.get('/findPeople',ensureAuthenticated,(req,res)=>{
  res.render('findPeople',{nav:'true'});
});

router.get('/People',ensureAuthenticated,(req,res) =>{
  User.find({main_user:req.user.email}).then(users=>{
    res.render('people',{nav:'true',users:users});
  });  
});

router.get('/upAss',(req,res)=>{
  
User.updateOne({'skillset.skill_name':'M3'},{$set:{'skillset.skill_group.skills.$.proficiency':2}}).then(r=>{
  res.send('done');
});



});



router.post('/savePeople',(req,res) =>{
  
  const { firstName, lastName, email, type,organization, password1, password2,team_name,role_name,skill_name,login, security_group,country,city} = req.body;

  User.findOne({ email: email }).then(user => {
    if (user) {            
      req.flash(
        'error_msg',
        'Email Already Exists!'
      );        
      res.redirect('/users/addPoeple');
         
      
    } else {
      SkillSet.findOne({skill_name:skill_name}).then(skillset=>{
        console.log('skill set  '+skill_name);
        const newUser = new User({  
          username:'asdasdas',
          firstName:firstName,
          lastName:lastName,
          email:email,          
          password1:password1,
          team_name:team_name,
          role_name:role_name,
          country:country,
          city:city,
          skill_name:skill_name,
          login:login,
          main_user:req.user.email,
          security_group:security_group,
          skillset:[skillset]
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password1, salt, (err, hash) => {
            if (err) throw err;
            newUser.password1 = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'New Person created!'
                );   
                res.redirect('/users/people');
              })
              .catch(err => console.log(err));
          });
        });
      });
    }
  }); 

});




router.post('/login', (req, res, next) => {
    passport.authenticate('local', {      
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  });

  // Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
  });
  

module.exports = router;
