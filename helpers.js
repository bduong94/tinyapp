const e = require("express");

let urlLength = 6;

//Create shortURL string
function generateRandomString(database) {
  let result = "";
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  
  for (let i = 0; i < urlLength; i++) {
    result += characters[Math.floor(characters.length * Math.random())];
  }

  if (database[result]) {
    generateRandomString();
  }

  return result;
}

//Check email
function checkEmail(email, database) {
  for (let user in database) {
    if (database[user]['email'] === email) {
      return true;
    }
  }

  return false;
}

//Check email
function findUserID(email, database) {
  for (let userID in database) {
    if (database[userID]['email'] === email) {
      return userID;
    }
  }

  return undefined;
}

//Check for all shortURLs created by a user
function urlsForUser(id, database) {
  let urlsOfUser = {};

  for (let url in database) {
    if (database[url]['userID'] === id) {
      urlsOfUser[url] = database[url];
    }
  }

  return urlsOfUser;
}

//Checks if user is valid
function checkValidUser(id, shortURL, database) {
  if (database[shortURL]['userID'] === id){
    return true;
  }
  
  return false;
}

module.exports = { generateRandomString, checkEmail, findUserID, urlsForUser, checkValidUser };