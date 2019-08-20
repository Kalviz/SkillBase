const express = require('express');
const router = express.Router();
const assert = require('assert');
const { ensureAuthenticated } = require('../config/auth');

const Location = require('../models/Location');
const Role = require('../models/Role');


router.get('/index',ensureAuthenticated,(req,res) => {
    console.log('test');
    Role.find({organization:req.user.organization}).then(recs =>{
        res.render('roles',{nav:'true', recs:recs});
    });
    
});

router.get('/add',ensureAuthenticated,(req,res) =>{
    res.render('addRole',{nav:'true'});
});

router.post('/save',ensureAuthenticated,(req, res) =>{
    const {role_name} =req.body;
                
            const newRole = new Role({
                email:req.user.email,
                role_name:role_name,
                organization:req.user.organization
            });
            
            newRole.save()
            .then(user=>{
                req.flash('success_msg',
                        'New Role Added : '+role_name);



                        res.redirect('/roles/index');

       
    }).catch(err => console.log(err));

});


router.get('/edit/:_id',(req,res)=>{
    Role.findOne({_id:req.params._id}).then(rec=>{
        console.log('rec '+rec);
        res.render('editRole',{rec:rec,nav:'true'});
    });
});


router.post('/update/:_id',(req,res)=>{
    const {role_name} =req.body;
    Role.updateOne(
        {_id:req.params._id},
            {role_name : role_name
            }).then(rec=>{
                req.flash('success_msg',
                'Role Updated : '+role_name);



                res.redirect('/roles/index');

            });
        });


router.get('/delete/:_id',(req,res)=>{    
    Role.deleteOne({_id:req.params._id}).then(rec=>{
                req.flash('success_msg',
                'Role Deleted');
                res.redirect('/roles/index');

            });
        });





module.exports = router;