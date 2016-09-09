const CRYPTO = require("crypto");

var DB;

const TEST_LENGTH = /.{10,}/;
const TEST_LENGTH_FAILED = 1;
const TEST_LOWER = /[a-z]+/;
const TEST_LOWER_FAILED = 2;
const TEST_UPPER = /[A-Z]+/;
const TEST_UPPER_FAILED = 3;
const TEST_NUMBER = /[0-9]+/;
const TEST_NUMBER_FAILED = 4;

const PASSWORD_TEST_VALID = 0;

const EMAIL_VALID = /([a-z0-9A-Z\+\-_\.,]+)@([a-z0-9]{3,}\.[a-z0-9]{2,})/;
const USERNAME_VALID = /[a-zA-Z0-9\.\+]{8,}/;


function usernameExists(username, callback) {
    getUserAuthInfo(username, (info) => {
        callback(info != null);
    });
}

function isPasswordValid(password) {
    if (!TEST_LENGTH.test(password)) return TEST_LENGTH_FAILED;
    if (!TEST_LOWER.test(password)) return TEST_LOWER_FAILED;
    if (!TEST_UPPER.test(password)) return TEST_UPPER_FAILED;
    if (!TEST_NUMBER.test(password)) return TEST_NUMBER_FAILED;

    return PASSWORD_TEST_VALID;
}

function registerUser(username, email, password, response) {

    var username_exists = false;
    var username_invalid = false;
    var password_invalid = false;
    var email_invalid = false;

    DB.queryUser(username, (info) => {
        if (info) username_exists = true;

        username_invalid = !USERNAME_VALID.test(username);
        email_invalid = !EMAIL_VALID.test(email);
        password_invalid = !isPasswordValid(password);

        if (username_invalid || username_exists || password_invalid || email_invalid)
            response.send({
                username_invalid: username_invalid,
                username_exists: username_exists,
                password_invalid: password_invalid,
                email_invalid: email_invalid
            });
            else {
                response.send("Success!");
            }
    });
}

function requestRegisterUser(req, res) {
    registerUser(req.body.username, req.body.email, req.body.password, res);
}

function init(db) {
    DB = db;
}

module.exports.init = init;
module.exports.route = requestRegisterUser;
