import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../firebase.js';

const provider = new GoogleAuthProvider();
const txtMessageElm = document.querySelector("#txt-message");
const btnSendElm = document.querySelector("#btn-send");
const btnSignInElm = document.querySelector("#btn-sign-in");
const outputElm = document.querySelector("#output");
const loginOverlayElm = document.querySelector("#login-overlay");
const accountElm = document.querySelector("#account");
const userNameElm = document.querySelector("#user-name");
const userEmailElm = document.querySelector("#user-email");
const btnSignOutElm = document.querySelector("#btn-sign-out");
const loaderElm = document.querySelector("#loader");
const { API_BASE_URL } = process.env;
const user = {
    email: null,
    name: null,
    picture: null
};

accountElm.addEventListener('click', (e)=> {
    accountElm.querySelector("#account-details")
        .classList.remove('d-none');
    e.stopPropagation();
});

document.addEventListener('click', ()=> {
    accountElm.querySelector("#account-details")
        .classList.add('d-none');
});

btnSignOutElm.addEventListener('click', (e)=> {
    accountElm.querySelector("#account-details")
        .classList.add('d-none');
    e.stopPropagation();
    signOut(auth);
});

onAuthStateChanged(auth, (loggedUser) => {
    loaderElm.classList.add('d-none');
    if (loggedUser){
        user.email = loggedUser.email;
        user.name = loggedUser.displayName;
        user.picture = loggedUser.photoURL;
        finalizeLogin();
        loginOverlayElm.classList.add('d-none');
    } else{
        user.email = null;
        user.name = null;
        user.picture = null;
        loginOverlayElm.classList.remove('d-none');
    }
});

btnSignInElm.addEventListener('click', () => {
    signInWithPopup(auth, provider)
        .then(res => {
            user.name = res.user.displayName;
            user.email = res.user.email;
            user.picture = res.user.photoURL;
            loginOverlayElm.classList.add('d-none');
            finalizeLogin();
        }).catch(err => alert("Failed to sign in"));
});

function finalizeLogin(){
    userNameElm.innerText = user.name;
    userEmailElm.innerText = user.email;
    accountElm.style.backgroundImage = `url(${user.picture})`;
}

btnSendElm.addEventListener('click', () => {
    const message = txtMessageElm.value.trim();
    if (!message) return;

    const msgObj = { 
        message,
        email: user.email
    };

    fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(msgObj)
    }).then(res => {
        if (res.ok) {
            addChatMessageRecord(msgObj);
            outputElm.scrollTo(0, outputElm.scrollHeight);
            txtMessageElm.value = '';
            txtMessageElm.focus();
        } else {
            alert("Failed to send the chat message, please try again.");
        }
    }).catch(err => alert("Failed to connect with the server, please check the connection."));
});

function addChatMessageRecord({message, email}) {
    const messageElm = document.createElement('div');
    messageElm.classList.add('message')
    if (email === user.email){
        messageElm.classList.add('me');
    }else{
        messageElm.classList.add('others');
    }
    outputElm.append(messageElm);
    messageElm.innerText = message;
}

function loadChatMessages() {
    fetch(`${API_BASE_URL}/messages`)
        .then(req => req.json())
        .then(chatMessages => {
            Array.from(outputElm.children).forEach(child => child.remove());
            chatMessages.forEach(msg => addChatMessageRecord(msg))
        })
        .catch(err => console.log(err));
}

setInterval(loadChatMessages, 1000);

loadChatMessages();

