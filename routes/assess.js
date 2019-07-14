const express = require('express');
const router = express.Router();
const assert = require('assert');
const { ensureAuthenticated } = require('../config/auth');

const Location = require('../models/Location');
const Role = require('../models/Role');
const Team = require('../models/Team');
const User = require('../models/User');
const SkillSet = require('../models/SkillSet');


router.get('/index',ensureAuthenticated,(req,res) => {
    
    User.find({main_user:req.user.email}).then(users=>{
        res.render('assessPoeple',{nav:'true',users:users});
      });  
});

router.get('/add',ensureAuthenticated,(req,res) =>{
    res.render('addTeam',{nav:'true'});
});

router.post('/submitAssessment',(req,res)=>{
     post = new User(req.body);
     var test = JSON.stringify(req.body, null, 2);
     console.log('post '+JSON.stringify(req.body, null, 2));     

     User.update({email:'asdasd@gmail.com'},{$set:{skillset:req.body}},{upsert:true}).then(t=>{
        req.flash(
            'success_msg',
            'Assessment Done!'
        )
        res.redirect('/assess/index')
    }) ;
    
});

router.post('/saveAssess/:proficiency/:_id/:email',(req,res)=>{
   const {asdas } = req.body;
   var par = req.params._id.split('/');
   console.log('proficiency '+req.params.proficiency);
   console.log('_id '+req.params._id);
   console.log('email '+req.params.email);
   User.findOne({email:req.params.email}).then(rec=>{
    
    //rec.forEach(function(r){        
        
                
                
              
                User.updateOne({email:req.params.email,'skillset.skill_group.skills._id':'5d22c9e7c8a49d2da82aaac3'},{            
                    $set:{'skillset.$[].skill_group.$[].skills.$':{proficiency:1123123}}
                }).then(rt=>{
                    
                    res.send('ok');
                }); 
        

        
        
        
    //});
   });  
});
// /,{$set:{'skillset[0].skill_group.$.skills.$.':{skill:'gihra'}}}
//router.post('/saveAssess/:email/:skill_name:/:skill_group_name/:skill/:proficiency')

router.get('/assessPerson/:_id',ensureAuthenticated,(req,res)=>{
    User.findOne({_id:req.params._id}).then(rec=>{
        res.render('assessPerson',{nav:'true',rec:rec});
    });
});

router.post('/save',ensureAuthenticated,(req, res) =>{
    const {team_name,delegates,user_selectable,skill_catagory} =req.body;
                
            const newTeam = new Team({
                email:req.user.email,
                team_name:team_name,
                delegates:delegates,
                user_selectable:user_selectable,
                skill_catagory:skill_catagory                
            });
            
            newTeam.save()
            .then(user=>{
                req.flash('success_msg',
                        'New Team Added : '+team_name);



                        res.redirect('/teams/index');

       
    }).catch(err => console.log(err));

});


router.get('/edit/:_id',(req,res)=>{
    Team.findOne({_id:req.params._id}).then(rec=>{
        console.log('rec '+rec);
        res.render('editTeam',{rec:rec,nav:'true'});
    });
});


router.post('/update/:_id',(req,res)=>{
    const {skill_name,description} =req.body;
    Team.updateOne(
        {_id:req.params._id},
            {skill_name : skill_name,
            description: description
            }).then(rec=>{
                req.flash('success_msg',
                'Team Updated : '+Team);



                res.redirect('/teams/index');

            });
        });


router.get('/delete/:_id',(req,res)=>{    
    Team.deleteOne({_id:req.params._id}).then(rec=>{
                req.flash('error_msg',
                'Team Deleted');
                res.redirect('/teams/index');

            });
        });





module.exports = router;