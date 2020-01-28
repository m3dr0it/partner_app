var express = require('express');
var router = express.Router();
var fs = require('fs');
var formidable = require('formidable');
var mv = require('mv');
var dbConnection = require('../databases/dbConnection');
var beautify = require('json-beautify');
var models = require('../models')

router.use('/',function(req,res,next) {
  console.log("hit wellcome page");
  next();
});

router.get('/form-vendor',async function(req,res,next) {
  var data;
  console.log(req.user);
  console.log("form vendor");

  try {
    const countries = await models.countries.findAll({});
    const bussinessSegment = await models.bussiness_segment.findAll({});
    var vendorNum = await models.vendor.max('no');
    
    if(!Number(vendorNum)){
      vendorNum = 1;
    }else{
      vendorNum = vendorNum + 1;
    }
    res.render('vendor/formVendor',{
      bussiness_segment : bussinessSegment,
      vendorNum : vendorNum,
      countries : countries
    }); 
  }catch (error) {
    console.log(error)
    res.send(error);    
  }
});

router.post('/form-vendor',async function(req,res,next) {
  var data;
  console.log("post form vendor hitted");
  var vendorId;
  console.log(req.body);

  var monthRegist = req.body.registerDate.split('-');
  var noAkunVendor = Number(req.body.noVendor)+Number(req.body.no);

  //Create Vendor ID
  var vendorId = noAkunVendor+monthRegist[0]+monthRegist[1];
  console.log("Vendor ID created : "+vendorId);

  try {
    const addVendor = await models.vendor.create({
        'id':vendorId,
        'no':null,
        'name':req.body.vendorName,
        'service_type': req.body.serviceType,
        'register_date':req.body.registerDate,
        'bussinessSegmentId':req.body.bussinessSegment,
        'countryId':req.body.country,
        'address':req.body.address,
        'phone_number':req.body.phoneNumber,
        'contact_name':req.body.contactName,
        'contact_number':req.body.contactNumber,
        'contact_email':req.body.contactEmail,
        'contact_position':req.body.contactPosition
    })
    res.render('vendor/formDocumentVendor',{vendorId : vendorId});
  } catch (error) {
    res.send(error) 
  }
});


router.get('/delete/:vendorId',async function(req,res,next){
  try {
    const deleteVendor = await models.vendor.destroy({
      where:{
        id:req.params.vendorId
      }
    })
    console.log(deleteVendor)
    res.redirect('/vendor/list-vendor');
  } catch (error) {
    res.render('error');    
  }
})

router.post('/upload-document/:vendorId',function(req,res,next) {
  console.log(req.params.vendorId);
  idVendor = req.params.vendorId;
  console.log(idVendor);
  console.log("hits api upload");
  fs.mkdirSync("document/vendor/"+idVendor+"");
  pathId = "document/vendor/"+idVendor+"";
 
  var form = new formidable.IncomingForm();
  form.multiples = true;

  form.parse(req,function(err,fields,files){
  // manangani upload file
      // NPWP
      var oldNpwpPath = files.npwp.path;
      var npwpPath = pathId+"/NPWP.pdf";
      mv(oldNpwpPath, npwpPath, function (err) {
        if (err) { throw err; }
          console.log('NPWP uploaded successfully');
      });
  
      //SIUP
      var oldSiupPath = files.siup.path;
      var siupPath = pathId+"/SIUP.pdf";
      mv(oldSiupPath, siupPath, function (err) {
        if (err) { throw err; }
          console.log('SIUP uploaded successfully');
      });
  
      //KTP Direksi
      var oldKtpDireksiPath = files.ktpDireksi.path;
      var ktpDireksi = pathId+"/KTP DIREKSI.pdf";
      mv(oldKtpDireksiPath, ktpDireksi, function (err) {
        if (err) { throw err; }
          console.log('KTP Direksi uploaded successfully');
      });
  
      //NPWP Direksi
      var oldNpWpDireksiPath = files.npwpDireksi.path;
      var npwpDireksi = pathId+"/NPWP DIREKSI.pdf";
      mv(oldNpWpDireksiPath, npwpDireksi, function (err) {
        if (err) { throw err; }
          console.log('NPWP Direksi uploaded successfully');
      });
  
      //Rek Number
      var oldNorekPath = files.norek.path;
      var norek = pathId+"/NOREK.pdf";
      mv(oldNorekPath, norek, function (err) {
        if (err) { throw err; }
          console.log('Norek uploaded successfully');
      });
  
      //License
      var oldLicensePath = files.license.path;
      var lisence = pathId+"/LICENSE.pdf";
      mv(oldLicensePath, lisence, function (err) {
        if (err) { throw err; }
          console.log('License uploaded successfully');
      });
  
      //SKAKEMENKUMHAM
      var oldSkakemenkumhamPath = files.skakemenkumham.path;
      var skakemenkumham = pathId+"/SKAKEMENKUMHAM.pdf";
      mv(oldSkakemenkumhamPath, skakemenkumham, function (err) {
        if (err) { throw err; }
          console.log('SKAKEMENKUMHAM uploaded successfully');
      });
  
      //SPT
      var oldSptPath = files.spt.path;
      var spt = pathId+"/SPT.pdf";
      mv(oldSptPath, spt, function (err) {
        if (err) { throw err; }
          console.log('SPT uploaded successfully');
      });
  
      //Experience List
      var oldExperienceListPath = files.experienceList.path;
      var experienceList = pathId+"/EXPERIENCE LIST.pdf";
      mv(oldExperienceListPath, experienceList, function (err) {
        if (err) { throw err; }
          console.log('SPT uploaded successfully');
      });
  
      //Tool List
      var oldToolistPath = files.toolList.path;
      var toolList = pathId+"/TOOL LIST.pdf";
      mv(oldToolistPath,toolList, function (err) {
        if (err) { throw err; }
          console.log('SPT uploaded successfully');
      });
      
      //TDP
      var oldTdpPath = files.tdp.path;
      var tdp = pathId+"/TDP.pdf";
      mv(oldTdpPath,tdp, function (err) {
        if (err) { throw err; }
          console.log('TDP uploaded successfully');
      });
  
      //Akte
      var oldAktePath = files.akte.path;
      var akte = pathId+"/AKTE.pdf";
      mv(oldAktePath,akte, function (err) {
        if (err) { throw err; }
          console.log('Akte uploaded successfully');
      });
      
      //SKT
      var oldSktPath = files.skt.path;
      var skt = pathId+"/SKT.pdf";
      mv(oldSktPath,skt, function (err) {
        if (err) { throw err; }
          console.log('SKT uploaded successfully');
      });
  
      //SPPKP
      var oldSppkpPAth = files.sppkp.path;
      var sppkp = pathId+"/SPPKP.pdf";
      mv(oldSppkpPAth,sppkp, function (err) {
        if (err) { throw err; }
          console.log('SPPKP uploaded successfully');
      });
  
      //Location Permission
      var oldLocationPermissionPath = files.locationPermission.path;
      var locationPermission = pathId+"/LOCATION PERMISSION.pdf";
      mv(oldLocationPermissionPath,locationPermission, function (err) {
        if (err) { throw err; }
          console.log('Location Permission uploaded successfully');
      });
  
      //Commercial Permission
      var oldCommercialPermissionPath = files.commercialPermission.path;
      var commercialPermission = pathId+"/COMMERCIAL PERMISSION.pdf";
      mv(oldCommercialPermissionPath,commercialPermission, function (err) {
        if (err) { throw err; }
          console.log('Commercial Permission uploaded successfully');
      });
  
      //Employee List
      var oldEmployeeListPath = files.employeeList.path;
      var employeeList = pathId+"/EMPLOYEE LIST.pdf";
      mv(oldEmployeeListPath,employeeList, function (err) {
        if (err) { throw err; }
          console.log('Employee List uploaded successfully');
      });
  
      //Company Profile
      var oldCompanyProfilePath = files.companyProfile.path;
      var companyProfile = pathId+"/SKT.pdf";
      mv(oldCompanyProfilePath,companyProfile, function (err) {
        if (err) { throw err; }
          console.log('Company Profile uploaded successfully');
      });
  
      //Organization Structure
      var oldOrganizationStructurePath = files.organizationStructure.path;
      var organizationStructure = pathId+"/ORGANIZATION STRUCTURE.pdf";
      mv(oldOrganizationStructurePath,organizationStructure, function (err) {
        if (err) { throw err; }
          console.log('Organization Structure uploaded successfully');
      });
  
      //AuditResult
      var oldAuditResultPath = files.auditResult.path;
      var auditResult = pathId+"/AUDIT RESULT.pdf";
      mv(oldAuditResultPath,auditResult, function (err) {
        if (err) { throw err; }
          console.log('Audit Result uploaded successfully');
      });
  
      //List of Company Management
      var oldListOfCompanyManagementPath = files.listOfCompanyManagement.path;
      var listOfCompanyManagement = pathId+"/LIST OF COMPANY MANAGEMENT.pdf";
      mv(oldListOfCompanyManagementPath,listOfCompanyManagement, function (err) {
        if (err) { throw err; }
          console.log('List Of Company Management uploaded successfully');
      })
      
      //Composition Of Share Ownership
      var oldCompositionOfShareOwnershipPath = files.compositionOfShareOwnership.path;
      var compositionOfShareOwnership = pathId+"/COMPOSITION OF SHARE OWNERSHIP.pdf";
      mv(oldCompositionOfShareOwnershipPath,compositionOfShareOwnership, function (err) {
      if (err) { throw err; }
        console.log('Composition Of Share Ownership Path uploaded successfully');
    });
    res.redirect('/vendor/list-vendor');
  });
});

router.get('/update/:vendorId',async function(req,res,next){
  console.log("Update Vendor information API");
  console.log(req.params.vendorId);
  try {
    const bussiness_segment = await models.bussiness_segment.findAll({})
    const countries = await models.countries.findAll({})
    const vendor = await models.vendor.findOne({
      where : {
        id : req.params.vendorId
      }
    });

    var date = vendor.register_date;
    console.log(date);
    var year = date.getFullYear();
    if(date.getMonth() < 10){
      var month = date.getMonth()+1;
      var rightMonth = "0"+month 
    }else{
      var rightMonth = date.getMonth()+1;
    }
    var day = date.getDate();
    console.log(day)
    console.log(rightMonth)
    console.log(year) 
    var realDate = year+"-"+rightMonth+"-"+day

    res.render('vendor/formUpdateVendor',{
      vendor:vendor,
      date:realDate,
      bussiness_segment:bussiness_segment,
      countries : countries
    })
  } catch (error) {
    res.render('error');
  }
});

router.post('/update/:vendorId',async function(req,res,next){
  console.log(req.body)
  console.log("API update")
  try {
    const updateVendor = await models.vendor.update({
        'name':req.body.vendorName,
        'service_type': req.body.serviceType,
        'register_date':req.body.registerDate,
        'bussinessSegmentId':req.body.bussinessSegment,
        'countryId':req.body.country,
        'address':req.body.address,
        'phone_number':req.body.phoneNumber,
        'contact_name':req.body.contactName,
        'contact_number':req.body.contactNumber,
        'contact_email':req.body.contactEmail,
        'contact_position':req.body.contactPosition
    },{
      where : {
        id : req.params.vendorId
      }
    })
    console.log(updateVendor)
    res.redirect('/vendor/list-vendor');
  } catch (error) {
    res.send(error) 
  }})

router.get('/list-vendor',async function(req,res,next){
try {
  const vendor = await models.vendor.findAll({
    include :[{
      model : models.countries
    },{
      model : models.bussiness_segment
    }]
  });
    res.render('vendor/listVendor',{vendor : vendor});
  } catch (error) {
    res.render('error')
  }
});

module.exports = router;