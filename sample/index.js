var assets = require('../');

assets.convertAssets('./in', '@3x', './out/android', assets.systems.android, function(err){

});

assets.convertAssets('./in', '@3x', './out/ios', assets.systems.ios, function(err){

});
