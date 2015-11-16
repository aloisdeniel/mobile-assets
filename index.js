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
  ios: require('./systems/ios.js'),
  windows: require('./systems/windows.js')
};

/*
 * Program commands
 */

program
  .version('0.0.1')
  .option('-w, --windows', 'generates assets for Windows projects')
  .option('-s, --ios', 'generates assets for iOS projects')
  .option('-a, --android', 'generates assets for Android projects')
  .option('-b, --iconBackgroundColor [iconBackgroundColor]', 'the background color for iOS and Android generated icons', "#54c5ef")
  .option('-f, --iconForegroundColor [iconForegroundColor]', 'the foreground color for all generated icons', "#ffffff")
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
     convertAssets(program.input, program.dpi, program.output,system, program.iconForegroundColor, program.iconBackgroundColor, function(err) {

     });
   }
  }
}

 /*
  * Converts all assets in a folder for a given system.
  */
function convertAssets(pathIn, density, pathOut, system, iconForegroundColor, iconBackgroundColor, callback) {

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

         system.createIcon(inFile,iconForegroundColor, iconBackgroundColor,function(err,icon){
           if(err){
             console.log("failed to generate app icon : ".red + err);
           }
           else if(icon){
             var iconJobs = [];

             for (var iconSizePath in system.icons) {
                var value = system.icons[iconSizePath];
                var outFile = formatName(pathOut,iconSizePath,"appicon");

                iconJobs.push({
                  imgIn: icon,
                  dpiIn: density,
                  imgPathOut: outFile,
                  convertParams: value
                });
             }

             asynch.map(iconJobs, function(opt,cb) {
                  convertAsset(opt.imgIn,opt.dpiIn,opt.imgPathOut,opt.convertParams,cb);
              }, callback);
           }
         });
       }
       else if(path.extname(inFile) === '.png') {
         var relative = path.relative(pathIn,inFile);
         var flatname = system.createResourceName(relative);

         for(var assetPath in system.assets) {
              var value = system.assets[assetPath];
              var outFile = formatName(pathOut,assetPath,flatname);

              batchJobs.push({
                imgIn: inFile,
                dpiIn: density,
                imgPathOut: outFile,
                convertParams: value
              });
         }
     }
   }

   asynch.map(batchJobs, function(opt,cb) {
        convertAsset(opt.imgIn,opt.dpiIn,opt.imgPathOut,opt.convertParams,cb);
    }, callback);

 });
}

/*
 * Replace {lowercase},  or {camelcase} in template with corresponding value.
 */
function formatName(rootFolder,template,filePath) {
  var name = path.basename(filePath,path.extname(filePath));
  var outFile = template.replace('{camelcase}', name);
  outFile = outFile.replace('{lowercase}', name.toLowerCase());
  outFile = outFile.replace('{pascalcase}', changeCase.camelCase(name));
  return path.join(rootFolder,outFile);
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
function convertAsset(imgIn, dpiIn, imgPathOut, convertParams, callback) {

    mkdirp(path.dirname(imgPathOut), function (err) {
      if (err) {
        callback(err);
        return;
      }

      // If imgPathIn isn't a jimp image instance, we need to load an image

      if((typeof imgIn) === 'string') {
          jimp.read(imgIn, function (err, img) {
              if (err) {
                callback(err);
                return;
              }
              try {
                writeImage(img,dpiIn,imgPathOut,convertParams);
                callback();

              } catch (e) {
                console.log(('FAILED : ').red + e);
                callback(e)
              }
          });
        }
        else {
          try {
            writeImage(imgIn,dpiIn,imgPathOut,convertParams);
            callback();

          } catch (e) {
            console.log(('FAILED : ').red + e);
            callback(e)
          }
        }
    });
};

/*
 * Writes an image with the given size or scale.
 */
function writeImage(img, dpiIn, imgPathOut, sizeParams) {
  if(Array.isArray(sizeParams)) {
    // Resizing
    img.clone().contain(sizeParams[0],sizeParams[1]).write(imgPathOut);
    console.log(('('+ sizeParams[0] + 'x' + sizeParams[1] +' px) : ').cyan + imgPathOut);
  }
  else {
    if(dpiIn >= sizeParams) {
      //Scaling
      var scale = sizeParams / (1.0 * dpiIn);
      img.clone().scale(scale).write(imgPathOut);
      console.log(('('+ dpiIn +' ppi > '+ sizeParams +' ppi) : ').cyan + imgPathOut);
    }
    else {
      console.log(("Ignored - output density is higher that input one : " ).yellow + imgPathOut);
    }
  }
};

/*
 * Module exports
 */

 module.exports = {
   systems: systems,
   convertAssets: convertAssets,
   convertAsset: convertAsset,
   parseDensity: parseDensity
 }
