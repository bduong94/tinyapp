const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
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

//Object to store all URLs
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//Object to store all Users
const users = {
  
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

//Shows all URL's in the database
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, user_id: users[req.cookies['user_id']] };
  res.render("urls_index", templateVars);
});

//Shows form to create new URL
app.get("/urls/new", (req, res) => {
  const templateVars = { user_id: users[req.cookies['user_id']] };
  res.render("urls_new", templateVars);
});

//Shows all short URLS
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user_id: users[req.cookies['user_id']]};
  res.render("urls_show", templateVars);
});

//Shows registration page
app.get("/register", (req, res) =>{
  res.render("urls_registration");
});

//Redirect to longURL
app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
});

//-----POST-----
//Creates new shortURL and adds to database
app.post("/urls", (req, res) => {
  let randomString = generateRandomString();
  urlDatabase[randomString] = req.body['longURL'];
  res.redirect(`/urls/${randomString}`);
});

//Delete URL from Database
app.post("/urls/:shortURL", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

//Edit longURL in Database
app.post("/urls/:shortURL/edit", (req, res) => {
  console.log(req.body['newURL']);
  urlDatabase[req.params.shortURL] = req.body['newURL'];
  res.redirect("/urls");
});

//Login user
app.post("/login", (req, res) => {
  res.cookie('username', req.body['username']);
  res.redirect("/urls");
});

//Logout user
app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect("/urls");
});

//Register a user
app.post("/register", (req, res) => {
  let userID = generateRandomString();
  users[userID] = { id: userID, email: req.body['userEmail'], password: req.body['userPassword'] };
  res.cookie('user_id', userID);
  res.redirect("/urls");
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));