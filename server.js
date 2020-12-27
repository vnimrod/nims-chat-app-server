const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const users = require('./utils/users');

const port = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
  wsEngine: 'ws'
});

let admin = 'Admin';
let currentDate = new Date();
let currentTime = currentDate.getHours() + ':' + currentDate.getMinutes();

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', ({ name, room }, cb) => {
    const { err, user } = users.addUser({ id: socket.id, name, room });

    if (err) return cb(err); //ChatRoom on client will recive the cb

    socket.emit('message', {admin: admin, currentTime, message: 'Welcome'});

    //broadcast to the current room only
    socket.broadcast
      .to(user.room)
      .emit('message', {admin: admin, name:user.name, currentTime, message: 'has joined the room'});

    socket.join(user.room);

    io.to(user.room).emit("roomUsers", { room: user.room, roomUsers: users.getRoomUsers(user.room)})
  });

  socket.on('sendMessage', (message, cb) => {
    const user = users.getUser(socket.id);
    io.to(user.room).emit('message', {user: user.name, currentTime, message});

    cb();
  });

  socket.on('disconnect', () => {
    const user = users.removeUser(socket.id)

    if(user) {
      io.to(user.room).emit('message',{ admin: admin, name:user.name, currentTime: currentTime, message: 'has left the room'})
      io.to(user.room).emit('roomUsers', {
        room:user.room,
        roomUsers: users.getRoomUsers(user.room)
      })
    }
  });
});

server.listen(port, () => {
  `Server started on port ${port}`;
});
