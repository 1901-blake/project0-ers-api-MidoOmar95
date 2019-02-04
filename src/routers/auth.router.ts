import express from 'express';
import { unauthorizedError } from '../middleware/error.middleware';
import { UserDAO } from '../dao/userDAO';

const users = new UserDAO();

// static pages
const loginPage = ['Login Page', `<p>Please login</p>
<div id="login">
<form method="post" action="/login">
<p>Username:</p>
<input type="text" name="username" id="username" value="" placeholder="username">
<p>Password: <br/>
<br/>
<input type="password" name="password" id="password" value="" placeholder="password">
<p>&nbsp;</p>
<p><input type="submit" value="Login" class="button2"></p>
</form>
</div>`];
const homePage = ['Home', `<p>Welcome</p>`];

// menus -  contains links not unique to user types
const associateMenu = [
  ['Reimbursements', '/reimbursements']
];
const financeMenu = [
  ['Reimbursements', '/reimbursements'],
  ['Users', '/users']
];
const adminMenu = [
  ['Reimbursements', '/reimbursements'],
  ['Users', '/users']
];

export const authRouter = express.Router();

// response from login form
authRouter.post('/login', (req, res) => {
  let passed = false;
  users.getAllUsers().then(function (result) {
    result.forEach(element => {
      if (req.body.username === element.username && req.body.password === element.password) {
        element.password = '******';
        req.session.user = element;
        passed = true;
      }
    });
    if (passed) {
      res.redirect('/');
    } else {
      console.log('login failed');
      unauthorizedError(req, res);
    }
  });
});

// present login if not logged in
authRouter.get('/', (req, res) => {
  if (req.session.user === undefined) {
    res.status(200).send(pageGenerator(loginPage, ''));
  } else {
    res.status(200).send(pageGenerator(homePage, req.session.user));
  }
});

// redirect to home
authRouter.get('/login', (req, res) => {
  res.redirect('/');
});

authRouter.get('/logout', (req, res) => {
  req.session.destroy(function(err) {
    // cannot access session here
  });
  res.redirect('/');
});

// create page body using template
export function pageGenerator(vars, user) {
  const title = vars[0];
  const body = vars[1];
  let id = '';
  let role = '';
  if (user !== '') {
    role = user.role.role;
    id = user.userId;
  }
  let html = `<html>
  <head>
  <title>Project 0 App - ${title}</title>\
    <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
  <link rel="stylesheet" type="text/css" href="/css/style.css">
  </head>
  <body>
  <div id="main">
  <nav>
  <ul id="menu" >
  `;
  switch (role) {
    case 'Admin':
      html += menuGenerator(adminMenu, id);
      break;
    case 'Finance-Manager':
      html += menuGenerator(financeMenu, id);
      break;
    case 'Associate':
      html += menuGenerator(associateMenu, id);
      break;
    default:
      break;
  }
  html += `</ul>
  </nav>
  <div id="primary">
  ${body}
  </body>
  </html>`;
  return html;
}

// create page menu based on user role
function menuGenerator(items, id) {
  let menu = ``;
  menu += `<li><a href="/">Home</a></li>`;
  items.forEach(element => {
    menu += `<li><a href="${element[1]}">${element[0]}</a></li>`;
  });
  if (id !== '') {
    menu += `<li><a href="/users/${id}">Profile</a></li>`;
    menu += `<li><a href="/logout">Logout</a></li>`;
  }
  return menu;
}