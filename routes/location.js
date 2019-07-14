const express = require('express');
const router = express.Router();
const assert = require('assert');
const { ensureAuthenticated } = require('../config/auth');

const Location = require('../models/Location');
const Post = require('../models/Post');
const User = require('../models/User');


router.get('/index',ensureAuthenticated,(req,res) => {
    
    Location.find({email:req.user.email}).then(recs=>{
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

router.post('/save',(req, res) =>{
    const {location_name} =req.body;    
                
            const newLocation = new Location({
                location_name:location_name,
                email:req.user.email
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