const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
var db;
var string;
MongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true }, (err, database) => {
    if (err) return console.log(err)
    db = database.db('BOOKS')
    app.listen(3030, () => {
        console.log("Listening to port #3030")
    })
})
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))


app.get('/', (req, res) => {
    db.collection('BOOKS').find().toArray((err, result) => {
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
    check=true
    db.collection('BOOKS').find().toArray((err, result) => {
        if (err) return console.log(err)
        for (var i = 0; i < result.length; i++) {
            if (result[i].id == req.body.id) {
                check=false
                return alert("already exised book")
            }
        }
    })
    if(check){
    db.collection('BOOKS').save(req.body, (err, result) => {
        if (err) return console.log(err)
        res.redirect('/')
    })
    }
})
app.post('/update_data', (req, res) => {
    db.collection('BOOKS').find().toArray((err, result) => {
        if (err) return console.log(err)
        for (var i = 0; i < result.length; i++) {
            if (result[i].id == req.body.id) {
                string = result[i].stock
                break
            }
        }
        db.collection('BOOKS').findOneAndUpdate({ id: req.body.id }, {
            $set: { stock: parseInt(string) + parseInt(req.body.stock) }
        }, { sort: { _id: -1 } }
            , (err, result) => {
                if (err) return console.log(err)
            })
    })
    res.redirect('/')
})

app.post('/delete_data', (req, res) => {
    db.collection('BOOKS').findOneAndDelete({ id: req.body.id }, (err, result) => {
        if (err) return console.log(err)
    })
     
    res.redirect('/')
})