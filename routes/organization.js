const express = require('express');
const router = express.Router();
const assert = require('assert');
const { ensureAuthenticated } = require('../config/auth');

const Organization = require('../models/Organization');

router.post('/save',(req, res) =>{
    const {organization_name,organization_industry,organization_size,role,department,link,email} =req.body;
    console.log('org name '+email);
    Organization.findOne({organization_name:organization_name}).then(rec =>{
        if(!rec){       
            
            const newOrganization = new Organization({
                organization_name,
                organization_industry,
                organization_size,
                email,
                role,
                department,
                link
            });
            console.log('newOrganization._id :'+newOrganization._id);
            newOrganization.save()
            .then(user=>{
                req.flash('success_msg',
                        'New Organization Created : '+organization_name);
                
                res.redirect('/dashboard');

            }).catch(err => console.log(err));
        }
        else{
            req.flash('error_msg',
                        'Organization Already Exists!');
            
            res.render('join',{nav:true});

        }
    }).catch(err => console.log(err));

});


router.post('/update/:_id',(req, res) =>{
    const {organization_name,organization_industry,organization_size,role,department,link,email} =req.body;
    console.log('org name '+email);
    Organization.findOne({_id:req.params._id}).then(rec =>{
        if(rec){       
            Organization.update({_id:req.params._id},
                {
                    organization_industry:organization_industry,
                    organization_size:organization_size,
                    role:role,
                    department:department
                }).then(rt=>{
                    req.flash('success_msg',
                    'Organization Update : '+organization_name);
            
                    res.redirect('/organization/index');
                });
        }
        else{
            req.flash('error_msg',
                        'Organization Already Exists!');
            
            res.render('join',{nav:true});

        }
    }).catch(err => console.log(err));

})

router.get('/index',ensureAuthenticated,(req,res)=>{
    Organization.find().then(orgs=>{
        res.render('organization',{nav:'true',orgs:orgs});
    });
    
});

router.get('/register',(req,res) =>{
    res.render('orglogin',{nav:'true'});
  });


  router.get('/edit/:_id',(req,res) =>{
    Organization.findOne({_id:req.params._id}).then(rec=>{
        res.render('editOrganization',{nav:'true',rec:rec});
    });    
  });

/* router.get('/create',(req, res)=>{
    Organization.find().then(orgs=>{
        res.render('createOrganization',{orgs:orgs,nav:'false'});

    });   

}); */




module.exports = router;