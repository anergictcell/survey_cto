'use strict'
var Parser = require("../lib/Parser.js")

describe('SurveyCTO Parser Module',function(){
  var parser;
  beforeEach(function(){
    parser = new Parser()
  })

  it("addColumns should define columns",function(){
    var cols = ["col1","col2"],
    fn = x=>x*2
    var expRes = [{
      "columns":cols,
      "fn":fn
    }]
    parser.addColumns(cols,fn)
    expect(parser.columns()).toEqual(expRes)
  })

  it("calling addColumns multiple times adds to columns array",function(){
    var cols1 = ["col1","col2"],
    fn1 = x=>x*2,
    cols2 = ["cols3"],
    fn2 = x=>x*3,
    expRes = [
      {"columns":cols1, "fn":fn1},
      {"columns":cols2, "fn":fn2},
    ]
    parser.addColumns(cols1,fn1)
    parser.addColumns(cols2,fn2)
    expect(parser.columns()).toEqual(expRes)
  })

  it("Correclty converting Numbers",function(){
    var cols = ["col1","col2"],
    type = "Number";

    parser.addColumns(cols,type)

    expect(parser.columns()[0].fn("2")).toEqual(2)
  })

  it("Correclty converting String",function(){
    var cols = ["col1","col2"],
    type = "String";

    parser.addColumns(cols,type)

    expect(parser.columns()[0].fn("2")).toEqual("2")
  })

  it("Correclty converting Date",function(){
    var cols = ["col1","col2"],
    type = "Date",
    dateString = 'Wed Nov 16 2016 11:25:55 GMT+0300 (EAT)',
    date = new Date(dateString);
    parser.addColumns(cols,type)
    expect(parser.columns()[0].fn(dateString)).toEqual(date)
  })

  it("Correclty converting Array",function(){
    var cols = ["col1","col2"],
    type = "Array";

    parser.addColumns(cols,type)

    expect(parser.columns()[0].fn("1 2 3")).toEqual(["1","2","3"])
  })

  it("Correclty converting Number-Array",function(){
    var cols = ["col1","col2"],
    type = "Number-Array";

    parser.addColumns(cols,type)

    expect(parser.columns()[0].fn("1 2 3")).toEqual([1,2,3])
  })

  it("Correclty converting 'false' to Boolean",function(){
    var cols = ["col1","col2"],
    type = "Boolean";

    parser.addColumns(cols,type)

    expect(parser.columns()[0].fn("false")).toEqual(false)
  })
  it("Correclty converting 'true' to Boolean",function(){
    var cols = ["col1","col2"],
    type = "Boolean";

    parser.addColumns(cols,type)

    expect(parser.columns()[0].fn("true")).toEqual(true)
  })
  it("Correclty converting '0' to Boolean",function(){
    var cols = ["col1","col2"],
    type = "Boolean";

    parser.addColumns(cols,type)

    expect(parser.columns()[0].fn("0")).toEqual(false)
  })

  it("Correclty converting '' to Boolean",function(){
    var cols = ["col1","col2"],
    type = "Boolean";

    parser.addColumns(cols,type)

    expect(parser.columns()[0].fn("")).toEqual(false)
  })

  it("Correclty converting 'NO' to Boolean",function(){
    var cols = ["col1","col2"],
    type = "Boolean";

    parser.addColumns(cols,type)

    expect(parser.columns()[0].fn("NO")).toEqual(false)
  })


  it("Adding groups to a repeat group",function(){
    var name = "testRepeat",
    cols1 = ["col1","col2"],
    fn1 = x=>x*2,
    cols2 = ["cols3"],
    fn2 = x=>x*3,
    expRes = [{
      "name":name, 
      "columns": [
        {"columns":cols1, "fn":fn1},
        {"columns":cols2, "fn":fn2}
      ]
    }]
    parser
      .addRepeat(name)
      .addToRepeat(name,cols1,fn1)
      .addToRepeat(name,cols2,fn2)

    expect(parser.repeats()).toEqual(expRes)
  })

  it("parsing correctly",function(done){
    var testString = require('./testJSON.js');
    var parseGender = function(x){
      if (x === "Female") {
        return "F ♀"
      } else if (x === "Male") {
        return "M ♂"
      } else {
        return "Unknown gender"
      }
    }
    parser
      .addColumns(["SubmissionDate","holidaytrainingdate"],"Date")
      .addColumns(["holidaytrainingheld","otherattending"],"Boolean")
      .addColumns(["province","district","training_label"],"String")
      .addColumns(["numofteachers","sum_male","sum_female"],"Number")
      .addColumns(["attendingteachers"],"Array")
      .addRepeat("genderRepeat")
      .addToRepeat("genderRepeat",["male_teachers","female_teachers"],"Number")
      .addToRepeat("genderRepeat",["teacher_id"],"String")
      .addToRepeat("genderRepeat",["teacher_gender"],parseGender)
      .addRepeat("otherTeacher")
      .addToRepeat("otherTeacher",["other_pos"],"Number")
      .addToRepeat("otherTeacher",["gender_othermale","gender_otherfemale"],"Boolean")
      .addToRepeat("otherTeacher",["other_gen"],"Number")
      .parse(testString.raw)
      .then(function(res){
        expect(JSON.stringify(res))
        .toEqual(JSON.stringify(testString.parsed))
        done()
      })
  })


})