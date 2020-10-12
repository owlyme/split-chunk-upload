const socket = require('socket.io')

module.exports = function (app) {
  const io = socket(app).of('/chat')
  io.on('connection', (socket) => { 
      // 将用户昵称加入房间名单中

      console.log(socket.request.url, socket.request._query.room)
      room = socket.request._query.room
      socket.join(room);  // 加入房间
      // 通知房间内人员
      io.to(room).emit('message', '加入了房间'+ room);  

    // socket.on('message', function(data){
    //   console.log(data)
    //   io.emit('message', 123123)
    // });
  });
}