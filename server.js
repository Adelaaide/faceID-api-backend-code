const express = require('express');
const cors = require('cors');
// const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');
const register  = require('./controllers/register');
const signin  = require('./controllers/signin');
const profile  = require('./controllers/profile');
const rank = require('./controllers/rank');
const PORT = process.env.PORT || 3008;
const { Client } = require('pg');

const db = new Client ({
      connectionString: "postgresql://postgres:NOh9eSQ8FblV5aEvt8Wo@containers-us-west-171.railway.app:5662/railway",
      ssl: {
          rejectUnauthorized: false
        }
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
  

  const app = express();
  const whitelist = ["http://localhost:3000", 'https://faceid.onrender.com' ]
  const corsOptions = {
      origin: function(origin, callback) {
          if(!origin || whitelist.indexOf(origin) !== -1) {
              callback(null, true)
          } else {
              callback(new Error("Not Allowed by CORS"))
          }
      },
      credentials: true,
  }
  
  app.use(express.json());
  app.use(cors(corsOptions));

app.get('/', (req, res) => { res.send('it is working') })
app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)})
    //2nd thing: Register new users by adding their details to our database.
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})
    //3rd thing: create user specific IDs
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})
    //Finally, to get each user's ranks for posting an image surmised, we do:
app.put('/rank', (req, res) => {rank.handleRank(req, res, db)})
app.post('/rankurl', (req, res) => {rank.handleApiCall(req, res)})


// your code

app.listen(PORT || 3008, () => {
  console.log(`server started on port ${PORT}`);
});
