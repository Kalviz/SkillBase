const express = require('express');
const router = express.Router();
const assert = require('assert');
const { ensureAuthenticated } = require('../config/auth');

const Certification = require('../models/Certification');


router.get('/index',ensureAuthenticated,(req,res) => {
    console.log('test');
    Certification.find({email:req.user.email}).then(recs=>{
        res.render('certifications',{nav:'true',recs:recs});
    });
    
});

router.get('/add',ensureAuthenticated,(req,res) =>{
    res.render('addCertification',{nav:'true'});
});

router.post('/save',(req, res) =>{
    const {certification_name} =req.body;    
                
            const newCertification = new Certification({
                certification_name:certification_name,
                email:req.user.email
            });
            
            newCertification.save()
            .then(user=>{
                req.flash('success_msg',
                        'New Certificate Added : '+certification_name);
                        res.redirect('/certifications/index');

       
    }).catch(err => console.log(err));

});


router.get('/edit/:_id',ensureAuthenticated,(req,res)=>{
    Certification.findOne({_id:req.params._id}).then(rec=>{        
        res.render('editCertifications',{rec:rec,nav:'true'});
    });
});


router.post('/update/:_id',ensureAuthenticated,(req,res)=>{
    const {certification_name} =req.body;
    Certification.updateOne(
        {_id:req.params._id},
            {certification_name:certification_name
            }).then(rec=>{
                req.flash('success_msg',
                'Certificate Updated : '+certification_name);
                res.redirect('/certifications/index');

            });
        });


router.get('/delete/:_id',ensureAuthenticated,(req,res)=>{    
    Certification.deleteOne({_id:req.params._id}).then(rec=>{
                req.flash('error_msg',
                'Certificate Deleted');
                res.redirect('/certifications/index');

            });
        });





module.exports = router;