let poppedCount = 0;
const totalBalloons = 4;

// ==========================================
// 0. GENERATE PARALLAX STARS
// ==========================================
function generateStars(elementId, count) {
    let shadow = '';
    for(let i=0; i<count; i++) {
        let x = Math.floor(Math.random() * window.innerWidth);
        let y = Math.floor(Math.random() * window.innerHeight);
        shadow += `${x}px ${y}px #FFF, `;
    }
    document.getElementById(elementId).style.boxShadow = shadow.slice(0, -2);
    document.getElementById(elementId).style.width = '2px';
    document.getElementById(elementId).style.height = '2px';
    document.getElementById(elementId).style.background = 'transparent';
    document.getElementById(elementId).style.borderRadius = '50%';
}
generateStars('stars1', 150);
generateStars('stars2', 100);
generateStars('stars3', 50);

document.addEventListener('mousemove', (e) => {
    const x = (e.clientX - window.innerWidth / 2) / 100;
    const y = (e.clientY - window.innerHeight / 2) / 100;
    document.getElementById('stars1').style.transform = `translate(${x * -2}px, ${y * -2}px)`;
    document.getElementById('stars2').style.transform = `translate(${x * -4}px, ${y * -4}px) scale(1.2)`;
    document.getElementById('stars3').style.transform = `translate(${x * -6}px, ${y * -6}px) scale(1.5)`;
});

// ==========================================
// 1. SPLIT SCREEN GATEWAY LOGIC & CONFETTI POP
// ==========================================
function burstConfetti(x, y) {
    const colors = ['#ff6b8b', '#ff4757', '#ffeaa7', '#55efc4', '#74b9ff', '#a29bfe'];
    for (let i = 0; i < 45; i++) {
        const conf = document.createElement('div');
        conf.className = 'confetti';
        conf.style.left = x + 'px';
        conf.style.top = y + 'px';
        conf.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 60 + Math.random() * 120;
        conf.style.setProperty('--tx', `${Math.cos(angle) * velocity}px`);
        conf.style.setProperty('--ty', `${Math.sin(angle) * velocity}px`);
        conf.style.setProperty('--rot', `${Math.random() * 360}deg`);
        
        document.body.appendChild(conf);
        setTimeout(() => conf.remove(), 1200);
    }
}

function checkUnlockDate() {
    const inputDate = document.getElementById('secret-dob').value;
    const inputName = document.getElementById('guest-name').value.trim();
    const errorMsg = document.getElementById('lock-error');
    
    // Check if they left the name or date blank
    if (!inputDate || !inputName) { 
        errorMsg.innerText = "Please enter your name and select a date!"; 
        
        const rightPanel = document.querySelector('.split-right');
        rightPanel.style.transform = "translateX(5px)";
        setTimeout(() => rightPanel.style.transform = "translateX(-5px)", 100);
        setTimeout(() => rightPanel.style.transform = "translateX(5px)", 200);
        setTimeout(() => rightPanel.style.transform = "translateX(0)", 300);
        return; 
    }

    // Trigger explosive celebratory button particle burst
    const btn = document.querySelector('.unlock-btn');
    const rect = btn.getBoundingClientRect();
    burstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);

    // --- INJECT THE NAME ACROSS THE APP ---
    document.getElementById('dynamic-name').innerText = inputName.toUpperCase();
    
    document.querySelectorAll('.dynamic-msg-name').forEach(el => {
        el.innerText = inputName;
    });

    // --- DEEPLY ROMANTIC LIVE-TYPING LETTER CONTENT ---
    letterString = `My dearest ${inputName},<br><br>Happy Birthday to the most incredible person.<br><br>Every moment spent with you feels like a beautiful dream. Your smile lights up my world, and your heart brings so much warmth to my life.<br><br>May this special day bring you as much joy, laughter, and endless love as you give to everyone around you. I promise to always cherish, support, and celebrate you, not just today, but for all the days to come.<br><br>You are my greatest adventure.<br><br><span style='color:#ff4757; font-weight:bold; float:right; font-family:Caveat; font-size:2rem; margin-top: 15px;'>~ With all my love ❤️<br>Yours Always</span>`;

    // --- PROCEED TO NEXT SCREEN ---
    errorMsg.innerText = ""; 
    const currentScreen = document.getElementById('screen0');
    currentScreen.classList.add('exiting');
    
    const audio = document.getElementById('bg-music');
    if (audio) {
        audio.volume = 0;
        audio.play().catch(e => console.log("Audio play deferred."));
        let fadeAudio = setInterval(function () {
            if (audio.volume < 0.3) { audio.volume += 0.05; }
            else { clearInterval(fadeAudio); }
        }, 200);
    }

    setTimeout(() => {
        currentScreen.classList.remove('active', 'exiting');
        document.getElementById('screen1').classList.add('active');
        startAmbientHearts(); 
    }, 500); 
}

// ==========================================
// 2. SCREEN NAVIGATION
// ==========================================
function nextScreen(screenNum) {
    const currentScreen = document.querySelector('.screen.active');
    if (currentScreen) {
        currentScreen.classList.add('exiting');
        
        setTimeout(() => {
            currentScreen.classList.remove('active', 'exiting');
            const targetScreen = document.getElementById(`screen${screenNum}`);
            if (targetScreen) targetScreen.classList.add('active');

            if (screenNum === '1a') initCarousel();
            if (screenNum === 4) initScratchCard(); 
            if (screenNum === 5) {
                startHeartRain(); 
            }
        }, 500); 
    }
}

function dodgeButton() {
    const noBtn = document.getElementById('no-btn');
    const screenCard = document.getElementById('screen1');
    if (!noBtn || !screenCard) return;

    noBtn.style.position = 'absolute'; noBtn.style.width = '140px'; 
    const padding = 20;
    const maxLeft = screenCard.clientWidth - noBtn.offsetWidth - padding;
    const maxTop = screenCard.clientHeight - noBtn.offsetHeight - padding;

    let targetX = Math.floor(Math.random() * (maxLeft - padding)) + padding;
    let targetY = Math.floor(Math.random() * (maxTop - padding)) + padding;
    if (targetY > screenCard.clientHeight - 150 && targetX < 200) targetY -= 150; 

    noBtn.style.left = `${targetX}px`; noBtn.style.top = `${targetY}px`;
}

function initCarousel() {
    const track = document.getElementById('reason-carousel');
    const dots = document.querySelectorAll('.dot');
    track.addEventListener('scroll', () => {
        let index = Math.round(track.scrollLeft / 220);
        dots.forEach(d => d.classList.remove('active-dot'));
        if(dots[index]) dots[index].classList.add('active-dot');
    });
}

// ==========================================
// 3. BALLOON POP GAME
// ==========================================
function popBalloon(element) {
    if (!element.classList.contains('popped')) {
        element.classList.add('popped');
        poppedCount++;
        if (poppedCount === totalBalloons) {
            setTimeout(() => document.getElementById('balloon-next-btn').classList.add('show-btn'), 800);
        }
    }
}

// ==========================================
// 4. MICROPHONE CANDLE LOGIC
// ==========================================
function blowOutCandle() {
    const flame = document.getElementById('candle-flame');
    if (flame) flame.style.display = 'none';
    setTimeout(() => nextScreen(4), 800);
}

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(function(stream) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
        analyser.smoothingTimeConstant = 0.75; analyser.fftSize = 512;
        microphone.connect(analyser); analyser.connect(javascriptNode); javascriptNode.connect(audioContext.destination);

        javascriptNode.onaudioprocess = function() {
            const array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            let totalAmplitude = 0;
            for (let i = 0; i < array.length; i++) totalAmplitude += array[i];
            const averageVolume = totalAmplitude / array.length;
            const currentScreen = document.getElementById('screen3');
            
            if (averageVolume > 52 && currentScreen && currentScreen.classList.contains('active')) {
                blowOutCandle(); stream.getTracks().forEach(track => track.stop());
            }
        };
    }).catch(function(err) { console.log("Mic offline. Tap works."); });
}

// ==========================================
// 5. SCRATCH-OFF TICKET
// ==========================================
let isScratched = false;
function initScratchCard() {
    const canvas = document.getElementById('scratch-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 280; canvas.height = 180;

    let gradient = ctx.createLinearGradient(0, 0, 280, 180);
    gradient.addColorStop(0, '#e2e2e2'); gradient.addColorStop(0.5, '#ffffff'); gradient.addColorStop(1, '#cccccc');
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    for(let i=0; i<100; i++) { ctx.fillRect(Math.random()*280, Math.random()*180, 2, 2); }

    ctx.font = 'bold 22px Poppins'; ctx.fillStyle = '#7f8c8d'; ctx.textAlign = 'center';
    ctx.fillText('Scratch Here!', canvas.width / 2, canvas.height / 2 + 5);

    let isDrawing = false;
    let scratchedPixels = 0;

    function scratch(e) {
        if (!isDrawing) return;
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath(); ctx.arc(x, y, 22, 0, Math.PI * 2); ctx.fill();
        scratchedPixels++;

        if (!isScratched && scratchedPixels > 40) {
            isScratched = true;
            setTimeout(() => document.getElementById('scratch-next-btn').classList.add('show-btn'), 1000);
        }
    }

    canvas.addEventListener('mousedown', () => isDrawing = true); canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('touchstart', () => isDrawing = true); canvas.addEventListener('touchend', () => isDrawing = false);
    canvas.addEventListener('touchmove', scratch);
}

// ==========================================
// 6. LIVE TYPING LETTER ENGINE
// ==========================================

let hasTyped = false;
let letterString = ""; 
let typeIndex = 0;

function openLetterCard() {
    const overlay = document.getElementById('letterModal');
    if (overlay) overlay.classList.add('show-card');
    
    if(!hasTyped) {
        hasTyped = true;
        document.getElementById('typing-content').innerHTML = ""; 
        setTimeout(typeWriterHTML, 800); 
    }
}

function closeLetterCard() {
    const overlay = document.getElementById('letterModal');
    if (overlay) overlay.classList.remove('show-card');
}

function typeWriterHTML() {
    if (typeIndex < letterString.length) {
        if (letterString.charAt(typeIndex) === '<') {
            let tag = "";
            while(letterString.charAt(typeIndex) !== '>') {
                tag += letterString.charAt(typeIndex); typeIndex++;
            }
            tag += '>'; document.getElementById('typing-content').innerHTML += tag; typeIndex++;
        } else {
            document.getElementById('typing-content').innerHTML += letterString.charAt(typeIndex); typeIndex++;
        }
        setTimeout(typeWriterHTML, 45); 
    } else {
        document.querySelector('.typing-cursor').style.display = 'none'; 
    }
}

// ==========================================
// 7. EFFECTS, SECRETS & PARTICLES
// ==========================================
function startAmbientHearts() {
    setInterval(() => {
        const heart = document.createElement('div'); heart.classList.add('ambient-heart');
        const symbols = ['🤍', '✨', '💫'];
        heart.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
        heart.style.left = Math.random() * 100 + 'vw'; heart.style.animationDuration = (Math.random() * 6 + 10) + 's'; 
        document.body.appendChild(heart); setTimeout(() => heart.remove(), 16000); 
    }, 1000); 
}

document.addEventListener('mousemove', function(e) {
    if(Math.random() > 0.6) {
        const dust = document.createElement('div'); dust.className = 'magic-dust';
        dust.style.left = e.pageX + 'px'; dust.style.top = e.pageY + 'px';
        document.body.appendChild(dust); setTimeout(() => dust.remove(), 600);
    }
});

let teddyClicks = 0;
function pokeTeddy() {
    teddyClicks++;
    const teddy = document.getElementById('left-teddy');
    teddy.style.transform = `scale(${1 + (teddyClicks * 0.1)}) rotate(${teddyClicks * -8}deg)`;
    teddy.style.transition = 'transform 0.2s';
    
    const cloud = document.querySelector('.teddy-hint-cloud');
    if (cloud) { cloud.style.opacity = '0'; cloud.style.transition = 'opacity 0.3s ease'; }
    
    if(teddyClicks === 3) {
        playSecretSound();
        
        // FIXED: Re-added the vibrant color hexes for the teddy balloon swarm!
        const colors = ['#ff4757', '#1e90ff', '#ffc107', '#2ed573', '#ff6b8b', '#a29bfe', '#fd79a8'];
        const particlePool = ['balloon', 'heart', 'star'];

        for(let i = 0; i < 65; i++) {
            setTimeout(() => {
                const swarm = document.createElement('div');
                swarm.className = 'swarm-balloon';
                swarm.style.left = Math.random() * 100 + 'vw';
                
                const scale = (Math.random() * 0.6) + 0.6;
                swarm.style.transform = `scale(${scale})`;
                swarm.style.animationDuration = (Math.random() * 2.5 + 3) + 's';
                
                const chosenType = particlePool[Math.floor(Math.random() * particlePool.length)];
                
                if (chosenType === 'balloon') {
                    const body = document.createElement('div');
                    body.className = 'swarm-body';
                    body.style.background = colors[Math.floor(Math.random() * colors.length)];
                    
                    const string = document.createElement('div');
                    string.className = 'swarm-string';
                    
                    swarm.appendChild(body);
                    swarm.appendChild(string);
                } else if (chosenType === 'heart') {
                    const hearts = ['💖', '💝', '💘', '❤️', '💕'];
                    swarm.innerHTML = `<span style="font-size: 2.8rem; filter: drop-shadow(0 5px 10px rgba(0,0,0,0.15));">${hearts[Math.floor(Math.random() * hearts.length)]}</span>`;
                } else {
                    const stars = ['✨', '⭐', '🌟', '💫'];
                    swarm.innerHTML = `<span style="font-size: 2.8rem; filter: drop-shadow(0 5px 10px rgba(0,0,0,0.15));">${stars[Math.floor(Math.random() * stars.length)]}</span>`;
                }
                
                document.body.appendChild(swarm);
                setTimeout(() => swarm.remove(), 5500);
            }, Math.random() * 2200); 
        }
        
        const secretMsg = document.createElement('div');
        secretMsg.className = 'secret-text';
        secretMsg.innerHTML = '✨ Party Mode Unlocked! ✨';
        document.getElementById('screen1').appendChild(secretMsg);
        
        setTimeout(() => secretMsg.remove(), 4000);
        teddyClicks = 0;
        setTimeout(() => teddy.style.transform = '', 1000);
    }
}

function playSecretSound() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.type = 'square'; 
    osc.frequency.setValueAtTime(440, audioCtx.currentTime); 
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1); 
    osc.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.2); 
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    osc.connect(gain); gain.connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + 0.3);
}

function startHeartRain() {
    setInterval(() => {
        const heart = document.createElement('div'); heart.classList.add('heart-particle');
        const symbols = ['❤️', '💖', '💝', '💘', '🌸', '✨'];
        heart.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
        heart.style.left = Math.random() * 100 + 'vw'; heart.style.animationDuration = (Math.random() * 2 + 3) + 's'; 
        document.body.appendChild(heart); setTimeout(() => heart.remove(), 5000);
    }, 200);
}

// --- SECRET KEYBOARD CODE ("LOVE") ---
let pressedKeys = "";
const secretCode = "love";

document.addEventListener('keydown', (e) => {
    pressedKeys += e.key.toLowerCase();
    if (pressedKeys.length > secretCode.length) { pressedKeys = pressedKeys.substring(1); }
    
    if (pressedKeys === secretCode) {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
        osc.type = 'sine'; 
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); 
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.2); 
        osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.4); 
        osc.frequency.setValueAtTime(1046.50, audioCtx.currentTime + 0.6); 
        gain.gain.setValueAtTime(0, audioCtx.currentTime); gain.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.1); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 2);
        osc.connect(gain); gain.connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + 2);
        
        for(let i=0; i<15; i++) {
            setTimeout(() => {
                const heart = document.createElement('div'); heart.classList.add('ambient-heart');
                heart.innerHTML = '💖'; heart.style.left = Math.random() * 100 + 'vw';
                heart.style.fontSize = '4rem'; heart.style.animationDuration = '3s';
                document.body.appendChild(heart); setTimeout(() => heart.remove(), 3000);
            }, i * 100);
        }
        pressedKeys = ""; 
    }
});