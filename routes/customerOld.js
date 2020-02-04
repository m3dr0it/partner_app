var express = require('express');
var router = express.Router();
var fs = require('fs');
var formidable = require('formidable');
var mv = require('mv');
var dbConnection = require('../databases/dbConnection');

router.get('/form-customer',function(req,res,next) {
  var data;
  dbConnection.query("select * from `bussiness-segment`",function(err,rowsBs,fields) {
    if (err) {
      console.log("error blog");
    }else {
      dbConnection.query("select * from `origin-of-opportunity`",function(err,rowsOoo,fields) {
          if (err) {
            console.log(err);
          }else {
            dbConnection.query("select * from `project-location`",function (err,rowsLocation,fields) {
              if (err) {
                console.log(err);
              }else {
                dbConnection.query("select * from `project-type`",function(err,rowsProjectType,fields) {
                  if (err) {
                    console.log(err);
                  }else {
                    dbConnection.query("select * from `no-vendor`",function(err,rowsNoVendor,fields) {
                      if (err) {
                        console.log(err);
                      }else {
                        dbConnection.query("select * from `apps_countries`",function(req,rowsCountries,fields) {
                            if (err) {
                              console.log(err);
                            }else {
                              dbConnection.query("select `no` from `customer` order by `no` desc limit 1",function(err,rowsNo,fields) {
                                if (err) {
                                  console.log(err);
                                }else {
                                  if (rowsNo[0] === undefined) {
                                    console.log("rowsno undefined");
                                    noCustomer = 1;
                                  }else {
                                    console.log(rowsNo);
                                    noCustomer = rowsNo[0].no + 1;
                                    console.log(noCustomer);
                                  }
                                  res.render('customer/formCustomer',{
                                    listCountries : rowsCountries,
                                    noCustomer : noCustomer,
                                    nv : JSON.parse(JSON.stringify(rowsNoVendor)),
                                    bs : JSON.parse(JSON.stringify(rowsBs)),
                                    Ooo : JSON.parse(JSON.stringify(rowsOoo)),
                                  });
                                }
                              })
                            }
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
  })

router.post('/form-customer',function(req,res,next) {
  console.log(req.body);
  console.log(req.body.dateRegister);
  var monthRegist = req.body.dateRegister.split('-');
  var noAkunCustomer = Number(req.body.noVendor)+Number(req.body.noCustomer);

  //Create Customer ID
  var customerId = noAkunCustomer+req.body.bussinessSegment+monthRegist[0]+monthRegist[1];
  console.log("Cutomer ID created : "+customerId);

  dbConnection.query("select * from `bussiness-segment`",function(err,rowsBs,fields) {
    if (err) {
      console.log(err);
    }else {
      dbConnection.query("select * from `origin-of-opportunity`",function(err,rowsOoo,fields) {
          if (err) {
            console.log(err);
          }else {
            dbConnection.query("select * from `no-vendor`",function(err,rowsNoVendor,fields) {
              if (err) {
                console.log(err);
              }else {
                dbConnection.query("select * from `apps_countries`",function(err,rowsCountries,fields) {
                  if (err) {
                    console.log(err);
                  }else {
                    dbConnection.query("INSERT INTO `customer` (`no`, `customer-id`, `date`, `id-origin-of-opportunity`, `name`,`id-bussiness-segment`, `id-country`, `address`, `phone-number`, `contact-name`, `contact-number`,`contact-email`,`contact-position`) VALUES ('"+req.body.noCustomer+"', '"+customerId+"', '"+req.body.dateRegister+"', '"+req.body.originOfOpportunity+"','"+req.body.customerName+"', '"+req.body.bussinessSegment+"', '"+req.body.country+"', '"+req.body.address+"','"+req.body.phoneNumber+"','"+req.body.contactName+"','"+req.body.contactNumber+"','"+req.body.contactEmail+"','"+req.body.contactPosition+"')",function(err,res) {
                        if (err) {
                          console.log(err);
                        }else {
                          console.log(res);
                        }
                    });
                    res.render('customer/formDocumentCustomer',{
                      noCustomer : req.body.noCustomer,
                      dateRegister : req.body.dateRegister,
                      idOriginOfOpportunity : req.body.originOfOpportunity,
                      customerName : req.body.customerName,
                      idBussinessSegment : req.body.bussinessSegment,
                      address : req.body.address,
                      phoneNumber : req.body.phoneNumber,
                      contacName : req.body.contactName,
                      contactNumber : req.body.contactNumber,
                      contactEmail : req.body.contactEmail,
                      contactPosition : req.body.contactPosition,
                      listCountries : rowsCountries,
                      idCountry : req.body.country,
                      nv : JSON.parse(JSON.stringify(rowsNoVendor)),
                      bs : JSON.parse(JSON.stringify(rowsBs)),
                      Ooo : JSON.parse(JSON.stringify(rowsOoo)),
                      customerId : customerId
                    });
                  }
                })
              }
            })
          }
        })
      }
    })
  })

router.get('/form-customer/:custId',function(req,res,next){
  console.log(req.params.custId);
  dbConnection.query("select * from `origin-of-opportunity`",function (err,rowsOoo,fields) {
    if(err){
      console.log(err);
      res.send("ID TIDAK DITEMUKAN");
    }else{
      dbConnection.query("select * from `bussiness-segment`",function (err,rowsBs,fields) {
        if(err){
          console.log(err);
          res.send("ID TIDAK DITEMUKAN");
        }else{
          dbConnection.query("select * from `apps_countries`",function(err,rowsCountries,fields) {
            if(err){
              console.log(err);
            }else{
              dbConnection.query("SELECT date_format(`date`,'%d-%m-%Y'),`no`,`customer-id`,`date`,`name`,`origin-of-opportunity`,`bussiness-segment`,`address`,`phone-number`,`contact-name`,`contact-number`,`country_name`,`contact-email`,`contact-position` FROM `customer` JOIN `origin-of-opportunity` using(`id-origin-of-opportunity`) join `bussiness-segment` using(`id-bussiness-segment`) join `apps_countries` using(`id-country`) where `customer-id`='"+req.params.custId+"' ",function(err,rowsCustomer,fields) {
                if (err) {
                  console.log(err);
                  res.send("ID TIDAK DITEMUKAN");
                }else {
                  console.log(rowsCustomer[0]);
                  if(rowsCustomer[0] == undefined){
                    console.log("data tidak ditemukan")
                    res.render('error');
                  }else{
                  var date = rowsCustomer[0].date;

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
                  console.log(rowsCustomer[0]);
                  res.render('customer/formEditCustomer',{
                    listCustomer : rowsCustomer[0],
                    date : realDate,
                    Ooo : rowsOoo,
                    bs : rowsBs,
                    listCountries : rowsCountries
                  });
                  }
                } 
              })
            }
          })
        }
      })
    }
  })
});

router.get('/delete/:custId',function(req,res,next){
  console.log(req.params.custId)
  dbConnection.query("delete from `customer` where `customer-id`='"+req.params.custId+"'",function(err,result){
    if(err){
      console.log(err)
    }else{
      console.log(result)
      res.redirect('/customer/list-customer');
    }
  })
})

router.post('/change/:custId',function(req,res,next){
  console.log("change customer information API");
  console.log(req.body);
  dbConnection.query("UPDATE `customer` SET `date`='"+req.body.dateRegister+"',`id-origin-of-opportunity`='"+req.body.originOfOpportunity+"',`name`='"+req.body.customerName+"',`id-bussiness-segment`='"+req.body.bussinessSegment+"',`id-country`='"+req.body.country+"',`address`='"+req.body.address+"',`phone-number`='"+req.body.phoneNumber+"',`contact-name`='"+req.body.contactName+"',`contact-number`='"+req.body.contactNumber+"',`contact-email`='"+req.body.contactEmail+"',`contact-position`='"+req.body.contactPosition+"' WHERE `customer-id`='"+req.params.custId+"'",function(err,result){
    if(err){
      console.log(err);
      res.render('err');
    }else{
      console.log(result)
      res.redirect('/customer/list-customer');
    }
  })
});

// router.get('/upload-document/:custId',function(req,res,next) {
//   console.log(req.params.custId);
//   idCust = req.params.custId;
//   console.log(idCust);
//   console.log("hits api upload");
//   fs.mkdirSync("document/customer/"+idCust+"");
//   pathId = "document/customer/"+idCust+"";

//   var form = new formidable.IncomingForm();
//   form.multiples = true;
//   // manangani upload file
//   form.parse(req, function (err, fields, files) {
//     var listFiles = [{
//       'npwp' : files.npwp,
//       'siup' : files.siup,
//       'ktpDireksi':files.ktpDireksi
//     }]
//     console.log(listFiles);
//     //handle NPWP
//     var oldNpwpPath = files.npwp.path;
//     var npwpPath = pathId+"/NPWP.pdf";

//     mv(oldNpwpPath, npwpPath, function (err) {
//       if (err) { throw err; }
//         console.log('NPWP uploaded successfully');
//     });  

//     //handle SIUP
//     var oldSiupPath = files.siup.path;
//     var siupPath = pathId+"/SIUP.pdf";
//     mv(oldSiupPath, siupPath, function (err) {
//       if (err) { throw err; }
//         console.log('SIUP uploaded successfully');
//     });

//     //KTP Direksi
//     var oldKtpDireksiPath = files.ktpDireksi.path;
//     var ktpDireksi = pathId+"/KTP DIREKSI.pdf";
//     mv(oldKtpDireksiPath, ktpDireksi, function (err) {
//       if (err) { throw err; }
//         console.log('KTP Direksi uploaded successfully');
//     });
//     res.send("Success")
//   });
// });

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

router.get('/list-customer',function(req,res,next){
  dbConnection.query("SELECT date_format(`date`,'%d-%m-%Y'),`no`,`customer-id`,`date`,`name`,`origin-of-opportunity`,`bussiness-segment`,`address`,`phone-number`,`contact-name`,`contact-number`,`country_name` FROM `customer` JOIN `origin-of-opportunity` using(`id-origin-of-opportunity`) join `bussiness-segment` using(`id-bussiness-segment`) join `apps_countries` using(`id-country`)",function(err,rowsCustomer,fields) {
    if (err) {
      console.log(err);
    }else {
      console.log(rowsCustomer);
      res.render('customer/list-customer',{listCustomer:rowsCustomer});
    }
  })
})

module.exports = router;