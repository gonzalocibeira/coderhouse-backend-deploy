const socket = io();
const chatForm = document.querySelector("#chatForm");
const mailIn = document.querySelector("#mailIn");
const msgIn = document.querySelector("#msgIn");
const nameIn = document.querySelector("#nameIn");
const lastIn = document.querySelector("#lastIn");
const ageIn = document.querySelector("#ageIn");
const aliasIn = document.querySelector("#aliasIn");
const picIn = document.querySelector("#picIn");
const chatPool = document.querySelector("#chatPool");
const productlist = document.querySelector("#productList");
const rndBtn = document.querySelector("#randomize");
const compRate = document.querySelector("#compRate");


const sendMessage = (messageInfo) => {
    
    socket.emit("client:message", messageInfo);
};

const renderMessage = (messagesData) => {

    const html = messagesData.map((messageInfo) => {
    return `<div> <strong style="color:blue">${messageInfo.author.id}</strong> <span style="color:brown">[${messageInfo.author.nombre}] : </span><span style="color:green; font-style: italic">${messageInfo.text}</span> </div>`;
    });

    chatPool.innerHTML = html.join(" ");
};

const msgHandler = (event) => {

    event.preventDefault();

    const messageInfo = {
        author: {
            id: mailIn.value,
            nombre: nameIn.value,
            apellido: lastIn.value,
            edad: ageIn.value,
            alias: aliasIn.value,
            avatar: picIn.value
        },
        text: msgIn.value
    }

    sendMessage(messageInfo);


    msgIn.value = "";
    mailIn.readOnly = true;
    nameIn.readOnly = true;
    lastIn.readOnly = true;
    ageIn.readOnly = true;
    aliasIn.readOnly = true;
    picIn.readOnly = true;
};

const prodHandler = (event) => {

    event.preventDefault();
    socket.emit("client:product");
};

const renderProducts = (products) => {

    const html = products.map((p) => {
        return `<div><span>${p.title}</span> <span>$${p.price}</span> <img src="${p.thumbnail}" height="20"></img></div>`
    });

    productlist.innerHTML = html.join(" ");
};

chatForm.addEventListener("submit", msgHandler);

socket.on("server:message", renderMessage);