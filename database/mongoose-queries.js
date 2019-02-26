const {mongoose}=require('./mongoose.js');
const {ObjectID}=require('mongodb');

const {users}=require('./mongoose.js');
_id="5c39661e63229548342d67"
if(!ObjectID.isValid(_id)){
    console.log("not valid  ID");
}else{
    users.find({
        _id:ObjectID(_id)
    }).then((user)=>{
         console.log(user);
    });
}

// users.remove({
//     name:"Vimal nagar"
// }).then((user)=>{
//        console.log(user);
// })