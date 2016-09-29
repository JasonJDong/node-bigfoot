var fs = require('fs');
var async = require('async');
var path = require('path');

var createDir = function (dirPath, createdCallback) {
	
	fs.stat(dirPath, function (ferr, stat) {
		
		if (ferr && ferr.code == 'ENOENT') {
			fs.mkdir( dirPath, function (merr) {
				if ( createdCallback ) createdCallback(merr);
			});
		}else{
			if ( createdCallback ) createdCallback(ferr);
		}
	})
}

var createDirIfNoExist = function ( dirPath, createdCallback ) {
	
	var pathsArray = dirPath.split( path.sep );
	var dirMaybePaths = new Array();

	var currDirPath = "";
	pathsArray.forEach( function (subdir) {
		
		currDirPath = path.join( currDirPath, subdir );
		dirMaybePaths.push( currDirPath );
	});

	async.eachSeries( dirMaybePaths, function (subdir, callback) {
		
		createDir( subdir, function (e) {
			callback(e);
		});
	}, function (e) {
		if ( createdCallback ) {createdCallback(e);}
	});
}

var renameDir = function ( dirPath, callback ) {
	
	var oldAddon = path.join( dirPath, 'Interface' );
	fs.stat(oldAddon, function (ferr, state) {
		
		if (!ferr) {
			fs.link( oldAddon, oldAddon + '.Old', function (e) {
				
				if (callback) {callback(e);}
			});
		}else{
			if (callback) {callback(null);}
		}
	});
}

module.exports = {

	createDir: createDirIfNoExist,
	renameDir: renameDir
}