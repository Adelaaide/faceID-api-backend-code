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
      connectionString: "postgres://faceidsql_user:xKiMPFXkTqhCOFVO0TZcemv3cNiqaCLd@dpg-cfuqrt5a499aogr0m4b0-a/faceidsql",
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
  const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://faceid.onrender.com');
});
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
