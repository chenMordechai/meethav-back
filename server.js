const express = require('express')
const app = express()

const port = process.env.PORT || 3000;
const http = require('http').createServer(app);
// const io = require('socket.io')(http);

const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const cors = require('cors')
const socketService = require('./services/socket.service.js')


socketService.setup(http);

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(cookieParser());

app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082','http://localhost:8086'],
  credentials: true
}));

app.use(session({
  secret: 'puki muki',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false
  },
}))



const dogRoute = require('./api/dog.route');
app.use('/api/dog', dogRoute)
const googleRoute = require('./api/google.route');
app.use('/api/google', googleRoute)



app.get('/', (req, res) => res.send('Hello World!'))

http.listen(port, () => console.log(`Example app listening on port ${port}!`))