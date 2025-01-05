let config;

async function loadConfig() {
    const response = await fetch('config.json');
    config = await response.json();
    updateUI();
    initParticles();  // Initialize particles after config is loaded
}

function updateUI() {
    document.querySelector('.logo').textContent = config.serverName;
    document.querySelectorAll('#server-name').forEach(el => el.textContent = config.serverName);
    
    const discordLinks = document.querySelectorAll('#discord-link, #footer-discord-link, #join-discord-btn');
    discordLinks.forEach(link => link.href = config.discordLink);

    const storeLinks = document.querySelectorAll('#store-link, #footer-store-link, #footer-shop-now');
    storeLinks.forEach(link => link.href = config.storeLink);
    
    // Set image sources
    const aboutUsImg = document.getElementById('about-us-img');
    if (aboutUsImg) {
        aboutUsImg.src = config.images.aboutUs;
    }
    
    const communityImg = document.getElementById('community-img');
    if (communityImg) {
        communityImg.src = config.images.community;
    }
    
    // Populate game modes
    const gameModeContainer = document.getElementById('game-modes-container');
    if (gameModeContainer) {
        gameModeContainer.innerHTML = '';
        config.gameModes.forEach(mode => {
            const modeElement = document.createElement('div');
            modeElement.className = 'game-card';
            modeElement.innerHTML = `
                <img src="${mode.imageUrl}" alt="${mode.name}">
                <h3>${mode.name}</h3>
                <p>${mode.description}</p>
            `;
            gameModeContainer.appendChild(modeElement);
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
});

async function updatePlayerCount() {
    const onlineCountElement = document.querySelector('.online-count');
    const playerCountElement = document.getElementById("playerCount");
    const pulseElement = onlineCountElement.querySelector('.pulse');

    try {
        const response = await fetch(config.playerAPIUrl + config.serverIP);
        const data = await response.json();

        if (data.online) {
            const playerCount = data.players.online;
            playerCountElement.textContent = `${playerCount} Online`;
            onlineCountElement.classList.remove('offline');
            onlineCountElement.title = `${playerCount} player${playerCount !== 1 ? 's' : ''} online`;
        } else {
            playerCountElement.textContent = 'Offline';
            onlineCountElement.classList.add('offline');
            onlineCountElement.title = 'Server is offline';
        }
        pulseElement.style.display = 'inline-block'; // Always show the pulse
    } catch (error) {
        console.error("Error fetching player count:", error);
        playerCountElement.textContent = 'Offline';
        onlineCountElement.classList.add('offline');
        pulseElement.style.display = 'inline-block'; // Show pulse even on error
        onlineCountElement.title = 'Unable to fetch server status';
    }
}

function copyIP() {
    navigator.clipboard.writeText(config.serverIP).then(() => {
        const notification = document.createElement('div');
        notification.textContent = `IP copied: ${config.serverIP}`;
        notification.className = 'ip-notification';
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }).catch(err => {
        console.error('Failed to copy IP: ', err);
    });
}

window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

function initParticles() {
    if (config.particles && config.particles.enabled) {
        const particlesContainer = document.getElementById('particles-js');
        if (particlesContainer) {
            // Initialize particles with dynamic config
            particlesJS('particles-js', getParticleConfig());
            
            // Adjust particle container size on window resize
            window.addEventListener('resize', () => {
                particlesContainer.style.width = window.innerWidth + 'px';
                particlesContainer.style.height = window.innerHeight + 'px';
            });
            
            // Set initial size
            particlesContainer.style.width = window.innerWidth + 'px';
            particlesContainer.style.height = window.innerHeight + 'px';
        }
    }
}

loadConfig().then(() => {
    updatePlayerCount();
    setInterval(updatePlayerCount, 300000);
});