// Parser handles the parsing of SurveyCTO
// wide JSON data
// into a nested Array
// and converts columns based on their type definitions

'use strict'

function Parser(){
  var parser = {},
  Types = TypeDefinitions(),
  _columns = [],
  _repeatGroups = [],
  _renameColumns = {};


  //
  // Getter/Setter Function
  //
  parser.columns = function(){
    if (arguments.length) {
      _columns = x
      return parser
    } else {
      return _columns
    }
  }
  parser.addColumns = function(columns,func) {
    if (arguments.length == 2) {
      var fn = func

      if (typeof fn !== "function") {
        fn = Types[fn].fn || typeWarning(fn)
      }

      _columns.push({
        "columns":columns,
        "fn":fn
      })
      return parser
    } else {
      return _columns
    }
  }
  parser.repeats = function(x){
    if (arguments.length) {
      _repeatGroups = x
      return parser
    } else {
      return _repeatGroups
    }
  }
  parser.addRepeat = function(name){
    if (arguments.length) {
      _repeatGroups.push({
        "name":name,
        "columns":[]
      })
      return parser
    } else {
      return _repeatGroups
    }
  }
  parser.addToRepeat = function(name,columns,func){
    if (arguments.length === 3){
      var fn = func

      if (typeof fn !== "function") {
        fn = Types[fn].fn || typeWarning(fn)
      }

      _repeatGroups.filter(function(f){
        return f.name === name
      }).forEach(function(rGroup){
        rGroup.columns.push({
          "columns":columns,
          "fn":fn
        })
      })
      return parser
    } else {
      return _repeatGroups
    }
  }
  parser.renameColumns = function(x){
    if (arguments.length) {
      _renameColumns = x
      return parser
    } else {
      return _renameColumns
    }
  }

  // Parses the wide-JSON string (body)
  // and returns Promise with the final JSON Object
  parser.parse = function(body){
    return new Promise(function(resolve,reject){
      try {

        // convert body to JSON
        var rawData = JSON.parse(body)

        var organizedData = rawData.map(function(rawRow){
          var organizedRow = {}

          // parse all "regular" columns
          _columns.forEach(function(dataGroup){
            dataGroup.columns.forEach(function(key){

              // use a different column name if required
              var newColumnName = (_renameColumns[key] || key)
              organizedRow[newColumnName] = dataGroup.fn(rawRow[key])
            })
          })

          // parse all repeats
          _repeatGroups.forEach(function(repeatGroup){
            organizedRow[repeatGroup.name] =
              parseGroupRepeat(rawRow,repeatGroup)
          })

          return organizedRow
        })

        resolve(organizedData)
      } catch (e) {
        reject(e)
      }
    })
  }


  /**
   * parses one repeat group in one row
   * @param  {wide-JSON} row    [raw JSON object (one row) from SurveyCTO]
   * @param  {[Object} repeat [datatype definition for repeat-groups]
   * @return {JSON}        [JSON Object of the repeat group]
   */
  function parseGroupRepeat(row,repeat){
    var wideArray = wideArrayFromWideJSON(row,repeat)
    var repeatArray = arrayFromWideJSON(wideArray)
    return convertColumnsInRepeat(repeatArray,repeat)
  }

  /**
   * private
   * converts SurveyCTO wide-JSON object into an Array
   * @param  {JSON} row    [raw JSON representation of the current row]
   * @param  {Object} repeat [Object defining the columns of the repeat]
   * @return {Array}        [Array that contains all repeat-fields]
   *                               even when empty
   */
  function wideArrayFromWideJSON(row,repeat){
    var nRepeats = numberOfRepeats(row,repeat)

    // To store the Data for one repeatGroup for one row
    var repeatArray = []

    // Iterates through the columns with the repeat data one by one
    // and combines them into one Objects for each repeat
    for (var i=1; i<=nRepeats; i++) {
      var repeatItem = {}

      // First store the raw data from the repeats
      repeat.columns.forEach(function(dataGroup){
        dataGroup.columns.forEach(function(key){
          // repeatItem[key] = dataGroup.fn( row[key+"_"+i] )
          repeatItem[key] = row[key+"_"+i]
        })
      })

      repeatArray.push(repeatItem)
    }

    return repeatArray
  }


  /**
   * private
   * finds the maximum number of entries in each repeat
   * @param  {JSON} row    [raw JSON representation of the current row]
   * @param  {Object} repeat [Object defining the columns of the repeat]
   * @return {Int}        [number of item in the repeat]
   */
  function numberOfRepeats(row,repeat){
    // to be super safe it checks in all columns,
    // even though they all should have the same size
    return repeat.columns.reduce(function(max,columnGroup){
      var tempMax = columnGroup.columns.reduce(function(groupMax, column){
        while (row[column+"_"+ (++groupMax)] !== undefined){
        }
        return groupMax-1
      },max)
      return tempMax > max ? tempMax : max
    },0)
  }


  /**
   * private
   * removes all Objects in an Array that don't contain data
   * @param  {Array} wideArray    [Array of Objects]
   * @return {Array}        [Array of Objects containing data]
   */
  function arrayFromWideJSON(wideArray){
    return wideArray.filter(function(item){
      return Object.keys(item).filter(function(key){
        return (item[key] && item[key] !== "")
      }).length
    })
  }

  /**
   * converts values in Array of Objects according to their datatype definition
   * @param  {Array} repeatArray [Array of Objects to be converted]
   * @param  {Object} repeat      [datatype definition for repeat-groups]
   * @return {Array}             [Array of Objects]
   */
  function convertColumnsInRepeat(repeatArray, repeat){
    // convert data in the repeat-columns
    return repeatArray.map(function(item){
      var convertedItem = {}

      // go through each group
      repeat.columns.forEach(function(dataGroup){
        dataGroup.columns.forEach(function(key){

          // use a different column name if required
          var newColumnName = (_renameColumns[key] || key)
          convertedItem[newColumnName] = dataGroup.fn( item[key] )
        })
      })

      return convertedItem
    })
  }


  function typeWarning(type){
    console.log("Undefined type "+type + " in SurveyCTO parser")
    return Types.String.fn
  }

  return parser
}

function TypeDefinitions(){
  var Types = {}
  Types["Number"] = { "fn" : x => +x}
  Types["String"] = { "fn" : x => x === "" ? null : x}
  Types["Date"] = {"fn": x => new Date(x + " GMT")}
  Types["Array"] = {"fn": x => x.split(" ").filter( f => f !== "")}
  Types["[]"] = Types.Array
  Types["Number-Array"] = {"fn": x => x.split(" ").map( Types.Number.fn)}
  Types["[Number]"] = Types["Number-Array"]
  Types["Date-Array"] = {"fn": x => x.split(" ").map( Types.Date.fn)}
  Types["[Date]"] = Types["Date-Array"]
  Types["Boolean"] = { "fn" : function(x){
    if (!x){ return false}
    if (x === "0") { return false}
    if (x.toLowerCase() === "false") {return false}
    if (x.toLowerCase() === "no") {return false}
    return true
  }}
  return Types
}

module.exports = Parser
