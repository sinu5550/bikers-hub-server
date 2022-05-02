const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const inventory = await inventoryCollection.findOne(query);
            res.send(inventory);
        })

        // ================================ POST ============================

        app.post('/inventory', async (req, res) => {
            const newInventory = req.body;
            console.log(newInventory);
            if (!newInventory.productName || !newInventory.price || !newInventory.supplier || !newInventory.quantity || !newInventory.description || !newInventory.img) {
                return res.send({ success: false, error: "Please provide all information" });
            }
            result = await inventoryCollection.insertOne(newInventory);
            res.send({ success: true, message: `Successfully addeded item: ${newInventory.productName}` });
        });

        // =========================== DELETE =====================
        app.delete('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await inventoryCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally { }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('bikers hub running');
});

app.listen(port, () => {
    console.log('listening to port', port);
});