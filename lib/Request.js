// Request handles the request from SurveyCTO
// and returns a Promise with the request body

'use strict'

function Request(){
  var config = require('../config.js'),
  request = require('request'),
  url = config.url,
  username = config.username,
  password = config.password,
  req = {},
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
      request( reqOptions,reqResponse )
    })
  }

  // creates the options Object to be used by Request
  // from the options passed via setter functions
  function createRequestOptions(){
    return {
      'uri':url+_formId,
      'auth':{
        'user': username,
        'pass': password,
        'sendImmediately': false
      },
      'qs':{"date":_lastDate},
      // 'timeout':4000,
    }
  }

  return req
}

module.exports = Request
