'use strict'
var surveyCTO = require('../index.js')
var servername = "svname"
var newName = "aNewServerName"
var prototypes = ["addColumns","addRepeat","addToRepeat","parser","renameColumns","formId","lastDate","request","getAndParse"].sort()

describe("SurveyCTO Base functions",function(){
  it("should not allow to set incomplete config",function(){
    expect(function(){surveyCTO.config(servername,"user")})
      .toThrow(new Error("SurveyCTO config requires 3 arguments"))
  })

  it("should not be able to initialize",function(){
    expect(function(){surveyCTO.init()})
      .toThrow(new Error("SurveyCTO server credentials not yet specified"))
  })

  it("should be able to config",function(){
    expect(surveyCTO.config(servername,"user","pass")).toEqual(true)
  })

  it("should be able to initialize and return functions",function(){
    var x = surveyCTO.init()
    expect(Object.keys(x).sort()).toEqual(prototypes)
  })
})

describe("Setting and getting variables",function(){
  it("should set formId",function(){
    var id = "myId"
    var temp = surveyCTO.init()
    temp.formId(id)
    expect(temp.request().formId()).toEqual(id)
  })

  it("should be able to rename columns",function(){
    var cols = {"old1":"new1", "old2":"new2"};
    var temp = surveyCTO.init()
      .renameColumns(cols)
    expect(temp.parser().renameColumns()).toEqual(cols)
  })

  it("New initialized Request is blank",function(){
    // formId was set in earlier test for another Request
    var myReq = surveyCTO.init()
    expect(myReq.request().formId()).toEqual("")
  })
})


describe("Starting an additional SurveyCTO instance",function(){
  var newsCTO = require('../index.js')

  it("Old instance should contain config data",function(){
    // checks that init() doesn't throw an error
    var x = surveyCTO.init()
    expect(Object.keys(x).sort()).toEqual(prototypes)
  })

  it("New instance should contain config data",function(){
    // checks that init() doesn't throw an error
    var x = newsCTO.init()
    expect(Object.keys(x).sort()).toEqual(prototypes)
  })

  it("New instance should have servername set from first instance",function(){
    expect(newsCTO.init().request().servername()).toEqual(servername)
  })

  it("New instance should be able to config",function(){
    expect(newsCTO.config(newName,"user","pass")).toEqual(true)
  })
  it("Old instance should now have the new server name set",function(){
    expect(surveyCTO.init().request().servername()).toEqual(newName)
  })
})
