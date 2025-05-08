function fireConfetti() {
    const duration = 5000;
    const end = Date.now() + duration;

    (function frame() {
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
    }());
}

// Fire confetti when the page loads
window.onload = fireConfetti;

// Check if completion needs to be marked
if (!window.isCompleted) {
    // Mark as completed after confetti animation
    setTimeout(() => {
        fetch('/complete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.reload();
            }
        })
        .catch(error => console.error('Error:', error));
    }, 5000);
} 