const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const app = express();
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));
const PORT = 8080;
let urlLength = 6;

//Create shortURL string
function generateRandomString() {
  let result = "";
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  
  for (let i = 0; i < urlLength; i++) {
    result += characters[Math.floor(characters.length * Math.random())];
  }

  if (urlDatabase[result]) {
    generateRandomString();
  }

  return result;
}

//Check email
function checkEmail(email) {
  for (let user in users) {
    if (users[user]['email'] === email) {
      return true;
    }
  }

  return false;
}

//Check email
function findUserID(email) {
  for (let userID in users) {
    if (users[userID]['email'] === email) {
      return userID;
    }
  }
}

//Check for all shortURLs created by a user
function urlsForUser(id) {
  let urlsOfUser = {};

  for (let url in urlDatabase) {
    if (urlDatabase[url]['userID'] === id) {
      urlsOfUser[url] = urlDatabase[url];
    }
  }

  return urlsOfUser;
}

//Object to store all URLs
const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "kImfn"},
  "9sm5xK": { longURL: "http://www.google.com", userID: "kImfn"}
};

//Object to store all Users
const users = {
  "kImfn": {
    id: "kImfn",
    email: "brian@test.test",
    password: bcrypt.hashSync('test123', 10)
  }
};

//bodyParser
app.use(bodyParser.urlencoded({extended: true}));

//-----SET----
app.set('view engine', 'ejs');

//-----GET-----
//Creates json for urlDatabase
app.get("/urls.json", (req, res) => res.json(urlDatabase));

//Directs root page to urls
app.get("/", (req, res) => res.redirect(`/urls`));

//Shows all URL's for the user
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlsForUser(req.session.user_id), user_id: users[req.session.user_id] };
  res.render("urls_index", templateVars);
});

//Shows form to create new URL
app.get("/urls/new", (req, res) => {
  //Check to see if user logged in or not
  if (!req.session.user_id) {
    res.redirect(403, "/urls");
  }
  const templateVars = { user_id: users[req.session.user_id] };
  res.render("urls_new", templateVars);
});

//Shows all short URLS
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]['longURL'], user_id: users[req.session.user_id]};
  res.render("urls_show", templateVars);
});

//Shows registration page
app.get("/register", (req, res) =>{
  const templateVars = { user_id: users[req.session.user_id] };
  res.render("urls_registration", templateVars);
});

//Shows login page
app.get("/login", (req, res) =>{
  const templateVars = { user_id: users[req.session.user_id] };
  res.render("urls_login", templateVars);
});

//Redirect to longURL
app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]['longURL']);
});

//-----POST-----
//Creates new shortURL and adds to database
app.post("/urls", (req, res) => {
  let randomString = generateRandomString();
  urlDatabase[randomString] = { longURL: req.body['longURL'], userID: req.session.user_id };
  res.redirect(`/urls/${randomString}`);
});

//Delete URL from Database
app.post("/urls/:shortURL/delete", (req, res) => {
  if (urlDatabase[req.params.shortURL]['userID'] !== req.session.user_id) {
    return res.status(403).send('User not authorized to do this.');
  }
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

//Edit longURL in Database
app.post("/urls/:shortURL/edit", (req, res) => {
  if (urlDatabase[req.params.shortURL]['userID'] !== req.session.user_id) {
    return res.status(403).send('User not authorized to do this.');
  }
  urlDatabase[req.params.shortURL] = req.body['newURL'];
  res.redirect("/urls");
});

//Login user
app.post("/login", (req, res) => {
  if (req.body['userEmail'] === "" || req.body['userPassword'] === "") {
    return res.status(400).send("Sorry, email or password cannot be empty!");
  }

  if (!checkEmail(req.body['userEmail'])) {
    return res.status(403).send('Email is not in the database');
  }
  
  let userID = findUserID(req.body['userEmail']);

  if (!bcrypt.compareSync(req.body['userPassword'], users[userID]['password'])) {
    return res.status(403).send('Password does not match');
  }

  req.session.user_id = userID;
  res.redirect("/urls");
});

//Logout user
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

//Register a user
app.post("/register", (req, res) => {
  if (req.body['userEmail'] === "" || req.body['userPassword'] === "") {
    return res.status(400).send("Sorry, email or password cannot be empty!");
  }

  if (checkEmail(req.body['userEmail'])) {
    return res.status(400).send("Sorry, that email is already in use.");
  }
  let userID = generateRandomString();
  users[userID] = { id: userID, email: req.body['userEmail'], password: bcrypt.hashSync(req.body['userPassword'], 10) };
  req.session.user_id = userID;
  res.redirect("/urls");
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));