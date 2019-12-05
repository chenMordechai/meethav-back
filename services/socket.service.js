const socketIO = require('socket.io');
// const roomService = require('./room-service');


var io;
var activeUsersCount = 0;
const msgsDB = {};

function setup(http) {
    io = socketIO(http);
    io.on('connection', function (socket) {

        console.log('a user connected');
        activeUsersCount++;
        var room;

        socket.on('disconnect', () => {
            console.log('user disconnected');
            activeUsersCount--;
        });
        // make the room
        socket.on('test users chat', members => {
            if (members[0] === null || members[1] === null) return;
            members.sort((a, b) => a.userName > b.userName ? 1 : -1)
            // members[0]._id + members[1]._id is the room id
            socket.join(members[0]._id + members[1]._id)
            // console.log('chat history emit', msgsDB[members[0]._id + members[1]._id])
            io.to(members[0]._id + members[1]._id).emit('chat history', msgsDB[members[0]._id + members[1]._id])
        })
        // got msg
        socket.on('chat msg', ({ members, msg }) => {
            if (members[0] === null || members[1] === null) return;
            members.sort((a, b) => a.userName > b.userName ? 1 : -1)
            //save the msgs
            if (msgsDB[members[0]._id + members[1]._id]) msgsDB[members[0]._id + members[1]._id].push(msg);
            else msgsDB[members[0]._id + members[1]._id] = [msg];
            //got msg
            io.to(members[0]._id + members[1]._id).emit('test got msg', msg)
        })

        socket.on('user typing', ({ members, user }) => {
            // console.log(members, 'this is soket memebers')
            members.sort((a, b) => a.userName > b.userName ? 1 : -1)
            socket.join(members[0]._id + members[1]._id)
            socket.broadcast.to(members[0]._id + members[1]._id).emit('user isTyping', `${user} is typing...`)
        })

        socket.on('chat notification', (senderUserName, getUser) => {
            io.to(getUser._id).emit('chat notification sent', senderUserName);
        });

        socket.on('user login', (userId) => {
            socket.join(userId);
        });

        socket.on('friend req', (user, currUserLogin) => {
            if (currUserLogin === null) return
            io.to(user._id).emit('friend req sent', currUserLogin.owner.fullName);
        });

        socket.on('friend like', (user, currUserLogin) => {
            if (currUserLogin === null) return
            io.to(user._id).emit('friend like sent', currUserLogin.owner.fullName);
        });

    });
}


module.exports = {
    setup
}