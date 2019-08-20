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
    SkillSet.find({organization:req.user.organization}).then(recs =>{
        res.render('skills',{nav:'true', recs:recs});
    });
    
});

router.get('/skillGroup/index',ensureAuthenticated,(req,res)=>{
    SkillSet.find({organization:req.user.organization}).then(recs =>{
        res.render('skillGroup',{nav:'true',recs:recs});
    });
});

router.get('/skillGroupSkill/index',ensureAuthenticated,(req,res)=>{
    SkillSet.find({organization:req.user.organization}).then(recs =>{
        res.render('skillGroupSkill',{nav:'true',recs:recs});
       
    });
});

router.get('/add',ensureAuthenticated,(req,res) =>{
    SkillSet.find({organization:req.user.organization}).then(recs=>{
        res.render('addSkill',{nav:'true',recs:recs});
    });
    
});


router.get('/addSkillGroup',ensureAuthenticated,(req,res)=>{
    SkillSet.find({organization:req.user.organization}).then(skills =>{
        res.render('addSkillGroup',{nav:'true',skills:skills});
    });
});



router.get('/addSkillGroupSkill',ensureAuthenticated,(req,res)=>{
    SkillSet.find({organization:req.user.organization}).then(skills =>{
        res.render('addSkillGroupSkill',{nav:'true',skills:skills});
    });
});

router.post('/saveSkillGroup',ensureAuthenticated,(req,res) =>{
    const {skill_name,skill_group_name} = req.body;
    SkillSet.updateOne({organization:req.user.organization,skill_name:skill_name},{$push:{skill_group:[{skill_group_name:skill_group_name}]}}).then(rec=>{
        req.flash('success_msg',
                'Skill Group Added : '+skill_name);
        res.redirect('/skills/skillGroup/index');
    });
});

router.post('/updateSkillGroupSkill/:_id/:sg/:sk',ensureAuthenticated,(req,res)=>{
    req.flash('success_msg',
    'Skill Updated');
    res.redirect('/skills/skillGroupSkill/index'); 
});

router.post('/saveSkillGroupSkill',(req,res) =>{
    const {skill_name,skill_group_name,skill} = req.body;
    SkillSet.updateOne({skill_name:skill_name,'skill_group.skill_group_name':skill_group_name,organization:req.user.organization},{$push:{'skill_group.$.skills':{skill:skill}}}).then(rec=>{
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
    SkillSet.findOne({organization:req.user.organization,skill_name:req.params.skill_name}).then(sg=>{
        res.send({sg:sg});
    });
});


router.post('/getSkillGroupSkill/:skill_name/:skill_group',(req,res) =>{
    console.log('req.params.skill_group '+req.params.skill_group);
    SkillSet.findOne({skill_name:req.params.skill_name,'skill_group.skill_group_name':req.params.skill_group}).then(sg=>{        
        res.send({sg:sg});
    });
});

router.post('/save',ensureAuthenticated,(req, res) =>{
    const {skill_name,description} =req.body;
                
            const newSkill = new SkillSet({
                email:req.user.email,
                skill_name:skill_name,
                description: description,
                organization:req.user.organization
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


router.get('/editSkillGroup/:_id/:count',ensureAuthenticated,(req,res)=>{
    SkillSet.findOne({'skill_group._id':req.params._id}).then(rec=>{
        res.render('editSkillGroup',{nav:'true',rec:rec,count:req.params.count});
    });
});


router.get('/deleteSkillGroup/:_id',ensureAuthenticated,(req,res)=>{
    SkillSet.update({},{$pull:{skill_group:{_id:req.params._id}}},{ multi: true }).then(rec=>{
        req.flash('success_msg',
                    'Skill Group Deleted');
        res.redirect('/skills/skillGroup/index');
    });
});


router.get('/editSkillGroupSkill/:_id/:sg_count/:sk_count',ensureAuthenticated,(req,res)=>{
    SkillSet.findOne({'skill_group.skills._id':req.params._id}).then(rec=>{
        console.log('rec '+rec);
        res.render('editSkillGroupSkill',{nav:'true',rec:rec,sg_count:req.params.sg_count,sk_count:req.params.sk_count});
    });
});

router.post('/updateSkillGroup/:_id',(req,res)=>{
    const {skill_group_name} = req.body;
    SkillSet.updateOne({'skill_group._id':req.params._id},
    {$set:{'skill_group.$.skill_group_name':skill_group_name}}).then(rec=>{
        req.flash('success_msg',
                'Skill Group Updated');
                res.redirect('/skills/skillGroup/index');
    });    
});

router.post('/00/:_id/:sg_count/:sk_count',(req,res)=>{
    const {skill} = req.body;    
    /* SkillSet.updateOne({'skill_group.skills._id':req.params._id},
    {$set:{'skill_group.skills.skill.$':skill}}).then(rec=>{
        req.flash('success_msg',
                'Skill Updated');
                res.redirect('/skills/skillGroupSkill/index');
    });   */  
    var x=1;
    var obj = {};
    obj['skill_group.'+req.params.sg_count+'.skills.'+req.params.sk_count+'.skill']= skill;
    /* SkillSet.findOne({'skill_group.[0].skills._id':req.params._id}).then(rec=>{
        console.log('rec '+rec);
    }); */
    SkillSet.updateOne({'skill_group.skills._id':req.params._id},
    {$set:obj}).then(rec=>{
        req.flash('success_msg',
                'Skill Updated');
                res.redirect('/skills/skillGroupSkill/index');
    });


});

router.post('/updateSkillGroup/:_id',(req,res)=>{
    const {skill_group_name} = req.body;
    SkillSet.updateOne({'skill_group._id':req.params._id},
    {$set:{'skill_group.$.skill_group_name':skill_group_name}}).then(rec=>{
        req.flash('success_msg',
                'Skill Group Updated');
                res.redirect('/skills/skillGroup/index');
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