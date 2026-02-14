// ========== GLOBAL VARIABLES ==========
let currentPage = 1;
let currentPhotoIndex = 0;
let isEnvelopeOpened = false;
let musicStarted = false;
let shakeCount = 0;
let lastShakeTime = 0;

const bgMusic = document.getElementById('bgMusic');
const musicControl = document.getElementById('musicControl');

// ========== CUSTOM CURSOR ==========
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    setTimeout(() => {
        cursorTrail.style.left = e.clientX + 'px';
        cursorTrail.style.top = e.clientY + 'px';
    }, 100);
});

// ========== LOADING SCREEN ==========
window.addEventListener('load', function() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        loadingScreen.classList.add('hidden');
        
        // Start floating hearts after loading
        startFloatingHearts();
    }, 2000);
});

// ========== MUSIC CONTROL ==========
musicControl.addEventListener('click', function() {
    if (bgMusic.paused) {
        bgMusic.play();
        this.classList.remove('muted');
    } else {
        bgMusic.pause();
        this.classList.add('muted');
    }
});

// ========== PAGE 1: 3D ENVELOPE WITH WAX SEAL ==========

const waxSeal = document.getElementById('waxSeal');
const envelope3d = document.getElementById('envelope3d');
const letterCard = document.getElementById('letterCard');
const instruction = document.getElementById('instruction');
const cardMessage = document.querySelector('.typewriter-text');
const nextBtn1 = document.getElementById('nextBtn1');

// Full message text
const fullMessage = `UNTUKK KAMUU ORANG YANG PALING AKU CINTAI
DAN AKU PERCAYA AKU JUGA ORANG YANG PALING KAMU CINTAI
DAN ORANGG YANG MEMBUAT HIDUPKUU LEBIHH BERWARNA HAIIIII SAYANGGGG`;

// Wax seal click handler
waxSeal.addEventListener('click', function() {
    if (isEnvelopeOpened) return;
    
    // Break wax seal
    this.classList.add('breaking');
    instruction.classList.add('hidden');
    
    setTimeout(() => {
        waxSeal.style.display = 'none';
        
        // Open envelope
        envelope3d.classList.add('opened');
        
        // Create confetti explosion
        createConfetti(100);
        
        setTimeout(() => {
            // Reveal letter
            letterCard.classList.add('revealed');
            
            // Start music
            if (!musicStarted) {
                bgMusic.play().catch(err => {
                    console.log('Music autoplay prevented:', err);
                });
                musicStarted = true;
                musicControl.classList.remove('muted');
            }
            
            // Start typewriter
            setTimeout(() => {
                typeWriter(fullMessage, 0);
            }, 800);
            
        }, 600);
    }, 800);
    
    isEnvelopeOpened = true;
});

// Typewriter effect
function typeWriter(text, index) {
    if (index < text.length) {
        cardMessage.textContent += text.charAt(index);
        setTimeout(() => typeWriter(text, index + 1), 50);
    } else {
        // Show next button after typing complete
        setTimeout(() => {
            nextBtn1.classList.add('show');
        }, 300);
    }
}

// Confetti effect
function createConfetti(count) {
    const colors = ['#ff4757', '#ff6b81', '#ffd93d', '#ff8fab', '#ffb3c1', '#a29bfe', '#74b9ff'];
    
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-particle';
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = confetti.style.width;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = '50%';
            confetti.style.top = '30%';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            
            const angle = (Math.random() * 360) * (Math.PI / 180);
            const velocity = Math.random() * 250 + 150;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity - 100; // Gravity effect
            
            confetti.style.animation = `confettiFall 2.5s ease-out forwards`;
            confetti.style.setProperty('--tx', tx + 'px');
            confetti.style.setProperty('--ty', ty + 'px');
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 2500);
        }, i * 15);
    }
}

// CSS for confetti animation
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translate(var(--tx), calc(var(--ty) + 300px)) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);

// ========== FLOATING HEARTS (PAGE 1) ==========
let heartsInterval;

function createFloatingHeart() {
    const heartsContainer = document.querySelector('.floating-hearts');
    if (!heartsContainer) return;
    
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.position = 'absolute';
    heart.style.fontSize = Math.random() * 20 + 15 + 'px';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.top = '100%';
    heart.style.opacity = Math.random() * 0.5 + 0.3;
    heart.style.animation = `floatUp ${Math.random() * 3 + 4}s linear`;
    heart.style.pointerEvents = 'none';
    
    heartsContainer.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 7000);
}

const floatUpStyle = document.createElement('style');
floatUpStyle.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.8;
        }
        50% {
            transform: translateY(-50vh) rotate(180deg);
            opacity: 0.5;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(floatUpStyle);

function startFloatingHearts() {
    heartsInterval = setInterval(createFloatingHeart, 800);
    for (let i = 0; i < 5; i++) {
        setTimeout(createFloatingHeart, i * 200);
    }
}

function stopFloatingHearts() {
    if (heartsInterval) {
        clearInterval(heartsInterval);
    }
}

// ========== PAGE NAVIGATION WITH GSAP ==========

function showPage(pageNumber) {
    const currentPageEl = document.querySelector('.page.active');
    const targetPage = document.getElementById(
        pageNumber === 1 ? 'page1' : 
        pageNumber === 2 ? 'page2' : 
        pageNumber === 2.5 ? 'pageReasons' : 
        'page3'
    );
    
    if (currentPageEl && targetPage) {
        // GSAP page transition
        gsap.to(currentPageEl, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.inOut',
            onComplete: () => {
                currentPageEl.classList.remove('active');
                targetPage.classList.add('active');
                targetPage.scrollTop = 0;
                
                gsap.fromTo(targetPage, 
                    { opacity: 0, scale: 0.95 },
                    { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
                );
            }
        });
    }

    currentPage = pageNumber;

    // Control floating hearts
    if (pageNumber === 1) {
        startFloatingHearts();
    } else {
        stopFloatingHearts();
    }

    // Initialize page-specific features
    if (pageNumber === 2) {
        initParallax();
    }
    
    if (pageNumber === 3) {
        initPage3Effects();
    }
}

// Navigation buttons
nextBtn1.addEventListener('click', () => showPage(2));

const backBtn2 = document.getElementById('backBtn2');
backBtn2.addEventListener('click', () => showPage(1));

const nextBtn2 = document.getElementById('nextBtn2');
nextBtn2.addEventListener('click', () => showPage(2.5));

const backBtn25 = document.getElementById('backBtn25');
backBtn25.addEventListener('click', () => showPage(2));

const nextBtn25 = document.getElementById('nextBtn25');
nextBtn25.addEventListener('click', () => showPage(3));

const backBtn3 = document.getElementById('backBtn3');
backBtn3.addEventListener('click', () => {
    showPage(2.5);
    resetPage3();
});

// Continue in Part 2...

// ========== PAGE 2: ENHANCED PHOTO GALLERY ==========

const polaroids = document.querySelectorAll('.polaroid');
const photoViewer = document.getElementById('photoViewer');
const viewerImage = document.getElementById('viewerImage');
const viewerCaption = document.getElementById('viewerCaption');
const viewerIndicator = document.getElementById('viewerIndicator');
const viewerClose = document.getElementById('viewerClose');
const viewerPrev = document.getElementById('viewerPrev');
const viewerNext = document.getElementById('viewerNext');

// Photo data
const photos = [];
polaroids.forEach((polaroid, index) => {
    const img = polaroid.querySelector('.polaroid-photo');
    const caption = polaroid.querySelector('.caption').textContent;
    
    photos.push({
        src: img.src || img.getAttribute('src') || '',
        caption: caption
    });
    
    // Click to view fullscreen
    polaroid.addEventListener('click', () => {
        if (img.src && img.src !== '' && !img.src.endsWith('/')) {
            openPhotoViewer(index);
        }
    });
});

function openPhotoViewer(index) {
    currentPhotoIndex = index;
    updateViewerImage();
    
    // GSAP animation for viewer
    gsap.fromTo(photoViewer,
        { opacity: 0, scale: 0.9 },
        { 
            opacity: 1, 
            scale: 1, 
            duration: 0.4, 
            ease: 'back.out(1.7)',
            onStart: () => {
                photoViewer.classList.add('active');
            }
        }
    );
    
    document.body.style.overflow = 'hidden';
}

function closePhotoViewer() {
    gsap.to(photoViewer, {
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
            photoViewer.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

function updateViewerImage() {
    const photo = photos[currentPhotoIndex];
    const img = document.querySelectorAll('.polaroid-photo')[currentPhotoIndex];
    
    if (img && img.src && img.src !== '' && !img.src.endsWith('/')) {
        // Remove ken-burns class temporarily for transition
        viewerImage.classList.remove('ken-burns');
        
        gsap.fromTo(viewerImage,
            { opacity: 0, scale: 0.9 },
            { 
                opacity: 1, 
                scale: 1, 
                duration: 0.5,
                onStart: () => {
                    viewerImage.src = img.src;
                },
                onComplete: () => {
                    // Re-add ken-burns effect after transition
                    viewerImage.classList.add('ken-burns');
                }
            }
        );
        
        viewerCaption.textContent = photo.caption;
        viewerIndicator.textContent = `${currentPhotoIndex + 1} / ${photos.length}`;
    }
}

function showPrevPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
    
    let attempts = 0;
    while (attempts < photos.length) {
        const img = document.querySelectorAll('.polaroid-photo')[currentPhotoIndex];
        if (img && img.src && img.src !== '' && !img.src.endsWith('/')) {
            updateViewerImage();
            return;
        }
        currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
        attempts++;
    }
}

function showNextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
    
    let attempts = 0;
    while (attempts < photos.length) {
        const img = document.querySelectorAll('.polaroid-photo')[currentPhotoIndex];
        if (img && img.src && img.src !== '' && !img.src.endsWith('/')) {
            updateViewerImage();
            return;
        }
        currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
        attempts++;
    }
}

// Viewer controls
viewerClose.addEventListener('click', closePhotoViewer);
viewerPrev.addEventListener('click', showPrevPhoto);
viewerNext.addEventListener('click', showNextPhoto);

// Swipe support
let touchStartX = 0;
let touchEndX = 0;

photoViewer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

photoViewer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            showNextPhoto();
        } else {
            showPrevPhoto();
        }
    }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (photoViewer.classList.contains('active')) {
        if (e.key === 'ArrowLeft') showPrevPhoto();
        if (e.key === 'ArrowRight') showNextPhoto();
        if (e.key === 'Escape') closePhotoViewer();
    }
});

// Parallax effect on scroll
function initParallax() {
    const page2 = document.getElementById('page2');
    if (!page2) return;
    
    const polaroidsInPage = page2.querySelectorAll('.polaroid');
    
    page2.addEventListener('scroll', function handleScroll() {
        const scrolled = page2.scrollTop;
        
        polaroidsInPage.forEach((polaroid, index) => {
            const speed = (index % 2 === 0) ? 0.15 : -0.15;
            const offset = scrolled * speed;
            
            let rotation = '0deg';
            if (polaroid.dataset.rotation) {
                rotation = polaroid.dataset.rotation;
            } else if (polaroid.style.transform) {
                const match = polaroid.style.transform.match(/rotate\(([^)]+)\)/);
                if (match) rotation = match[1];
            }
            
            polaroid.dataset.rotation = rotation;
            polaroid.style.transform = `translateY(${offset}px) rotate(${rotation})`;
        });
    }, { passive: true });
}

// ========== PAGE 2.5: REASONS WHY I LIKE YOU ==========

const reasonCards = document.querySelectorAll('.reason-card');

reasonCards.forEach((card, index) => {
    card.addEventListener('click', function() {
        if (!this.classList.contains('flipped')) {
            // Flip card
            this.classList.add('flipped');
            
            // GSAP animation for flip
            gsap.from(this.querySelector('.card-back'), {
                rotationY: -180,
                duration: 0.8,
                ease: 'back.out(1.7)'
            });
            
            // Create heart particles
            createHeartParticles(this);
        } else {
            // Unflip card
            this.classList.remove('flipped');
        }
    });
});

function createHeartParticles(card) {
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.innerHTML = '💕';
        particle.style.position = 'fixed';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.fontSize = '20px';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '10000';
        
        document.body.appendChild(particle);
        
        const angle = (i / 8) * Math.PI * 2;
        const distance = 80;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        gsap.to(particle, {
            x: tx,
            y: ty,
            opacity: 0,
            scale: 0,
            duration: 1,
            ease: 'power2.out',
            onComplete: () => particle.remove()
        });
    }
}

// ========== PAGE 3: ROMANTIC MESSAGE WITH PARTICLES ==========

const revealBtn = document.getElementById('revealBtn');
const romanticMessage = document.getElementById('romanticMessage');

function initPage3Effects() {
    createStars();
    createShootingStars();
    initParticles();
}

// Stars background
function createStars() {
    const starsContainer = document.getElementById('stars');
    if (!starsContainer || starsContainer.children.length > 0) return;

    const starCount = 100;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.width = Math.random() * 3 + 1 + 'px';
        star.style.height = star.style.width;
        star.style.backgroundColor = '#ffffff';
        star.style.borderRadius = '50%';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.opacity = Math.random() * 0.8 + 0.2;
        star.style.animation = `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`;
        star.style.animationDelay = Math.random() * 2 + 's';
        
        starsContainer.appendChild(star);
    }
}

const twinkleStyle = document.createElement('style');
twinkleStyle.textContent = `
    @keyframes twinkle {
        0%, 100% {
            opacity: 0.2;
            transform: scale(1);
        }
        50% {
            opacity: 1;
            transform: scale(1.5);
        }
    }
`;
document.head.appendChild(twinkleStyle);

// Shooting stars (slow and plenty)
function createShootingStars() {
    const shootingStarsContainer = document.getElementById('shootingStars');
    if (!shootingStarsContainer) return;

    setInterval(() => {
        createShootingStar(shootingStarsContainer);
    }, 2000);
}

function createShootingStar(container) {
    const star = document.createElement('div');
    star.style.position = 'absolute';
    star.style.width = '2px';
    star.style.height = '2px';
    star.style.backgroundColor = '#ffffff';
    star.style.borderRadius = '50%';
    star.style.boxShadow = '0 0 10px 2px rgba(255, 255, 255, 0.8)';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 50 + '%';
    
    const duration = Math.random() * 3 + 4; // 4-7 seconds (slow)
    star.style.animation = `shootingStar ${duration}s linear`;
    
    container.appendChild(star);
    
    setTimeout(() => {
        star.remove();
    }, duration * 1000);
}

const shootingStarStyle = document.createElement('style');
shootingStarStyle.textContent = `
    @keyframes shootingStar {
        0% {
            transform: translate(0, 0) rotate(-45deg);
            opacity: 1;
        }
        70% {
            opacity: 1;
        }
        100% {
            transform: translate(-300px, 300px) rotate(-45deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(shootingStarStyle);

// Particle.js initialization
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#ffffff' },
                shape: { type: 'circle' },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.2, width: 1 },
                move: { enable: true, speed: 1, direction: 'none', random: true, out_mode: 'out' }
            },
            interactivity: {
                detect_on: 'canvas',
                events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' } },
                modes: { grab: { distance: 140, line_linked: { opacity: 0.5 } }, push: { particles_nb: 4 } }
            },
            retina_detect: true
        });
    }
}

// Reveal button
revealBtn.addEventListener('click', function() {
    gsap.to(this, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
        onComplete: () => {
            this.style.display = 'none';
        }
    });

    setTimeout(() => {
        romanticMessage.classList.add('show');
        
        const texts = document.querySelectorAll('.romantic-text');
        texts.forEach((text, index) => {
            gsap.fromTo(text,
                { opacity: 0, y: 30 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.8,
                    delay: index * 0.4,
                    ease: 'power2.out'
                }
            );
        });

        setTimeout(() => {
            const finalMessage = document.querySelector('.final-message');
            gsap.fromTo(finalMessage,
                { opacity: 0, y: 30, scale: 0.9 },
                { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    duration: 1,
                    ease: 'back.out(1.7)'
                }
            );
        }, texts.length * 400 + 500);

        createHeartBurst();
    }, 500);
});

// Heart burst effect
function createHeartBurst() {
    const heartBurst = document.querySelector('.heart-burst');
    if (!heartBurst) return;

    const heartCount = 30;
    const hearts = ['❤️', '💕', '💖', '💗', '💘'];

    for (let i = 0; i < heartCount; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.position = 'absolute';
            heart.style.fontSize = Math.random() * 30 + 20 + 'px';
            heart.style.left = '50%';
            heart.style.top = '50%';
            heart.style.pointerEvents = 'none';
            
            heartBurst.appendChild(heart);
            
            const angle = (Math.random() * 360) * (Math.PI / 180);
            const distance = Math.random() * 300 + 150;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            gsap.to(heart, {
                x: tx,
                y: ty,
                opacity: 0,
                rotation: 360,
                duration: 2,
                ease: 'power2.out',
                onComplete: () => heart.remove()
            });
        }, i * 50);
    }
}

// Save as image (placeholder)

function resetPage3() {
    const revealBtn = document.getElementById('revealBtn');
    const romanticMessage = document.getElementById('romanticMessage');
    
    if (revealBtn) {
        revealBtn.style.display = 'block';
        gsap.set(revealBtn, { scale: 1, opacity: 1 });
    }
    
    if (romanticMessage) {
        romanticMessage.classList.remove('show');
        
        const texts = document.querySelectorAll('.romantic-text');
        texts.forEach(text => {
            gsap.set(text, { opacity: 0, y: 20 });
        });
        
        const finalMessage = document.querySelector('.final-message');
        if (finalMessage) {
            gsap.set(finalMessage, { opacity: 0, y: 20 });
        }
    }
}

// ========== EASTER EGG: SHAKE PHONE ==========

const secretModal = document.getElementById('secretModal');
const secretClose = document.getElementById('secretClose');

// Detect shake on mobile
if (window.DeviceMotionEvent) {
    let lastX = 0, lastY = 0, lastZ = 0;
    let shakeThreshold = 15;
    
    window.addEventListener('devicemotion', function(e) {
        const acc = e.accelerationIncludingGravity;
        const currentTime = new Date().getTime();
        
        if ((currentTime - lastShakeTime) > 1000) {
            const deltaX = Math.abs(acc.x - lastX);
            const deltaY = Math.abs(acc.y - lastY);
            const deltaZ = Math.abs(acc.z - lastZ);
            
            if (deltaX > shakeThreshold || deltaY > shakeThreshold || deltaZ > shakeThreshold) {
                showSecretMessage();
                lastShakeTime = currentTime;
            }
        }
        
        lastX = acc.x;
        lastY = acc.y;
        lastZ = acc.z;
    });
}

// Alternative: Double click for desktop
document.addEventListener('dblclick', function(e) {
    if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'A') {
        showSecretMessage();
    }
});

function showSecretMessage() {
    shakeCount++;
    document.getElementById('thinkCount').textContent = Math.floor(Math.random() * 9000) + 1000;
    
    gsap.fromTo(secretModal,
        { opacity: 0, scale: 0.8 },
        { 
            opacity: 1, 
            scale: 1, 
            duration: 0.4,
            ease: 'back.out(1.7)',
            onStart: () => {
                secretModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }
    );
}

secretClose.addEventListener('click', function() {
    gsap.to(secretModal, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
            secretModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

secretModal.addEventListener('click', function(e) {
    if (e.target === secretModal) {
        secretClose.click();
    }
});

// ========== INITIALIZE ==========
startFloatingHearts();

console.log('%c💕 Valentine Website by Claude 💕', 'color: #ff4757; font-size: 20px; font-weight: bold;');
console.log('%cMade with love! ❤️', 'color: #ff6b81; font-size: 14px;');

// ========== IMPROVED REASONS PAGE WITH BUTTON REVEAL ==========

const revealReasonButtons = document.querySelectorAll('.btn-reveal-reason');

revealReasonButtons.forEach((button, index) => {
    button.addEventListener('click', function() {
        const reasonIndex = this.getAttribute('data-reason');
        const reasonText = document.querySelector(`.reason-text[data-index="${reasonIndex}"]`);
        
        if (!this.classList.contains('revealed')) {
            // Show reason text
            reasonText.classList.add('show');
            
            // Mark button as revealed
            this.classList.add('revealed');
            this.textContent = 'Terlihat';
            
            // GSAP animation for text reveal
            gsap.fromTo(reasonText,
                { opacity: 0, scale: 0.9, y: -20 },
                { 
                    opacity: 1, 
                    scale: 1, 
                    y: 0,
                    duration: 0.6,
                    ease: 'back.out(1.7)'
                }
            );
            
            // Create heart particles
            createReasonHeartParticles(this);
        }
    });
});

function createReasonHeartParticles(button) {
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.innerHTML = '💕';
        particle.style.position = 'fixed';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.fontSize = '20px';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '10000';
        
        document.body.appendChild(particle);
        
        const angle = (i / 6) * Math.PI * 2;
        const distance = 60;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        gsap.to(particle, {
            x: tx,
            y: ty,
            opacity: 0,
            scale: 0,
            duration: 0.8,
            ease: 'power2.out',
            onComplete: () => particle.remove()
        });
    }
}