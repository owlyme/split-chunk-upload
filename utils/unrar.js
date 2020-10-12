const { spawn } = require('child_process');

const cmd = function (file, outPutPath, callback) {
	ls = spawn('unrar', ['e', file, outPutPath])
	ls.on('close', (code) => {
		console.log('unrar close')
		callback && callback(code)
	});
}

module.exports = cmd