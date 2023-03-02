const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const  cors = require('cors')
const knex = require('knex');
const register = require('./controllers/register.controller');
const signin = require('./controllers/signin.controller');
const profile = require('./controllers/profile.controller');
const {handleImage, handleApiCall} = require('./controllers/image.controller');
require('dotenv').config();
//const db = require('./config/config');

// const db = knex ({
//       connectionString: "postgresql://postgres:NOh9eSQ8FblV5aEvt8Wo@containers-us-west-171.railway.app:5662/railway",
//       ssl: true
//    });

const { Client } = require('pg');

const db = new Client ({
      connectionString: "postgresql://postgres:NOh9eSQ8FblV5aEvt8Wo@containers-us-west-171.railway.app:5662/railway",
      ssl: true
   });

db.connect((err) => {
    if (err) {
       console.error('Failed to connect to database', err);
    } else {
        console.log('Connected to database');
        db.query('SELECT * FROM users JOIN login ON users.id = login.user_id', (err, res) => {
            if (err) {
               console.error('Failed to execute query', err);
            } else {
                console.log(res.rows);
            }
        });
    }
});


const port = process.env.PORT || 4000;
const app = express();
app.use(bodyParser.json());
app.use(cors());


app.get('/',(req,res) => {
    res.send('success');
});

app.post('/signin',signin.handleSigin( db, bcrypt));

app.post('/register',register.handleRegister( db, bcrypt));

app.get('/profile/:id',profile.handleProfile(db));
app.put('/image',handleImage(db));
app.post('/imageurl',(req,res) => {handleApiCall(req, res)});


app.listen(port, () => {
    console.log(`app is runnin on port ${port}`);
});
