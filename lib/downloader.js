var fs = require('fs');
var path = require('path');
var request = require('request');
var progress = require('request-progress');
var extend = require('node.extend');
var dateFormat = require('dateformat');
var EventEmitter = require('events');
var inherits = require('util').inherits;
var process = require('process');

var config = require('./config');
var abUtil = require('./abutils');

var Downloader = function () {
	
	var self = this;

	EventEmitter.call(this);
	this.emitter = new EventEmitter();

	this.init = function (opts) {

		opts = opts || {};

		var defaultOpts = {
			version: config.version,
			downloadUrl: config.downloadUrlFmt.replace('{VERSION}', config.version),
			downloadDir: config.downloads.dir,
			keepDownloadArchive: config.downloads.keepArchive,
		}
		
		this.options = extend(true, {}, defaultOpts, opts);
		console.log('下载初始化...');
		return self;
	};

	this.download = function () {

		var fileName = 'Interface.' + this.options.version + '.zip';
		var tmpFileName = 'Interface.downloading.zip';
		var filePath = path.join(this.options.downloadDir, fileName);
		var tmpFilePath = path.join(this.options.downloadDir, tmpFileName);

		abUtil.isFileExists( filePath, function (exist) {
			
			if (!exist) {

				var fsStream = fs.createWriteStream(tmpFilePath);
				progress(request.get(self.options.downloadUrl))
				.on('progress', function (state) {
					
					var outstring = '下载中...' 
					+ parseFloat(state.percentage * 100).toFixed(1) + '% ' 
					+ (state.speed / 1024).toFixed(2) + ' KB/s ' + '剩余时间: ' 
					+ parseInt(state.time.remaining) + 's\r';

					process.stdout.write(outstring);
				})
				.on('error', function (e) {

					if (e && e.code === 'ENOTFOUND') {
						console.log('下载地址可能不对，请核对！');
						fsStream.emit('error');
					}
				})
				.pipe(fsStream);

				fsStream.on('error', function () {
					abUtil.deleteFile(tmpFilePath);
				});

				fsStream.on('close', function () {
					console.log('下载完成...');
					abUtil.renameFile(tmpFilePath, filePath, function () {
						abUtil.deleteFile(tmpFilePath);
						self.emitter.emit.call(self, 'done', filePath);
					});
				});

			}else{
				
				console.log('压缩文件已存在，跳过下载步骤...');
				self.emitter.emit.call(self, 'done', filePath);
			}
		});

		return self;
	}
}

inherits(Downloader, EventEmitter);

module.exports = Downloader;