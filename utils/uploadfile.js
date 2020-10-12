const Path = require('path')
const fs = require('fs')
const fse = require('fs-extra')
const formidable = require('formidable');
const unrar = require('./unrar')
const unzip = require('./unzip')
const uploadDir = Path.join(__dirname, "../upload")

function renameFile(oldName, newName) {
	return new Promise((resolve, reject) => {
		fs.rename(oldName, newName, err => {
			if (err) {
				return reject(err)
			}
		
			resolve('ok')
		})
	})
}

async function readdir(dir, maxNumber) {
	return new Promise((resolve, reject) => {
		fs.readdir(dir,  (err, files) => {
			if (err) {
				resolve(err)
			}
			resolve(files)
		})
	})
}

async function mergeFiles(srcDirList, newFileName) {
	let write = fs.createWriteStream(newFileName);

	function r() {
		if (!srcDirList.length) {
			write.end("Done");
			setTimeout(() => {
				console.log('setTimeout',newFileName );
				unrarFile(newFileName)
			}, 3000)
			return 
		} 
		let first = srcDirList.shift()
		
		const read = fs.createReadStream(first)
		read.resume();
		read.pipe(write, {end: false})
		read.on('end', () => { //监听状态
			console.log("监听状态 end")
			r()
		})
	}

	r();
}

function unrarFile(newFileName, cb) {
	if (/\.rar$/.test(newFileName)) {
		unrar(newFileName, Path.join(__dirname, "../temp"), (code) => {
			console.log(code)
			cb && cb(code)
		})
	} else if (/\.zip$/.test(newFileName)) {
		unzip(newFileName, Path.join(__dirname, "../temp"), (code) => {
			console.log(code)
			cb && cb(code)
		})
	}
}

function unzipFile(newFileName, ctx) {
	unrarFile(Path.join(uploadDir, newFileName), (code) => {
		
	})
}

function removeFileChunks(srcDir) {

}


const saveUploadFile = async function(ctx, next) {
	const form = formidable({ 
		multiples: true,
		uploadDir
	});

	await new Promise((resolve, reject) => {
		form.parse(ctx.req, async (err, fields, files) => {
			if (err) {
				ctx.body = JSON.stringify(err);
				reject(err);
				return;
			}

			const {fileIndex} = fields
			const {name, path, size} = files.file;
			const prefixPath = (name || "").replace(/\./g, "_")
			const fileDir = Path.join(uploadDir, prefixPath) 
			const newFileName = `${fileIndex}_${name}`
			const newFilePath = Path.join(fileDir, newFileName)
	
			fse.ensureDirSync(fileDir)
			
			await renameFile(path, newFilePath)
		
			
			ctx.set('Content-Type', 'application/json');
			ctx.status = 200;
			
			ctx.state = { size,  path: `${prefixPath}/${newFileName}`, chunkOrder: fileIndex, fileFinalName: name};
			ctx.body = JSON.stringify(ctx.state, null, 2);
			resolve();
		});
	});

	next()
}


function mergeChunkFiles(srcDirList, newFileName) {
	mergeFiles(srcDirList.map(i => Path.join(uploadDir, i)), 
	Path.join(uploadDir, newFileName))
}

exports.saveUploadFile = saveUploadFile;
exports.mergeChunkFiles = mergeChunkFiles;
exports.upzipFile = unzipFile;