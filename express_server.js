const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
const PORT = 8080;
let urlLength = 6;

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

//Directs root page to urls
app.get("/", (req, res) => res.redirect(`/urls`));

//Shows all URL's in the database
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies['username'] };
  res.render("urls_index", templateVars);
});

//Shows form to create new URL
app.get("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies['username'] };
  res.render("urls_new", templateVars);
});

//Creates new shortURL and adds to database
app.post("/urls", (req, res) => {
  let randomString = generateRandomString();
  urlDatabase[randomString] = req.body['longURL'];
  res.redirect(`/urls/${randomString}`);
});

//Shows all short URLS
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies['username']};
  res.render("urls_show", templateVars);
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

//Redirect to longURL
app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
});

//Login user
app.post("/login", (req, res) => {
  res.cookie('username', req.body['username']);
  res.redirect("/urls");
});

//Logout user
app.post("/logout", (req, res) => {
  res.cookie('username');
  res.redirect("/urls");
});

app.get("/urls.json", (req, res) => res.json(urlDatabase));
app.get("/hello", (req, res) => res.send("<html><body>Hello <b>World</b></body></html>\n"));

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));