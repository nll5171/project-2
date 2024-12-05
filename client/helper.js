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
    console.log(result);
    
    // TO-DO: handle redirects and errors using conditionals
    // - Need to return back to previous function for adding tasks to hunts
    if (result.redirect) {
        window.location = result.redirect;
    }

    if (result.error) {
        console.log(result.error);
    }

    if (handler) {
        handler();
    }

    // so that I can call await on this function
    return result;
};

module.exports = {
    sendPost,
}