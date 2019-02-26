var socket=io();
//io method is available from above library
//When we call it we are initiating the request,we are making request from client to the server to open up a web socket
//and keep that connection open.
//This creates the connection and it stores the connection in a variable and this variable is critical to communicating.
//It exactly what we need in order to listen for data from server and inorder to send data to the server.
socket.on('connect',function(){
console.log("connected to the server");
socket.emit('createEmail',{
    to:"server@gmail.com",
    from:"client@gmail.com",
    createdAt:234
});
socket.emit('createMessage',{
    from:"b@gmail.com",
    text:"fine ,how about you?"
})
});
//listen's for an event
//event listener

socket.on('disconnect',function(){
  console.log("Disconnected from server");
});
socket.on('newEmail',function(email){
    console.log("new email",email);
});
//event listener
//socket.on() is used for listening event
//socket.emit() is used for event.
//both event can be done from either side
socket.on('newMessage',function(message){
    console.log("message received",message);
})