const Koa = require('koa');
const path = require('path')
const proxy = require('koa-proxy')
const logger = require('koa-logger')
const convert = require('koa-convert');
const staticFiles = require('koa-static')
const historyApiFallback = require('koa2-history-api-fallback');
const socket = require('./websocket')
const cmd = require('./utils/process')
const bodyParse = require('./utils/bodyParse')
const koaBody = require('koa-body');
const app = new Koa()


const server = require('http').createServer(app.callback());

socket(server)
app.use(logger())

// app.use(historyApiFallback({
//     rewrites: [
//         { from: /\/admin/, to: '/xkadmin/admim.html'}
//       ]
// }));
app.use(staticFiles(path.resolve(__dirname, `./public`)))
// app.use(staticFiles(path.resolve(__dirname, `./html`)))
// app.use(staticFiles(path.join(`F:/ykt/gitlab/xkAdmin/offical`)))
// app.use(staticFiles(path.join(`F://ykt/gitlab/ldy/dist`)))
// app.use(staticFiles(path.join(`F:/ykt/gitlab/xkHtmlPage`)))

// app.use(staticFiles(path.join(`F:/ykt/TEST/pages/dist`)))
// app.use(staticFiles(path.join(`F:/ykt/gitlab/xkWap/dist`)))
// app.use(staticFiles(path.join(`F:/ykt/gitlab/nag`)))

// logger

// app.use(async (ctx, next) => {
//     await next();
//     const rt = ctx.response.get('X-Response-Time');
//     console.log(`${ctx.method} ${ctx.url} - ${rt}`);
//   });
  
//   // x-response-time
  
//   app.use(async (ctx, next) => {
//     const start = Date.now();
//     await next();
//     const ms = Date.now() - start;
//     ctx.set('X-Response-Time', `${ms}ms`);
//   });
  
//   // response
  
//   app.use(async ctx => {
//       console.log('hi')
//       let req = ctx.req
//     // 如果添加了监听器，则可读流会触发 'data' 事件。
//     req.on('data', chunk => {
//         console.log(chunk)
//         // body += chunk;
//     });

//     // 'end' 事件表明整个请求体已被接收。 
//     req.on('end', () => {
//         console.log('3456')
        
//     });
//     console.log('end')
//     ctx.body = '123';
//   });
  
  app.use(koaBody({
    multipart: true // 允许客户端上传文件
  }));
  app.use(async (ctx, next) => {
    let { url } = ctx.request
    console.log(url)
    if (url === '/pro') {
      cmd()
      ctx.body = url;
    } else if(url === '/parse') {
      // bodyParse(ctx, next)
      console.log(ctx.request)
      ctx.body = url;
    } else {
      ctx.body = "hello world"
    }
  })

  // app.use(async (ctx, next) => {
  //   let { url } = ctx.request

  //   console.log(url)
  //   if (url === '/pro') {
  //       cmd()
  //   }
  //   ctx.body = url;
   
  // });


app.use(convert(proxy({
    // host: 'http://xingke100.com'
    host: 'http://localhost:8091'
    // host: 'http://api.xingke100.com'
})));



server.listen(3001, () => {
    console.log(`app is listening on 3000; http://localhost:3001`)
})