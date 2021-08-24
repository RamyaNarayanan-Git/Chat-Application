const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const config = require('./env');
const {MongoClient} = require('mongodb');
const uri = config.DATABASE_URL;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const cors = require('cors');


const {addUser, removeUser, getUser, getUsersInRoom, getUserByName } = require('./users')

const {InsertMessage, connectDB, searchMessages} = require('./dbMethods')

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(router);
app.use(cors());

var db, col;

io.on('connection', (socket) => {

    //mongo db connection      
    connectDB();
     socket.on('join', ({name,room},callback) => {
        const {error, user} = addUser({id:socket.id, name,room});
        if(error) return callback(error);
        
            //welcome message after joining the chat
        socket.emit('message', {user:'admin', text:`${user.name}, Welcome to the room ${user.room}`});
        socket.broadcast.to(user.room).emit('message', {user:'admin', text: `${user.name}, has joined!`});
        socket.join(user.room);
        io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)});
        callback();
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        
        io.to(user.room).emit('message', {user:user.name, text: message});
        io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)});
        //inserting the chat to mongodb collection
        InsertMessage(user,message);
       
        callback();
    });

    socket.on('searchChat', (searchText, name, callback) => {
        const user = getUserByName(name);
      //  var resItems ;
         searchMessages(searchText,name).then(function(items){
            io.to(user.room).emit('searchResult',{result: items});
            
        }); 

        //var resItems = searchMessages(searchText,name)
      //  console.log(resItems)
        
        
     // io.to(user.room).emit('resItems',{result: resItems})
        callback();
    });

    socket.on('disconnect',()=>{
        const user = removeUser(socket.id);
        if(user){
            io.to(user.room).emit('message', {user:'admin', text: `${user.name} has left`})
        }
        client.close(); //closing mongodb connection
    })
});

app.use(router);

server.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));