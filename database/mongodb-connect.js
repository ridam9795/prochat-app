//const MongoClient=require('mongodb').MongoClient;
const {MongoClient,ObjectID}=require('mongodb');
MongoClient.connect('mongodb://localhost:27017/prochat',(error,client)=>{
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
    db.collection('users').find({
        Name:'karan Nagar'
    }).toArray().then((docs)=>{
      console.log(docs,undefined,2);
    },(err)=>{
         if(err){
             return console.log('unable to find ',err);
         }
    })
    client.close();
})