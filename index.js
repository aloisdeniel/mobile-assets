#!/usr/bin/env node

/*
 * Dependencies
 */

var jimp = require("jimp");
var program = require('commander');
var colors = require('colors');
var path = require('path');
var recursive = require('recursive-readdir');
var mkdirp = require('mkdirp');
var asynch = require('async')
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
  .option('-o, --output [ouput]', 'the output folder where all generated assets will be created', './assets/')
  .option('-i, --input [input]', 'the input folder that contains all the original HD assets', './')
  .parse(process.argv);

/*
 * Program execution
 */

if(require.main === module) {
  var allSystems = !(program.android || program.ios || program.windows);

  for(var s in systems) {
   if(allSystems || program[s]) {
     var system = systems[s];
     convertAssets(program.input,program.dpi,program.output,system,function(err) {

     });
   }
  }
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

   var batchJobs = [];

   for (var i in files) {
     var inFile = files[i];
       if(path.basename(inFile) === 'appicon.png') {
         system.createIcon(inFile,pathOut,"#ffffff", "#f3a62d",function(err){
           if(err){
           console.log("failed to generate app icon : ".red + err);
           }
         });
       }
       else if(path.extname(inFile) === '.png') {
         var relative = path.relative(pathIn,inFile);
         var flatname = system.createResourceName(relative);

         for(var densityPath in system.densities) {
              var densityValue = system.densities[densityPath];
              var camelCaseName = path.basename(flatname,path.extname(flatname));
              var outFile = densityPath.replace('{camelcase}', camelCaseName);
              outFile = outFile.replace('{lowercase}', camelCaseName.toLowerCase());
              outFile = path.join(pathOut,outFile);

              if(densityValue <= density) {
                batchJobs.push({
                  imgPathIn: inFile,
                  dpiIn: density,
                  imgPathOut: outFile,
                  dpiOut: densityValue
                });
              }
              else {
                console.log(("Ignored - output density is higher that input one : " + inFile  + ' ('+ density +' ppi)' + " > " + outFile + ' ('+ densityValue +' ppi)').yellow);
              }
         }
     }
   }

   asynch.map(batchJobs, function(opt,cb) {
        console.log(('[' + opt.imgPathIn + ']('+ opt.dpiIn +' ppi > '+ opt.dpiOut +' ppi) : ').cyan + opt.imgPathOut);
        convertAsset(opt.imgPathIn,opt.dpiIn,opt.imgPathOut,opt.dpiOut,cb);
    }, callback);

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
 * Converts an asset from a density to another.
 */
function convertAsset(imgPathIn, dpiIn, imgPathOut, dpiOut, callback) {

  var scale = dpiOut / (1.0 * dpiIn);

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
   parseDensity: parseDensity
 }
