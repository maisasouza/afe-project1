var clientId = '3352aeffbd24d33f8859'; //'bd15b1e768bb9e7e3d53';
var clientSecret = '097f832242ad371d9f012770cabdb1e6cebc433a'; // 'b6626a26b8c4214893a06cf8d9a3c63891f6ac5d';
var btoa = require('btoa');

console.log('Basic ' + btoa(clientId + ':' + clientSecret));