/* ======================
   PERFORMANCE OPTIMIZATIONS
   ====================== */
function optimizePerformance() {
    // Lazy load background media
    const video = document.getElementById('background-video');
    const gif = document.querySelector('.background-gif');
    
    // Preload critical resources
    const preloadVideo = () => {
        if (video && !video.src) {
            // Note: Replace with actual video URL when available
            video.src = 'assets/background-video.mp4';
        }
    };
    
    const preloadGif = () => {
        if (gif && !gif.src) {
            // Note: Using a placeholder - replace with actual GIF URL
            gif.src = 'assets/ronaldo-siu.gif';
        }
    };
    
    // Preload media when content page becomes active
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target === contentPage && contentPage.classList.contains('active')) {
                preloadVideo();
                preloadGif();
            }
        });
    });
    
    observer.observe(contentPage, { attributes: true, attributeFilter: ['class'] });
    
    // Optimize animations
    requestAnimationFrame(() => {
        document.body.style.willChange = 'auto';
    });
}

function handleVisibilityChange() {
    // Pause audio when page becomes hidden to save resources
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && backgroundAudio && !backgroundAudio.paused) {
            backgroundAudio.pause();
        } else if (!document.hidden && isAudioPlaying && backgroundAudio.paused) {
            backgroundAudio.play().catch(console.error);
        }
    });
}

/* ======================
   ERROR HANDLING
   ====================== */
function setupErrorHandling() {
    // Handle video loading errors
    const video = document.getElementById('background-video');
    if (video) {
        video.addEventListener('error', handleVideoError);
        video.addEventListener('loadeddata', () => {
            console.log('Background video loaded successfully');
        });
    }
    
    // Handle audio loading errors
    backgroundAudio.addEventListener('error', (e) => {
        console.error('Audio loading error:', e);
        // Hide audio toggle if audio fails to load
        audioToggle.style.display = 'none';
    });
    
    backgroundAudio.addEventListener('loadeddata', () => {
        console.log('Background audio loaded successfully');
    });
    
    // Handle image loading errors
    const gif = document.querySelector('.background-gif');
    if (gif) {
        gif.addEventListener('error', () => {
            console.log('GIF failed to load - hiding element');
            gif.style.display = 'none';
        });
        
        gif.addEventListener('load', () => {
            console.log('Background GIF loaded successfully');
        });
    }
    
    // Global error handler
    window.addEventListener('error', (e) => {
        console.error('Global error:', e.error);
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
    });
}

/* ======================
   RESPONSIVE HANDLING
   ====================== */
function handleResponsiveFeatures() {
    // Adjust audio volume based on screen size
    const adjustAudioForDevice = () => {
        if (window.innerWidth < 768) {
            backgroundAudio.volume = 0.2; // Lower volume on mobile
        } else {
            backgroundAudio.volume = 0.3;
        }
    };
    
    // Handle orientation changes
    const handleOrientationChange = () => {
        setTimeout(() => {
            adjustAudioForDevice();
            // Recalculate positions if needed
            const gif = document.querySelector('.background-gif');
            if (gif && window.innerHeight < window.innerWidth) {
                // Landscape mode - adjust gif size
                gif.style.width = '250px';
            } else {
                // Portrait mode - reset gif size
                gif.style.width = window.innerWidth < 768 ? '200px' : '300px';
            }
        }, 100);
    };
    
    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Initial adjustment
    adjustAudioForDevice();
}

/* ======================
   ACCESSIBILITY FEATURES
   ====================== */
function setupAccessibility() {
    // Add ARIA labels
    continueBtn.setAttribute('aria-label', 'Continue to main content');
    audioToggle.setAttribute('aria-label', 'Toggle background audio');
    copyBtn.setAttribute('aria-label', 'Copy text to clipboard');
    
    // Add focus indicators for keyboard navigation
    const focusableElements = [continueBtn, audioToggle, copyBtn, ...document.querySelectorAll('.social-icon')];
    
    focusableElements.forEach(element => {
        element.setAttribute('tabindex', '0');
        
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #4f46e5';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
    
    // Announce page transitions to screen readers
    const announceTransition = () => {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.textContent = 'Navigated to main content page';
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    };
    
    // Modify transition function to include accessibility
    const originalTransition = transitionToContentPage;
    transitionToContentPage = function() {
        originalTransition();
        announceTransition();
    };
}

/* ======================
   INITIALIZATION
   ====================== */
function initializeApp() {
    console.log('AroundTheChicken app initializing...');
    
    // Setup all functionality
    setupErrorHandling();
    optimizePerformance();
    handleResponsiveFeatures();
    setupAccessibility();
    addHoverEffects();
    handleKeyboardNavigation();
    handleVisibilityChange();
    
    console.log('App initialization complete');
}

/* ======================
   EVENT LISTENERS
   ====================== */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    initializeApp();
    
    // Main functionality event listeners
    continueBtn.addEventListener('click', transitionToContentPage);
    audioToggle.addEventListener('click', toggleAudio);
    copyBtn.addEventListener('click', copyToClipboard);
    
    // Initialize audio icon state
    updateAudioIcon();
    
    // Add click-to-focus for better mobile experience
    copyText.addEventListener('focus', () => {
        copyText.select();
    });
    
    // Prevent form submission on copy input
    copyText.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            copyToClipboard();
        }
    });
    
    console.log('Event listeners attached successfully');
});

/* ======================
   SERVICE WORKER REGISTRATION (Optional)
   ====================== */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment below if you want to add a service worker for caching
        /*
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
        */
    });
}

/* ======================
   EXPORTS FOR TESTING (Optional)
   ====================== */
// If you need to test functions, uncomment below
/*
window.AroundTheChicken = {
    transitionToContentPage,
    toggleAudio,
    copyToClipboard,
    showToast
};
/* ======================
   GLOBAL VARIABLES
   ====================== */
let audioContext = null;
let isAudioPlaying = false;

/* ======================
   DOM ELEMENTS
   ====================== */
const landingPage = document.getElementById('landing-page');
const contentPage = document.getElementById('content-page');
const continueBtn = document.getElementById('continue-btn');
const audioToggle = document.getElementById('audio-toggle');
const audioIcon = document.getElementById('audio-icon');
const backgroundAudio = document.getElementById('background-audio');
const copyBtn = document.getElementById('copy-btn');
const copyText = document.getElementById('copy-text');
const toast = document.getElementById('toast');

/* ======================
   PAGE TRANSITION FUNCTIONALITY
   ====================== */
function transitionToContentPage() {
    // Add exiting class to landing page
    landingPage.classList.add('exiting');
    
    // After transition delay, switch pages
    setTimeout(() => {
        landingPage.classList.remove('active', 'exiting');
        contentPage.classList.add('active');
        
        // Initialize audio after page transition
        initializeAudio();
    }, 600);
}

/* ======================
   AUDIO FUNCTIONALITY
   ====================== */
function initializeAudio() {
    // Set audio source - Note: You'll need to replace this with your actual audio file
    backgroundAudio.src = 'assets/ambient-sound.mp3';
    
    // Start audio unmuted after transition
    backgroundAudio.muted = false;
    backgroundAudio.volume = 0.3; // Set to 30% volume initially
    
    // Try to play audio
    playAudio();
}

function playAudio() {
    // Create audio context for better browser compatibility
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // Resume audio context if suspended (required by some browsers)
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    
    // Play the audio
    backgroundAudio.play()
        .then(() => {
            isAudioPlaying = true;
            updateAudioIcon();
            console.log('Audio started playing');
        })
        .catch((error) => {
            console.log('Audio autoplay prevented by browser:', error);
            // Audio autoplay was prevented - user will need to click the audio button
            isAudioPlaying = false;
            updateAudioIcon();
        });
}

function toggleAudio() {
    if (!backgroundAudio.src || backgroundAudio.src === '') {
        console.log('No audio source available');
        return;
    }
    
    if (backgroundAudio.paused) {
        // Audio is paused, try to play
        backgroundAudio.play()
            .then(() => {
                isAudioPlaying = true;
                backgroundAudio.muted = false;
                updateAudioIcon();
            })
            .catch((error) => {
                console.error('Error playing audio:', error);
            });
    } else {
        // Audio is playing, toggle mute
        backgroundAudio.muted = !backgroundAudio.muted;
        isAudioPlaying = !backgroundAudio.muted;
        updateAudioIcon();
    }
}

function updateAudioIcon() {
    const isMuted = backgroundAudio.muted || backgroundAudio.paused || !isAudioPlaying;
    
    if (isMuted) {
        // Muted icon
        audioIcon.innerHTML = `
            <path fill="currentColor" d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
        `;
        audioToggle.classList.add('muted');
    } else {
        // Unmuted icon
        audioIcon.innerHTML = `
            <path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
        `;
        audioToggle.classList.remove('muted');
    }
}

/* ======================
   COPY TO CLIPBOARD FUNCTIONALITY
   ====================== */
function copyToClipboard() {
    // Select and copy the text
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices
    
    // Use modern clipboard API if available
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(copyText.value)
            .then(() => {
                showToast();
            })
            .catch((error) => {
                console.error('Clipboard API failed:', error);
                fallbackCopy();
            });
    } else {
        // Fallback to execCommand
        fallbackCopy();
    }
}

function fallbackCopy() {
    try {
        document.execCommand('copy');
        showToast();
    } catch (error) {
        console.error('Fallback copy failed:', error);
        // Show error toast
        showToast('Copy failed!', 'error');
    }
}

function showToast(message = 'Copied!', type = 'success') {
    toast.textContent = message;
    toast.classList.add('show');
    
    // Change toast color based on type
    if (type === 'error') {
        toast.style.background = 'rgba(220, 38, 38, 0.9)';
    } else {
        toast.style.background = 'rgba(34, 197, 94, 0.9)';
    }
    
    // Hide toast after 2 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

/* ======================
   VIDEO HANDLING
   ====================== */
function handleVideoError() {
    const video = document.getElementById('background-video');
    const videoContainer = document.querySelector('.video-overlay');
    
    // Hide video container if video fails to load
    videoContainer.style.display = 'none';
    
    // Add a fallback background
    contentPage.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    
    console.log('Background video failed to load - using fallback background');
}

/* ======================
   UTILITY FUNCTIONS
   ====================== */
function addHoverEffects() {
    // Add subtle hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('.social-icon, .copy-button, .audio-toggle');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = this.style.transform || '';
            if (!this.style.transform.includes('scale')) {
                this.style.transform += ' scale(1.05)';
            }
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = this.style.transform.replace(' scale(1.05)', '');
        });
    });
}

function handleKeyboardNavigation() {
    // Add keyboard support for main interactive elements
    document.addEventListener('keydown', function(e) {
        // Enter or Space on Continue button
        if ((e.key === 'Enter' || e.key === ' ') && document.activeElement === continueBtn) {
            e.preventDefault();
            transitionToContentPage();
        }
        
        // Enter or Space on Copy button
        if ((e.key === 'Enter' || e.key === ' ') && document.activeElement === copyBtn) {
            e.preventDefault();
            copyToClipboard();
        }
        
        // Enter or Space on Audio toggle
        if ((e.key === 'Enter' || e.key === ' ') && document.activeElement === audioToggle) {
            e.preventDefault();
            toggleAudio();
        }
        
        // M key for mute/unmute (global shortcut)
        if (e.key.toLowerCase() === 'm' && contentPage.classList.contains('active')) {
            e.preventDefault();
            toggleAudio();
        }
        
        // Escape key to mute audio
        if (e.key === 'Escape' && contentPage.classList.contains('active') && isAudioPlaying) {
            backgroundAudio.muted = true;
            isAudioPlaying = false;
            updateAudioIcon();
        }
    });
}
