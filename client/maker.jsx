const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');
const { useId } = React;

// Stores whether the user is a premium user or not
let premium;
let taskLimitReached = false;
const freeTaskLimit = 10;
const premiumTaskLimit = 25;

let huntAmt;

let root;

const handleHunt = async (e) => {
    e.preventDefault();

    const name = e.target.querySelector('#huntName').value;
    const deadline = e.target.querySelector('#huntDeadline').value;

    // Store all tasks in an array, pull from the <fieldset> element
    // https://www.w3schools.com/html/html_form_elements.asp
    const taskElements = e.target.querySelector('#tasks').children;
    const tasks = [];

    // Iterate through every other child of tasks, since half are labels, half are inputs
    for (let i = 0; i < taskElements.length; i++) {
        console.log(taskElements[i]);
        const taskVal = taskElements[i].children[0].children[1].value;

        if (!name || !deadline || !taskVal) {
            // TO-DO: display error 'all fields are required!'
            return false;
        }

        tasks.push(taskVal);
    }

    // Get the Id of the hunt for use with task/item creation
    await helper.sendPost(e.target.action, { name, deadline, tasks }).then(async () => {
        // Update the number of hunts assigned to the user
        await helper.sendPost('/changeHuntAmt', { newAmt: huntAmt + 1 }).then(() => {
            location.reload();
        });
    });
};

const removeHunt = async (id) => {
    await helper.sendPost('/removeHunt', { id }).then(async () => {
        await helper.sendPost('/changeHuntAmt', { newAmt: huntAmt - 1 }).then(() => {
            location.reload();
        });
    });
}

const enablePremium = async () => {
    await helper.sendPost('/setPremium', { isPremium: !premium, pathname: location.pathname });
    return false;
};

const Navigation = () => {
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
                    <ul className='navbar-nav'>
                        <li className="nav-item">
                            <a className="nav-link" href="/changePass">Change Password</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/logout">Logout</a>
                        </li>
                        <li>
                            <button className='btn btn-secondary' onClick={enablePremium}>Enable Premium</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

const ErrorForm = (props) => {
    if (props.limitReached) {
        return <p>{props.message}</p>
    }

    else {
        return null;
    }
};

const HuntForm = (props) => {
    const [taskAmt, adjTask] = useState(1);

    // Can only increase taskAmt while less than minimum
    const addTask = () => {
        if ((!premium && taskAmt < freeTaskLimit)
        || (premium && taskAmt < premiumTaskLimit)) {
                adjTask(taskAmt + 1);
        }

        else if (!taskLimitReached) {
            taskLimitReached = true;
            const msg = (premium) ? 'Task limit reached! Please remove a task before creating the Scavenger Hunt!'
                : 'Task limit reached! Please upgrade to premium to add more tasks to the Scavenger Hunt!';

            helper.showError('#task-info', msg);
        }
    };

    const removeTask = () => {
        if (taskAmt === 1)
            return false;

        if ((!premium && (taskAmt - 1) < freeTaskLimit)
        || (premium && (taskAmt - 1) < premiumTaskLimit)) {
            taskLimitReached = false;
        }
        adjTask(taskAmt - 1);
        helper.hideErrors();
    }

    return (
        <form id='huntForm'
            onSubmit={(e) => handleHunt(e)}
            name='huntForm'
            action='/makeHunt'
            method='POST'
        >
            <div className='container mt-3'>
                <div className='mb-4'>
                    <div className='row'>
                        <h3 className='border-bottom'>Scavenger Hunt Overview</h3>
                    </div>
                    <div className='row'>
                        <div className='input-group col'>
                            <span className='input-group-text' id='hunt-name-info'>Hunt Name:</span>
                            <input 
                            type='text' 
                            className='form-control' 
                            placeholder='Enter Scavenger Hunt name!' 
                            aria-label='hunt-name' 
                            aria-describedby='hunt-name-info'
                            id='huntName'/>
                        </div>
                        <div className='input-group col'>
                            <span className='input-group-text' id='hunt-deadline-info'>Deadline:</span>
                            <input 
                            type='date' 
                            className='form-control'  
                            aria-label='hunt-deadline' 
                            aria-describedby='hunt-deadline-info'
                            id='huntDeadline'/>
                        </div>
                    </div>
                </div>
                <div className='mb-4' id='task-info'>
                    <div className='row'>
                        <h3 className='border-bottom'>Task Details</h3>
                    </div>
                    <div id='tasks'>
                        {Array.from({ length: taskAmt }, (_, index) => (
                            <div className='row'>
                                <div className='input-group mb-2 col'>
                                    <span className='input-group-text' id={`task-info-${index + 1}`}>Task #{index + 1}</span>
                                    <input 
                                        type='text'
                                        className='form-control'
                                        placeholder='Enter task info!'
                                        aria-label={`task-${index + 1}`}
                                        aria-describedby={`task-info-${index + 1}`}
                                    />
                                </div>
                                <div className='col-auto'>
                                    <button type='button' className='btn-close' aria-label='Close' onClick={(e) => {
                                        e.preventDefault();
                                        removeTask();
                                    }}></button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='row'>
                        <div className='col'>
                            <button type='button' className='btn btn-secondary' onClick={(e) => {
                                e.preventDefault();
                                addTask();
                            }}>Add another task!</button>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col text-center'>
                        <button type='submit' className='btn btn-secondary btn-lg'>Create Scavenger Hunt!</button>
                    </div>
                </div>
            </div>
        </form>
    );
};

// List all hunts created by the user
const HuntList = (props) => {
    const [hunts, setHunts] = useState(props.hunts);

    useEffect(() => {
        const loadHuntsFromServer = async () => {
            const huntResponse = await fetch('/getUserHunts');
            const huntData = await huntResponse.json();

            setHunts(huntData.hunts);
        };
        loadHuntsFromServer();
    }, [props.reloadHunts]);

    if (hunts.length === 0) {
        return (
            <h3>You haven't made any Scavenger Hunts yet!</h3>
        );
    }

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
                        <div className='mt-2 col text-end'>
                            <button type='button' className='btn btn-outline-secondary' onClick={(e) => {
                                e.preventDefault();
                                removeHunt(props.hunt._id);
                            }}>Remove Scavenger Hunt</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='accordion' id='huntsAccordion'>
            {hunts.map(huntData => <HuntNode hunt={huntData}></HuntNode>)}
        </div>
    );
};

const renderForm = (e) => {
    e.preventDefault();
    root.render(<FormApp />)
}

const App = () => {
    const [reloadHunts, setReloadHunts] = useState(false);

    return (
        <div>
            <Navigation />
            <div className='container'>
                <div className='row border-bottom mb-3 mt-3 text-center'>
                    <div className='col mb-3'>
                        <button type="button" className="btn btn-secondary btn-lg" onClick={renderForm}>Make new hunt!</button>
                    </div>
                </div>
                <div id='hunts' className='row mt-3'>
                    <h3><u>My Scavenger Hunts</u></h3>
                    <HuntList hunts={[]} triggerReload={() => setReloadHunts(!reloadHunts)} />
                </div>
            </div>
        </div>
    );
};

const FormApp = () => {
    return (
        <div>
            <Navigation />
            <div className='container'>
                <HuntForm />
            </div>
        </div>
    );
}

const init = async () => {
    // Load info about the user and store it in variables before loading the page
    const response = await fetch('/getUserInfo');
    const userInfo = await response.json();

    console.log(userInfo);

    premium = userInfo.premium;
    huntAmt = userInfo.huntAmt;

    const makeTaskBtn = document.getElementById('makeTaskBtn');
    root = createRoot(document.getElementById('app'));

    root.render(<App />);
}

window.onload = init;