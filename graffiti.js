// graffiti_module.js
// Logic for the "Graffiti Artist" feature

const GraffitiModule = {
    // A crude MS Paint style mustache SVG (URL Encoded to prevent browser blocking)
    mustacheSVG: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50"><path d="M50 10 C 60 30, 90 30, 95 10 C 95 40, 60 40, 50 25 C 40 40, 5 40, 5 10 C 10 30, 40 30, 50 10" fill="black"/></svg>'),

    // Find a suitable target for vandalism
    findTarget: function() {
        // 50/50 chance of defacing an image or correcting text
        const type = Math.random() > 0.5 ? 'IMG' : 'TEXT';
        let target = null;

        if (type === 'IMG') {
            const images = document.querySelectorAll('img');
            // Filter for decent sized images currently on screen
            const visibleImages = Array.from(images).filter(img => {
                const rect = img.getBoundingClientRect();
                return rect.width > 60 && rect.height > 60 &&
                    rect.top > 50 && rect.top < window.innerHeight - 50;
            });
            if (visibleImages.length) {
                target = visibleImages[Math.floor(Math.random() * visibleImages.length)];
            }
        }

        // Fallback to text if no image found or type was TEXT
        if (!target) {
            const paragraphs = document.querySelectorAll('p, h2, h3, li, span');
            const visibleText = Array.from(paragraphs).filter(p => {
                const rect = p.getBoundingClientRect();
                return rect.width > 100 && rect.height > 20 &&
                    rect.top > 50 && rect.top < window.innerHeight - 50 &&
                    p.innerText.length > 15;
            });
            if (visibleText.length) {
                target = visibleText[Math.floor(Math.random() * visibleText.length)];
            }
        }

        return target;
    },

    // Apply the visual graffiti
    applyGraffiti: function(targetElement) {
        if (!targetElement) return;

        const rect = targetElement.getBoundingClientRect();
        const graffiti = document.createElement('div');
        graffiti.className = 'thief-graffiti'; // CSS class for common styles

        // Ensure critical styles are set inline just in case CSS fails
        graffiti.style.position = 'absolute';
        graffiti.style.pointerEvents = 'none';
        graffiti.style.zIndex = '999990';

        // Calculate absolute position including scroll
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;

        if (targetElement.tagName === 'IMG') {
            // Mustache Logic
            graffiti.style.width = (rect.width * 0.4) + 'px';
            graffiti.style.height = (rect.width * 0.2) + 'px';
            graffiti.style.backgroundImage = `url('${this.mustacheSVG}')`;
            graffiti.style.backgroundSize = 'contain';
            graffiti.style.backgroundRepeat = 'no-repeat';

            // Try to center it (roughly face height)
            graffiti.style.left = (rect.left + scrollX + rect.width/2 - (rect.width * 0.2)) + 'px';
            graffiti.style.top = (rect.top + scrollY + rect.height * 0.35) + 'px';
        } else {
            // Red Circle Logic (correcting typos)
            graffiti.style.border = '2px solid red';
            graffiti.style.borderRadius = '100% 90% 110% 90% / 90% 100% 85% 100%'; // Wonky hand-drawn look
            graffiti.style.width = '60px';
            graffiti.style.height = '25px';
            graffiti.style.backgroundColor = 'rgba(255, 0, 0, 0.05)';

            // Pick a random word area in the text block
            const randomOffsetX = Math.random() * (rect.width - 80);
            graffiti.style.left = (rect.left + scrollX + randomOffsetX) + 'px';
            graffiti.style.top = (rect.top + scrollY + (rect.height/2) - 12) + 'px';
        }

        document.body.appendChild(graffiti);

        // Add a fade-in animation
        graffiti.animate([
            { transform: 'scale(0.8)', opacity: 0 },
            { transform: 'scale(1)', opacity: 1 }
        ], { duration: 200, easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' });
    }
};