import express, { NextFunction } from 'express';
import bodyParser from 'body-parser';
// import session from 'express-session';


const app = express();

// set up body parser to convert json body to js object and attach to req
app.use(bodyParser.json());

// create logging middleware
app.use((req, res, next) => {
  console.log(`request was made with url: ${req.path}
  and method: ${req.method}`);
  next(); // will pass the request on to search for the next piece of middleware
})

// set up express to attach sessions
// has to be before the routers
const sess = {
  secret: 'potato',
  cookie: {secure: false},
  resave: false,
  saveUninitialized: false
}

// app.use(session(sess));


app.listen(3000); 
console.log('application started on port: 3000')