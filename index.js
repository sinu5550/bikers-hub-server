const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

//midleware

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eht26.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {

    try {
        await client.connect();
        const inventoryCollection = client.db('bikersHub').collection('inventory');

        app.get('/inventory', async (req, res) => {
            const query = {};
            const cursor = inventoryCollection.find(query);
            const inventory = await cursor.toArray();
            res.send(inventory)
        });
    }
    finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('bikers hub running');
});

app.listen(port, () => {
    console.log('listening to port', port);
});