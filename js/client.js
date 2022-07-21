const socket = io('http://localhost:8000');

//get DOM elements in respective js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('msgInp');
const messageContainer = document.querySelector(".container");

//Audio that will play on receiving message
var audio = new Audio('ting.mp3');

//function which will append event into the container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play();
    }
    
}

//Ask new user for his/her name and let the server know
const name = prompt("Enter your name to join: ");
socket.emit('new-user-joined', name);

//if new user joins, receive his/her name from server
socket.on('user-joined', name => { //when new user joined show the message 
    append(`${name} joined the chat`, 'right');
})

//If server sends the message receive it
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
})

//If a user leaves the chat, append the info to the container
socket.on('left', name => {
    append(`${name} left the chat`, 'left');
})

//If the form gets submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault(); //prevent from loading again and again
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = ''
});