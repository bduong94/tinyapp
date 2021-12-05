const { assert } = require('chai');

const { findEmailInDatabase, findUserID } = require('../helpers');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "test@test.com",
    password: "test123"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "test2@test.test",
    password: "123test"
  }
};

describe('Tests for findUserID', () => {
  it('Should return a user with a valid email', () => {
    const user = findUserID("test@test.com", testUsers);
    const expectedValue = "userRandomID";
    assert.strictEqual(user, expectedValue);
  });

  it('Should return a undefined with an invalid email', () => {
    const user = findUserID("testss@test.com", testUsers);
    const expectedValue = undefined;
    assert.strictEqual(user, expectedValue);
  });
});

describe('Tests for findEmailInDatabase', () => {
  it('Should return true if email is in database', () => {
    const email = findEmailInDatabase("test@test.com", testUsers);
    assert.isTrue(email);
  });

  it('Should return a false if email is not in database', () => {
    const email = findEmailInDatabase("testss@test.com", testUsers);
    assert.isFalse(email);
  });
});