const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', socket => {
    let secretRoom;
    socket.on('joinRoom', joinKey => {
        if (io.sockets.adapter.rooms[joinKey] && io.sockets.adapter.rooms[joinKey].length <= 1) {
            secretRoom = joinKey;
            socket.join(secretRoom);

            socket.broadcast
                .to(secretRoom)
                .emit(
                    //this fires a notification on the frontend , 0 = disconnect, 1 = joined
                    'botMessage', 1);
        } else {
            socket.emit('sessionLocked');
        }
    });

    socket.on('newRoom', secretKey => {
        secretRoom = secretKey;
        socket.join(secretRoom);
        //get total numbers os clients in a room
        // const room = io.sockets.adapter.rooms[secretRoom].length;
        socket.broadcast
            .to(secretRoom)
            .emit(
                //this fires a notification on the frontend , 0 = disconnect, 1 = joined
                'botMessage', 1);
    });

    //message to room
    socket.on('message', message => {
        socket.broadcast.to(secretRoom).emit('sendMessage', message);
    });

    //fired when a user disconnects
    socket.on('disconnect', () => {
        socket.broadcast
            .to(secretRoom)
            .emit(
                //this fires a notification on the frontend , 0 = disconnect, 1 = joined
                'botMessage', 0);
    });
});

http.listen(3001, () => {
    console.log('listening on 3001');
});