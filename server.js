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




const db = knex({
    client: 'pg',
    connection: {
        host: 'containers-us-west-171.railway.app',
        user: 'postgres',
        password: 'NOh9eSQ8FblV5aEvt8Wo',
        database: 'railway'
    
        
        
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
