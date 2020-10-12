const { spawn } = require('child_process');

const cmd = function (file, outPutPath, callback) {
	console.log(file, outPutPath);
	let ls = spawn('unzip', [file])
	ls.stdout.on('data', (data) => {
		console.log(`stdout: ${data}`);
	});
	ls.on('close', (code) => {
		console.log(`close: ${code}`);
		callback && callback(code)
	});
}

module.exports = cmd