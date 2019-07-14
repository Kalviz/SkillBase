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
            
            newOrganization.save()
            .then(user=>{
                req.flash('success_msg',
                        'New Organization Created : '+organization_name);

                var mailOptions = {
                    from: 'lcsapp.lk@gmail.com',
                    to: email,
                    subject: 'Your Skills Base system is ready to go',
                    text: 'Your Skills Base instance has been set up and is ready to go!'+
                    '\n\n The first thing to do is create your account. Click the following link (or copy and paste into your web browser) to get started:'+
                    '\n\n http://51.52.8.2:5000/users/register/'
                };
                
                req.app.get('mailtrans').sendMail(mailOptions, function(error, info){
                    if (error) {
                    console.log(error);
                    } else {
                    console.log('Email sent: ' + info.response);
                    }
                });                 
                res.render('join',{nav:true,email:email});

            }).catch(err => console.log(err));
        }
        else{
            req.flash('error_msg',
                        'Organization Already Exists!');
            
            res.render('join',{nav:true});

        }
    }).catch(err => console.log(err));

})



router.get('/create',(req, res)=>{
    Organization.find().then(orgs=>{
        res.render('createOrganization',{orgs:orgs,nav:'false'});

    });   

});




module.exports = router;