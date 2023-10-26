const express = require("express")
const http = require("http")
const cors = require("cors")
const {Server} = require("socket.io")
const { Socket } = require("dgram")

const app = express()

app.use(cors())

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"]
    }
})

io.on("connection", (socket)=>{
    console.log(`User actual: ${socket.id}`);

    socket.on("join_room",(data)=>{
        socket.join(data)
        console.log(`User id: ${socket.id} in room ${data}`);
    })
    socket.on("send_message",(data)=>{
        socket.to(data.room).emit("receive_message",data)
    })

    socket.on("disconnect",()=>{
        console.log("User Disconnect",socket.id);
    })
})

server.listen(3001,()=>{
    console.log('SERVER ON');
})