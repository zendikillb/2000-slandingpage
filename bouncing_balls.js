const canvas = document.getElementById('bouncingCanvas');
const ctx = canvas.getContext('2d');

const BALLS = [
    { color: 'red' },
    { color: 'blue' },
    { color: 'green' },
    { color: 'orange' },
    { color: 'white' },
    { color: 'green' },
    { color: 'green' },
    { color: 'green' },
    { color: 'green' }
];

const balls = BALLS.map((ball, i) => {
    const radius = 20;
    return {
        x: Math.random() * (canvas.width - 2 * radius) + radius,
        y: Math.random() * (canvas.height - 2 * radius) + radius,
        vx: (Math.random() * 2 + 2) * (Math.random() < 0.5 ? 1 : -1),
        vy: (Math.random() * 2 + 2) * (Math.random() < 0.5 ? 1 : -1),
        radius,
        color: ball.color
    };
});

function drawBall(ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.shadowColor = ball.color;
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.closePath();
    ctx.shadowBlur = 0;
}

function updateBall(ball) {
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Bounce off left/right
    if (ball.x - ball.radius < 0) {
        ball.x = ball.radius;
        ball.vx *= -1;
    } else if (ball.x + ball.radius > canvas.width) {
        ball.x = canvas.width - ball.radius;
        ball.vx *= -1;
    }
    // Bounce off top/bottom
    if (ball.y - ball.radius < 0) {
        ball.y = ball.radius;
        ball.vy *= -1;
    } else if (ball.y + ball.radius > canvas.height) {
        ball.y = canvas.height - ball.radius;
        ball.vy *= -1;
    }
}

function resolveBallCollisions() {
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            const b1 = balls[i];
            const b2 = balls[j];
            const dx = b2.x - b1.x;
            const dy = b2.y - b1.y;
            const dist = Math.hypot(dx, dy);
            const minDist = b1.radius + b2.radius;
            if (dist < minDist) {
                // Overlap detected, resolve collision
                // Calculate angle, sine, cosine
                const angle = Math.atan2(dy, dx);
                const sin = Math.sin(angle);
                const cos = Math.cos(angle);

                // Rotate ball positions
                const x1 = 0;
                const y1 = 0;
                const x2 = dx * cos + dy * sin;
                const y2 = dy * cos - dx * sin;

                // Rotate velocities
                const vx1 = b1.vx * cos + b1.vy * sin;
                const vy1 = b1.vy * cos - b1.vx * sin;
                const vx2 = b2.vx * cos + b2.vy * sin;
                const vy2 = b2.vy * cos - b2.vx * sin;

                // 1D collision response (equal mass)
                const vx1Final = vx2;
                const vx2Final = vx1;

                // Update positions to prevent overlap
                const overlap = minDist - dist;
                const x1Final = x1 - overlap / 2;
                const x2Final = x2 + overlap / 2;

                // Rotate positions back
                b1.x = b1.x + (x1Final * cos - y1 * sin);
                b1.y = b1.y + (y1 * cos + x1Final * sin);
                b2.x = b1.x + (x2Final * cos - y2 * sin);
                b2.y = b1.y + (y2 * cos + x2Final * sin);

                // Rotate velocities back
                b1.vx = vx1Final * cos - vy1 * sin;
                b1.vy = vy1 * cos + vx1Final * sin;
                b2.vx = vx2Final * cos - vy2 * sin;
                b2.vy = vy2 * cos + vx2Final * sin;
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach(ball => {
        updateBall(ball);
    });
    resolveBallCollisions();
    balls.forEach(ball => {
        drawBall(ball);
    });
    requestAnimationFrame(animate);
}

animate(); 