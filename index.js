const express = require("express");
const app =express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

//middleware

app.use(cors())
app.use(express.json())





const uri = process.env.DB_URI

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    //database collection
    const allapartrment = client.db('finaleffort').collection('allaprtment')
    const allagreement = client.db('finaleffort').collection('allagreement')
    const allUser = client.db('finaleffort').collection('users')
    const anounce = client.db('finaleffort').collection('anounce')
   
    // anouncement

  app.post('/anounce', async(req,res)=>{
    const anouncement = req.body
    const result = await anounce.insertOne(anouncement)
    res.send(result)
  })

  app.get('/anounce', async(req,res)=>{
    const result = await anounce.find().toArray()
    res.send(result)
  })

    //get all apartment Info
    app.get('/allapartment', async(req,res)=>{
        const result = await allapartrment.find().toArray()
        res.send(result)
    })

    //send agreement & user data to the database
    app.post('/allagreement', async(req,res)=>{
        const agreementData = req.body
        const result = await allagreement.insertOne(agreementData)
        res.send(result)
    })

    //post & manage all user
    app.post('/users',async(req,res)=>{
      const user = req.body
      const query = {email: user.email}
      const exist = await allUser.findOne(query)
      if (exist) {
        return res.send({ message: 'user already exists', insertedId: null })
      }
      const result = await allUser.insertOne(user)
      res.send(result)
    })

    app.get('/users', async(req,res)=>{
      const result = await allUser.find().toArray()
      res.send(result)
    })

    // member & user api
    app.get('/user/member/:email', async(req,res)=>{
      const email = req.params.email
      const query = {email: email}
      const user = await allUser.findOne(query)
      let member = false
      if (user) {
        member = user.role === 'member'
      }
      res.send({member})
    })
    app.get('/user/admin/:email', async(req,res)=>{
      const email = req.params.email
      const query = {email: email}
      const user = await allUser.findOne(query)
      let admin = false
      if (user) {
        admin = user.role === 'admin'
      }
      res.send({admin})
    })

    app.patch('/user/member', async(req,res)=>{
      const id = req.query.id
      const filter = {_id: new ObjectId(id)}
      const updatedDoc = {
        $set:{
          role: 'user'
        }
      }
      const result = await allUser.updateOne(filter, updatedDoc)
      res.send(result)
    })


    app.put('/user/:email', async(req,res)=>{
      const email = req.params.email
      const filter = {email: email}
      // const options = {upsert: true }
      const updatedDoc = {
        $set:{
          role: 'member'
        }
      }
      const result = await allUser.updateOne(filter,updatedDoc)
      res.send(result)
    })

    //received agreemnet & user data
    app.get('/allagreeuser', async(req,res)=>{
        const result = await allagreement.find().toArray()
        res.send(result)
    })
    app.patch('/allagreeuser/:id', async(req,res)=>{
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const updatedDoc = {
        $set: {
          status: 'checked'
        }
      }
      const result = await allagreement.updateOne(filter, updatedDoc)
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req,res)=>{
    res.send("Running");
})

app.listen(port, ()=>{
    console.log(`Running on port ${port}`);
})