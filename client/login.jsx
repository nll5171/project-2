const helper = require('./helper.js');
const React = require('react');
const { createRoot } = require('react-dom/client');

const handleLogin = (e) => {
    e.preventDefault();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;

    if (!username || !pass) {
        // TO-DO: Error message display, 'Username and pass are required!'
        return false;
    }

    helper.sendPost(e.target.action, {username, pass});
    return false;
};

// Used for both signup and password change since they're identical forms
const handleSignup = (e) => {
    e.preventDefault();
    
    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    if (!username || !pass || !pass2) {
        // TO-DO: Error message display, 'All fields required!'
        return false;
    }

    if (pass !== pass2) {
        // TO-DO: Error message display, 'Passwords don't match!'
        return false;
    }

    helper.sendPost(e.target.action, {username, pass, pass2});
};

const LoginWindow = (props) => {
    return (
        <form id="loginForm"
            name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <input className="formSubmit" type="submit" value="Sign in" />
        </form>
    );
};

const SignupWindow = (props) => {
    return (
        <form id="signupForm"
            name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <label htmlFor="pass2">Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password" />
            <input className="formSubmit" type="submit" value="Sign up" />
        </form>
    );
};

// Runs handleSignup() function since forms and checks are identical
const ChangePassWindow = (props) => {
    return (
        <form id="changePassForm"
            name="changePassForm"
            onSubmit={handleSignup}
            action="/changePass"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <label htmlFor="pass2">Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password" />
            <input className="formSubmit" type="submit" value="Sign up" />
        </form>
    );
}

// TO-DO: Be able to render Change Password page when logged in
const init = (locals) => {
    // Only render this stuff if you're not logged in
    if (!locals.loggedIn) {
        const loginButton = document.getElementById('loginButton');
        const signupButton = document.getElementById('signupButton');

        const root = createRoot(document.getElementById('content'));

        loginButton.addEventListener('click', (e) => {
            e.preventDefault();
            root.render( <LoginWindow /> );
            return false;
        });

        signupButton.addEventListener('click', (e) => {
            e.preventDefault();
            root.render( <SignupWindow /> );
            return false;
        });

        root.render( <LoginWindow /> );
    } 
    // User is logged in
    else {
        root.render( <SignupWindow /> );
    }
};

window.onload = init;