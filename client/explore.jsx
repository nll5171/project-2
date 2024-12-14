const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');
const { useId } = React;

let premium;
let loggedIn;
let root;

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
                    <a className='nav-link' href='/login'>Login</a>
                </li>
                <li className='nav-item'>
                    <button type='button' className='btn btn-secondary' onClick={(e) => {
                        e.preventDefault();
                        window.location = '/signup';
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

const TaskNode = (props) => {
    const taskId = useId();

    return (
        <li key={taskId} className='list-group-item'>{props.task}</li>
    );
};

const HuntNode = (props) => {
    const accordionId = useId();

    return (
        <div className="accordion-item" key={props.hunt._id}>
            <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={"#" + accordionId} aria-expanded="false" aria-controls={accordionId}>
                    <b>{props.hunt.name}</b> &emsp; (Deadline: {new Date(props.hunt.deadline).toDateString()})
                </button>
            </h2>
            <div id={accordionId} className="accordion-collapse collapse" data-bs-parent="#huntsAccordion">
                <div className="accordion-body">
                    <ol className='list-group list-group-numbered'>
                        {props.hunt.tasks.map(taskData => <TaskNode task={taskData}></TaskNode>)}
                    </ol>
                </div>
            </div>
        </div>
    );
};

const HuntList = (props) => {
    const [hunts, setHunts] = useState(props.hunts);

    // Should cause this to only run once on page load
    useEffect(() => {
        // Load all existing scavenger hunts and their tasks
        const loadHuntsFromServer = async () => {
            const huntResponse = await fetch('/getHunts');
            const huntData = await huntResponse.json();

            setHunts(huntData.hunts);
        };
        loadHuntsFromServer();
    }, [props.reloadHunts]);

    if (hunts.length === 0) {
        return (
            <p>No Scavenger Hunts exist at the moment!</p>
        );
    }

    return (
        <div className='accordion' id='hunts-accordion'>
            {hunts.map(huntData => <HuntNode hunt={huntData} />)}
        </div>
    );
};

const Explore = () => {
    const [reloadHunts, setReloadHunts] = useState(false);

    return (
        <div>
            <Navigation />
            <div className='container mt-3 justify-content-center'>
            <h3><u>All Scavenger Hunts</u></h3>
                <HuntList hunts={[]} reloadHunts={reloadHunts} />
            </div>
            <ErrorContent />
        </div>
    );
}

const init = async () => {
    // Load info about user and store before loading content
    const loginResponse = await fetch('/isLoggedIn');
    const loginData = await loginResponse.json();

    // Can't be premium if you're not logged in
    loggedIn = loginData.loggedIn;

    if (loggedIn) {
        const infoRes = await fetch('/getUserInfo');
        const userData = await infoRes.json();
        premium = userData.premium;
    }

    root = createRoot(document.getElementById('content'));
    root.render(<Explore />);
};

window.onload = init;