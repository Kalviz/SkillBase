const express = require('express');
const router = express.Router();
const assert = require('assert');
const { ensureAuthenticated } = require('../config/auth');

const Location = require('../models/Location');
const Role = require('../models/Role');
const SkillSet = require('../models/SkillSet');
const Skill = require('../models/Skill');


router.get('/index',ensureAuthenticated,(req,res) => {
    console.log('test');
    SkillSet.find({email:req.user.email}).then(recs =>{
        res.render('skills',{nav:'true', recs:recs});
    });
    
});

router.get('/skillGroup/index',ensureAuthenticated,(req,res)=>{
    SkillSet.find({email:req.user.email}).then(recs =>{
        res.render('skillGroup',{nav:'true',recs:recs});
    });
});

router.get('/skillGroupSkill/index',ensureAuthenticated,(req,res)=>{
    SkillSet.find({email:req.user.email}).then(recs =>{
        res.render('skillGroupSkill',{nav:'true',recs:recs});
       
    });
});

router.get('/add',ensureAuthenticated,(req,res) =>{
    SkillSet.find({email:req.user.email}).then(recs=>{
        res.render('addSkill',{nav:'true',recs:recs});
    });
    
});


router.get('/addSkillGroup',ensureAuthenticated,(req,res)=>{
    SkillSet.find({email:req.user.email}).then(skills =>{
        res.render('addSkillGroup',{nav:'true',skills:skills});
    });
});



router.get('/addSkillGroupSkill',ensureAuthenticated,(req,res)=>{
    SkillSet.find({email:req.user.email}).then(skills =>{
        res.render('addSkillGroupSkill',{nav:'true',skills:skills});
    });
});

router.post('/saveSkillGroup',ensureAuthenticated,(req,res) =>{
    const {skill_name,skill_group_name} = req.body;
    SkillSet.updateOne({email:req.user.email,skill_name:skill_name},{$push:{skill_group:[{skill_group_name:skill_group_name}]}}).then(rec=>{
        req.flash('success_msg',
                'Skill Group Added : '+skill_name);
        res.redirect('/skills/skillGroup/index');
    });
});


router.post('/saveSkillGroupSkill',(req,res) =>{
    const {skill_name,skill_group_name,skill} = req.body;
    SkillSet.updateOne({skill_name:skill_name,'skill_group.skill_group_name':skill_group_name},{$push:{'skill_group.$.skills':{skill:skill}}}).then(rec=>{
        req.flash('success_msg',
                'Skill Added : '+skill);
        res.redirect('/skills/skillGroupSkill/index');        
    });

   /*  SkillSet.updateOne({skill_name:skill_name,skill_group:{$e;e}},{$push:{skill_group:[{skill_group_name:skill_group_name}]}}).then(rec=>{
        req.flash('success_msg',
                'Skill Group Added : '+skill_name);
        res.redirect('/skills/skillGroup/index');
    });
 */
    
   /*  const newSkill = new Skill({        
        skill_name:skill_name,
        skill_group_name:skill_group_name,
        skill:skill        
    });
    
    newSkill.save()
    .then(user=>{
        req.flash('success_msg',
                'New Skill Added');



                res.redirect('/skills/skillGroupSkill/index');
}).catch(err => console.log(err));*/

});


router.post('/getSkillGroup/:skill_name',(req,res) =>{
    SkillSet.findOne({skill_name:req.params.skill_name}).then(sg=>{
        res.send({sg:sg});
    });
});

router.post('/save',ensureAuthenticated,(req, res) =>{
    const {skill_name,description} =req.body;
                
            const newSkill = new SkillSet({
                email:req.user.email,
                skill_name:skill_name,
                description: description
            });
            
            newSkill.save()
            .then(user=>{
                req.flash('success_msg',
                        'New Skill Added : '+skill_name);



                        res.redirect('/skills/index');

       
    }).catch(err => console.log(err));

});


router.get('/edit/:_id',(req,res)=>{
    SkillSet.findOne({_id:req.params._id}).then(rec=>{
        console.log('rec '+rec);
        res.render('editSkill',{rec:rec,nav:'true'});
    });
});


router.post('/update/:_id',(req,res)=>{
    const {skill_name,description} =req.body;
    SkillSet.updateOne(
        {_id:req.params._id},
            {skill_name : skill_name,
            description: description
            }).then(rec=>{
                req.flash('success_msg',
                'Skill Updated : '+skill_name);



                res.redirect('/skills/index');

            });
        });


router.get('/delete/:_id',(req,res)=>{    
    SkillSet.deleteOne({_id:req.params._id}).then(rec=>{
                req.flash('error_msg',
                'Skill Deleted');
                res.redirect('/skills/index');

            });
        });





module.exports = router;