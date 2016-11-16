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

Before you start, you need to create a `config.js` file in the root directory of the module. Please make sure to exclude this file from version control, such as git.
```js
config.js
module.exports = {
  url:"https://myServerName.surveycto.com/api/v1/forms/data/wide/json/",
  username : "me@example.com",
  password : "Pa55w0rd"
}
```

## Normal workflow
```js
var SurveyCTO = require('./index.js')
SurveyCTO
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
  req = new Request()
    .formId('My_Test_form')
    .get()
    .then(callback)
    .catch(console.log)
```
`formId` sets the id of the form data to download.
`get` returns a Promise containing the wide-JSON data.
The Promise is only resolved upon a `200` status code. All other status codes cause rejection.


## Filter by date
## Converting data
## Defining repeats
## Examples
## API

### <i>surveyCTO</i>.<b>addColumns</b>(<i>Array</i>,<i>Type</i>/<i>Function</i>)
Ensures the data in the columns as defined in `Array` will be converted to type `Type` or via function `Function`.
```js
SurveyCTO
  .addColumns(["SubmissionDate"],"Date")
  .addColumns(["instanceID","KEY"],"String")
  .addColumns(["doubleColumn"],x => x*2)
```

### <i>surveyCTO</i>.<b>addRepeat</b>(<i>name</i>)
Tells the parser to add a column with the given name to store repeat data in. The actual data to be stored within the repeat must be defined via <i>surveyCTO</i>.<b>addToRepeat</b>.
```js
SurveyCTO
  .addRepeat("myRepeatName")
```

### <i>surveyCTO</i>.<b>addToRepeat</b>(<i>name</i>,<i>Array</i>,<i>Type</i>/<i>Function</i>)
Ensures that the data from the columns as defined in `Array` will be converted to type `Type` or via function `Function` and stored in repeat `name`. Requires that the repeat has been defined via <i>surveyCTO</i>.<b>addRepeat</b>.
```js
SurveyCTO
  .addRepeat("myRepeatName")
  .addToRepeat("myRepeat",["repeatField"],"String")
  .addToRepeat("myRepeat",["anotherRepeatField"],x=>x*2)
```





