const config = require('./env');
const {MongoClient} = require('mongodb');
const uri = config.DATABASE_URL;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
var db, collection;

function connectDB(){
    client.connect()
.then(()=> {
    console.log("Connected correctly to server");
    //use the database chatdb
     db = client.db("chatdb");
    // Use the collection "chats"
     collection = db.collection("chats");
    })
    .catch((err) => {
        console.log('Connection issue: '+err)
    })
}

function InsertMessage(user,message) {    

    //inserting the chat to mongodb collection
    collection.insertOne({
        email: user.name,
        message: message,
        datetime: new Date(),
        room: user.room
    })

    .catch((err) => {
        console.log('Insert issue: '+err)
    })
}


async function searchMessages(searchText,name) {
      
        //retrieving the chat from mongodb collection
     return await collection.find({email:name, message:/.*searchText.*/}).toArray()
       .then(function(items) {
         //  console.log(items);
           return items;
       })
    
        
    }
module.exports = {InsertMessage, connectDB, searchMessages};