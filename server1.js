const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
var db;
var string;
MongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true }, (err, database) => {
    if (err) return console.log(err)
    db = database.db('FootWear')
    app.listen(3030, () => {
        console.log("Listening to port #3030")
    })
})
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))


app.get('/', (req, res) => {
    db.collection('bata').find().toArray((err, result) => {
        if (err) return console.log(err)
        res.render('homepage.ejs', { data: result })
    })
})
app.get('/create', (req, res) => {
    res.render('add.ejs')
})

app.get('/update', (req, res) => {
    res.render('update.ejs')
})

app.get('/delete', (req, res) => {
    res.render('delete.ejs')
})
app.post('/add_data', (req, res) => {
    db.collection('bata').save(req.body, (err, result) => {
        if (err) return console.log(err)
        res.redirect('/')
    })
})
app.post('/update_data', (req, res) => {
    db.collection('bata').find().toArray((err, result) => {
        if (err) return console.log(err)
        for (var i = 0; i < result.length; i++) {
            if (result[i].id == req.body.id) {
                string = result[i].stock
                break
            }
        }
        db.collection('bata').findOneAndUpdate({ id: req.body.id }, {
            $set: { stock: parseInt(string) + parseInt(req.body.stock) }
        }, { sort: { _id: -1 } }
            , (err, result) => {
                if (err) return console.log(err)
            })
    })
    /*db.collection('bata').insertOne({ date: date, product_id: req.body.product_id, quantity: req.body.quantity }, (err, result) => {
        if (err) return console.log(err)
    })*/
    res.redirect('/')
})

app.post('/delete_data', (req, res) => {
    db.collection('bata').findOneAndDelete({ id: req.body.id }, (err, result) => {
        if (err) return console.log(err)
    })
     
    res.redirect('/')
})