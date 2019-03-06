



const $messageForm=document.querySelector('#message-form')
console.log($messageForm)
const $messageFormInput=$messageForm.querySelector('input')
const $messageFormButton=$messageForm.querySelector('button')
const $locationButton=document.querySelector('#send-location');
const $messages = document.querySelector('#messages')





   

var socket=io();

//io method is available from above library
//When we call it we are initiating the request,we are making request from client to the server to open up a web socket
//and keep that connection open.
//This creates the connection and it stores the connection in a variable and this variable is critical to communicating.
//It exactly what we need in order to listen for data from server and inorder to send data to the server.
const messageTemplate = document.querySelector('#message-template').innerHTML
//const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML


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
    var user=jQuery('<b></b>')
    var li=jQuery('<p></p>');
    var sub=jQuery('<p></p><br>')
    user.text(` ${message.from}  ${moment(message.createdAt).format('h:mm a')}`)
   
    li.text(` ${message.text} ` )
    jQuery('#messages').append(user).append(li);
});
socket.on('newLocationMessage',function(message){
    var li=jQuery('<b></b><br>');
    var a=jQuery('<a target="_blank">My current Location</a><br>')
    li.text(` ${message.from} ${moment(message.createdAt).format('h:mm a')}`);
    a.attr('href',message.url);
    
    jQuery('#messages').append(li).append(a);

})
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

$messageForm.addEventListener('submit',function(e){
    e.preventDefault();
    $messageFormButton.setAttribute('disabled','disabled')
    

    //e=>event;
    //here prevent defaut prvent page reloading on submit of form
    socket.emit('createMessage',{
        from:'User',
        text:jQuery('[name=message]').val()
    },(error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }

        console.log('Message delivered!')
    })
});
//similar to socket.io it also listens the event and we can also add callback function as above
var locationButton=jQuery('#send-location');
document.querySelector('#send-location').addEventListener('click',function(){
      $locationButton.setAttribute('disabled','disabled')
      if(!navigator.geolocation){
          return alert("Geolocation not supported by your browser");
      }
      navigator.geolocation.getCurrentPosition(function(position){
          socket.emit('createLocationMessage',{
              latitude:position.coords.latitude,
              longitude:position.coords.longitude,
          },()=>{
            $locationButton.removeAttribute('disabled');
          })
              console.log(position);
      },()=>{
        
          alert("unable to fetch location");
      })
});