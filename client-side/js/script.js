const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const chatContainer = document.getElementById('messages');

let username = prompt("Welcome to the group chat app, Please enter your name:");

socket.emit("new-connection", { username });

form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (input.value) {
        socket.emit('new-message', { user: socket.id, message: input.value })
        addMessage({ message: input.value }, true)
        input.value = '';
    }
});

socket.on('welcome-message', (data) => {
    const messageElement = document.createElement('li');
    messageElement.classList.add('message');

    messageElement.innerText = `${data.message}`;
    if (chatContainer.childElementCount) {
        chatContainer.removeChild(chatContainer.firstChild);
        chatContainer.insertBefore(messageElement, chatContainer.firstChild);
    }
    else
        chatContainer.appendChild(messageElement);
});

socket.on('broadcast-message', (data) => {
    addMessage(data, false);
});

function addMessage(data, isSelf = false) {
    const messageElement = document.createElement('li');
    messageElement.classList.add('message');
    if (isSelf) {
        messageElement.classList.add('self-message');
        messageElement.innerText = `${data.message}`;
    } else {
        messageElement.classList.add('others-message');
        messageElement.innerHTML = `<span class="name">${data.user}:</span> ${data.message}`;
    }
    chatContainer.appendChild(messageElement);
    window.scrollTo(0, document.body.scrollHeight);
}

