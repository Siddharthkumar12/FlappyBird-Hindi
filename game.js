// गेम वेरिएबल्स
const bird = document.getElementById('bird');
const gameContainer = document.getElementById('game-container');
const gameArea = document.getElementById('game-area');
const birdSelection = document.getElementById('bird-selection');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('game-over');

let birdPosition = 300;
let gravity = 0.5;
let velocity = 0;
let gameRunning = false;
let score = 0;
let pipes = [];
let pipeGap = 150;
let pipeFrequency = 1500;
let lastPipeTime = 0;
let selectedBird = 'duck';

// पक्षी चुनने का फंक्शन
function selectBird(birdType) {
    selectedBird = birdType;
    bird.style.backgroundImage = `url('assets/duck.png')`;
    birdSelection.style.display = 'none';
    gameArea.style.display = 'block';
    startGame();
}

// गेम शुरू करें
function startGame() {
    gameRunning = true;
    score = 0;
    scoreElement.textContent = score;
    birdPosition = 300;
    bird.style.top = birdPosition + 'px';
    gameOverElement.style.display = 'none';
    pipes.forEach(pipe => {
        if (pipe.top && pipe.bottom) {
            gameContainer.removeChild(pipe.top);
            gameContainer.removeChild(pipe.bottom);
        }
    });
    pipes = [];
    gameLoop();
}

// गेम लूप
function gameLoop() {
    if (!gameRunning) return;

    applyGravity();
    movePipes();
    
    const currentTime = Date.now();
    if (currentTime - lastPipeTime > pipeFrequency) {
        createPipe();
        lastPipeTime = currentTime;
    }
    
    requestAnimationFrame(gameLoop);
}

// गुरुत्वाकर्षण लागू करें
function applyGravity() {
    velocity += gravity;
    birdPosition += velocity;
    bird.style.top = birdPosition + 'px';
    
    if (birdPosition <= 0 || birdPosition >= gameContainer.offsetHeight - bird.offsetHeight) {
        endGame();
    }
}

// पाइप बनाएं
function createPipe() {
    const pipeTopHeight = Math.floor(Math.random() * (gameContainer.offsetHeight - pipeGap - 100)) + 50;
    
    const pipeTop = document.createElement('div');
    pipeTop.className = 'pipe';
    pipeTop.style.top = '0';
    pipeTop.style.height = pipeTopHeight + 'px';
    pipeTop.style.right = '0';
    
    const pipeBottom = document.createElement('div');
    pipeBottom.className = 'pipe';
    pipeBottom.style.bottom = '0';
    pipeBottom.style.height = (gameContainer.offsetHeight - pipeTopHeight - pipeGap) + 'px';
    pipeBottom.style.right = '0';
    
    gameContainer.appendChild(pipeTop);
    gameContainer.appendChild(pipeBottom);
    
    pipes.push({
        top: pipeTop,
        bottom: pipeBottom,
        passed: false,
        x: gameContainer.offsetWidth
    });
}

// पाइप्स हिलाएं
function movePipes() {
    pipes.forEach(pipe => {
        if (!gameRunning) return;
        
        pipe.x -= 2;
        pipe.top.style.right = (gameContainer.offsetWidth - pipe.x) + 'px';
        pipe.bottom.style.right = (gameContainer.offsetWidth - pipe.x) + 'px';
        
        // टकराव जांचें
        if (
            (birdPosition < pipe.top.offsetHeight || 
             birdPosition > gameContainer.offsetHeight - pipe.bottom.offsetHeight) &&
            pipe.x < 100 && pipe.x > 0
        ) {
            endGame();
        }
        
        // स्कोर बढ़ाएं
        if (!pipe.passed && pipe.x < 50) {
            pipe.passed = true;
            score++;
            scoreElement.textContent = score;
        }
        
        // पाइप हटाएं
        if (pipe.x < -60) {
            gameContainer.removeChild(pipe.top);
            gameContainer.removeChild(pipe.bottom);
            pipes = pipes.filter(p => p !== pipe);
        }
    });
}

// गेम ओवर
function endGame() {
    gameRunning = false;
    gameOverElement.style.display = 'block';
}

// डोनेट फंक्शन
function donate() {
    const upiId = 'yourupi@okaxis';
    const message = `Enjoyed the game? Donate via UPI: ${upiId}`;
    alert(message);
}

// शेयर फंक्शन
function shareGame() {
    const shareText = `मैंने फ्लैपी बर्ड में ${score} स्कोर किया! आप भी खेलें: ${window.location.href}`;
    if (navigator.share) {
        navigator.share({
            title: 'भारतीय फ्लैपी बर्ड',
            text: shareText,
            url: window.location.href
        });
    } else {
        prompt("लिंक को कॉपी करें:", window.location.href);
    }
}

// कीबोर्ड कंट्रोल
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (!gameRunning && gameArea.style.display === 'block') {
            startGame();
        } else {
            jump();
        }
    }
});

// जंप फंक्शन
function jump() {
    velocity = -10;
}
