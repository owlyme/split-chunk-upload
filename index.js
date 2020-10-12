const Koa = require('koa');
const path = require('path')
const logger = require('koa-logger')
const staticFiles = require('koa-static')
const koaBody = require('koa-body')
const cmd = require('./utils/process')
const { saveUploadFile,  mergeChunkFiles, upzipFile } = require('./utils/uploadfile')

const app = new Koa()
const server = require('http').createServer(app.callback());

app.use(logger())
app.use(koaBody())
app.use(staticFiles(path.resolve(__dirname, `./public`)))
app.use(staticFiles(path.resolve(__dirname, `./dist`)))
app.use(async (ctx, next) => {
  let { url } = ctx.request

  if (url === '/pro') {
    cmd()
    ctx.body = url;
  } else if(url === '/parse') {
    await saveUploadFile(ctx, next)
    // ctx.body = body;
  } else if(url === '/merge') {
    const {fileList, newFileName} = JSON.parse(ctx.request.body)
    await mergeChunkFiles(fileList, newFileName)
    ctx.body = 'ctx.request';
  } else if (url === '/unzip') {
    const { newFileName} = JSON.parse(ctx.request.body)
    upzipFile(newFileName, ctx)
    ctx.body = "/unzip";
  }else {
    ctx.body = "hello world"
  }
})
server.listen(3001, () => {
    console.log(`app is listening on 3000; http://localhost:3001`)
})