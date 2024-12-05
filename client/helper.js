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
    
    // TO-DO: handle redirects and errors using conditionals
    // - Need to return back to previous function for adding tasks to hunts
    if (result.redirect) {
        window.location = result.redirect;
        return false;
    }

    if (result.error) {
        console.log(result.error);
        return false;
    }

    if (handler) {
        handler();
        return false;
    }

    // so that I can call await on this function
    return result;
};

module.exports = {
    sendPost,
}