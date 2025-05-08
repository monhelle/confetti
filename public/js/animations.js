function fireCryingEmojis() {
    console.log('Starting crying emojis animation');
    const emojis = ['😢', '😭', '😪'];
    
    function frame() {
        confetti({
            particleCount: 1,
            angle: 90,
            spread: 20,
            origin: { x: Math.random(), y: -0.2 },
            scalar: 4,
            drift: 0,
            ticks: 200,
            gravity: 0.35,
            shapes: ['text'],
            shapeOptions: {
                text: { 
                    value: emojis[Math.floor(Math.random() * emojis.length)],
                    style: 'normal',
                    size: '48px'
                }
            }
        });

        if (window.requirementsFailed) {
            setTimeout(() => requestAnimationFrame(frame), 200);
        }
    }

    frame();
}

function fireCelebrationConfetti() {
    console.log('Starting celebration confetti');
    const duration = 5000;
    const end = Date.now() + duration;

    function frame() {
        confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#1a73e8', '#34a853', '#fbbc05', '#ea4335']
        });
        confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#1a73e8', '#34a853', '#fbbc05', '#ea4335']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }

    frame();
}

// Start animations based on page state
window.addEventListener('load', function() {
    console.log('Window loaded. Requirements failed:', window.requirementsFailed, 'Is completed:', window.isCompleted);
    
    if (window.requirementsFailed) {
        fireCryingEmojis();
    } else if (window.isCompleted) {
        fireCelebrationConfetti();
    }
}); 