# node-bigfoot
nodejs编写的自动更新大脚插件工具，因为bigfoot客户端总是报“下载配置文件出错”的错误，而NGA论坛提供了绿色安装包，因此有了这个自动更新工具。

## Reference - 依赖
前往[https://nodejs.org](http://nodejs.org)并下载安装nodejs

## Installation - 安装
`npm install node-bigfoot`

## Config - 配置 

   配置项  |                说明                     
 :-------- | :------------------------------------
 distDir  | 更新插件的位置，解压出来的文件夹为Interface 
 version | 大脚插件版本,目前默认为7.0.0.591
 downloads.dir | 下载文件的存放地址 
 downloads.keepArchive | 是否保留下载的压缩包 

## Usage - 用法
```
var bigfoot = require('node-bigfoot');
    bigfoot.start({
        version: "7.0.0.591",
        distDir: "./dist"，
        downloads: {
            dir: './downloads',
            keepArchive: true
        }
    });
```

## License - [MIT license](http://revolunet.mit-license.org/)
