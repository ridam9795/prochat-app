//const MongoClient=require('mongodb').MongoClient;
const {MongoClient,ObjectID}=require('mongodb');
MongoClient.connect('mongodb://localhost:27017/prochat',{ useNewUrlParser: true },(error,client)=>{
    if(error){
        return console.log('Unable to connect to the database');
    }
    console.log('connected to the database');
    const db=client.db('prochat');

//     db.collection('users').insertOne({
//    Name:'Ridam Nagar',
//    Gender:'male'
//     },(error,result)=>{
//         if(error){
//             return console.log('Unable to insert user',error);
//         }
//         console.log(JSON.stringify(result.ops,undefined,2));
//     })
//     db.collection('users').find({
//         Name:'karan Nagar'
//     }).toArray().then((docs)=>{
//       console.log(docs,undefined,2);
//     },(err)=>{
//          if(err){
//              return console.log('unable to find ',err);
//          }
//     })
    // db.collection('users').deleteMany({Name:'Ridam Nagar'}).then((result)=>{
    //             console.log(result.opts,undefined,2);
    // },(error)=>{
    //     if(error){
    //         return console.log('not found');
    //     }
    // })
    db.collection('users').findOneAndDelete({Name:'karan Nagar'},(error,result)=>{
        if(error){
             return console.log('not found',error);
        }
        console.log(result.opts,undefined,2);
    }) 
    db.collection('users').findOneAndUpdate({
        Name:'Ridam Nagar'
    },{
        $rename:{
            Name:'Username'
        }
    },{
        returnOriginal:false
    }).then((result)=>{
        console.log(result);
    })
      
    client.close();
})