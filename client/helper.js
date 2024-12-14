// Sends post requests to the server using fetch
const sendPost = async (url, data, handler) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (result.redirect) {
        window.location = result.redirect;
        return false;
    }

    if (result.error) {
        console.log(result.error);
        showError(result.error);
        return false;
    }

    if (handler) {
        handler();
        return false;
    }

    return result;
};

// const showError = (parentElId, msg) => {
//     // TO-DO: Create a child element with the aforementioned message
//     const parentEl = document.querySelector(parentElId);
//     const errorEl = document.createElement('div');
//     errorEl.className = 'row error-div mt-2';
//     errorEl.innerHTML = `<p class='text-danger'>${msg}</p>`;

//     parentEl.append(errorEl);
// };
const showError = (msg) => {
    const errorDiv = document.querySelector('#error-div');
    errorDiv.classList.remove('d-none');
    document.querySelector('#error-msg').innerHTML = msg;
}

// Removes all error messages
// const hideErrors = () => {
//     const elements = document.getElementsByClassName('error-div');
//     console.log(elements);

//     // Clear full list of elements
//     while(elements.length > 0) {
//         elements[0].remove();
//     }
// };
const hideErrors = () => {
    const errorDiv = document.querySelector('#error-div');
    errorDiv.classList.add('d-none');
}

module.exports = {
    sendPost,
    showError,
    hideErrors,
};