const users=require('../../database/mongoose.js')
const $myEmail=document.querySelector('#myEmail');
users.find().then((User)=>{
    
    for (let [index, val] of User.entries()) {
        // your code goes here 
        console.log(val.email);   
       $myEmail.innerHTML=val.email
        
     
}

});



   
