var Unarchive = require('./lib/unarchive');
var Downloader = require('./lib/downloader');
var extend = require('node.extend');

var config = require('./lib/config');

function start(userOpts) {

	var defalutOpts = config;
	var opts = extend(true, {}, defalutOpts, userOpts);
	config = opts;
	
	var dnload = new Downloader();
	var unzip = new Unarchive();
	var extractDir = config.distDir;
	var keepArchive = config.downloads.keepArchive;
	var backupOld = config.backupOld;

	dnload.init(config, function () {
		dnload.download();
	});
	dnload.on('done', function (archivePath) {
		unzip.unzip( archivePath, extractDir, {keepArchive:keepArchive, backupOld: backupOld});
	});

	unzip.on('done', function () {
		console.log('大脚插件更新完毕！')
	});

	unzip.on('error', function (err) {
		console.log(err);
	})

}

module.exports = 
{
	start: start
}