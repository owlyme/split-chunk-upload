

const cmd = function () {
	eval(`
	const { spawn } = require('child_process');
	const ls = spawn('node', ['./console.js']);
	// const ls = spawn('rm', ['-rf', '*']);

	ls.stdout.on('data', (data) => {
	  console.log('a' + data);
	});
	

	
	ls.on('close', (code) => {
	  console.log('子进程退出，退出码');
	});
	`)
}

module.exports = cmd