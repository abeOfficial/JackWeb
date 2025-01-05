function getParticleConfig() {
    return {
        particles: {
            number: {
                value: config.particles.amount,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: config.particles.color
            },
            shape: {
                type: "circle"
            },
            opacity: {
                value: 0.5,
                random: true,
                anim: {
                    enable: false
                }
            },
            size: {
                value: 3,
                random: true
            },
            line_linked: {
                enable: false
            },
            move: {
                enable: true,
                speed: 2,
                direction: "bottom",
                random: true,
                straight: false,
                out_mode: "out"
            }
        }
    };
}