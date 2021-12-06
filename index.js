const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000

//Middlewar

app.use(cors());
app.use(express.json());

app.get('/',(req,res) => {
    res.send('my node server onup')
})
app.listen(port,()=>{
    console.log('port count no:',port);
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8ncjb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri)
async function run(){
    try{
        await client.connect();
        const database = client.db('tour');
        const serviceCollection = database.collection('service');
        const orderCollection = database.collection('order');

        //Get product api
        app.get('/services',async(req,res) =>{
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })
        //Get product api
        app.get('/orders',async(req,res) =>{
            const cursor = orderCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })
        
        //Get order api
        app.get('/myorders',async(req,res) =>{
          const email = req.query.email;
          const query = {email:email}
          const cursor = orderCollection.find(query);
          const services = await cursor.toArray();
          res.send(services)
      })
        
      //post data
      app.post('/services',async(req,res) =>{
        const services = req.body;
        const result = await serviceCollection.insertOne(services);
        console.log('hitting the post',req.body);
        res.json(result)
      })

      //delete api
      app.delete('/orders/:id',async(req,res) =>{
        const id=req.params.id;
        const query = {_id:ObjectId(id)};
        const result = await orderCollection.deleteOne(query);
        console.log('delete the id',result);
        res.json(result)
      })

      //order colletion api
      app.post('/orders',async(req,res) =>{
        const oder=req.body;
        const result = await orderCollection.insertOne(oder);
        console.log('order',result);
        res.json(result)
      })
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);