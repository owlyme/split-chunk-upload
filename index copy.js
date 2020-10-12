const Koa = require('koa');
const path = require('path')
const proxy = require('koa-proxy')
const logger = require('koa-logger')
const convert = require('koa-convert');
const staticFiles = require('koa-static')
const historyApiFallback = require('koa2-history-api-fallback');
const socket = require('./websocket')

const app = new Koa()

const server = require('http').createServer(app.callback());
socket(server)
app.use(logger())
app.use(historyApiFallback({
  rewrites: [
    { from: /\/admin/, to: '/admin.html'}
  ]
}));
app.use(staticFiles(path.resolve(__dirname, `./public`)))
app.use(staticFiles(path.resolve(__dirname, `./html`)))
// app.use(staticFiles(path.join(`F:/ykt/gitlab/xkAdmin/offical`)))
// app.use(staticFiles(path.join(`F:/ykt/gitlab/xkAdmin/dist`)))
// app.use(staticFiles(path.join(`F:/ykt/gitlab/xkWap/dist`)))

// logger

app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
  });
  
  // x-response-time
  
  app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
  });
  
  // response
  
  app.use(async ctx => {
      let req = ctx.request
      let body = ''
    // 如果添加了监听器，则可读流会触发 'data' 事件。
    req.on('data', (chunk) => {
        body += chunk;
    });

    // 'end' 事件表明整个请求体已被接收。 
    req.on('end', () => {
        ctx.body =  body;
    });
    
  });
  
server.on('data', chunk => {
    console.log(chunk)
})
app.use(convert(proxy({
    // host: 'http://xingke100.com'
    host: 'http://localhost:8091'
    // host: 'http://api.xingke100.com'
})));



server.listen(3000, () => {
    console.log(`app is listening on 3000`)
})