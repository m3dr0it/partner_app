var express = require('express');
var router = express.Router();
var fs = require('fs');
var formidable = require('formidable');
var mv = require('mv');
const models = require('../models/index');

router.get('/list-customer', async function(req,res,next){
    try {
        const customer = await models.customer.findAll({
          include :[{
            model : models.bussiness_segment,
            attributes : ['bussiness_segment']
          },{
            model : models.origin_of_opportunity,
            attributes : ['origin_of_opportunity']
          },{
            model : models.countries,
            attributes : ['country']
          }]
        });
        console.log(customer)
        //res.json(customer);
        res.render('customer/listCustomer',{customer:customer});
    } catch (error) {
        res.json("errors")
    }
});

router.get('/form-customer',async function(req,res,next){
    try {
        const bussiness_segment = await models.bussiness_segment.findAll({})
        const countries = await models.countries.findAll({})
        const origin_of_opportunity = await models.origin_of_opportunity.findAll({})
        var customerNum = await models.customer.max('no');

        if(!Number(customerNum)){
            customerNum = 1;
        }else{
            customerNum = customerNum + 1;
        }
        res.render('customer/formCustomer',{
            noCustomer : customerNum,
            countries : countries,
            bussiness_segment : bussiness_segment,
            origin_of_opportunity : origin_of_opportunity
        })
    } catch (error) {
        res.send('error')
    }
})

router.post('/form-customer',async function(req,res,next){
    console.log(req.body.registerDate);
    console.log(req.body.noCustomer);
    console.log(req.body.noVendor)
    var monthRegist = req.body.registerDate.split('-');
    var noAkunCustomer = Number(req.body.noVendor)+Number(req.body.noCustomer);

    //Create Customer ID
    var customerId = noAkunCustomer+req.body.bussinessSegment+monthRegist[0]+monthRegist[1];
    console.log("Cutomer ID created : "+customerId);
    
    const {
        customerNo,
        customerName,
        registerDate,
        originOfOpportunity,
        bussinessSegment,
        country,
        address,
        phoneNumber,
        contactName,
        contactNumber,
        contactEmail,
        contactPosition
    } = req.body;
    try {
        const addCustomer = await models.customer.create({
        'id':customerId,
        'no':null,
        'name':customerName,
        'register_date':registerDate,
        'originOfOpportunityId':originOfOpportunity,
        'bussinessSegmentId':bussinessSegment,
        'countryId':country,
        'address':address,
        'phone_number':phoneNumber,
        'contact_name':contactName,
        'contact_number':contactNumber,
        'contact_email':contactEmail,
        'contact_position':contactPosition
      });
        console.log(addCustomer)
        res.render('customer/formDocumentCustomer',{customerId:customerId});
    } catch (error) {
        res.send('error')
    }
});

router.get('/update/:custId', async function(req,res,next){
    console.log(req.params.custId)
    try {
        const bussinessSegment = await models.bussiness_segment.findAll({})
        const countries = await models.countries.findAll({})
        const originOfOpportunity = await models.origin_of_opportunity.findAll({})
        const customer = await models.customer.findOne({
            where:{
                id:req.params.custId
            }
        });
        console.log(customer);
        var date = customer.register_date;

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
        console.log(realDate);

        res.render('customer/formUpdateCustomer',{
            customer : customer,
            date : realDate,
            bussinessSegment : bussinessSegment,
            originOfOpportunity : originOfOpportunity,
            countries : countries
        })
    } catch (error) {
        res.send('error')
    }
});

router.post('/update/:custId',async function(req,res,next){
  console.log("API update Customer")
  console.log(req.body)
  console.log(req.params.custId)
  try {
    const updateCustomer = await models.customer.update({
      'name':req.body.customerName,
      'register_date':req.body.registerDate,
      'originOfOpportunityId':req.body.originOfOpportunity,
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
        id:req.params.custId
      }
    })
    console.log(updateCustomer);
    res.redirect('/customer/list-customer')
  } catch (error) {
    res.send(error)
  }
})

router.get('/delete/:custId',async function(req,res,next){
    console.log(req.params.custId);
    const deleteCustomer = await models.customer.destroy({
        where : {
            id:req.params.custId
        }
    })
    console.log(deleteCustomer);
    res.redirect('/customer/list-customer')
  });

router.post('/upload-document/:custId',function(req,res,next) {
    console.log(req.params.custId);
    idCust = req.params.custId;
    console.log(idCust);
    console.log("hits api upload");
    fs.mkdirSync("document/customer/"+idCust+"");
    pathId = "document/customer/"+idCust+"";
  
    var form = new formidable.IncomingForm();
    form.multiples = true;
  
    // File Upload Handler
    form.parse(req, function (err, fields, files) {
      var listFiles = [{
        'npwp' : files.npwp,
        'siup' : files.siup,
        'ktpDireksi':files.ktpDireksi,
        'npwpDireksi':files.npwpDireksi,
        'norek':files.norek,
        'license':files.license
      }]
      console.log(listFiles);
  
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
    
    res.redirect('/dashboard');
    });
  });

module.exports = router;