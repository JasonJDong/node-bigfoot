var fs = require('fs');
var async = require('async');
var path = require('path');


var isFileExists = function (filePath, callback) {
	
	fs.stat( filePath, function (ferr, stat) {
		
		if (ferr && ferr.code == 'ENOENT') {
			callback(false);
		}else{
			callback(true);
		}
	});
}

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

var renameDir = function ( dirPath, distPath, callback ) {
	
	fs.stat(dirPath, function (ferr, state) {
		
		if (!ferr) {
			fs.rename( dirPath, distPath, function (lerr) {
				
				if (lerr && lerr.code === 'EPERM') {
					if (callback) {callback(lerr.code);}
				}else{
					if (callback) {callback(null);}
				}
			});
		}else{
			if (callback) {callback(null);}
		}
	});
}

var deleteFile = function ( filePath, callback ) {
	
	isFileExists(filePath, function (exist) {
		
		if (exist) {

			fs.unlink(filePath, function (e) {

				if(callback){callback(!e);}
			})
		}else{

			if(callback){callback(true);}
		}
	})
}

module.exports = {

	createDir: createDirIfNoExist,
	renameDir: renameDir,
	renameFile: renameDir,
	deleteFile: deleteFile,
	isFileExists: isFileExists
}