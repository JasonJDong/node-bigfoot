var fs = require('fs');
var async = require('async');
var extend = require('node.extend');
var unzip = require('unzip');
var EventEmitter = require('events');
var inherits = require('util').inherits;

var abUtil = require('./abutils');

var UnArchive = function () {
	
	EventEmitter.call(this);

	var self = this;

	this.emitter = new EventEmitter();

	this.unzip = function (archivePath, extractDir, opts) {

		var defaultOpts = {
			keepArchive: true,
			backupOld: true,
		}

		this.options = extend(true,{}, defaultOpts, opts);

		async.waterfall([

			function checkArchivePath(callback) {
				
				console.log('检查大脚插件压缩文档...');
				fs.stat( archivePath, function (ferr, stat) {

					if ( ferr && ferr.code === 'ENOENT') {
						callback('没找到压缩文档!');
					}else{
						callback(null);
					}
				});
			},
			//Create dirctory if it not exists.
			function toggleExtractDir(callback) {
				
				console.log('检查大脚插件解压目录...');
				abUtil.createDir(extractDir, function (e) {
					callback(e);
				});
			},
			function backupOldAddon(callback) {
				
				if (self.options.backupOld) {
					abUtil.renameDir(extractDir, function (e) {
						callback(e);
					});
				}else{
					callback(null);
				}
			},
			//Do extract action
			function extractArchive(callback) {
				
				console.log('解压中...');
				var unzipExtractor = unzip.Extract({path: extractDir})
				fs.createReadStream(archivePath).pipe(unzipExtractor);
				unzipExtractor.on('close', function () {
					callback(null);
				});

				unzipExtractor.on('error', function (e) {
					callback(e);
				});
			},
			function deleteArchive(callback) {
				
				if ( self.options.keepArchive ) {
					callback(null);
				}else{
					
					console.log('删除下载文档...');
					fs.unlink( archivePath, function (e) {
						console.log('删除完成...');
						callback(e);
					});
				}
			}

		], function (e) {
			
			if (e) {
				self.emitter.emit.call(self, 'error',e);
			}else{
				self.emitter.emit.call(self, 'done');
			}
		});
		
		return this;
	}
}

inherits(UnArchive, EventEmitter);

module.exports = UnArchive;