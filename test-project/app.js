var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});
users = [];
io.on('connection', function(socket){
  console.log('A user connected');
  socket.on('setUsername', function(data){
    console.log(data);
	
	
    if(data.option =='r' && users.indexOf(data.name) > -1){ // sees if the user nickname is already in the list or not 
      socket.emit('userExists', data + ' username is taken! Try some other username.');
    }
    else{
	if ( data.option== 'r')
      users.push(data.name);
  
	 userid = users.indexOf(data.name);
      socket.emit('userSet', {username: data.name , id: userid });
    }
  });
  
  
  socket.on('room' , function(room){
	  socket.join(room); 
	  console.log('client joined '+room ); 

	  socket.on('pmsg', function(data){
      //Send message to everyone (sockets)
      io.sockets.in(room).emit('pnewmsg', data);
  })
  });
  socket.on('msg', function(data){
      //Send message to everyone (sockets)
      io.sockets.emit('newmsg', data);
  })
  
 
});
http.listen(3000, function(){
  console.log('listening on localhost:3000');
});
