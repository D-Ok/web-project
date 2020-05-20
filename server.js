let http = require('http');
let path = require('path');
let express = require('express');
const nodemailer = require('nodemailer');
let ejs = require('ejs');
var fs=require('fs');
let server=express();


var bodyParser = require('body-parser');
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.set('view engine', 'ejs');

server.listen(8888);
console.log('Server is running on port 8888');

server.use(express.static(__dirname));
let enLen = false;

var config=JSON.parse(fs.readFileSync('config.json', 'utf8'));


server.get('/', function(req, res){
    let id = req.query.client;
    if(id!=null && id!==undefined){
        updateCli(id);
        let r = getAllUsers();
        console.log(r);
    }

    res.render('main', {
        color: config.mainColor,
        domain: config.domainName
    });
});

console.log(config);
server.get('/img', function (req, res) {
    res.set({'Content-Type': 'image/png'});
    fs.readFile(config.image, function(err, data) {
        if (err) throw err;
        res.send(data.toString('base64'));
    })
});

server.post('/', async function(req, res){
    let f = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        note: req.body.note
    };
    let i = await addNewUser(f.name, f.email, f.phone, f.note, false);
    console.log(i._id);
    sendEmail(f.email, i._id);
    res.render('main',{
        color: config.mainColor,
        domain: config.domainName
    });
});

server.get('/en', async function(req, res){
    var data=fs.readFileSync('lang/en.json', 'utf8');
    res.send(data);
});

server.get('/ukr', async function(req, res){
    var data=fs.readFileSync('lang/ukr.json', 'utf8');
    res.send(data);
});

server.get('/getBooks', async function(req, res){
    let r = await getAllBooks();
    res.send(r);
});

server.get('/admin', async function(req, res){
    let r = await getAllUsers();
    res.render("admin", {
        users: r
    });
});

server.post('/addUser', async function(req, res){
    let f = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        note: req.body.note
    };
    console.log(f);
    //res.send();
});

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'oliinyk.daryna@gmail.com',
        pass: 'mongotest141'
    }
});
var hostName = require('os').hostname();


function sendEmail(to, id) {
    var link = "http://localhost:8888?client="+id;
    let mailOptions ={
        from: 'oliinyk.daryna@gmail.com"',
        to: to,
        subject: "Підтверження заявки",
        html: "<p>Будь ласка, перейдіть за посиланням: " +
            "<a href="+link+">http://mycoolsite</a></p>"
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            console.log(err);
        else
            console.log(info);
        transporter.close();
    });
}


var mongoClient = require("mongodb").MongoClient;

async function addNewBook(header, author, details, headerEn, autorEn, detailsEn){
    let newBook = {header: header, author: author, details: details, headerEn: headerEn,
        autorEn: autorEn, detailsEn: detailsEn};
    return await addNew(newBook, "books");
}

async function getAllBooks() {
    return await getAll("books");
}

function deleteBook(id){
    deleteById(id, "books");
}

var ObjectID = require('mongodb').ObjectID;

async function addNewUser(name, email, phone, comment, registred){
    let newUser = {name: name, email: email, phone: phone, comment: comment, registred: registred};
    return await addNew(newUser, "users");
}

async function getAllUsers() {
    return await getAll("users");
}

function deleteUser(id){
    deleteById(id, "users");
}

function addNew(newObj, tableName){
    return new Promise((resolve, reject) => {
        mongoClient.connect("mongodb://localhost:27017", function(err, client) {
            if (err) return console.log(err);

            const db = client.db("blog");
            db.collection(tableName).insertOne(newObj, function (err, results) {
                client.close();
                console.log("added");
                resolve(newObj);
            });
        });
    });
}


function deleteById(id, tableName){
    return new Promise((resolve, reject)=>{
        mongoClient.connect("mongodb://localhost:27017", function (err, client) {

            if (err) return console.log(err);
            const db = client.db("blog");
            let myq = {_id: ObjectID(id)};
            console.log(myq);
            db.collection(tableName).deleteOne(myq, function (err, result) {
                if (err) throw err;
                console.log("1 book deleted");
                client.close();
                resolve(true);
            });

        });
    });
}

function getAll(tableName) {
    return new Promise((resolve, reject) => {
        mongoClient.connect("mongodb://localhost:27017", function (err, client) {

            if (err) return console.log(err);
            const db = client.db("blog");
            db.collection(tableName).find().toArray(function (err, result) {
                resolve(result);
            });

        });
    });
}

function updateCli(id) {
    return new Promise((resolve, reject) => {
        mongoClient.connect("mongodb://localhost:27017", function (err, client) {

            if (err) return console.log(err);
            const db = client.db("blog");
            var myq = {_id: ObjectID(id)};
            var newvalues = {$set: {registred: true}};
            console.log(myq);
            db.collection("users").updateOne(myq, newvalues, function (err, res) {
                if (err) throw err;
                console.log(res.result.nModified + " document(s) updated");
                resolve(res);
            });

        });
    });
}

//check();
async function check() {
    r = await getAllUsers();
    console.log(r);
    for(let i =0; i<r.length; i++){
        deleteUser(r[i]._id);
    }
}