const express = require ('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const db = require ('./mysql.js');
const app = express();
const port= 2801;

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/', function(req,res){
    res.render('login.ejs');
});

app.post('/authlogin', (req,res)=>{
    var email = req.body.email;
    var password = req.body.password;
    const sql = 'select * from akun where email = ? AND password = ?';
    if (email && password){
        db.query(sql, [email, password], function(err, rows){
            if (err) throw err;
            else if (rows.length > 0){
                req.session.loggedin = true;
                req.session.email = email;
                res.redirect('/home');
            } else{
                res.end('Kredensial anda salah!');
            }
        });
    }
});

app.get('/home', function(req,res){
    res.render('home.ejs');
});

app.listen(port, function(){
    console.log(`Server di ${port}`);
});