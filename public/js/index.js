var socket=io();
//io method is available from above library
//When we call it we are initiating the request,we are making request from client to the server to open up a web socket
//and keep that connection open.
//This creates the connection and it stores the connection in a variable and this variable is critical to communicating.
//It exactly what we need in order to listen for data from server and inorder to send data to the server.
socket.on('connect',function(){
console.log("connected to the server");
// socket.emit('createEmail',{
//     to:"server@gmail.com",
//     from:"client@gmail.com",
//     createdAt:234
// });

});
//acknowledgement funtionality is being added in which server acknowledges the client that the data send by client has been received.
//acknowledgement is done via callback function passed in socket.emit() method 
//listen's for an event
//event listener
socket.on('newMessage',function(message){
    console.log("message received",message);
    var li=jQuery('<li></li>');
    li.text(`${message.from}: ${message.text} ` )
    jQuery('#messages').append(li);
});

socket.on('disconnect',function(){
  console.log("Disconnected from server");
});
// socket.on('newEmail',function(email){
//     console.log("new email",email);
// });
//event listener
//socket.on() is used for listening event
//socket.emit() is used for event.
//both event can be done from either side

jQuery('#message-form').on('submit',function(e){
    e.preventDefault();
    //e=>event;
    //here prevent defaut prvent page reloading on submit of form
    socket.emit('createMessage',{
        from:'User',
        text:jQuery('[name=message]').val()
    },function(){

    })
});
//similar to socket.io it also listens the event and we can also add callback function as above