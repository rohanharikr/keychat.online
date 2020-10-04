const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let userName, userAvatar, anonName, anonAvatar, userPublicKey, anonPublicKey, nonce;

io.on('connection', socket => {
    let secretRoom;

    socket.on('joinRoom', data => {
        //check if session exists and user count < 2
        if (io.sockets.adapter.rooms[data.joinKey] && io.sockets.adapter.rooms[data.joinKey].length === 1) {
            secretRoom = data.joinKey;
            anonPublicKey = data.anonPublicKey;
            socket.join(secretRoom);
            io.in(secretRoom).emit('userData', { userName, userAvatar, anonName, anonAvatar, userPublicKey, anonPublicKey, nonce });
            socket.broadcast
                .to(secretRoom)
                .emit(
                    //sends a notif to fe, 0 = disconnect, 1 = joined
                    'botMessage', 1);
        } else {
            socket.emit('sessionLocked');
        }
    });

    socket.on('newRoom', data => {
        userName = data.userName;
        userAvatar = data.userAvatar;
        anonName = data.anonName;
        anonAvatar = data.anonAvatar;
        secretRoom = data.secretKey;
        userPublicKey = data.userPublicKey;
        nonce = data.nonce;
        socket.join(secretRoom);
        socket.broadcast
            .to(secretRoom)
            .emit(
                'botMessage', 1);
    });

    socket.on('message', message => {
        socket.broadcast.to(secretRoom).emit('sendMessage', message);
    });

    socket.on('typingMessage', () => {
        socket.broadcast.to(secretRoom).emit('typing');
    });

    socket.on('noLongerTypingMessage', () => {
        socket.broadcast.to(secretRoom).emit('noLongerTyping');
    })

    //when user leaves room at will
    socket.on('disconnecting', () => {
        socket.leave(secretRoom);
        socket.broadcast
            .to(secretRoom)
            .emit(
                'botMessage', 0);
        secretRoom = '';
    })

    socket.on('disconnect', () => {
        socket.broadcast
            .to(secretRoom)
            .emit(
                'botMessage', 0);
    });
});

const port = process.env.PORT || 3001;

http.listen(port, () => {
    console.log(`listening on ${port}`);
});