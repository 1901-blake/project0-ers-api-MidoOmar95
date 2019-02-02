import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import { authRouter } from './routers/auth.router';
import { userRouter } from './routers/user.router';
import { reimbursementRouter } from './routers/reimbursement.router';
import { notFound, internalError } from './middleware/error.middleware';

const methodOverride = require('method-override');

const app = express();
app.use('/', express.static(__dirname + '/views/'));

// set up body parser to convert json body to js object and attach to req
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// change method to patch when needed.
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

// create logging middleware
app.use((req, res, next) => {
  console.log(`request was made with url: ${req.path}
  and method: ${req.method}`);
  next(); // will pass the request on to search for the next piece of middleware
});

// set up express to attach sessions
const sess = {
  secret: '12345678',
  cookie: { secure: false },
  resave: false,
  saveUninitialized: false
};

// create session
app.use(session(sess));

// routers
app.use('/', authRouter);
app.use('/users', userRouter);
app.use('/reimbursements', reimbursementRouter);


app.listen(3000);
console.log(`application started on port: ${3000}`);