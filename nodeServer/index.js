//const { Socket } = require('socket.io');

// Node server which will handle socket io connections
//const io = require('socket.io')(8000)
const io = require('socket.io')(8000, {
    cors: {
      origin: '*',
    }
  });

const users = {};

io.on('connection', socket =>{  // it is instance of socket.io which listen many connection
    //if new user joins, let other users connected to the server know
    socket.on('new-user-joined', name => {  //it decides what should be done when particular connection was called
        //console.log("New user", name);
        users[socket.id] = name; //socket ko jab bhi 'user-joined' event mila name ka then users me append kr do
        socket.broadcast.emit('user-joined', name) // jis user ne join kiya usko chhod ke sabhi ko inform kr dega
    });

    //if someone send the the message, broadcast to the other people
    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]});
    })

    //If someone leave the chat, let other people know
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    })
});