const createParticles = (count = 80) => {
    const container = document.getElementById('particle-container');
    if (!container) return;

    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.classList.add('particle');
        p.style.left = `${Math.random() * window.innerWidth}px`;
        p.style.top = `${Math.random() * window.innerHeight}px`;
        p.style.animationDuration = `${5 + Math.random() * 10}s`;
        const size = 2 + Math.random() * 4;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        container.appendChild(p);
    }
};

createParticles();
