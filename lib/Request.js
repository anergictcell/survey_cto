// Request handles the request from SurveyCTO
// and returns a Promise with the request body

'use strict'

function Request(){
  var _servername = "",
  _username = "",
  _password = "",
  req = {
    "request" : require('request')
  },
  _formId = "",
  _lastDate = undefined;
 
  // 
  // Getter/Setter functions
  // 
  req.formId = function(x){
    if (arguments.length) {
      _formId = x
      return req
    } else {
      return _formId
    }
  }
  req.lastDate = function(x){
    if (arguments.length) {
      _lastDate = x
      return req
    } else {
      return _lastDate
    }
  }
  req.servername = function(x){
    if (arguments.length) {
      _servername = x
      return req
    } else { 
      return _servername
    }
  }

  // Setter only!
  req.auth = function(username,password){
    _username = username;
    _password = password;
    return req
  }


  // Calls the get request and returns the body of the response
  req.get = function(){
    return new Promise(function(resolve,reject){
      var reqOptions = createRequestOptions()
      function reqResponse(err,response,body){
        if (err){
          reject(err)
        } else if (response.statusCode !== 200) {
          reject("Response status code "+response.statusCode)
        } else {
          resolve(body)
        }
      }
      req.request( reqOptions,reqResponse )
    })
  }

  // creates the options Object to be used by Request
  // from the options passed via setter functions
  function createRequestOptions(){
    var apiPath = ".surveycto.com/api/v1/forms/data/wide/json/"
    return {
      'uri':"https://"+_servername+ apiPath +_formId,
      'auth':{
        'user': _username,
        'pass': _password,
        'sendImmediately': false
      },
      'qs':{"date":_lastDate},
      // 'timeout':4000,
    }
  }

  return req
}

module.exports = Request
