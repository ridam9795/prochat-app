const express=require('express');
const {mongoose}=require('D:/Nodejs/prochat-app/database/mongoose.js');
const {users}=require('D:/Nodejs/prochat-app/database/mongoose.js');
const {user}=require('D:/Nodejs/prochat-app/database/mongoose.js');
const hbs=require('hbs');
const bodyParser=require('body-parser'); 
const app=express();
const lodash=require('lodash');
const bcrypt=require('bcryptjs');
const nodemailer=require('nodemailer');
var {authenticate}=require('D:/Nodejs/prochat-app/middleware/authenticate.js');
const os=require('os');
const port=process.env.PORT || 3000;
app.set('view engine','hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended:false}))

app.get('/',(req,res)=>{


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

app.post('/',(req,res)=>{
      var body=lodash.pick(req.body,['email','password','name'])
     
    var user=new users(body);
    console.log(body);
    user.save().then((user)=>{
        console.log(os.hostname());
        let transporter = nodemailer.createTransport({
            host:'mail.traversymedia.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            Oauth: {
                user: 'ridamnagar11@gmail.com', // generated ethereal user
                pass: 'g8bhaiya'  // generated ethereal password
            },
            tls:{
              rejectUnauthorized:false
            }
          });
        
          // setup email data with unicode symbols
          let mailOptions = {
              from: '"Nodemailer Contact" <ridamnagar11@gmail.com>', // sender address
              to: 'rishabhn417@gmail.com', // list of receivers
              subject: 'Node Contact Request', // Subject line
              text: 'Hello world?', // plain text body
             // html: output // html body
          };
        
          // send mail with defined transport object
          transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                  return console.log(error);
              }
              console.log('Message sent: %s', info.messageId);   
              console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        
              res.render('contact', {msg:'Email has been sent'});
          });
        return user.generateAuthToken();
       
    }).then((token)=>{

               res.header('x-auth',token).render('home.hbs',{
                name:"Hey"+user.name+" you have successfully",
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
           console.log("heyyyyyyyyyyyyyyyyyyyyyyyyy");
           console.log();
           console.log(error);
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
        name:"Hey"+user.name+" you have successfully",
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
        name:"Hey"+user.name+" you have successfully",
        type:"logged out"
    })
 },(e)=>{
     console.log("error in loading page");
     console.log(e);
     res.status(400).send(e);
 })
})
app.get('/chat',(req,res)=>{
   // res.send("Home page");
   res.render('home.hbs',{
       title:"ProChat",
       Login:"Login"

   });

});

app.listen(port,()=>{
    console.log(`server is up on the port ${port}`);
})