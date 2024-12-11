const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');
//const Navigation = require('./components/navbar.jsx');
const Form = require('react-bootstrap/Form');
const Button = require('react-bootstrap/Button');

// Stores whether the user is a premium user or not
let premium;
let taskLimitReached = false;
const freeTaskLimit = 10;
const premiumTaskLimit = 50;

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
        })
    });
};

const ErrorForm = (props) => {
    if (props.limitReached) {
        return <p>{props.message}</p>
    }

    else {
        return null;
    }
}

const HuntForm = (props) => {
    const [taskAmt, incrementTask] = useState(1);

    // Can only increase taskAmt while less than minimum
    const addTask = () => {
        if ((!premium && taskAmt < freeTaskAmt)
            || (premium && taskAmt < premiumTaskAmt)) {
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
                <input id='huntDeadline' type='date' name='deadline' placeholder={Date.now} />
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
                    <ErrorForm limitReached={taskLimitReached} message={'Maximum tasks added! Feel free to edit the tasks, but you can\'t add any more!'}></ErrorForm>
                </div>
                <button onClick={(e) => {
                    e.preventDefault();
                    addTask();
                }}>Add another task!</button>
            </div>
            <input type='submit' value='Make Hunt' />
        </form>
    );

    // return (
    //     <Form id="huntForm"
    //         onSubmit={(e) => handleHunt(e)}
    //         name="huntForm"
    //         action="/makeHunt"
    //         method="POST"
    //     >
    //         <Row className="mb-4">
    //             <Container className="mb-2">
    //                 <h3 className="border-bottom">Scavenger Hunt Overview</h3>
    //             </Container>
    //             <Form.Group as={Col} controlId="formGridEmail">
    //                 <Form.Label>Hunt Name</Form.Label>
    //                 <Form.Control size="lg" type="text" placeholder="Enter name of Scavenger Hunt!" />
    //             </Form.Group>

    //             <Form.Group as={Col} controlId="formGridPassword">
    //                 <Form.Label>Deadline</Form.Label>
    //                 <Form.Control size="lg" type="date" />
    //             </Form.Group>
    //         </Row>

    //         <div className="mb-3 border-bottom">
    //             <Row>
    //                 <Container className="mb-2">
    //                     <h3 className="border-bottom">Task Details</h3>
    //                 </Container>
    //             </Row>

    //             <Row className="mb-3">
    //                 <Form.Label column lg={1}>
    //                     Task #1
    //                 </Form.Label>
    //                 <Col>
    //                     <Form.Control type="text" placeholder="Enter task info!" />
    //                 </Col>
    //             </Row>

    //             <Row className="mb-3">
    //                 <Form.Label column lg={1}>
    //                     Task #2
    //                 </Form.Label>
    //                 <Col>
    //                     <Form.Control type="text" placeholder="Enter task info!" />
    //                 </Col>
    //             </Row>

    //             <Button variant="secondary" type="button" className="mb-2">
    //                 Add another task!
    //             </Button>
    //         </div>

    //         <Button variant="secondary" type="submit" size="lg">
    //             Create Scavenger Hunt
    //         </Button>
    //     </Form>
    // );
};

// List all hunts created by the user
const HuntList = (props) => {
    const [hunts, setHunts] = useState(props.hunts);

    useEffect(() => {
        const loadHuntsFromServer = async () => {
            const response = await fetch('/getUserHunts');
            const data = await response.json();
            setHunts(data.hunts);
        };
        loadHuntsFromServer();
    }, [props.reloadHunts]);

    if (hunts.length === 0) {
        return (
            <div>
                <h3>You haven't made any Scavenger Hunts yet!</h3>
            </div>
        );
    }

    const HuntNodes = hunts.map(hunt => {
        return (
            <div key={hunt.id}>
                <h3>Hunt Name: {hunt.name}</h3>
            </div>
        );
    });

    return (
        <div>
            {HuntNodes}
        </div>
    );
};

const App = () => {
    const [reloadHunts, setReloadHunts] = useState(false);

    // Only show hunts by default, add button to create new hunts
    // return (
    //     <div>
    //         <Navigation loggedIn={false} premium={false} />
    //         <div id='hunts'>
    //             <h3>My Hunts:</h3>
    //             <HuntList hunts={[]} reloadHunts={reloadHunts} />
    //         </div>
    //     </div>
    // );

    return (
        <div>
            <div id='hunts'>
                <h3>My Hunts:</h3>
                <HuntList hunts={[]} reloadHunts={reloadHunts} />
            </div>
        </div>
    );
};

const init = async () => {
    // Load info about the user and store it in variables before loading the page
    // const response = await fetch('/getUserInfo');
    // const userInfo = await response.json();

    // premium = userInfo.premium;

    const makeTaskBtn = document.getElementById('makeTaskBtn');
    const root = createRoot(document.getElementById('app'));

    makeTaskBtn.addEventListener('click', (e) => {
        e.preventDefault();
        root.render(< HuntForm />);
        return false;
    });

    root.render(<App />);
}

window.onload = init;