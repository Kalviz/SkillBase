const express = require('express');
const router = express.Router();
const assert = require('assert');
const { ensureAuthenticated } = require('../config/auth');

const Location = require('../models/Location');
const Role = require('../models/Role');
const Team = require('../models/Team');


router.get('/index',ensureAuthenticated,(req,res) => {
    console.log('test');
    Team.find({email:req.user.email}).then(recs =>{
        res.render('teams',{nav:'true', recs:recs});
    });
    
});

router.get('/add',ensureAuthenticated,(req,res) =>{
    res.render('addTeam',{nav:'true'});
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