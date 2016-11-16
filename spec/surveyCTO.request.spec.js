'use strict'
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