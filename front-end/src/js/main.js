const txtMessageElm = document.querySelector("#txt-message");
const btnSendElm = document.querySelector("#btn-send");
const outputElm = document.querySelector("#output");
const { API_BASE_URL } = process.env;

btnSendElm.addEventListener('click', ()=> {
    const message = txtMessageElm.value.trim();
    if (!message) return;

    fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({message})
    }).then(res => {
        if (res.ok){
            addChatMessageRecord(message);
            txtMessageElm.value = '';
            txtMessageElm.focus();
        }else{
            alert("Failed to send the chat message, please try again.");
        }
    }).catch(err => alert("Failed to connect with the server, please check the connection."));
});

function addChatMessageRecord(message){
    const messageElm = document.createElement('div');
    outputElm.append(messageElm);
    messageElm.innerText = message;
}

function loadChatMessages(){
    fetch(`${API_BASE_URL}/messages`)
    .then(req => req.json())
    .then(chatMessages => {
        Array.from(outputElm.children).forEach(child => child.remove());
        chatMessages.forEach(msg => addChatMessageRecord(msg))
    })
    .catch(err => console.log(err));
}

setInterval(loadChatMessages, 1000);