// Start and meeting dates
const startDate = new Date("2025-10-05T18:00:00");
const meetDate = new Date("2025-10-28T18:00:00");

const path = document.getElementById("flight-path");
const airplane = document.getElementById("airplane");
const pathLength = path.getTotalLength();
const svg = document.getElementById("path-svg");
const container = document.getElementById("progress-container");

// Countdown Timer
function updateTimer(simDate = null) {
    const now = simDate ? new Date(simDate) : new Date();
    const diff = meetDate - now;

    if (diff <= 0) {
        document.getElementById("timer").innerText = "Újra együtt!!!";
        moveAirplane(1); // airplane at end
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById("timer").innerText = `${days} nap, ${hours} óra, ${minutes} perc, ${seconds} másodperc`;
}

// Move airplane along path with rotation
function moveAirplane(progress) {
    const point = path.getPointAtLength(progress * pathLength);

    const scaleX = container.clientWidth / svg.viewBox.baseVal.width;
    const scaleY = container.clientHeight / svg.viewBox.baseVal.height;

    const x = point.x * scaleX;
    const y = point.y * scaleY;

    // Tangent for rotation (1% of path length)
    const deltaLength = pathLength * 0.01;
    let nextLength = progress * pathLength + deltaLength;
    if (nextLength > pathLength) nextLength = pathLength;

    const nextPoint = path.getPointAtLength(nextLength);
    const nextX = nextPoint.x * scaleX;
    const nextY = nextPoint.y * scaleY;

    const angle = Math.atan2(nextY - y, nextX - x) * (180 / Math.PI);

    airplane.style.left = `${x}px`;
    airplane.style.top = `${y}px`;
    airplane.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
}

// Animate airplane smoothly
function animate() {
    const now = new Date();
    const totalTime = meetDate - startDate;
    const elapsed = now - startDate;

    let progress = elapsed / totalTime;
    if (progress < 0) progress = 0;
    if (progress > 1) progress = 1;

    moveAirplane(progress);
    updateTimer();

    requestAnimationFrame(animate);
}

// Simulate airplane at any date
function simulateFlight(simDate) {
    const now = new Date(simDate);
    const totalTime = meetDate - startDate;
    const elapsed = now - startDate;

    let progress = elapsed / totalTime;
    if (progress < 0) progress = 0;
    if (progress > 1) progress = 1;

    moveAirplane(progress);
    updateTimer(simDate); // show timer as if it were that day
}

// Start real-time animation
animate();

// Preview airplane and timer on October 20th
//simulateFlight("2025-10-20T12:00:00"); 
