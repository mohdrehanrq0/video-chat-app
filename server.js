const express = require('express');
const app = express();
const server = require('http').createServer(app);
const dotenv = require('dotenv');
const cors = require('cors');
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST'],
    }
});

app.use(cors());


dotenv.config({path:'config.env'});


app.get('/', function(req, res){
    res.send('Backend server is running..');
});

io.on('connection', (socket) => {

    socket.emit('me', socket.id);

    // console.log(socket.id); 

    socket.on('disconnect', () => {
        socket.broadcast.emit('callEnded')
    });

    socket.on('callUser', ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit('callUser', { signal: signalData, from, name});
    })

    socket.on('callAnswer', (data) => {
        io.to(data.to).emit('callaccepted', data.signal);
    })

});


server.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on ${process.env.PORT || 3000}`);
})


