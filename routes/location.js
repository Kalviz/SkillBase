const express = require('express');
const router = express.Router();
const assert = require('assert');
const { ensureAuthenticated } = require('../config/auth');

const Location = require('../models/Location');
const Post = require('../models/Post');
const User = require('../models/User');
const SkillSet = require('../models/SkillSet');


router.get('/index',ensureAuthenticated,(req,res) => {
    
    Location.find({organization:req.user.organization}).then(recs=>{
        res.render('location',{nav:'true',recs:recs});
    });
    
});


router.post('/new', (req, res) => {
    var post = new Post(req.body);
    console.log(req.body);
    Post.updateOne({_id:'5d26f008fccc4d29cc40beb6'},{$set:{post}}).then(t=>{

        res.send("Success! Your post hdasfsdfsdfsdfsdfsdas been saved.");
    });
    });


router.post('/t',(req,res)=>{
    
    var x = {};
    x['req.body.last_name'] = req.body.last_name;

    console.log('my form '+req.body.last_name);
});

router.get('/test',(req,res)=>{
    res.render('test',{nav:'true'});
    
    
    });

router.get('/add',ensureAuthenticated,(req,res) =>{
    res.render('addLocation',{nav:'true'});
});

router.get('/heatmapConsultant',ensureAuthenticated,(req,res)=>{
    const {skill_name} = req.body;
    Location.find({organization:req.user.organization}).then(locations=>{        
        SkillSet.find({organization:req.user.organization}).then(skills =>{
            
                res.render('heatmapConsultant',{nav:'true',locations:locations,skills:skills,show:'false'});
                   
        });
    });
});

router.post('/heatmapConsultant',ensureAuthenticated,(req,res)=>{
    const {skill_name,country} = req.body;
    var obj ={};
    if(country=='All'){
        obj['skill_name'] = skill_name;
        obj['organization'] = req.user.organization;
        obj['status'] = 'Assessed';
    }else{
        obj['country'] = country;
        obj['skill_name'] = skill_name;
        obj['organization'] = req.user.organization;
        obj['status'] = 'Assessed';
    }
    Location.find({organization:req.user.organization}).then(locations=>{        
        SkillSet.find({organization:req.user.organization}).then(skill =>{
            SkillSet.find({organization:req.user.organization,skill_name:skill_name}).then(skills =>{
            User.find(obj).then(users=>{
                console.log('users '+users);
                res.render('heatmapConsultant',{nav:'true',locations:locations,recs:skills,skills:skill,users:users,show:'true'});
            });        
        });
        });
    });
});

router.get('/heatmapSkill',ensureAuthenticated,(req,res)=>{
    const {skill_name} = req.body;
    Location.find({organization:req.user.organization}).then(locations=>{        
        SkillSet.find({organization:req.user.organization}).then(skills =>{
            
                res.render('heatmapSkill',{nav:'true',locations:locations,skills:skills,show:'false'});
                   
        });
    });
});

router.post('/heatmapSkill',ensureAuthenticated,(req,res)=>{
    const {skill_name,country} = req.body;
    var obj ={};
    if(country=='All'){
        obj['skill_name'] = skill_name;
        obj['organization'] = req.user.organization;
        obj['status'] = 'Assessed';
    }else{
        obj['country'] = country;
        obj['skill_name'] = skill_name;
        obj['organization'] = req.user.organization;
        obj['status'] = 'Assessed';
    }
    Location.find({organization:req.user.organization}).then(locations=>{        
        SkillSet.find({organization:req.user.organization}).then(skill =>{
            SkillSet.find({organization:req.user.organization,skill_name:skill_name}).then(skills =>{
            User.find(obj).then(users=>{
                console.log('users '+users);
                res.render('heatmapSkill',{nav:'true',
                locations:locations,
                recs:skills,
                skills:skill,
                users:users,
                skill:skill_name,
                country:country,
                show:'true'});
            });        
        });
        });
    });
});




router.get('/test123',(req,res)=>{
    SkillSet.findOne({organization:req.user.organization,skill_name:'IFS'}).then(skills =>{
        User.updateMany({email:'ben@gmail.com'},{$set:{skillset:[skills]}}).then(res3=>{
            console.log('skill '+req.user.organization);
            res.send('done');
        });
    });
});


router.post('/save',(req, res) =>{
    const {location_name,latitude,longitude} =req.body;    
                
            const newLocation = new Location({
                location_name:location_name,
                latitude:latitude,
                longitude:longitude,
                email:req.user.email,
                organization:req.user.organization
            });
            
            newLocation.save()
            .then(user=>{
                req.flash('success_msg',
                        'New Location Added : '+location_name);
                        res.redirect('/location/index');

       
    }).catch(err => console.log(err));

});


router.get('/edit/:_id',(req,res)=>{
    Location.findOne({_id:req.params._id}).then(rec=>{        
        res.render('editLocation',{rec:rec,nav:'true'});
    });
});


router.post('/update/:_id',(req,res)=>{
    const {location_name} =req.body;
    Location.updateOne(
        {_id:req.params._id},
            {location_name:location_name
            }).then(rec=>{
                req.flash('success_msg',
                'Location Updated : '+location_name);
                res.redirect('/location/index');

            });
        });


router.get('/delete/:_id',(req,res)=>{    
    Location.deleteOne({_id:req.params._id}).then(rec=>{
                req.flash('error_msg',
                'Location Deleted!');
                res.redirect('/location/index');

            });
        });





module.exports = router;