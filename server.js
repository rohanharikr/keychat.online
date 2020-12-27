const app = require('express')()
const server = app.listen(3001)
const io = require('socket.io').listen(server)

let userName,
  userAvatar,
  anonName,
  anonAvatar,
  userPublicKey,
  anonPublicKey,
  nonce

const USER_JOINED = 1
const USER_LEFT = 0

io.on('connection', (socket) => {
  let secretRoom

  socket.on('joinRoom', (data) => {
    if (
      io.sockets.adapter.rooms[data.joinKey] &&
      io.sockets.adapter.rooms[data.joinKey].length === 1
    ) {
      secretRoom = data.joinKey
      anonPublicKey = data.anonPublicKey
      socket.join(secretRoom)
      io.in(secretRoom).emit('userData', {
        userName,
        userAvatar,
        anonName,
        anonAvatar,
        userPublicKey,
        anonPublicKey,
        nonce,
      })
      socket.broadcast.to(secretRoom).emit('botMessage', USER_JOINED)
    } else {
      socket.emit('sessionLocked')
    }
  })

  socket.on('newRoom', (data) => {
    userName = data.userName
    userAvatar = data.userAvatar
    anonName = data.anonName
    anonAvatar = data.anonAvatar
    secretRoom = data.secretKey
    userPublicKey = data.userPublicKey
    nonce = data.nonce
    socket.join(secretRoom)
    socket.broadcast.to(secretRoom).emit('botMessage', USER_JOINED)
  })

  socket.on('message', (message) => {
    socket.broadcast.to(secretRoom).emit('sendMessage', message)
  })

  socket.on('typingMessage', () => {
    socket.broadcast.to(secretRoom).emit('typing')
  })

  socket.on('noLongerTypingMessage', () => {
    socket.broadcast.to(secretRoom).emit('noLongerTyping')
  })

  //when user leaves room at will
  socket.on('disconnecting', () => {
    socket.leave(secretRoom)
    socket.broadcast.to(secretRoom).emit('botMessage', USER_LEFT)
    secretRoom = ''
  })

  socket.on('disconnect', () => {
    socket.broadcast.to(secretRoom).emit('botMessage', USER_LEFT)
  })
})