const fs = require('fs')

// const cmd = function (ctx, next) {
// 	const {req, res} = ctx
// 	console.log(ctx.request.files)
// 	// let data = fs.readFileSync(ctx.request.files.image.path);
//   	// fs.writeFileSync(path.join(__dirname, 'upload', ctx.request.files.image.name), data);


// 	// req.on('end', () => {
// 	// 	// // JSON.parse(data) // '做点事情'
// 	// 	// res.write(data + ' ')
// 	// 	// res.end()
// 	// 	console.log(data.toString())
// 	// })
	
// }


const cmd = function (ctx, next) {
	const {req, res} = ctx
	let body = ''
	req.on('data', function(chunk){
		body += chunk;
	});

	req.on('end', () => {
		console.log(body)

		
	})
	
}

module.exports = cmd