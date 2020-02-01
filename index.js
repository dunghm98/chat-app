var express = require('express');
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views","./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(process.env.PORT || 3000, () => console.log('run server'));


var listUsers = [];

io.on("connection", (socket) => {
    console.log("Co nguoi ket noi: " +socket.id);
    
    socket.on("client-send-username",(data) => {
        console.log(data + " has login");
        if(listUsers.indexOf(data)>=0){
            // dki that bat
            socket.emit("server-send-failed-res");
        } else {
            // dki thanh cong
            listUsers.push(data);
            socket.userName = data;
            socket.emit("server-send-success-res",data);
            // notify for all people
            io.sockets.emit("server-send-list-users", listUsers);
        }
        // io.sockets.emit("Server-send-data", data+"hihi");
        socket.broadcast.emit("Server-send-data", data+"has login ")
    });
    socket.on("logout",()=>{
        console.log("loutouttt");
        let index = listUsers.indexOf(socket.userName);
        listUsers.splice(index,1);
        console.log(listUsers);
        
        socket.broadcast.emit("server-send-list-users", listUsers);
    });
    // listen to message
    socket.on("user-send-message", (message =>{
        io.sockets.emit("server-send-message", {
            user: socket.userName,
            text: message
        })
    }));
    socket.on("user-typing", () =>{
        console.log( socket.userName + ' are typing...');
        let indicator = socket.userName + " is typing";
        socket.broadcast.emit("user-typing", indicator);
    });
    socket.on("user-end-typing", () =>{
        console.log( socket.userName + ' end typing...');
        socket.broadcast.emit("user-end-typing");
    })
})

app.get('/', (req,res) => {
    res.render("home");
})
