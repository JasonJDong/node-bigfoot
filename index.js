var Unarchive = require('./lib/unarchive');
var Downloader = require('./lib/downloader');

var config = require('./lib/config');

;(function main() {
	
	var dnload = new Downloader();
	var unzip = new Unarchive();
	var extractDir = config.distDir;
	var keepArchive = config.downloads.keepArchive;
	var backupOld = config.backupOld;

	dnload.init().download();
	dnload.on('done', function (archivePath) {
		unzip.unzip( archivePath, extractDir, {keepArchive:keepArchive, backupOld: backupOld});
	});

	unzip.on('done', function () {
		console.log('大脚插件更新完毕！')
	});

	unzip.on('error', function (err) {
		console.log(err);
	})

})();