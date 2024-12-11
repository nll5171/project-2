const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');
const { useId } = React;
//const Navigation = require('./components/navbar.jsx');

// Stores whether the user is a premium user or not
let premium;
let taskLimitReached = false;
const freeTaskLimit = 10;
const premiumTaskLimit = 50;

let root;

const handleHunt = async (e) => {
    e.preventDefault();

    const name = e.target.querySelector('#huntName').value;
    const deadline = e.target.querySelector('#huntDeadline').value;

    console.log('pulling from task elements!');

    // Store all tasks in an array, pull from the <fieldset> element
    // https://www.w3schools.com/html/html_form_elements.asp
    const taskElements = e.target.querySelector('#tasks').children;
    const tasks = [];

    // Iterate through every other child of tasks, since half are labels, half are inputs
    for (let i = 0; i < taskElements.length; i++) {
        const taskVal = taskElements[i].children[1].value;

        if (!name || !deadline || !taskVal) {
            // TO-DO: display error 'all fields are required!'
            return false;
        }

        tasks.push(taskVal);
    }

    // Get the Id of the hunt for use with task/item creation
    await helper.sendPost(e.target.action, { name, deadline }).then((result) => {
        const huntId = result.id;
        let promises = [];

        for (let i = 0; i < tasks.length; i++) {
            promises.push(helper.sendPost('/makeItem', { task: tasks[i], hunt: huntId }));
        }

        Promise.all(promises).then(() => {
            location.reload();
        });
    });
};

const enablePremium = async () => {
    await helper.sendPost('/setPremium', { premium: true });
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
                    <ul className="navbar-nav mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link" href="/explore">Explore</a>
                        </li>
                        <li className="nav-item active">
                            <a className="nav-link" href="/maker">Create</a>
                        </li>
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
    const [taskAmt, incrementTask] = useState(1);

    // Can only increase taskAmt while less than minimum
    const addTask = () => {
        if ((!premium && taskAmt < freeTaskLimit)
            || (premium && taskAmt < premiumTaskLimit)) {
            incrementTask(taskAmt + 1);
        }

        else {
            taskLimitReached = true;
        }
    };

    return (
        <form id='huntForm'
            onSubmit={(e) => handleHunt(e)}
            name='huntForm'
            action='/makeHunt'
            method='POST'
        >
            <div>
                <h3>Hunt Overview:</h3>
                <label htmlFor='name'>Name: </label>
                <input id='huntName' type='text' name='name' placeholder='Hunt Name' />
                <label htmlFor='deadline'>Deadline: </label>
                <input id='huntDeadline' type='date' name='deadline' />
            </div>
            <div>
                <h3>Tasks:</h3>
                <div id='tasks'>
                    {Array.from({ length: taskAmt }, (_, index) => (
                        <div>
                            <label key={index} htmlFor='task'>Task #{index + 1}: </label>
                            <input type='text' name='task' placeholder='Enter task here!' />
                        </div>
                    ))}
                </div>
                <button onClick={(e) => {
                    e.preventDefault();
                    addTask();
                }}>Add another task!</button>
                <ErrorForm limitReached={taskLimitReached} message={'Task limit for this hunt has been reached!'}></ErrorForm>
            </div>
            <input type='submit' value='Make Hunt' />
        </form>
    );

    return (
        <Form id="huntForm"
            onSubmit={(e) => handleHunt(e)}
            name="huntForm"
            action="/makeHunt"
            method="POST"
        >
            <Row className="mb-4">
                <Container className="mb-2">
                    <h3 className="border-bottom">Scavenger Hunt Overview</h3>
                </Container>
                <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Hunt Name</Form.Label>
                    <Form.Control size="lg" type="text" placeholder="Enter name of Scavenger Hunt!" />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridPassword">
                    <Form.Label>Deadline</Form.Label>
                    <Form.Control size="lg" type="date" />
                </Form.Group>
            </Row>

            <div className="mb-3 border-bottom">
                <Row>
                    <Container className="mb-2">
                        <h3 className="border-bottom">Task Details</h3>
                    </Container>
                </Row>

                <Row className="mb-3">
                    <Form.Label column lg={1}>
                        Task #1
                    </Form.Label>
                    <Col>
                        <Form.Control type="text" placeholder="Enter task info!" />
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Form.Label column lg={1}>
                        Task #2
                    </Form.Label>
                    <Col>
                        <Form.Control type="text" placeholder="Enter task info!" />
                    </Col>
                </Row>

                <Button variant="secondary" type="button" className="mb-2">
                    Add another task!
                </Button>
            </div>

            <Button variant="secondary" type="submit" size="lg">
                Create Scavenger Hunt
            </Button>
        </Form>
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

    const HuntNode = (props) => {
        const accordionId = useId();

        return (
            <div className="accordion-item" key={props.hunt.id}>
                <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={"#" + accordionId} aria-expanded="true" aria-controls={accordionId}>
                        {props.hunt.name}
                    </button>
                </h2>
                <div id={accordionId} className="accordion-collapse collapse" data-bs-parent="#huntsAccordion">
                    <div className="accordion-body">
                        <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                    </div>
                </div>
            </div>
        );
    }

    const HuntNodes = hunts.map(huntData => {
        return (
            <HuntNode hunt={huntData}></HuntNode>
        );
    });

    return (
        <div className='accordion' id='huntsAccordion'>
            {HuntNodes}
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
                <div className='row border-bottom mb-3 mt-3'>
                    <button type="button" className="btn btn-secondary btn-lg" onClick={renderForm}>Make new hunt!</button>
                </div>
                <div id='hunts' className='row mt-3'>
                    <h3><u>My Scavenger Hunts</u></h3>
                    <HuntList hunts={[]} reloadHunts={reloadHunts} />
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

    const makeTaskBtn = document.getElementById('makeTaskBtn');
    root = createRoot(document.getElementById('app'));

    root.render(<App />);
}

window.onload = init;