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

        // Make sure all fields are included. Must be done for all tasks
        if (!name || !deadline || !tasks[i]) {
            // TO-DO: display error 'all fields are required!'
            return false;
        }
    }

    // Get the Id of the hunt for use with task/item creation
    const huntId = helper.sendPost(e.target.action, {name, deadline});
    
    // TO-DO: Create the individual tasks...somehow
    // Still haven't decided how to format the form stuff
    
    // Attempt to create each individual task/item
    for (let i = 0; i < tasks.length; i++) {
        helper.sendPost('/createItem', {task: tasks[i]});
    }
    
    return false;
};