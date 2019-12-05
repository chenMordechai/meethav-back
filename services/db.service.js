const MongoClient = require('mongodb').MongoClient;

module.exports = {
    connect,
    getCollection
}

// Connection URL
// const url = (process.env.NODE_ENV === 'production')? 
// 'mongodb+srv://chen:eLriNHFsEHNy87k@cluster0-xnd7v.mongodb.net/test?retryWrites=true&w=majority'
//     : 'mongodb://localhost:27017';


// const url = 'mongodb+srv://idan:saribeni12@cluster0-cquxv.mongodb.net/test?retryWrites=true&w=majority';

const url ='mongodb+srv://chen:eLrjNHFsEHNy87k@cluster0-xnd7v.mongodb.net/test?retryWrites=true&w=majority'


// Database Name
const dbName = 'dogs';

var dbConn = null;

async function connect() {
    if (dbConn) return dbConn;
    try {
        const client = await MongoClient.connect(url, { useNewUrlParser: true });
        const db = client.db(dbName);
        // console.log(db);

        dbConn = db;
        return db;
    } catch (err) {
        console.log('Cannot Connect to DB', err)
        throw err;
    }
}

async function getCollection(collectionName) {
    const db = await connect()

    var colaction = db.collection(collectionName);
    return colaction
}