var Request = require("../lib/Request.js")
var req = new Request()

describe('SurveyCTO Request Module',function(){

  it("req.formId should set formid",function(){
    var formId = "myTest"
    req.formId(formId)
    expect(req.formId()).toEqual(formId);
  })

  it("req.lastDate should set lastDate",function(){
    var lastDate = "Aug 22, 2016 12:09:52 PM"
    req.lastDate(lastDate)
    expect(req.lastDate()).toEqual(lastDate)
  })

  it("req.servername should set the servername",function(){
    var servername = "testme"
    req.servername(servername)
    expect(req.servername()).toEqual(servername)
  })
})

describe('Checking calls to request module',function(){
  var failTest = function(error,done) {
    expect(error).toBeUndefined();
    done()
  };
  
  beforeEach(function(){
    spyOn(req,"request").and
      .callFake(function(options,callback) {
        callback(null,{statusCode : 200},options)
      });  

  })

  it("url should be built correctly",function(done){
    var apiPath = ".surveycto.com/api/v1/forms/data/wide/json/"
    var servername = "testme"
    var formId = "myTest"
    var uri = "https://"+servername+apiPath+formId
    req
      .servername(servername)
      .formId(formId)
      .get()
      .then(function(data){
        expect(data.uri).toEqual(uri)
        done()
      })
      .catch(function(data){failTest(data,done)})
  })

  it("date should be added to qs",function(done){
    var lastDate = "Aug 22, 2016 12:09:52 PM"
    req
      .lastDate(lastDate)      
      .get()
      .then(function(data){
        expect(data.qs).toEqual({"date":lastDate})
        done()
      })
      .catch(function(data){failTest(data,done)})
  })

  it("auth should be put correctly",function(done){
    var user = "tstusr"
    var password = "tstpwd"
    var res = { "user": user, "pass": password, "sendImmediately": false }
    req
      .auth(user,password)
      .get()
      .then(function(data){
        expect(data.auth).toEqual(res)
        done()
      })
      .catch(function(data){failTest(data,done)})
  })
})

describe('Checking errors during network request',function(){
  it("Server response 401",function(done){
    spyOn(req,"request").and
      .callFake(function(options,callback) {
        callback(null,{statusCode : 401},options)
      });  
    req
      .get()
      .then(function(data){
        expect(data).toBeUndefined();
        done()
      })
      .catch(function(error){
        expect(error).toEqual("Response status code 401")
        done()
      })
  })

  it("Request module error",function(done){
    spyOn(req,"request").and
      .callFake(function(options,callback) {
        callback("Unknown Error","someResponseData","someBody")
      });  
    req
      .get()
      .then(function(data){
        expect(data).toBeUndefined();
        done()
      })
      .catch(function(error){
        expect(error).toEqual("Unknown Error")
        done()
      })
  })
})
