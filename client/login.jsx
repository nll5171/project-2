const helper = require('./helper.js');
const React = require('react');
const { createRoot } = require('react-dom/client');

let root;
let premium;
let loggedIn;

const handleLogin = (e) => {
    e.preventDefault();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;

    if (!username || !pass) {
        helper.showError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, { username, pass });
    return false;
};

// Used for both signup and password change since they're identical forms
const handleSignup = (e) => {
    e.preventDefault();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    if (!username || !pass || !pass2) {
        helper.showError('All fields are required!');
        return false;
    }

    if (pass !== pass2) {
        // TO-DO: Error message display, 'Passwords don't match!'
        return false;
    }

    helper.sendPost(e.target.action, { username, pass, pass2 });
};

const togglePremium = async () => {
    await helper.sendPost('/setPremium', { isPremium: !premium, pathname: location.pathname });
    return false;
};

// React Components
const UserNavOptions = (props) => {
    if (!loggedIn) {
        return (
            <ul className='navbar-nav'>
                <li className='nav-item'>
                    <a className='nav-link' href='#' onClick={(e) => {
                        e.preventDefault();
                        root.render(<LoginWindow />);
                    }}>Login</a>
                </li>
                <li className='nav-item'>
                    <button type='button' className='btn btn-secondary' onClick={(e) => {
                        e.preventDefault();
                        root.render(<SignupWindow />);
                    }}>Sign Up</button>
                </li>
            </ul>
        );
    }

    return (
        <ul className='navbar-nav'>
            <li className='nav-item'>
                <a className='nav-link' onClick={(e) => {
                    e.preventDefault();
                    root.render(<ChangePassWindow />);
                }}></a>
            </li>
            <li className='nav-item'>
                <a className='nav-link' href='/logout'>Logout</a>
            </li>
            <li>
                <button type='button' className='btn btn-secondary' onClick={togglePremium}>{premium ? "Disable Premium" : "Enable Premium"}</button>
            </li>
        </ul>
    );
}

const Navigation = (props) => {
    return (
        <nav className='navbar navbar-expand-lg bg-body-tertiary'>
            <div className='container'>
                <a className='navbar-brand'>Internet Scavenger Hunt</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link" href="/explore">Explore</a>
                        </li>
                        <li className="nav-item active">
                            <a className="nav-link" href="/maker">Create</a>
                        </li>
                    </ul>
                    <UserNavOptions />
                </div>
            </div>
        </nav>
    );
};

const ErrorContent = () => {
    return (
        <div className='row mt-2 d-none' id='error-div'>
            <p className='text-danger' id='error-msg'>No error message here yet.</p>
        </div>
    );
};

const LoginWindow = (props) => {
    return (
        <div>
            <Navigation />
            <div className='container'>
                <div className='col col-lg-6 ms-auto me-auto mt-5' id='login-content'>
                    <div className='card'>
                        <div className='card-header'>Login</div>
                        <div className='card-body'>
                            <form id="loginForm"
                                name="loginForm"
                                onSubmit={handleLogin}
                                action="/login"
                                method="POST"
                                className="mainForm"
                            >
                                <div className='form-floating mb-3'>
                                    <input type='text' className='form-control' id='user' placeholder='username' />
                                    <label for='user'>Username</label>
                                </div>
                                <div className='form-floating mb-3'>
                                    <input type='password' className='form-control' id='pass' placeholder='password' />
                                    <label for='pass'>Password</label>
                                </div>
                                <div className='col text-end'>
                                    <button type='submit' className='btn btn-secondary'>Login</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <ErrorContent />
                </div>
            </div>
        </div>
    );
};

const SignupWindow = (props) => {
    return (
        <div>
            <Navigation />
            <div className='container'>
                <div className='col col-lg-6 ms-auto me-auto mt-5' id='signup-content'>
                    <div className='card'>
                        <div className='card-header'>Sign Up</div>
                        <div className='card-body'>
                            <form id="signupForm"
                                name="signupForm"
                                onSubmit={handleSignup}
                                action="/signup"
                                method="POST"
                                className="mainForm"
                            >
                                <div className='form-floating mb-3'>
                                    <input type='text' className='form-control' id='user' placeholder='username' />
                                    <label for='user'>Username</label>
                                </div>
                                <div className='form-floating mb-3'>
                                    <input type='password' className='form-control' id='pass' placeholder='password' />
                                    <label for='pass'>Password</label>
                                </div>
                                <div className='form-floating mb-3'>
                                    <input type='password' className='form-control' id='pass2' placeholder='retype password' />
                                    <label for='pass2'>Retype Password</label>
                                </div>
                                <div className='col text-end'>
                                    <button type='submit' className='btn btn-secondary'>Sign Up</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <ErrorContent />
                </div>
            </div>
        </div>
    );
};

// Runs handleSignup() function since forms and checks are identical
const ChangePassWindow = (props) => {
    return (
        <div>
            <Navigation />
            <div className='container'>
                <div className='col col-lg-6 ms-auto me-auto mt-5' id='change-pass-content'>
                    <div className='card'>
                        <div className='card-header'>Change Password</div>
                        <div className='card-body'>
                            <form id="changePassForm"
                                name="changePassForm"
                                onSubmit={handleSignup}
                                action="/changePass"
                                method="POST"
                                className="mainForm"
                            >
                                <div className='form-floating mb-3'>
                                    <input type='text' className='form-control' id='user' placeholder='username' />
                                    <label for='user'>Username</label>
                                </div>
                                <div className='form-floating mb-3'>
                                    <input type='password' className='form-control' id='pass' placeholder='password' />
                                    <label for='pass'>New Password</label>
                                </div>
                                <div className='form-floating mb-3'>
                                    <input type='password' className='form-control' id='pass2' placeholder='retype password' />
                                    <label for='pass2'>Retype New Password</label>
                                </div>
                                <div className='col text-end'>
                                    <button type='submit' className='btn btn-secondary'>Change password</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <ErrorContent />
                </div>
            </div>
        </div>
    );
}

const init = async () => {
    const response = await fetch('/isLoggedIn');
    const data = await response.json();

    loggedIn = data.loggedIn;

    if (loggedIn) {
        const infoRes = await fetch('/getUserInfo');
        const userData = await infoRes.json();
        premium = userData.premium;
    }

    root = createRoot(document.getElementById('content'));

    if (!loggedIn) {
        root.render(<LoginWindow />);
    }

    else {
        root.render(<ChangePassWindow />);
    }
};

window.onload = init;