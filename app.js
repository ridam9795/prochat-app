const express=require('express');
const hbs=require('hbs');
var app=express();
app.set('view engine','hbs');
app.use(express.static(--__dirname + '/public'));
app.get('/',(req,res)=>{
   // res.send("Home page");
   res.render('home.hbs',{
       title:"Welcome to the chatting world"
   });

});
app.get('/registration',(req,res)=>{
    res.send("Registration form");
})
app.listen(3000,()=>{
    "server is up on the port"
})