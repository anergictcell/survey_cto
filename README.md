# SurveyCTO - Download and parse form data from SurveyCTO

## A node module for converting SurveuCTO's wide JSON data into structured objects

SurveyCTO provides and API to automatically download form data. Unfortunately, the wide-JSON returned from their API is not ideal for some data analysis environment.
This module fills the gap by providing a simple API to download and parse the form data from your SurveyCTO surveys.

## Table of contents

- [Setup](#setup)
- [Normal workflow](#normal-workflow)
- [Simple download](#simple-download)
- [Filter by date](#filter-by-date)
- [Converting data](#converting-data)
- [Defining repeats](#defining-repeats)
- [Examples](#examples)
- [API](#api)


---


## Setup
The SurveyCTO module works with global setting for the servername and authentification. Make sure to set them when first loading the module.
```js
var surveyCTO = require('survey-cto')
var servername = "myServerName" // don't use the full domain, just your servername
var username = "myUserName"
var password = "Pa55w0rd"
surveycto.config(servername,username,password)
//
```

## Normal workflow
```js
surveyCTO
  .addColumns(["SubmissionDate"],"Date")
  .addColumns(["instanceID","KEY"],"String")
  .addColumns(["repeatCount"],"Number")
  .addColumns(["someBooleanField"],"Boolean")
  .accColumns(["someMultipleSelect"],"Array")
  .addRepeat("myRepeat")
  .addToRepeat("myRepeat",["repeatField"],"String")
  .addToRepeat("myRepeat",["anotherRepeatField"],"Number")
  .formId('My_Test_form')
  .getAndParse()
  .then(function(data){
    // do something with the data
  })
  .catch(function(err){
    // log the error
  })
```

## Simple download
If you want to simply download data without converting it:
```js
var Request = require("./lib/Request.js"),
req = new Request();

req.formId('My_Test_form')
  .get()
  .then(callback)
  .catch(console.log)
```
`formId` sets the id of the form data to download.
`get` returns a Promise containing the wide-JSON data.
The Promise is only resolved upon a `200` status code. All other status codes cause rejection.


## Filter by date
If you only want to download form-data submitted after a specific date:
```js
var Request = require("./lib/Request.js"),
req = new Request();
  
req.formId('My_Test_form')
  .lastDate('2016-16-11 12:27:00 PM EAT')
  .get()
  ...
```

## Converting data
By default, all data in SurveyCTO's form-data is stored as `String` If you want to convert those strings to other datatypes:
```js
surveyCTO.addColumns(["columnName1","columnName2"],"Number") // converts all columnName1, columnName2 data into Numbers
  .addColumns(["columnName3"],"Date") // converts all columnName3 data into Dates
  .addColumns(["columnName4"],"Array") // splits the data of columnName4 into an Array
  .addColumns(["columnName5"],"Number-Array") // splits the data of columnName5 into an Array and converts each element to a Number
```

## Defining repeats
Merge data from the wide-JSON into a nested Object:
```js
// wideJson = {"Meeting":"1","name_1":"Bob","name_2":"Alice","name_3":"Paul","age_1":"21","age_2":"25","age_3":"31"}
surveyCTO.addRepeat("attendance") // defines a new key with the name attendance
  .addToRepeat("attendance",["name"],"String") // {"Meeting":"1","attendance":[{"name":"Bob"},{"name":"Alice"},{"name":"Paul"}]}
  .addToRepeat("attendance",["age"],"Number")  // {"Meeting":"1","attendance":[{"name":"Bob","age":21},{"name":"Alice","age":25},{"name":"Paul","age":31}]}
```

## Examples
TBD

## API
#### <i>surveyCTO</i>.<b>addColumns</b>(<i>Array</i>,<i>Type</i>/<i>Function</i>)
Ensures the data in the columns as defined in `Array` will be converted to type `Type` or via function `Function`.
```js
surveyCTO
  .addColumns(["SubmissionDate"],"Date")
  .addColumns(["instanceID","KEY"],"String")
  .addColumns(["doubleColumn"],x => x*2)
```

#### <i>surveyCTO</i>.<b>addRepeat</b>(<i>name</i>)
Tells the parser to add a column with the given name to store repeat data in. The actual data to be stored within the repeat must be defined via <i>surveyCTO</i>.<b>addToRepeat</b>.
```js
surveyCTO
  .addRepeat("myRepeatName")
```

#### <i>surveyCTO</i>.<b>addToRepeat</b>(<i>name</i>,<i>Array</i>,<i>Type</i>/<i>Function</i>)
Ensures that the data from the columns as defined in `Array` will be converted to type `Type` or via function `Function` and stored in repeat `name`. Requires that the repeat has been defined via <i>surveyCTO</i>.<b>addRepeat</b>.
```js
surveyCTO
  .addRepeat("myRepeatName")
  .addToRepeat("myRepeat",["repeatField"],"String")
  .addToRepeat("myRepeat",["anotherRepeatField"],x=>x*2)
```





