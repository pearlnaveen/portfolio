// Left Sidebar Mobile Navigation Menu Toggle
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebarLinks = document.querySelector('.sidebar-links');

if (sidebarToggle && sidebarLinks) {
    sidebarToggle.addEventListener('click', () => {
        sidebarLinks.classList.toggle('active');
        // Play quick interaction sound
        if (typeof RoboSynth !== 'undefined') RoboSynth.playClick();
    });
}

// Close sidebar menu when clicking links on mobile
document.querySelectorAll('.sidebar-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (sidebarLinks) sidebarLinks.classList.remove('active');
    });
});

// Ordered sections list to calculate sliding direction
const sectionOrder = [
    "#home",
    "#about",
    "#education",
    "#skills",
    "#projects",
    "#powerups",
    "#capabilities",
    "#certifications",
    "#contact"
];

let speedMultiplier = 1.0;
let isTransitioning = false;

// 3D space scene coordinates mapping (X, Y, Z, and rotations)
const sectionCoords = {
    "#home": { x: 0, y: 0, z: 0, rx: 0, ry: 0 },
    "#about": { x: 1400, y: -200, z: -1200, rx: 0, ry: -40 },
    "#education": { x: -1400, y: 400, z: -2200, rx: 15, ry: 40 },
    "#skills": { x: 1600, y: 600, z: -3200, rx: 0, ry: -45 },
    "#projects": { x: -1800, y: -600, z: -4200, rx: 0, ry: 55 },
    "#powerups": { x: 1800, y: -800, z: -5200, rx: 0, ry: -35 },
    "#capabilities": { x: -1400, y: 900, z: -6200, rx: 20, ry: 30 },
    "#certifications": { x: 1600, y: -400, z: -7200, rx: 0, ry: -50 },
    "#contact": { x: 0, y: 0, z: -8500, rx: 0, ry: 180 }
};

// Active section panel transition and nav manager using 3D Space Scene movements
function navigateToSection(targetId) {
    if (!targetId || targetId === '#' || isTransitioning) return;

    const sections = document.querySelectorAll('.main-content-wrapper section');
    const targetSection = document.querySelector(targetId);
    const mainWrapper = document.querySelector('.main-content-wrapper');
    if (!targetSection || !mainWrapper) return;

    const currentActiveSection = document.querySelector('.main-content-wrapper section.active');

    // Fallback for initial load
    if (!currentActiveSection || currentActiveSection === targetSection) {
        sections.forEach(sec => sec.classList.remove('active'));
        targetSection.classList.add('active');
        targetSection.scrollTop = 0;
        updateTopStatusBar(targetId);

        const coords = sectionCoords[targetId] || { x: 0, y: 0, z: 0, rx: 0, ry: 0 };
        mainWrapper.style.transform = `rotateX(${-coords.rx}deg) rotateY(${-coords.ry}deg) translate3d(${-coords.x}px, ${-coords.y}px, ${-coords.z}px)`;

        const reveals = targetSection.querySelectorAll('.reveal');
        reveals.forEach((el, index) => {
            setTimeout(() => el.classList.add('active'), index * 100);
        });

        // Enable flat-mode after a brief moment for initial load
        setTimeout(() => {
            mainWrapper.classList.add('flat-mode');
        }, 100);
        return;
    }

    isTransitioning = true;

    // Temporarily remove flat-mode to allow 3D transition layout to run
    mainWrapper.classList.remove('flat-mode');

    // Play quick robotic switch sound
    if (typeof RoboSynth !== 'undefined') {
        RoboSynth.playArpeggio();
    }

    // Phase 1: Warp background neural synapse speeds
    speedMultiplier = 12.0;

    // Phase 2: Translate and rotate camera container to target coordinates in space
    const target = sectionCoords[targetId] || { x: 0, y: 0, z: 0, rx: 0, ry: 0 };
    mainWrapper.style.transform = `rotateX(${-target.rx}deg) rotateY(${-target.ry}deg) translate3d(${-target.x}px, ${-target.y}px, ${-target.z}px)`;

    // Swap active class at midpoint of the camera fly-through (700ms)
    setTimeout(() => {
        currentActiveSection.classList.remove('active');
        targetSection.classList.add('active');
        targetSection.scrollTop = 0;

        updateTopStatusBar(targetId);

        document.querySelectorAll('.sidebar-links a').forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === targetId) {
                a.classList.add('active');
            }
        });
    }, 700);

    // Phase 3: Arrive at section, slow down grid warp, trigger horizontal laser sweep
    setTimeout(() => {
        speedMultiplier = 1.0;

        let scannerLine = document.getElementById('target-section-scanline');
        if (!scannerLine) {
            scannerLine = document.createElement('div');
            scannerLine.id = 'target-section-scanline';
            scannerLine.className = 'section-scanline';
            document.body.appendChild(scannerLine);
        }
        scannerLine.classList.remove('scanning');
        void scannerLine.offsetWidth;
        scannerLine.classList.add('scanning');

        // Glitch headings reveal
        const title = targetSection.querySelector('.section-title');
        if (title) {
            title.classList.remove('glitch-flicker');
            void title.offsetWidth;
            title.classList.add('glitch-flicker');
        }

        const reveals = targetSection.querySelectorAll('.reveal');
        reveals.forEach((el, index) => {
            el.classList.remove('active');
            setTimeout(() => {
                el.classList.add('active');
            }, index * 80);
        });

        // Re-enable flat-mode to ensure inputs and buttons are clickable and focused in 2D
        mainWrapper.classList.add('flat-mode');
        isTransitioning = false;
    }, 1600);
}

// Update Top AI HUD reactor progress levels
function updateTopStatusBar(targetId) {
    const levelIndicator = document.querySelector('.level-indicator');
    const progressFill = document.querySelector('.status-progress-fill');
    const statusPercent = document.querySelector('.status-percent');

    if (!levelIndicator || !progressFill || !statusPercent) return;

    let level = "BOOTING";
    let pct = "15%";

    switch (targetId) {
        case "#home":
            level = "BOOTING";
            pct = "15%";
            break;
        case "#about":
            level = "ONLINE";
            pct = "30%";
            break;
        case "#education":
            level = "LEARNING";
            pct = "45%";
            break;
        case "#skills":
            level = "LEARNING";
            pct = "55%";
            break;
        case "#projects":
            level = "OPTIMIZING";
            pct = "70%";
            break;
        case "#powerups":
            level = "OPTIMIZING";
            pct = "78%";
            break;
        case "#capabilities":
            level = "AUTONOMOUS";
            pct = "85%";
            break;
        case "#certifications":
            level = "AUTONOMOUS";
            pct = "92%";
            break;
        case "#contact":
            level = "SUPER AI";
            pct = "100%";
            break;
    }

    levelIndicator.textContent = `SYSTEM LEVEL // ${level}`;
    progressFill.style.width = pct;
    statusPercent.textContent = `${pct} COMPILER STABLE`;
}

// Bind clicks to single-page anchor tags
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId && targetId !== '#') {
            e.preventDefault();
            navigateToSection(targetId);
        }
    });
});

// Trigger reveals and setups on document load
document.addEventListener('DOMContentLoaded', () => {
    const homeSection = document.getElementById('home');
    if (homeSection) {
        homeSection.querySelectorAll('.reveal').forEach((el, index) => {
            setTimeout(() => el.classList.add('active'), index * 100);
        });
    }

    // Add custom cursor click pulse and vibrations
    document.addEventListener('click', (e) => {
        const clickEffect = document.createElement('div');
        clickEffect.className = 'cursor-click-effect';
        clickEffect.style.left = e.clientX + 'px';
        clickEffect.style.top = e.clientY + 'px';
        document.body.appendChild(clickEffect);
        setTimeout(() => clickEffect.remove(), 400);

        const interactive = e.target.closest('a, button, .glass-card, .sidebar-links a');
        if (interactive) {
            interactive.classList.remove('button-click-vibrate');
            void interactive.offsetWidth;
            interactive.classList.add('button-click-vibrate');
            setTimeout(() => {
                interactive.classList.remove('button-click-vibrate');
            }, 160);
        }
    });
});

/* ==========================================================================
   ROBOTIC SOUND SYNTHESIZER (WEB AUDIO API)
   ========================================================================== */
const RoboSynth = {
    ctx: null,
    muted: localStorage.getItem('robo-synth-muted') === 'true',

    init() {
        if (this.ctx) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch(e) {
            console.warn("Web Audio API not supported", e);
        }
    },

    playBoot() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        const ctx = this.ctx;
        const now = ctx.currentTime;

        // Deep sub hum
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(45, now);
        osc1.frequency.exponentialRampToValueAtTime(110, now + 1.5);
        gain1.gain.setValueAtTime(0.001, now);
        gain1.gain.linearRampToValueAtTime(0.25, now + 0.3);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

        // Cyber resonance filter sweep
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.Q.setValueAtTime(10, now);
        filter.frequency.setValueAtTime(100, now);
        filter.frequency.exponentialRampToValueAtTime(1200, now + 1.2);

        osc1.connect(filter);
        filter.connect(gain1);
        gain1.connect(ctx.destination);

        osc1.start(now);
        osc1.stop(now + 2.0);

        // Short digital sweep chimes
        setTimeout(() => {
            this.playArpeggio();
        }, 1000);
    },

    playArpeggio() {
        if (this.muted) return;
        this.init(); // Initialize context if not already done
        if (!this.ctx) return;
        const ctx = this.ctx;
        const now = ctx.currentTime;
        const freqs = [440, 554, 659, 880];
        freqs.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.08);
            gain.gain.setValueAtTime(0.001, now + i * 0.08);
            gain.gain.linearRampToValueAtTime(0.05, now + i * 0.08 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + i * 0.08);
            osc.stop(now + i * 0.08 + 0.35);
        });
    },

    playClick() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        const ctx = this.ctx;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1000, now);
        osc.frequency.setValueAtTime(1500, now + 0.04);

        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
    },

    playHover() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') return;

        const ctx = this.ctx;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(160, now);

        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
    },

    playSuccess() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        const ctx = this.ctx;
        const now = ctx.currentTime;

        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.08);
            gain.gain.setValueAtTime(0.04, now + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.2);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + i * 0.08);
            osc.stop(now + i * 0.08 + 0.25);
        });
    },

    playError() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        const ctx = this.ctx;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.linearRampToValueAtTime(70, now + 0.2);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.28);
    },

    playKeyboardClick() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        const ctx = this.ctx;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        // Randomize frequency slightly to sound like realistic mechanical keys
        const freq = 1200 + Math.random() * 600;
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.005 + Math.random() * 0.005, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.02);
    }
};

/* ==========================================================================
   CUSTOM CURSOR INTERPOLATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.getElementById('custom-cursor');
    const ring = document.getElementById('custom-cursor-ring');

    if (cursor && ring) {
        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        // Interpolation animation for the ring
        function animateRing() {
            const lerpFactor = 0.16;
            ringX += (mouseX - ringX) * lerpFactor;
            ringY += (mouseY - ringY) * lerpFactor;

            ring.style.left = ringX + 'px';
            ring.style.top = ringY + 'px';

            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Bind hover actions to interactive nodes
        const interactiveElements = 'a, button, .glass-card, .social-circle-link, .suggestion-chip, .contact-item, input, textarea, #sidebar-toggle';

        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(interactiveElements)) {
                document.body.classList.add('custom-cursor-hover');
                RoboSynth.playHover();
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(interactiveElements)) {
                document.body.classList.remove('custom-cursor-hover');
            }
        });

        document.addEventListener('click', () => {
            RoboSynth.playClick();
        });
    }
});

/* ==========================================================================
   BOOT LOADING DIAGNOSTICS & STATE MACHINE
   ========================================================================== */
const AIMLQuotes = [
    { text: "Predicting the future isn't magic, it's Artificial Intelligence.", author: "Dave Waters" },
    { text: "The search for artificial intelligence is the search for ourselves.", author: "Unknown Core" },
    { text: "Machine learning is the science of getting computers to act without being explicitly programmed.", author: "Andrew Ng" },
    { text: "By software, we build thoughts. By AI, we shape destiny.", author: "Naveen's Neural Kernel" },
    { text: "The question is not whether machines think but whether men do.", author: "B.F. Skinner" }
];

// Ambient Canvas Background drawing loop
// Ambient Canvas Background drawing loop: AI/ML Neural Synapse Network
function initBackgroundCanvas() {
    const canvas = document.createElement('canvas');
    canvas.id = 'ambient-canvas';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = (canvas.width = window.innerWidth);
        height = (canvas.height = window.innerHeight);
    });

    // Mouse tracking for Neural Activation
    let mouse = { x: null, y: null, radius: 150 };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    const neurons = [];
    const maxNeurons = 45;

    for (let i = 0; i < maxNeurons; i++) {
        neurons.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            size: Math.random() * 2 + 1,
            originalSize: Math.random() * 2 + 1,
            pulseSpeed: Math.random() * 0.05 + 0.01,
            pulseVal: Math.random() * Math.PI
        });
    }

    // Spawn interactive neural nodes on click
    window.addEventListener('click', (e) => {
        // Only spawn if sound toggle wasn't clicked
        if (e.target.closest('.hud-sound-btn')) return;
        
        const count = Math.floor(Math.random() * 5) + 8;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 2.0 + 0.8;
            neurons.push({
                x: e.clientX,
                y: e.clientY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 2.5 + 2,
                originalSize: Math.random() * 1.5 + 1,
                pulseSpeed: Math.random() * 0.05 + 0.01,
                pulseVal: Math.random() * Math.PI,
                isTemporary: true,
                alpha: 1.0,
                decay: Math.random() * 0.02 + 0.015
            });
        }
    });

    // Floating binary data particles
    const binaries = [];
    for (let i = 0; i < 15; i++) {
        binaries.push({
            x: Math.random() * width,
            y: Math.random() * height,
            val: Math.random() > 0.5 ? "1" : "0",
            vy: -Math.random() * 0.3 - 0.1,
            alpha: Math.random() * 0.3 + 0.05
        });
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        // 1. Tech Grid Background
        ctx.strokeStyle = 'rgba(0, 242, 254, 0.012)';
        ctx.lineWidth = 1;
        const gridSize = 80;
        for (let x = 0; x < width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // 2. Draw Synapses (Links between nearby Neurons)
        for (let i = 0; i < neurons.length; i++) {
            for (let j = i + 1; j < neurons.length; j++) {
                // Skip connecting temporary particles to each other to save CPU
                if (neurons[i].isTemporary && neurons[j].isTemporary) continue;
                
                const dx = neurons[i].x - neurons[j].x;
                const dy = neurons[i].y - neurons[j].y;
                const distSq = dx * dx + dy * dy;

                if (distSq < 12100) {
                    const dist = Math.sqrt(distSq);
                    let alpha = (1 - dist / 110) * 0.12;
                    if (neurons[i].isTemporary) alpha *= neurons[i].alpha;
                    if (neurons[j].isTemporary) alpha *= neurons[j].alpha;
                    
                    ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(neurons[i].x, neurons[i].y);
                    ctx.lineTo(neurons[j].x, neurons[j].y);
                    ctx.stroke();
                }
            }
        }

        // 3. Draw Neurons and handle mouse interactions
        for (let i = neurons.length - 1; i >= 0; i--) {
            const n = neurons[i];
            n.x += n.vx * speedMultiplier;
            n.y += n.vy * speedMultiplier;

            if (n.isTemporary) {
                n.alpha -= n.decay;
                if (n.alpha <= 0) {
                    neurons.splice(i, 1);
                    continue;
                }
            } else {
                if (n.x < 0) n.x = width;
                if (n.x > width) n.x = 0;
                if (n.y < 0) n.y = height;
                if (n.y > height) n.y = 0;
            }

            // Mouse proximity neural activation
            if (mouse.x !== null && mouse.y !== null && !n.isTemporary) {
                const mdx = n.x - mouse.x;
                const mdy = n.y - mouse.y;
                const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

                if (mDist < mouse.radius) {
                    // Attract slightly
                    n.x -= mdx * 0.015;
                    n.y -= mdy * 0.015;

                    // Glow connection line to mouse
                    const lineAlpha = (1 - mDist / mouse.radius) * 0.16;
                    ctx.strokeStyle = `rgba(0, 255, 196, ${lineAlpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(n.x, n.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();

                    n.size = n.originalSize + (1 - mDist / mouse.radius) * 2.5;
                } else {
                    n.size = n.originalSize;
                }
            } else if (!n.isTemporary) {
                n.size = n.originalSize;
            }

            // Draw Neuron Core (pulsating slightly)
            n.pulseVal += n.pulseSpeed;
            const sizePulse = n.size + Math.sin(n.pulseVal) * 0.5;

            ctx.beginPath();
            ctx.arc(n.x, n.y, sizePulse, 0, Math.PI * 2);
            ctx.fillStyle = n.isTemporary 
                ? `rgba(0, 255, 196, ${n.alpha * 0.75})`
                : `rgba(0, 255, 196, 0.4)`;
            ctx.fill();
        }

        // 4. Draw floating binary data matrices
        ctx.font = '10px Share Tech Mono';
        binaries.forEach(b => {
            b.y += b.vy * speedMultiplier;
            if (b.y < 0) {
                b.y = height;
                b.x = Math.random() * width;
                b.val = Math.random() > 0.5 ? "1" : "0";
            }

            ctx.fillStyle = `rgba(0, 242, 254, ${b.alpha})`;
            ctx.fillText(b.val, b.x, b.y);
        });

        requestAnimationFrame(draw);
    }
    draw();
}

document.addEventListener('DOMContentLoaded', () => {
    initBackgroundCanvas();
    const loadingScreen = document.getElementById('loading-screen');
    const fill = document.querySelector('.loader-bar-fill');
    const statusText = document.querySelector('.loader-status');
    const percentageText = document.querySelector('.loader-percentage');
    const logsTerminal = document.getElementById('loader-logs-terminal');

    // Add radar to boot eye loader container
    const eyeContainer = document.querySelector('.cyber-eye-container');
    if (eyeContainer) {
        const radar = document.createElement('div');
        radar.className = 'loader-radar';
        eyeContainer.appendChild(radar);
    }

    if (!loadingScreen) return;

    const diagnostics = [
        "Initializing Neural Core...",
        "Connecting AI Modules...",
        "Loading Memory...",
        "Activating Vision System...",
        "Synchronizing Sensors...",
        "Establishing Secure Connection...",
        "AI System Online"
    ];

    let progress = 0;
    let logIndex = 0;

    function appendLog(log) {
        if (!logsTerminal) return;
        const line = document.createElement('div');
        line.className = 'log-line';
        line.textContent = `> ${log}`;
        logsTerminal.appendChild(line);
        logsTerminal.scrollTop = logsTerminal.scrollHeight;
    }

    const loadingInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 4) + 2;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            statusText.textContent = "CORE MATRIX CONNECTED.";
            setTimeout(transitionToEntrance, 600);
        }

        fill.style.width = progress + '%';
        percentageText.textContent = progress + '%';

        if (progress > (logIndex + 1) * 10 && logIndex < diagnostics.length) {
            appendLog(diagnostics[logIndex]);
            logIndex++;
            RoboSynth.playHover();
        }
    }, 110);

    function transitionToEntrance() {
        loadingScreen.classList.add('fade-out');
        const entranceScreen = document.getElementById('entrance-screen');
        if (entranceScreen) {
            entranceScreen.classList.remove('hidden');
            typeEntranceQuote();
        }
    }

    function typeEntranceQuote() {
        const textEl = document.getElementById('entrance-quote-text');
        const authorEl = document.getElementById('entrance-quote-author');
        if (!textEl || !authorEl) return;

        // Resume AudioContext on first click or keydown to bypass browser Autoplay policy
        const resumeAudio = () => {
            if (typeof RoboSynth !== 'undefined') {
                RoboSynth.init();
                if (RoboSynth.ctx && RoboSynth.ctx.state === 'suspended') {
                    RoboSynth.ctx.resume();
                }
            }
        };
        document.addEventListener('click', resumeAudio, { once: true });
        document.addEventListener('keydown', resumeAudio, { once: true });

        const randomQuote = AIMLQuotes[Math.floor(Math.random() * AIMLQuotes.length)];
        textEl.textContent = '';
        authorEl.textContent = '';

        let charIdx = 0;
        const text = `"${randomQuote.text}"`;

        function typeNextChar() {
            if (charIdx < text.length) {
                textEl.textContent += text.charAt(charIdx);
                charIdx++;
                
                if (typeof RoboSynth !== 'undefined') {
                    RoboSynth.playKeyboardClick();
                }
                
                setTimeout(typeNextChar, 35);
            } else {
                authorEl.textContent = `- ${randomQuote.author}`;
                RoboSynth.playArpeggio();
                // Clean up listeners if they weren't triggered
                document.removeEventListener('click', resumeAudio);
                document.removeEventListener('keydown', resumeAudio);
            }
        }
        typeNextChar();
    }
});

// Bind Entrance Button to Enter main portfolio
document.addEventListener('DOMContentLoaded', () => {
    const enterBtn = document.getElementById('entrance-enter-btn');
    const entranceScreen = document.getElementById('entrance-screen');

    if (enterBtn && entranceScreen) {
        enterBtn.addEventListener('click', () => {
            RoboSynth.playBoot();
            entranceScreen.classList.add('fade-out');

            setTimeout(() => {
                entranceScreen.classList.add('hidden');
                navigateToSection('#home');
            }, 800);
        });
    }
});

// Interactive Card Spotlights Glow Effect
document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Contact Form Handler (Web3Forms API Integration) with Draft Auto-Saving
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    // Load drafts on startup
    if (nameInput) nameInput.value = localStorage.getItem('contact-draft-name') || '';
    if (emailInput) emailInput.value = localStorage.getItem('contact-draft-email') || '';
    if (messageInput) messageInput.value = localStorage.getItem('contact-draft-message') || '';

    // Auto-save on input
    const saveDrafts = () => {
        if (nameInput) localStorage.setItem('contact-draft-name', nameInput.value);
        if (emailInput) localStorage.setItem('contact-draft-email', emailInput.value);
        if (messageInput) localStorage.setItem('contact-draft-message', messageInput.value);
    };

    if (nameInput) nameInput.addEventListener('input', saveDrafts);
    if (emailInput) emailInput.addEventListener('input', saveDrafts);
    if (messageInput) messageInput.addEventListener('input', saveDrafts);

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;

        // Show loading state with a spinner
        submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        const formData = new FormData(contactForm);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
            .then(async (response) => {
                let jsonRes = await response.json();
                if (response.status === 200) {
                    showSuccessToast();
                    contactForm.reset();
                    // Clear drafts
                    localStorage.removeItem('contact-draft-name');
                    localStorage.removeItem('contact-draft-email');
                    localStorage.removeItem('contact-draft-message');
                } else {
                    console.log(response);
                    alert(jsonRes.message || "Something went wrong. Please try again.");
                }
            })
            .catch(error => {
                console.log(error);
                alert("Form submission failed. Please check your internet connection.");
            })
            .then(() => {
                // Restore button state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
    });
}

// Custom Success Toast Notification
function showSuccessToast() {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    // Create toast card
    const toast = document.createElement('div');
    toast.className = 'toast success-toast';
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-check-circle toast-icon"></i>
            <div class="toast-message">
                <h4>Success!</h4>
                <p>Your message has been sent successfully.</p>
            </div>
            <button class="toast-close"><i class="fas fa-times"></i></button>
        </div>
        <div class="toast-progress"></div>
    `;

    toastContainer.appendChild(toast);

    // Close button click listener
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 400);
    });

    // Auto-remove after 4 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 400);
        }
    }, 4000);
}

/* ==========================================================================
   CLIENT-SIDE RULE-BASED KEYWORD CHATBOT ENGINE
   ========================================================================== */
const ChatbotDatabase = {
    greetings: {
        keywords: ["hi", "hello", "hey", "greetings", "bot", "assistant", "system", "start", "welcome"],
        response: "Hello human! 🤖 I am Naveen's AI Cybernetic Assistant. I can compile details about his **projects**, **skills**, **education**, **certifications**, or provide coordinates for **contact**. How can I assist you today?",
        action: null
    },
    about: {
        keywords: ["about", "who are you", "who is", "profile", "bio", "details", "naveen", "muthu"],
        response: "Muthu Naveen N is an aspiring Software Engineer & AI Enthusiast based in Tirunelveli, India. Specializing in C/C++, Java, Python, and Spring Boot backend engineering, he aims to develop intelligent, scalable systems. He holds an 8.16 CGPA in Computer Science at National Engineering College.",
        action: null
    },
    skills: {
        keywords: ["skill", "skills", "tech", "stack", "languages", "programming", "python", "java", "c++", "c", "node", "git", "github", "dbms", "communication", "ml", "machine learning", "dsa", "problem solving"],
        response: "Naveen's technical matrices include:\n- **Languages**: C, C++, Java, Python\n- **Development**: Node, Git & GitHub, DBMS\n- **Core Competencies**: Machine Learning, Data Structure, Technical Communication, and Advanced Problem Solving.\n\nI am navigating you to the Skills section to view the inventory panels.",
        action: "scroll_skills"
    },
    projects: {
        keywords: ["project", "projects", "work", "portfolio", "code", "github", "drift", "rl", "log", "monitor", "booking", "management"],
        response: "Naveen's primary projects are:\n1. **driftRL**: Reinforcement Learning platform designed to handle data drift in datasets dynamically.\n2. **Machine Log Monitor**: Full-stack Spring Boot REST tracker for server logs and health.\n3. **Tour Booking Manager**: C++ console software using core OOP design principles.\n\nType 'github' to view the code on his profile, or I can scroll you to the Projects grid.",
        action: "scroll_projects"
    },
    education: {
        keywords: ["education", "academic", "college", "school", "cgpa", "marks", "grade", "gpa", "b.e", "degree", "nec"],
        response: "Academic records log:\n- **B.E. Computer Science & Engineering**: National Engineering College (CGPA: 8.16 / 10)\n- **Higher Secondary (12th Grade)**: St. John's Matric Hr Sec School (Score: 87.16%)\n- **Secondary (10th Grade)**: St. John's Matric Hr Sec School (Score: 92.4%)",
        action: "scroll_education"
    },
    certifications: {
        keywords: ["certification", "certifications", "achievement", "achievements", "credentials", "course", "courses", "nptel", "oracle", "deloitte", "tata"],
        response: "Naveen holds professional certifications in:\n- **AI Specialization**: Deep Learning, Generative AI (Generative AI, Deep Learning)\n- **Database Design**: Oracle partners certificate\n- **National NPTEL**: Deep Learning, Cloud Computing, Industrial IoT 4.0\n- **Job Simulations**: AI/ML simulations from Tata and Deloitte\n- **Tech Fest**: 2nd place in UI Design Innovation (Intellina'26 at CIT Coimbatore)",
        action: "scroll_certifications"
    },
    powerups: {
        keywords: ["powerup", "powerups", "ai tools", "chatgpt", "gemini", "claude", "grok", "perplexity", "replit", "antigravity", "openai", "perplexity", "tool", "tools"],
        response: "Naveen actively employs these **AI Powerups**:\n- **ChatGPT**: OpenAI engine for logical reasoning and debugging.\n- **Gemini**: Google core for multi-modal context mapping.\n- **Claude**: Anthropic system for analysis and documentation synthesis.\n- **Grok**: xAI matrix for real-time querying.\n- **Anti Gravity**: DeepMind agentic SDK.\n- **Replit**: Sandbox sandbox for quick compilation.\n- **Perplexity**: Research search matrix.\n\nI will redirect your console to the AI Powerups matrix panel.",
        action: "scroll_powerups"
    },
    capabilities: {
        keywords: ["capability", "capabilities", "help", "build", "building", "services", "ml model", "machine learning model", "ai agent", "web application", "applications", "oops", "rest api"],
        response: "Naveen's **Core Capabilities** include:\n1. **Building ML Models**: Deep learning pipelines and Reinforcement Learning nodes (e.g. driftRL).\n2. **Building AI Agents**: Logical classification arrays, tool-binding, and autonomous decision loops.\n3. **Building Web Applications**: REST API integration, Spring Boot, MySQL, and glassmorphic designs.\n\nRedirecting your console to the Core Capabilities log.",
        action: "scroll_capabilities"
    },
    contact: {
        keywords: ["contact", "email", "phone", "linkedin", "hire", "address", "location", "reach", "mail", "connect"],
        response: "Naveen's contact coordinates:\n- **Email**: [pearlnaveen24@gmail.com](mailto:pearlnaveen24@gmail.com)\n- **Phone**: +91 6374668011\n- **LinkedIn**: [Muthu Naveen N on LinkedIn](https://www.linkedin.com/in/muthu-naveen-n-24104028cse/)\n- **GitHub**: [pearlnaveen on GitHub](https://github.com/pearlnaveen)\n- **Location**: Tirunelveli, India\n\nI will scroll you to the contact form so you can send a message directly.",
        action: "scroll_contact"
    },
    resume: {
        keywords: ["resume", "cv", "download", "pdf", "file"],
        response: "CV download requested. I have compiled Muthu Naveen's resume: [Download Resume (PDF)](knowledge/resume.pdf).\nExecuting direct download now...",
        action: "download_resume"
    },
    github_action: {
        keywords: ["open github", "link github", "github link"],
        response: "Opening Muthu Naveen's GitHub profile in a new tab... 🐙",
        action: "open_github"
    },
    linkedin_action: {
        keywords: ["open linkedin", "link linkedin", "linkedin link"],
        response: "Opening Muthu Naveen's LinkedIn profile in a new tab... 🌐",
        action: "open_linkedin"
    }
};

function getBotResponse(userQuery) {
    const query = userQuery.toLowerCase().trim();
    let bestMatch = null;
    let highestScore = 0;

    for (const key in ChatbotDatabase) {
        const entry = ChatbotDatabase[key];
        let score = 0;

        entry.keywords.forEach(keyword => {
            if (query.includes(keyword)) {
                score += keyword.length; // Higher weight for longer matching words
            }
        });

        if (score > highestScore) {
            highestScore = score;
            bestMatch = entry;
        }
    }

    if (highestScore > 0 && bestMatch) {
        return bestMatch;
    }

    return {
        response: "Query parameters unrecognized. 🤖 Try asking about Naveen's **projects**, **skills**, **education**, or type **resume** to download his CV.",
        action: null
    };
}

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const chatToggleBtn = document.getElementById('chatbot-toggle-btn');
    const chatPanel = document.getElementById('chatbot-panel');
    const chatCloseBtn = document.getElementById('chatbot-close-btn');
    const chatMinimizeBtn = document.getElementById('chatbot-minimize-btn');
    const chatClearBtn = document.getElementById('chatbot-clear-btn');
    const chatMessages = document.getElementById('chatbot-messages');
    const chatForm = document.getElementById('chatbot-form');
    const chatInput = document.getElementById('chatbot-input');
    const chatSuggestions = document.getElementById('chatbot-suggestions');

    let lastUserQuery = '';
    let isGenerating = false;
    let typingIndicator = null;

    // Chat sound typing chatter simulation
    function playChatterSound() {
        let count = 0;
        const max = Math.floor(Math.random() * 3) + 3;
        const chatterInterval = setInterval(() => {
            if (count >= max) {
                clearInterval(chatterInterval);
                return;
            }
            RoboSynth.playHover();
            count++;
        }, 50);
    }

    // Toggles
    if (chatToggleBtn && chatPanel) {
        chatToggleBtn.addEventListener('click', () => {
            const isHidden = chatPanel.classList.contains('hidden');
            if (isHidden) {
                chatPanel.classList.remove('hidden');
                chatPanel.classList.remove('minimized');
                chatInput.focus();
                scrollToBottom();
            } else {
                chatPanel.classList.add('hidden');
            }
        });
    }

    if (chatCloseBtn && chatPanel) {
        chatCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            chatPanel.classList.add('hidden');
        });
    }

    if (chatMinimizeBtn && chatPanel) {
        chatMinimizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            chatPanel.classList.toggle('minimized');
            if (!chatPanel.classList.contains('minimized')) {
                chatInput.focus();
            }
        });
    }

    // Clear
    if (chatClearBtn) {
        chatClearBtn.addEventListener('click', () => {
            if (confirm("Clear this conversation history?")) {
                clearChatUI();
            }
        });
    }

    function clearChatUI() {
        chatMessages.innerHTML = `
            <div class="message chatbot-msg system-msg">
                <div class="message-bubble">
                    <p>Hi! I'm Muthu Naveen N's AI assistant. Ask me anything about his projects, skills, education, certifications, or how to contact him. 🤖</p>
                </div>
            </div>
        `;
        if (chatSuggestions) {
            chatMessages.appendChild(chatSuggestions);
        }
        localStorage.removeItem('chatbot-history');
        chatPanel.classList.remove('minimized');
        chatInput.focus();
    }

    function saveChatHistory() {
        const messages = [];
        const msgElements = chatMessages.querySelectorAll('.message:not(.typing-indicator-msg)');
        msgElements.forEach(msg => {
            const sender = msg.classList.contains('user-msg') ? 'user' : (msg.classList.contains('system-msg') ? 'system' : 'chatbot');
            const bubble = msg.querySelector('.message-bubble');
            const time = msg.querySelector('.message-time')?.textContent || '';
            if (bubble) {
                // Remove the action buttons from stored HTML to keep saved log clean
                const actions = bubble.querySelector('.message-actions');
                let cleanHTML = bubble.innerHTML;
                if (actions) {
                    cleanHTML = cleanHTML.replace(actions.outerHTML, '');
                }
                messages.push({
                    sender,
                    html: cleanHTML,
                    time
                });
            }
        });
        localStorage.setItem('chatbot-history', JSON.stringify(messages));
    }

    function loadChatHistory() {
        const stored = localStorage.getItem('chatbot-history');
        if (stored) {
            try {
                const messages = JSON.parse(stored);
                if (messages.length > 0) {
                    chatMessages.innerHTML = '';
                    messages.forEach(msg => {
                        const msgDiv = document.createElement('div');
                        msgDiv.className = `message ${msg.sender === 'user' ? 'user-msg' : (msg.sender === 'system' ? 'system-msg' : 'chatbot-msg')}`;

                        const bubble = document.createElement('div');
                        bubble.className = 'message-bubble';
                        bubble.innerHTML = msg.html;
                        msgDiv.appendChild(bubble);

                        const timeSpan = document.createElement('span');
                        timeSpan.className = 'message-time';
                        timeSpan.textContent = msg.time;
                        msgDiv.appendChild(timeSpan);

                        chatMessages.appendChild(msgDiv);
                        
                        // Re-bind actions for chatbot messages
                        if (msg.sender === 'chatbot') {
                            const rawText = bubble.textContent.trim();
                            addMessageActions(msgDiv, rawText);
                        }
                    });
                    
                    if (chatSuggestions && chatSuggestions.parentNode === chatMessages) {
                        chatMessages.removeChild(chatSuggestions);
                    }
                    scrollToBottom();
                }
            } catch (e) {
                console.error("Failed to parse chatbot history", e);
            }
        }
    }

    // Suggested Chips Bindings
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('suggestion-chip')) {
            const promptText = e.target.textContent;
            handleUserMessage(promptText);
        }
    });

    // Form Submit
    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const messageText = chatInput.value.trim();
            if (!messageText || isGenerating) return;
            chatInput.value = '';
            handleUserMessage(messageText);
        });
    }

    // Core message handler
    function handleUserMessage(messageText) {
        // Hide suggestions on first message
        if (chatSuggestions && chatSuggestions.parentNode === chatMessages) {
            chatMessages.removeChild(chatSuggestions);
        }

        lastUserQuery = messageText;
        appendMessage('user', messageText, false);

        showTyping();
        isGenerating = true;

        // Simulate thinking delay (500 - 1000ms)
        const delay = Math.floor(Math.random() * 500) + 500;

        setTimeout(() => {
            hideTyping();

            // Get response from local keyword DB
            const match = getBotResponse(messageText);

            // Append message to UI
            const aiMsgEl = appendMessage('chatbot', match.response, true);
            addMessageActions(aiMsgEl, match.response);

            // Play success synth chords and computer chatter audio
            playChatterSound();

            // Execute actions mapped in the database
            if (match.action) {
                setTimeout(() => {
                    executeCustomAction(match.action);
                }, 800);
            }

            isGenerating = false;
        }, delay);
    }

    // Append bubble to logs
    function appendMessage(sender, text, isMarkdown = true) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender === 'user' ? 'user-msg' : 'chatbot-msg'}`;

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';

        if (isMarkdown && sender === 'chatbot') {
            bubble.innerHTML = renderMarkdown(text);
        } else {
            const p = document.createElement('p');
            p.textContent = text;
            bubble.appendChild(p);
        }

        msgDiv.appendChild(bubble);

        const timeSpan = document.createElement('span');
        timeSpan.className = 'message-time';
        timeSpan.textContent = getFormattedTime();
        msgDiv.appendChild(timeSpan);

        chatMessages.appendChild(msgDiv);
        scrollToBottom();

        if (sender === 'chatbot' && typeof Prism !== 'undefined') {
            Prism.highlightAllUnder(bubble);
        }

        // Save new logs state in history
        saveChatHistory();

        return msgDiv;
    }

    // Add buttons
    function addMessageActions(messageElement, text) {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'message-actions';

        const copyBtn = document.createElement('button');
        copyBtn.className = 'msg-action-btn copy-btn';
        copyBtn.innerHTML = '<i class="far fa-copy"></i> Copy';
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(text).then(() => {
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="far fa-copy"></i> Copy';
                }, 2000);
            });
        });
        actionsDiv.appendChild(copyBtn);

        const regenBtn = document.createElement('button');
        regenBtn.className = 'msg-action-btn';
        regenBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Retry';
        regenBtn.addEventListener('click', () => {
            if (isGenerating) return;
            messageElement.remove();
            handleUserMessage(lastUserQuery);
        });
        actionsDiv.appendChild(regenBtn);

        messageElement.appendChild(actionsDiv);
    }

    // Typing loading dots
    function showTyping() {
        if (typingIndicator) return;

        typingIndicator = document.createElement('div');
        typingIndicator.className = 'message chatbot-msg typing-indicator-msg';
        typingIndicator.innerHTML = `
            <div class="message-bubble">
                <div class="typing-indicator">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingIndicator);
        scrollToBottom();
    }

    function hideTyping() {
        if (typingIndicator) {
            typingIndicator.remove();
            typingIndicator = null;
        }
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getFormattedTime() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutes} ${ampm}`;
    }

    // Markdown compiler
    function renderMarkdown(text) {
        if (typeof marked !== 'undefined' && typeof marked.parse === 'function') {
            return marked.parse(text);
        }

        // Basic fallback compilation rules
        let html = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
            return `<pre><code class="language-${lang || 'txt'}">${code.trim()}</code></pre>`;
        });

        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/^\s*-\s+(.+)$/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

        return html;
    }

    // Trigger local client behaviors
    function executeCustomAction(actionName) {
        switch (actionName) {
            case 'download_resume':
                appendMessage('chatbot', "Triggering resume download... 📄", false);
                setTimeout(() => {
                    const link = document.createElement('a');
                    link.href = 'knowledge/resume.pdf';
                    link.download = 'Muthu Naveen N.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    RoboSynth.playSuccess();
                }, 800);
                break;

            case 'open_github':
                appendMessage('chatbot', "Opening Muthu Naveen's GitHub profile... 🐙", false);
                setTimeout(() => {
                    window.open("https://github.com/pearlnaveen", "_blank");
                }, 800);
                break;

            case 'open_linkedin':
                appendMessage('chatbot', "Opening Muthu Naveen's LinkedIn profile... 🌐", false);
                setTimeout(() => {
                    window.open("https://www.linkedin.com/in/muthu-naveen-n-24104028cse/", "_blank");
                }, 800);
                break;

            case 'scroll_contact':
                appendMessage('chatbot', "Accessing contacts terminal... ✉️", false);
                setTimeout(() => {
                    chatPanel.classList.add('minimized');
                    navigateToSection('#contact');
                }, 800);
                break;

            case 'scroll_projects':
                appendMessage('chatbot', "Accessing projects archives... 📁", false);
                setTimeout(() => {
                    chatPanel.classList.add('minimized');
                    navigateToSection('#projects');
                }, 800);
                break;

            case 'scroll_skills':
                appendMessage('chatbot', "Accessing skills analytics matrices... 📊", false);
                setTimeout(() => {
                    chatPanel.classList.add('minimized');
                    navigateToSection('#skills');
                }, 800);
                break;

            case 'scroll_education':
                appendMessage('chatbot', "Accessing educational logs... 🎓", false);
                setTimeout(() => {
                    chatPanel.classList.add('minimized');
                    navigateToSection('#education');
                }, 800);
                break;

            case 'scroll_certifications':
                appendMessage('chatbot', "Accessing credentials vaults... 🏆", false);
                setTimeout(() => {
                    chatPanel.classList.add('minimized');
                    navigateToSection('#certifications');
                }, 800);
                break;

            case 'scroll_powerups':
                appendMessage('chatbot', "Accessing AI powerups matrix... ⚡", false);
                setTimeout(() => {
                    chatPanel.classList.add('minimized');
                    navigateToSection('#powerups');
                }, 800);
                break;

            case 'scroll_capabilities':
                appendMessage('chatbot', "Accessing capabilities mainframe... ⚙️", false);
                setTimeout(() => {
                    chatPanel.classList.add('minimized');
                    navigateToSection('#capabilities');
                }, 800);
                break;

            default:
                console.warn("Unhandled chatbot action:", actionName);
        }
    }

    // Restore persisted chatbot logs on page load
    loadChatHistory();

    // Sound HUD Toggle Switch Handler
    const soundBtn = document.getElementById('sound-toggle-btn');
    if (soundBtn) {
        const soundIcon = soundBtn.querySelector('i');
        const soundLabel = soundBtn.querySelector('.sound-status-label');
        
        // Synchronize initial sound states
        if (RoboSynth.muted) {
            soundBtn.classList.add('muted');
            if (soundIcon) soundIcon.className = 'fas fa-volume-mute';
            if (soundLabel) soundLabel.textContent = 'AUDIO: OFF';
        }

        soundBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Avoid triggering screen click effects
            RoboSynth.muted = !RoboSynth.muted;
            localStorage.setItem('robo-synth-muted', RoboSynth.muted);
            
            if (RoboSynth.muted) {
                soundBtn.classList.add('muted');
                if (soundIcon) soundIcon.className = 'fas fa-volume-mute';
                if (soundLabel) soundLabel.textContent = 'AUDIO: OFF';
            } else {
                soundBtn.classList.remove('muted');
                if (soundIcon) soundIcon.className = 'fas fa-volume-up';
                if (soundLabel) soundLabel.textContent = 'AUDIO: ON';
                // Trigger a quick click confirmation audio chord
                RoboSynth.playClick();
            }
        });
    }
});