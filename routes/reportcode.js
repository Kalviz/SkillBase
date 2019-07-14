const express = require('express');
const router = express.Router();
const assert = require('assert');
const { ensureAuthenticated } = require('../config/auth');

const ReportCode = require('../models/ReportCode');

router.post('/save',(req, res) =>{
    const {report_code_id,report_code_name,invoiceable} =req.body;
    var inv ='';
    ReportCode.findOne({report_code_id:report_code_id}).then(rec =>{
        if(!rec){       
            console.log(' invoiceable : '+invoiceable);
            if(invoiceable =='on'){
                inv = true;
            }
            else{
                inv = false;
            }
            const newreportcode = new ReportCode({
                report_code_id,
                report_code_name,
                invoiceable: inv
            });
            
            newreportcode.save()
            .then(user=>{
                req.flash('success_msg',
                        'New Report Code Created : '+report_code_name);
                res.redirect('/reportcode/create');

            }).catch(err => console.log(err));
        }
        else{
            req.flash('error_msg',
                        'Report Code Already Exists!');
            
            res.redirect('/reportcode/create');

        }
    }).catch(err => console.log(err));

})


router.post('/getInvoiceable/:repID',(req,res) => {
    ReportCode.findOne({report_code_id:req.params.repID},{invoiceable:1}).then(rec=>{
        console.log('rec : '+rec);
        res.send({rec:rec});
    });
});
router.get('/create',(req, res)=>{
    ReportCode.find().then(repcodes=>{
        res.render('createreportcode',{repcodes:repcodes});
    })
    

});

module.exports = router;