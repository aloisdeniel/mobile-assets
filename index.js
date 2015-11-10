#!/usr/bin/env node

/*
 * Dependencies
 */

var jimp = require("jimp");
var program = require('commander');
var path = require('path');
var recursive = require('recursive-readdir');
var mkdirp = require('mkdirp');
var changeCase = require('change-case');
var systems = {
  android: require('./systems/android.js'),
  ios: require('./systems/ios.js')
}

/*
 * Program commands
 */

program
  .version('0.0.1')
  .option('-w, --windows', 'generates assets for Windows projects')
  .option('-s, --ios', 'generates assets for iOS projects')
  .option('-a, --android', 'generates assets for Android projects')
  .option('-d, --dpi [dpi]', 'density of original HD assets (can be "@3x", "@2x", "ldpi" to "xxxdpi" or an integer in dpi)', 'xxxhdpi')
  .option('-o, --output [ouput]', 'the output folder where all generated assets will be created', './assets-output/')
  .option('-i, --input [input]', 'the input folder that contains all the original HD assets', './')
  .parse(process.argv);

/*
 * Program execution
 */

for(var s in systems) {
  var converter = systems[s];

}

 /*
  * Converts all assets in a folder for a given system.
  */
function convertAssets(pathIn, density, pathOut, system, callback) {

 density = parseDensity(density)

 recursive(pathIn,function (err, files) {

   if(err) {
     callback(err);
     return;
   }

   for (var i in files) {
     var inFile = files[i];
     if(path.extname(inFile) === '.png'){
       var flatname = path.join(pathOut, flattenName(pathIn,inFile));

       for(var densityPath in system.densities) {
            var densityValue = system.densities[densityPath];
            var outFile = densityPath.replace('{name}', path.basename(flatname,path.extname(flatname)));
            outFile = path.join(pathOut,outFile);

            if(densityValue <= density) {
              console.log( inFile  + ' ('+ density +' ppi)' + " > " + outFile + ' ('+ densityValue +' ppi)');
              convertAsset(inFile,density,outFile,densityValue,function(err) {


              });
            }
            else {
              console.log( "Not generated - output density is higher that input one : " + inFile  + ' ('+ density +' ppi)' + " > " + outFile + ' ('+ densityValue +' ppi)');
            }
       }
     }
   }

   callback();
 });
}

/*
 * Parses a string parameter to an integer ppi density value.
 */
function parseDensity(parameter) {
  if(parameter === '@3x') return 401;
  if(parameter === '@2x') return 264;
  if(parameter === 'ldpi') return 120;
  if(parameter === 'mdpi') return 160;
  if(parameter === 'hdpi') return 240;
  if(parameter === 'xhdpi') return 320;
  if(parameter === 'xxhdpi') return 480;
  if(parameter === 'xxxhdpi') return 640;
  return parseInt(parameter);
}

/*
 * Flattens an image from its path to a unique single level file.
 * Example : "/a/b/c d/e/f g h.png" > "[a-b-cD-e]fGH.png"
 */
function flattenName(folderPath, imagePath) {

  var result = '';
  var parsed = path.parse(imagePath);
  var relative = path.relative(folderPath,parsed.dir);
  var splits = relative.split(path.sep).filter(n => n.length > 0);

  for(var i = 0; i < splits.length; i++) {
    if(i == 0) { result += "["; }
    else { result += "-"; }
    result += changeCase.camelCase(splits[i]);
  }

  if(result.length > 0) { result += "]"; }

  return result + changeCase.camelCase(parsed.name)  + parsed.ext;

}

/*
 * Converts an asset from a density to another.
 */
function convertAsset(imgPathIn, dpiIn, imgPathOut, dpiOut, callback) {

  var scale = dpiOut / dpiIn;

  mkdirp(path.dirname(imgPathOut), function (err) {
    if (err) {
      callback(err);
      return;
    }

      jimp.read(imgPathIn, function (err, img) {
          if (err) {
            callback(err);
            return;
          }
          try {
            img.scale(scale)
               .write(imgPathOut);
               callback()
          } catch (e) {
            callback(e)
          }
      });


  });

}

/*
 * Module exports
 */

 module.exports = {
   systems: systems,
   convertAssets: convertAssets,
   convertAsset: convertAsset,
   flattenName: flattenName,
   parseDensity: parseDensity
 }
