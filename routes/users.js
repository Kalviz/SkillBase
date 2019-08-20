const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const {ObjectId} = require('mongodb');
const { ensureAuthenticated } = require('../config/auth');
//User Model
const User = require('../models/User');
const Organization = require('../models/Organization');
const Team = require('../models/Team');
const SkillSet = require('../models/SkillSet');
const Role   = require('../models/Role');
const Location   = require('../models/Location');
const Certification   = require('../models/Certification');


router.get('/login', (req, res) => res.render('login',{user:req.user,nav:'false'}));

/* router.get('/register/:_id', (req, res) =>{  
    Organization.findOne({_id:req.params._id}).then(org => {  
      console.log('test') ;
      if(org){
        res.render('register', {
          user: req.user,
          org,
          nav:'false'
          
        });
      }else{
        req.flash(
          'error_msg',
          'Organization Not Found! Please Register a Valid Organization-'
        );
        res.redirect('/users/orglogin');
      }
    });
}); */



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
  Team.find({organization:req.user.organization}).then(teams =>{
    SkillSet.find({organization:req.user.organization}).then(skills =>{
      Role.find({organization:req.user.organization}).then(roles=>{
        Location.find({organization:req.user.organization}).then(locations=>{
          Organization.find().then(orgs=>{
            console.log('lcations : '+locations);
            res.render('addPeople',{nav:'true',skills:skills,teams:teams,roles:roles,locations:locations,orgs,
                                    firstName:'',
                                    lastName:'',
                                    team_name :'',
                                    role_name:'',
                                    city:'',
                                    country:'',
                                    skill_name:'',
                                    security_group:'',
                                    login:'',
                                    email:'',
                                    organization:''
                                    });
            });
          });
        });
    });
  });
});



router.get('/People',ensureAuthenticated,(req,res) =>{
  User.find({organization:req.user.organization}).then(users=>{
    res.render('people',{nav:'true',users:users});
  });  
});

router.get('/upAss',(req,res)=>{
  
User.updateOne({'skillset.skill_name':'M3'},{$set:{'skillset.skill_group.skills.$.proficiency':2}}).then(r=>{
  res.send('done');
});
});


router.post('/updatePeople/:_id',ensureAuthenticated,(req,res)=>{
  const { firstName, lastName, team_name,role_name, security_group,country,city,organization} = req.body;
  User.updateOne({_id:req.params._id},
    {firstName:firstName,
      lastName:lastName,
      team_name:team_name,
      role_name:role_name,
      city:city,
      country:country,
      security_group:security_group,
      organization:organization}).then(r=>{
        req.flash('success_msg',
                  'Person Updated!');
        res.redirect('/users/People');
      });

});



router.post('/peopleFinder',(req,res)=>{
  const {country,skill_name,skill_group_name,skill} = req.body;
  console.log('country '+country);
  console.log('skill_name '+skill_name);
  var obj={};
  obj['organization'] = req.user.organization;
  if(country !='All'){
    obj['country'] = country;
  }
  if(skill_name){
    obj['skill_name'] = skill_name;
  }
  if(skill_group_name){
    obj['skillset.skill_group.skill_group_name'] = skill_group_name;
  }
  if(skill){
    obj['skillset.skill_group.skills.skill'] = skill;
  }
  
  User.find(obj).then(recs=>{
    console.log('recs '+recs);
    SkillSet.find({organization:req.user.organization}).then(skills =>{
      Location.find({organization:req.user.organization}).then(locations=>{        
        res.render('peopleFinder',{nav:'true',skills:skills,locations:locations,recs:recs,location_name:country,skill_name:skill_name,skill_group_name:skill_group_name,skill:skill});
    });  
  });
});
});

router.post('/listPeople',(req,res)=>{
  const {country,skill_name,skill_group_name,skill} = req.body;
  console.log('country '+country);
  console.log('skill_name '+skill_name);
  var obj={};
  obj['organization'] =req.user.organization;
  if(country !='All'){
    obj['country'] = country;
  }
  if(skill_name){
    obj['skill_name'] = skill_name;
  }  
  User.find(obj).then(recs=>{
    console.log('recs '+recs);
    SkillSet.find({organization:req.user.organization}).then(skills =>{
      Location.find({organization:req.user.organization}).then(locations=>{
        res.render('peopleList',{nav:'true',skills:skills,locations:locations,recs:recs,
                  location_name:country,skill_name:skill_name,skill_group_name:skill_group_name,skill:skill});
    });  
  });
});
});


router.get('/skillsbyPerson/:_id',(req,res)=>{
  User.findOne({_id:req.params._id}).then(rec=>{
    Certification.find({organization:req.user.organization}).then(certifications=>{
      var obj = []
      var count =0;

      rec.skillset[0].skill_group.forEach(function(sg){
        obj[count] = [sg.skill_group_name];
        count++;
      });
      console.log('obj '+obj[0]);

      res.render('skillsbyPerson',{nav:'true',rec:rec,obj,certifications:certifications});
    });    
  });
});

router.get('/peopleFinder',ensureAuthenticated,(req,res)=>{
  SkillSet.find({organization:req.user.organization}).then(skills =>{
    Location.find({organization:req.user.organization}).then(locations=>{
      User.find({organization:req.user.organization}).then(recs=>{
        res.render('peopleFinder',{nav:'true',skills:skills,locations:locations,recs:recs,location_name:'',skill_name:'',skill_group_name:'',skill:''});
      });
      
  });  
});
});


router.get('/peopleList',ensureAuthenticated,(req,res)=>{
  SkillSet.find({organization:req.user.organization}).then(skills =>{
    Location.find({organization:req.user.organization}).then(locations=>{
      User.find({organization:req.user.organization}).then(recs=>{
        res.render('peopleList',{nav:'true',skills:skills,locations:locations,recs:recs,
        location_name:'',skill_name:'',skill_group_name:'',skill:''});
      });
      
  });  
});
});


router.get('/deletePeople/:_id',ensureAuthenticated,(req,res)=>{
  User.findOneAndDelete({_id:req.params._id}).then(rec=>{
    console.log('rec '+rec);
    req.flash('error_msg',

              'Person "'+rec.firstName+' '+rec.lastName+'" Deleted');
              res.redirect('/users/People');

  });
});

router.get('/editPeople/:_id',ensureAuthenticated,(req,res)=>{
  User.findOne({_id:req.params._id}).then(rec=>{
    Team.find({organization:req.user.organization}).then(teams =>{
      SkillSet.find({organization:req.user.organization}).then(skills =>{
        Role.find({organization:req.user.organization}).then(roles=>{
          Location.find({organization:req.user.organization}).then(locations=>{     
            Organization.find().then(orgs=>{
              res.render('editPeople',{rec:rec,nav:'true',teams:teams,roles:roles,locations:locations,skills:skills,orgs:orgs});
            });                   
          });
        });
      });
    });
  });
});


router.post('/savePeople',(req,res) =>{
  let errors = [];
  const { firstName, lastName, email, type,organization, password1, password2,team_name,role_name,skill_name,login, security_group,country,city} = req.body;
  if(login == 'Enabled'){
    console.log('lastName '+lastName);

    User.findOne({ email: email }).then(user => {
      if (user) {            
       errors.push({msg : 'Email Already Exists!'});
        Team.find({organization:req.user.organization}).then(teams =>{
          SkillSet.find({organization:req.user.organization}).then(skills =>{
            Role.find({organization:req.user.organization}).then(roles=>{
              Location.find({organization:req.user.organization}).then(locations=>{
                Organization.find().then(orgs=>{
                  console.log('lcations : '+locations);
                  res.render('addPeople',{nav:'true',skills:skills,teams:teams,roles:roles,locations:locations,errors,orgs,
                                          firstName:firstName,
                                          lastName:lastName,
                                          team_name:team_name,
                                          role_name:role_name,
                                          city:city,
                                          country:country,
                                          skill_name:skill_name,
                                          security_group:security_group,
                                          login:login,
                                          email:email,
                                          organization:organization
                                          });
                });                
              });              
            });
          });
        });        
      }else {
        SkillSet.findOne({organization:req.user.organization,skill_name:skill_name}).then(skillset=>{
          console.log('skill sdfsdfset  '+skillset);
          const newUser = new User({            
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
            organization:organization,
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
          if(email!=''){
            var mailOptions = {
              from: 'lcsapp.lk@gmail.com',
              to: email,
              subject: 'Your Anthesis Expert-Ease system is ready to go',
              text: 'Your Anthesis Expert-Ease instance has been set up and is ready to go!'+
              '\n\n The first thing to do is create your account. Click the following link (or copy and paste into your web browser) to get started:'+
              '\n\n Password : '+password1+
              '\n\n http://51.52.8.2:5000/users/login/'
          };          
          req.app.get('mailtrans').sendMail(mailOptions, function(error, info){
              if (error) {
              console.log(error);
              } else {
              console.log('Email sent: ' + info.response);
              }
          });
          }          
        });
      }
    }); 
  }else{

    User.findOne({ email: email }).then(user => {
      if (user) {            
       errors.push({msg : 'Email Already Exists!'});
        Team.find({organization:req.user.organization}).then(teams =>{
          SkillSet.find({organization:req.user.organization}).then(skills =>{
            Role.find({organization:req.user.organization}).then(roles=>{
              Location.find({organization:req.user.organization}).then(locations=>{
                Organization.find().then(orgs=>{
                  console.log('lcations : '+locations);
                  res.render('addPeople',{nav:'true',skills:skills,teams:teams,roles:roles,locations:locations,errors,orgs,
                                          firstName:firstName,
                                          lastName:lastName,
                                          team_name:team_name,
                                          role_name:role_name,
                                          city:city,
                                          country:country,
                                          skill_name:skill_name,
                                          security_group:security_group,
                                          login:login,
                                          email:email,
                                          organization:organization
                                          });
                });                
              });              
            });
          });
        });        
      }else{
        SkillSet.findOne({organization:req.user.organization,skill_name:skill_name}).then(skillset=>{
          console.log('skill set  '+skill_name);
          const newUser = new User({            
            firstName:firstName,
            lastName:lastName,
            email:email,          
            password1:password1,
            team_name:team_name,
            role_name:role_name,
            country:country,
            city:city,
            organization:organization,
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
  }
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
