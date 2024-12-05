const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

// Stores whether the user is a premium user or not
let premium = false;

// Create the hunt first, then the individual tasks
// Should redirect to user's collection once created
const handleHunt = (e) => {
    e.preventDefault();

    const name = e.target.querySelector('#huntName').value;
    const deadline = e.target.querySelector('#huntDeadline').value;

    // Store all tasks in an array, pull from the <fieldset> element
    // https://www.w3schools.com/html/html_form_elements.asp
    const taskElements = e.target.querySelector('#tasks').children;
    const tasks = [];

    // Iterate through all children of #tasks, store text inside task array
    for (let i = 0; i < taskElements.length; i++) {
        tasks.add(taskElements[i].value);

        if (!name || !deadline || !tasks[i]) {
            // TO-DO: display error 'all fields are required!'
            return false;
        }
    }

    // Get the Id of the hunt for use with task/item creation
    const huntId = helper.sendPost(e.target.action, { name, deadline });

    // Attempt to create each individual task/item
    for (let i = 0; i < tasks.length; i++) {
        helper.sendPost('/makeItem', { task: tasks[i], hunt: huntId });
    }

    return false;
    //location.reload();    Once I can confirm this works properly
};

// Adds task item to the list
const AddTaskItem = () => {
    const taskLabel = document.createElement('label');
    taskLabel.setAttribute('htmlFor', 'task');
    taskLabel.innerHTML = 'Task: ';

    const taskInput = document.createElement('input');
    taskInput.setAttribute('type', 'text');
    taskInput.setAttribute('name', 'task');
    taskInput.setAttribute('placeholder', 'Enter task here!');

    // const parentDiv = document.createElement('div');
    // parentDiv.appendChild(taskLabel);
    // parentDiv.appendChild(taskInput);

    document.querySelector('#tasks').appendChild(taskLabel);
    document.querySelector('#tasks').appendChild(taskInput);
};

const HuntForm = (props) => {
    const [taskAmt, incrementTask] = useState(1);

    const addTask = () => {
        incrementTask(taskAmt + 1);
    };

    return (
        <form id='huntForm'
            onSubmit={(e) => handleHunt(e, props.triggerReload)}
            name='huntForm'
            action='/maker'
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
                            <label htmlFor='task'>Task #{index}: </label>
                            <input type='text' name='task' placeholder='Enter task here!' />
                        </div>
                    ))}
                </div>
                <button onClick={addTask}>Add another task!</button>
            </div>
            <input type='submit' value='Make Hunt' />
        </form>
    )
};

// List all hunts created by the user
const HuntList = (props) => {
    const [hunts, setHunts] = useState(props.hunts);

    useEffect(() => {
        const loadHuntsFromServer = async () => {
            const response = await fetch('/getUserHunts');
            const data = await response.json();
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

    // TO-DO: Add task nodes field that handles task nodes
    const taskNodes = tasks.map(task => {
        return (
            <div key={task.id}>
                <h3>Task: {task.content}</h3>
            </div>
        );
    });

    const huntNodes = hunts.map(hunt => {
        return (
            <div key={hunt.id}>
                <h3>Hunt Name: {hunt.name}</h3>
                <div id='task-list'>
                    {taskNodes}
                </div>
            </div>
        );
    });

    return (
        <div>
            {huntNodes}
        </div>
    );
};

const App = () => {
    const [reloadHunts, setReloadHunts] = useState(false);

    // Only show hunts by default, add button to create new hunts
    return (
        <div>
            <div id='hunts'>
                <h3>My Hunts:</h3>
                <HuntList hunts={[]} reloadHunts={reloadHunts} />
            </div>
        </div>
    );
};

const init = () => {
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