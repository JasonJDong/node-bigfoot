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

		var fileNamePrefix = dateFormat(new Date(), 'yyyymmddhMMss');
		var fileName = fileNamePrefix + 'Interface.' + this.options.version + '.zip';
		var filePath = path.join(this.options.downloadDir, fileName);
		var fsStream = fs.createWriteStream(filePath);

		progress(request.get(this.options.downloadUrl))
		.on('progress', function (state) {
			
			var outstring = '下载中...' 
			+ parseFloat(state.percentage * 100).toFixed(1) + '% ' 
			+ (state.speed / 1024).toFixed(2) + ' KB/s ' + '剩余时间: ' 
			+ parseInt(state.time.remaining) + 's\r';

			process.stdout.write(outstring);
		})
		.pipe(fsStream);

		fsStream.on('close', function () {
			console.log('下载完成...');
			self.emitter.emit.call(self, 'done', filePath);
		});

		return self;
	}
}

inherits(Downloader, EventEmitter);

module.exports = Downloader;