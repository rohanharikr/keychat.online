const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', socket => {
    let secretRoom;
    socket.on('secretRoom', secretKey => {
        secretRoom = secretKey;
        socket.join(secretRoom);
        socket.broadcast
            .to(secretRoom)
            .emit(
                'botMessage', 'someone has joined the chat');
    });
    socket.on('message', message => {
        // io.to(secretRoom).emit('sendMessage', message);
        socket.broadcast.to(secretRoom).emit('sendMessage', message);
    });
    socket.on('disconnect', () => {
        socket.broadcast
            .to(secretRoom)
            .emit(
                'botMessage', 'someone has left the chat');
    })
})

http.listen(3001, () => {
    console.log('listening on 3001');
});