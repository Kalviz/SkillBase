const express = require('express');
const router = express.Router();
const assert = require('assert');
const { ensureAuthenticated } = require('../config/auth');

const Qualification = require('../models/Qualification');

router.post('/save',(req, res) =>{
    const {qualification_name,status,start_date,end_date,email} =req.body;
    console.log('org name '+email);
                
            const newQualification = new Qualification({
                email,
                qualification_name,
                status,
                start_date,
                end_date
            });
            
            newQualification.save()
            .then(user=>{
                req.flash('success_msg',
                        'New Qualification Added : '+qualification_name);



                        res.redirect('/dashboard');

       
    }).catch(err => console.log(err));

});


router.get('/edit/:_id',(req,res)=>{
    Qualification.findOne({_id:req.params._id}).then(rec=>{
        console.log('rec '+rec);
        res.render('editQualification',{rec:rec,nav:'true'});
    });
});


router.post('/update/:_id',(req,res)=>{
    const {qualification_name,status,start_date,end_date,email} =req.body;
    Qualification.updateOne(
        {_id:req.params._id},
            {qualification_name : qualification_name,
                status:status,
                start_date:start_date,
                end_date:end_date
            }).then(rec=>{
                req.flash('success_msg',
                'Qualification Updated : '+qualification_name);



                res.redirect('/dashboard');

            });
        });


router.get('/delete/:_id',(req,res)=>{    
    Qualification.deleteOne({_id:req.params._id}).then(rec=>{
                req.flash('success_msg',
                'Qualification Deleted');
                res.redirect('/dashboard');

            });
        });





module.exports = router;