const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');
const register  = require('./controllers/register');
const signin  = require('./controllers/signin');
const profile  = require('./controllers/profile');
const rank = require('./controllers/rank');


const db = knex ({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'daniela.grey',
      password : 'Daniel1304',
      database : 'face-app'
    }
  });

  db.select('*').from('users').then( data => {
    console.log(data);
  });
  

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => { res.send('it is working') })
app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)})
    //2nd thing: Register new users by adding their details to our database.
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})
    //3rd thing: create user specific IDs
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})
    //Finally, to get each user's ranks for posting an image surmised, we do:
app.put('/rank', (req, res) => {rank.handleRank(req, res, db)})
app.post('/rankurl', (req, res) => {rank.handleApiCall(req, res)})


app.listen(process.env.PORT || 3008, () => {
    console.log(`app is running fine on port ${process.env.PORT}`)
})


/**
 *  --> res = this is working 
 this is the root route that responds with this is working 
 * signin --> POST = success/fail
 this is sign in which will be post request of user information, responding with either success/fail
 * register --> POST = user
we have a resgister which will add the new user information to our database, this will return the new created user object.
 * profile/:userID --> GET = user
this a user detail that is specific to each user.
 * ranks/image point --> PUT --> user 
this keeps a record of each user number
 */
