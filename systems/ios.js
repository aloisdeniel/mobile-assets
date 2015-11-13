/*
 * Dependencies
 */

var jimp = require("jimp");
var path = require('path');
var changeCase = require('change-case');

/*
 * Creates an icon from a mask logo.
 */
function createIcon(originalPath, outputFolder, foregroundColor, backgroundColor, callback) {



}

/*
 * Creates a compatible resource name from original image path.
 */
function createResourceName(originalPath) {
  var result = '';
  var parsed = path.parse(originalPath);
  var splits = parsed.dir.split(path.sep).filter(n => n.length > 0);

  for(var i = 0; i < splits.length; i++) {
    if(i != 0) { result += "_"; }
    result += changeCase.camelCase(splits[i]);
  }

  if(result.length > 0) { result += "__"; }

  return result + changeCase.camelCase(parsed.name);
}

module.exports = {
  createIcon: createIcon,
  createResourceName: createResourceName,
  assets: {
    "/{camelcase}@2x.png" : 264,
    "/{camelcase}@3x.png" : 401
  }
};
