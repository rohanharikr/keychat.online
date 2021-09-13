const { nanoid } = require('nanoid');
const app = require('http').createServer()
const io = require('socket.io')(app, {
  cors: {
    origin: "*"
  }
});

io.on('connection', (socket) => {
  let room_key = nanoid(5).toUpperCase();
  let user_id = nanoid(5);
  let messages = [];
  
  socket.emit('roomKey', {
    room_key,
    user_id
  })

  socket.on('message', message => {
    messages.push({
      id: 0,
      message
    })

    socket.emit('messages', messages)
  })  
});

io.listen(3001);