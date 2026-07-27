// Typing Animation
const text = [
    "Software Engineer",
    "Web Developer",
    "Programmer",
    "Vlogger"
];

let count = 0;
let index = 0;
let currentText = "";
let letter = "";

(function type(){

    if(count === text.length){
        count = 0;
    }

    currentText = text[count];
    letter = currentText.slice(0, ++index);

    document.querySelector('.typing').textContent = letter;

    if(letter.length === currentText.length){
        count++;
        index = 0;
    }

    setTimeout(type, 200);

})();

// DARK LIGHT MODE

window.addEventListener("DOMContentLoaded", ()=>{

    const toggle =
    document.getElementById("modeToggle");

    if(toggle){

        toggle.onclick = ()=>{

            document.body.classList.toggle("light-mode");

            // ICON CHANGE

            if(document.body.classList.contains("light-mode")){

                toggle.innerHTML = "☀️";

            }

            else{

                toggle.innerHTML = "🌙";

            }

        };

    }

});

// Visitor Counter
if(localStorage.visits){
    localStorage.visits = Number(localStorage.visits)+1;
}else{
    localStorage.visits = 1;
}

document.getElementById("visitorCount").innerHTML = localStorage.visits;

// Auto Music Stop after 15 sec
const music = document.getElementById("bgMusic");

setTimeout(()=>{
    music.pause();
},15000);

//NEW ADD CODE

// Loader
window.addEventListener("load", ()=>{
    document.getElementById("loader").style.display = "none";
});

// Voice Assistant
const voiceBtn = document.getElementById("voiceBtn");

voiceBtn.addEventListener("click", ()=>{

    const speech = new SpeechSynthesisUtterance(
        "Welcome to Ahsan Ali portfolio website"
    );

    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);

});

// Simple Particle Effect
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

for(let i=0;i<80;i++){
    particles.push({
        x:Math.random()*canvas.width,
        y:Math.random()*canvas.height,
        r:Math.random()*3
    });
}

function animate(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    particles.forEach(p=>{
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle="#38bdf8";
        ctx.fill();

        p.y += 0.5;

        if(p.y > canvas.height){
            p.y = 0;
        }
    });

    requestAnimationFrame(animate);
}

animate();

   

// =========================
// TEXT CHAT (LOCAL SMART AI)
// =========================

async function sendMessage() {

    const input = document.getElementById("userInput");
    const chat = document.getElementById("chatArea");

    const msg = input.value.trim();

    if (msg === "") return;

    // Show user message
chat.innerHTML += `<div class="message user">${msg}</div>`;
    input.value = "";

    // Typing indicator
chat.innerHTML += `
<div class="message ai" id="typing">
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
</div>`;
    chat.scrollTop = chat.scrollHeight;

    try {

        const response = await fetch("https://ahsan-portfolio-production.up.railway.app/ai", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: msg
            })
        });

        const data = await response.json();
        console.log("Status:", response.status);
console.log(JSON.stringify(data, null, 2));

        document.getElementById("typing").remove();

        chat.innerHTML += `<div class="message ai">${data.reply}</div>`;

if (voiceEnabled) {
    speak(data.reply);
}
// Save chat
localStorage.setItem("chatHistory", chat.innerHTML);

chat.scrollTop = chat.scrollHeight;

    } catch (error) {

        document.getElementById("typing").remove();

        chat.innerHTML += `<p><b>AI:</b> ❌ Error connecting to Gemini AI.</p>`;

    }
}

// =========================
// CHAT BUTTON OPEN/CLOSE
// =========================
window.onload = function () {

    const chatBtn = document.getElementById("chatBtn");
    const chatBox = document.getElementById("chatBox");
    const closeChat = document.getElementById("closeChat");

    if (!chatBtn || !chatBox) {
        alert("Chat elements not found!");
        return;
    }

    // Open / Close Chat
    chatBtn.addEventListener("click", function () {

        if (chatBox.style.display === "flex") {
    chatBox.style.display = "none";
} else {
    chatBox.style.display = "flex";
}
    });

    // Close Button
    if (closeChat) {
        closeChat.addEventListener("click", function () {
            chatBox.style.display = "none";
        });
    }

};

// =========================
// VOICE INPUT (AI + API)
// =========================
function startVoice() {

    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = async function (event) {

        let text = event.results[0][0].transcript;

        document.getElementById("userText").innerText = text;

        let reply = await getAIResponse(text);

        document.getElementById("aiText").innerText = reply;

        speak(reply);
    };
}


// =========================
// CHATGPT BACKEND CALL
// =========================
async function getAIResponse(text) {

    try {
        let res = await fetch("https://ahsan-portfolio-production.up.railway.app/ai", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: text })
        });

        let data = await res.json();
        return data.reply;

    } catch (error) {
        return "Server connect nahi ho raha 😢";
    }
}


// =========================
// TEXT TO SPEECH
// =========================
function speak(text){

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);
    
}
const clearBtn = document.getElementById("clearChat");

if (clearBtn) {
    clearBtn.addEventListener("click", () => {
        document.getElementById("chatArea").innerHTML = "";
        localStorage.removeItem("chatHistory");
    });
}
// Send message on Enter key
document.getElementById("userInput").addEventListener("keypress", function (e) {

    if (e.key === "Enter") {

        e.preventDefault();

        sendMessage();

    }

});
// Load chat history
window.addEventListener("DOMContentLoaded", () => {

    const chat = document.getElementById("chatArea");

    const history = localStorage.getItem("chatHistory");

    if (history) {
        chat.innerHTML = history;
    }

});
// Voice Toggle
let voiceEnabled = false;

const voiceToggle = document.getElementById("voiceToggle");

if (voiceToggle) {

    voiceToggle.addEventListener("click", () => {

        voiceEnabled = !voiceEnabled;

        voiceToggle.innerHTML = voiceEnabled ? "🔊 ON" : "🔇 OFF";

    });

}
function quickAsk(question){

    document.getElementById("userInput").value = question;

    sendMessage();

}
// =========================
// DRAG CHAT BOX
// =========================

const chatBox = document.getElementById("chatBox");
const chatHeader = document.querySelector(".chat-header");

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

if(chatHeader){

chatHeader.addEventListener("mousedown",(e)=>{

    isDragging=true;

    offsetX=e.clientX-chatBox.offsetLeft;
    offsetY=e.clientY-chatBox.offsetTop;

});

document.addEventListener("mousemove",(e)=>{

    if(!isDragging) return;

    chatBox.style.left=(e.clientX-offsetX)+"px";
    chatBox.style.top=(e.clientY-offsetY)+"px";

    chatBox.style.right="auto";
    chatBox.style.bottom="auto";

});

document.addEventListener("mouseup",()=>{

    isDragging=false;

});

}
// ==========================
// CONTACT FORM EMAILJS
// ==========================

// EmailJS Init (Sirf 1 baar script ke start me)
emailjs.init({
    publicKey: "sL5JHUDNTqk0-c3xT"
});

// Contact Form
const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", function (e) {

        e.preventDefault();

        emailjs.send(
            "service_zxlxcpe",
            "template_kvf86xy",
            {
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                message: document.getElementById("message").value
            }
        )

        .then(function () {

            console.log("✅ Email Sent Successfully");

            alert("✅ Message Sent Successfully!");

            contactForm.reset();

        })

        .catch(function (error) {

            console.log(error);

            alert("❌ " + JSON.stringify(error));

        });

    });

}
// =========================
// HAMBURGER MENU
// =========================

const menuToggle = document.getElementById("menuToggle");
const navbar = document.getElementById("navbar");

if(menuToggle && navbar){

    menuToggle.addEventListener("click",()=>{

        navbar.classList.toggle("active");

        menuToggle.innerHTML =
        navbar.classList.contains("active")
        ? "✖"
        : "☰";

    });

}
