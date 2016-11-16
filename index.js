// ISC License
// 
// Copyright (c) 2016, Jonas Marcello, Educate!
// 
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above 
// copyright notice and this permission notice appear in all copies.
// 
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES 
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF 
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY 
// SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES 
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION
// OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN 
// CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
//    
//    If you like this module, consider donating to Educate!
//    www.experienceeducate.org
//    to help youth across Africa by transforming education
//    to teach youth the skills to solve poverty.

'use strict'
var Request = require("./lib/Request.js")
var Parser = require("./lib/Parser.js")

var parser = new Parser()
var req = new Request()

var getAndParse = function(resolve,reject){
  return new Promise(function(resolve,reject){
    req.get()
      .then(parser.parse)
      .then(resolve)
      .catch(reject)
  })
}

module.exports = {
  addColumns : function(columns,type){
    parser.addColumns(columns,type)
    return this;
  },
  addRepeat : function(name){
    parser.addRepeat(name)
    return this
  },
  addToRepeat : function(name,columns,type){
    parser.addToRepeat(name,columns,type)
    return this
  },
  formId : function(idString){
    req.formId(idString)
    return this
  },
  lastDate : function(date){
    req.lastDate(date)
    return this;
  },
  getAndParse : getAndParse
}
