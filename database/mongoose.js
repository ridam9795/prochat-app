const mongoose=require('mongoose');
const validator=require('validator');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');

mongoose.Promise=global.Promise;
//mongoose.connect("mongodb://localhost:27017/prochat",{useNewUrlParser:true});
MONGODB_URI="mongodb://ridam123:<PASSWORD>@prochat-shard-00-00-vulcd.mongodb.net:27017,prochat-shard-00-01-vulcd.mongodb.net:27017,prochat-shard-00-02-vulcd.mongodb.net:27017/test?ssl=true&replicaSet=prochat-shard-0&authSource=admin&retryWrites=true"
mongoose.connect( process.env.MONGODB_URI|| "mongodb://localhost:27017/prochat");
var userSchema=new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        required:true,
        minlength:1,
        unique:true,
        validate:{
            validator:validator.isEmail,
            message:`{{value}} is not valid`
        }

    },
    password:{
         type:String,
         required:true,
         minlength:6,
       
    },
    mob_no:{
        type:Number
    },
    tokens: [{
        access: {
          type: String,
          required: true
        },
        token: {
          type: String,
          required: true
        }
      }]
});

userSchema.methods.generateAuthToken=function(){
    var user =this;
    var access='auth';
    var token=jwt.sign({_id:user._id.toHexString(),access},'abc123').toString();
    user.tokens=user.tokens.concat([{access,token}]);
   return user.save().then(()=>{
        return token;
    })
};

userSchema.methods.removeToken=function(token){
    var user=this;
  return  user.update({
        $pull:{
            tokens:{token}
        }
    })
}
userSchema.statics.findByToken = function (token) {
    var users = this;
    var decoded;
  
    try {
      decoded = jwt.verify(token, 'abc123');
    } catch (e) {
       
        
      return Promise.reject(e);
    }
  
    
  
    return users.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
      });
  };

  userSchema.pre('save',function(next){
      var user=this;
      if(user.isModified('password')){
                  bcrypt.genSalt(10,(error,salt)=>{
                      bcrypt.hash(user.password,salt,(error,hash)=>{
                          user.password=hash;
                          next();
                      })
                  })
      }else{
          next();
      }
  })
var users=mongoose.model('users',userSchema);

// var user=new users({
//   name:'Ridam nagar'
// })
// user.save().then((docs)=>{
// console.log("save",docs);
// },(error)=>{
//     console.log('unable to save');
// })
module.exports={
    mongoose,
    users

}