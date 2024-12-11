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
        return false;
    }

    if (handler) {
        handler();
        return false;
    }

    return result;
};

module.exports = {
    sendPost,
}