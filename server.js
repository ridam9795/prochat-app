const express=require('express');
const {mongoose}=require('./database/mongoose.js');
const {users}=require('./database/mongoose.js');
const {user}=require('./database/mongoose.js');
const hbs=require('hbs');
const bodyParser=require('body-parser'); 
const app=express();
const lodash=require('lodash');
const bcrypt=require('bcryptjs');
const nodemailer=require('nodemailer');
var {authenticate}=require('./middleware/authenticate.js');
const os=require('os');
const port=process.env.PORT || 3000;
const http=require("http");
//this is built in module
const socketIO=require("socket.io");

var server=http.createServer(app);
//happens at the backside but this time we are using it here.
var io=socketIO(server);
//we have access to the server via server variable passed in as argument.
//socketIO(server) return a websocket server.
//here we can do what we want in terms emitting or listening to event
io.on('connection' ,(socket)=>{
console.log("new user connected");
socket.on('disconnect',()=>{
    console.log("user was disconnected");
})
});
//io.on let's you register an event listener,we can listen for specific event and do something when that event happens
//we will be using one built in event called connection as an argument.This let's you listen for new connection and do something 
//when that connection comes in.Inorder to do something we provide a callback function which is called with socket argument.
// 

app.set('view engine','hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended:false}))




app.get('/registration',(req,res)=>{


    res.render('registration.hbs',{
        Login:"Login",
        exist:"",
        head:"Registration",
        name:"name",
        email:"email Id",
        password:"Create Password",
        mob_no:"Mob _no."
    });
   
    


})

app.post('/registration',(req,res)=>{
      var body=lodash.pick(req.body,['email','password','name'])
     
    var user=new users(body);
    console.log(body);
    user.save().then((user)=>{
    
       
        return user.generateAuthToken();
       
    }).then((token)=>{
               
               res.header('x-auth',token).render('home.hbs',{
                name:"Hey "+user.name+" you have successfully",
                Login:"login",
                type:"registered"
            });


          
    }).catch((e)=>{
        if(user.password.length<6){
            message="password length must be greater then 6"
        }else{
            message=""
        }
        if(e.errmsg){
            exists="User Already exists"
        }else{
            exists=""
        }
        
      
        
            res.render('registration.hbs',{
                Login:"Login",

        passlength:message,
        exist:exists,
        head:"Registration",
        name:"name",
        email:"email Id",
        password:"Create Password",
        mob_no:"Mob _no."
    });
    })
})



app.get('/login',(req,res)=>{
    res.render('login.hbs',{
        Login:"Login",

        head:"Login",
        email:'Email_Id',
        password:'Password'
    })
})
app.post('/login',(req,res)=>{
    var body=lodash.pick(req.body,['email','password']);
    
    users.findOne({
        email:body.email,
        
    }).then((user)=>{
       var userToken=user.tokens[0].token;
       var hashedpassword=user.password;
       console.log(hashedpassword);
       console.log(body.password);
       bcrypt.compare(body.password,hashedpassword,(error,result)=>{
          
           if(result==true){
        
            getToken(userToken);
           }
           else if(result==false || error){
               console.log("wrong password");
            res.render('login.hbs',{
                Login:"Login",
                head:"Login",
                email:'Email_Id',
                password:'Password',
                message:"Invalid Password"
            }) 
           }
       })
       
       
            
    }).catch((e)=>{
        console.log("e:"+e);
        res.render('login.hbs',{
            Login:"Login",

            head:"Login",
            email:'Email_Id',
            password:'Password',
            message:"Plese register first"
        })  
        
    })
      
    
    function getToken(userToken){
        
    
 console.log("body-token",body.email);
   // var token = req.header('x-auth');
  users.findByToken(userToken).then((user)=>{
      console.log("user-token:",userToken+"user:",user);
      if(!user){
        console.log("token:",token);
        console.log(user);
          
           return Promise.reject();
      }
      
      res.render('home.hbs',{
        link1:"link1",
        link2:"link2",
        link3:"link3",
        loggedin:user.email,
        Login:"Logout",
        name:"Hey "+user.name+" you have successfully",
        type:"logged in"
    })
      console.log("user:"+user);
       }).catch((e)=>{
           console.log(e);
           res.send("Unautherized access");
       })
    }
});
app.delete('/logout',authenticate,(req,res)=>{
 req.user.removeToken(req.token).then(()=>{
     console.log("loaded successfully");
    res.render('home.hbs',{
        Login:"Login",
        name:"Hey "+user.name+" you have successfully",
        type:"logged out"
    })
 },(e)=>{
     console.log("error in loading page");
     console.log(e);
     res.status(400).send(e);
 })
})
app.get('/',(req,res)=>{
   // res.send("Home page");
   res.render('home.hbs',{
       title:"ProChat",
       Login:"Login"

   });

});

server.listen(port,()=>{
    console.log(`server is up on the port ${port}`);
})
//earlier i used app.listen() which on backside call server.listen() by passing app as an argument in createServer() method 
//called by http. 


















