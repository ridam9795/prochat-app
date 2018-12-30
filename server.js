const express=require('express');
const hbs=require('hbs');
var app=express();
app.set('view engine','hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(__dirname + '/public'));
app.get('/',(req,res)=>{
   // res.send("Registration form");
    res.render('registration.hbs',{
        head:"Registration",
        name:"Userame",
        email:"email Id",
        password:"Create Password",
        mob_no:"Mob _no."
    });
   
})
app.get('/login',(req,res)=>{
    res.render('login.hbs',{
        head:"Login",
        email:'Email_Id',
        password:'Password'
    })
})
app.get('/chat',(req,res)=>{
   // res.send("Home page");
   res.render('home.hbs',{
       title:"Welcome to the chatting world"
   });

});

app.listen(3000,()=>{
    console.log(`server is up on the port 3000`);
})