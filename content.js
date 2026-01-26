class Thief {
    constructor() {
        this.element = null;
        this.bubble = null;
        this.x = 0;
        this.y = 0;
        this.targetElement = null;
        this.stolenItem = null;
        this.stolenOriginalStyles = {};
        this.state = 'IDLE';
        this.speed = 3;
        this.animationId = null;
        this.boredomLevel = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        this.createPet();
        if (typeof AuthorityModule !== 'undefined' && AuthorityModule.isSeriousSite()) {
            this.becomeRespectful();
        } else if (typeof CringeModule !== 'undefined' && CringeModule.isCringeSite()) {
            this.becomeCringeMirror();
        } else {
            this.startLoop();
        }
    }

    createPet() {
        this.element = document.createElement('div');
        this.element.id = 'the-thief-pet';
        this.element.textContent = '🦝';
        this.bubble = document.createElement('div');
        this.bubble.className = 'thief-bubble';
        this.element.appendChild(this.bubble);
        document.body.appendChild(this.element);
        this.x = Math.random() * (window.innerWidth - 50);
        this.y = window.innerHeight - 60;
        this.updatePosition();
        this.element.addEventListener('click', () => this.dropLoot());
    }

    say(text, duration = 2000) {
        this.bubble.textContent = text;
        this.bubble.classList.add('visible');
        setTimeout(() => {
            this.bubble.classList.remove('visible');
        }, duration);
    }

    becomeRespectful() {
        this.state = 'RESPECTFUL';
        //AuthorityModule.equipSuit(this.element);
        this.x = window.innerWidth - 90;
        this.y = window.innerHeight - 60;
        this.updatePosition();
        this.startLoop();
        setTimeout(() => {
            this.say("Good day, officer.", 3000);
        }, 500);
    }

    becomeCringeMirror() {
        this.state = 'CRINGE';
        CringeModule.equipClown(this.element);
        this.startLoop();
        this.say("Look, it's you.", 3000);
    }

    updatePosition() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;

        if (this.stolenItem) {
            this.stolenItem.style.position = 'fixed';
            this.stolenItem.style.left = `${this.x + 10}px`;
            this.stolenItem.style.top = `${this.y + 10}px`;
            this.stolenItem.style.zIndex = '999998';
            this.stolenItem.style.transform = 'scale(0.5) rotate(15deg)';
            this.stolenItem.style.pointerEvents = 'none';
            this.stolenItem.style.transition = 'none';
        }
    }

    findTarget() {
        const candidates = document.querySelectorAll('img, button, input, a.btn, h2, p');
        const validTargets = Array.from(candidates).filter(el => {
            const rect = el.getBoundingClientRect();
            return (
                rect.width > 20 && rect.width < 300 &&
                rect.height > 20 && rect.height < 300 &&
                rect.top > 0 && rect.top < window.innerHeight &&
                el.id !== 'the-thief-pet' &&
                !el.contains(this.element)
            );
        });

        if (validTargets.length > 0) {
            this.targetElement = validTargets[Math.floor(Math.random() * validTargets.length)];
            this.state = 'HUNTING';
            this.say("Ooh shiny...");
            this.element.classList.add('thief-walking');
        } else {
            this.targetX = Math.random() * window.innerWidth;
            this.targetY = window.innerHeight - 60;
            this.state = 'WANDERING';
            this.element.classList.add('thief-walking');
        }
    }

    moveTowards(targetX, targetY) {
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 5) return true;
        const vx = (dx / distance) * this.speed;
        const vy = (dy / distance) * this.speed;
        this.x += vx;
        this.y += vy;
        if (vx > 0) this.element.style.transform = 'scaleX(-1)';
        else this.element.style.transform = 'scaleX(1)';

        this.updatePosition();
        return false;
    }

    steal() {
        if (!this.targetElement) return;

        this.stolenItem = this.targetElement;
        this.stolenOriginalStyles = {   //save original to restore later
            position: this.stolenItem.style.position,
            left: this.stolenItem.style.left,
            top: this.stolenItem.style.top,
            zIndex: this.stolenItem.style.zIndex,
            transform: this.stolenItem.style.transform,
            pointerEvents: this.stolenItem.style.pointerEvents,
            transition: this.stolenItem.style.transition
        };
        this.say("YOINK!");
        this.state = 'ESCAPING';
        this.speed = 6;
        this.burrowX = Math.random() > 0.5 ? -200 : window.innerWidth + 200;
        this.burrowY = this.y;
    }

    dropLoot() {
        if (this.stolenItem) {
            this.say("EEKK!");
            Object.assign(this.stolenItem.style, this.stolenOriginalStyles);
            this.stolenItem = null;
            this.targetElement = null;
            this.state = 'ESCAPING';
            this.burrowX = Math.random() > 0.5 ? -200 : window.innerWidth + 200;
            this.burrowY = Math.random() * window.innerHeight;
            this.speed = 10;
        } else {
            this.say("Hissss!");
            this.element.style.transform += ' scale(1.2)';
            setTimeout(() => this.element.style.transform = this.element.style.transform.replace(' scale(1.2)', ''), 200);
        }
    }

    gameLoop() {
        if (this.state === 'RESPECTFUL') {
            this.x = window.innerWidth-90;
            this.y = window.innerHeight-90;
            this.updatePosition();
            if (Math.random() < 0.005) {
                const phrases = ["I'm legal.", "Nice forms.", "Just browsing....", "I pay my taxes on time."];
                this.say(phrases[Math.floor(Math.random() * phrases.length)]);
            }

            this.animationId = requestAnimationFrame(() => this.gameLoop());
            return;
        }
        if (this.state === 'CRINGE') {
            const targetX = this.mouseX + 20;
            const targetY = this.mouseY + 20;
            this.speed = 6;
            this.moveTowards(targetX, targetY);
            if (Math.random() < 0.002) {
                const insults = ["Synergy.", "Thought leader.", "Content.", "Viral.", "Good use of time."];
                this.say(insults[Math.floor(Math.random() * insults.length)]);
            }

            this.animationId = requestAnimationFrame(() => this.gameLoop());
            return;
        }

        if (this.state === 'IDLE') {
            this.boredomLevel++;
            if (Math.random() < 0.01) {
                this.findTarget();
                this.boredomLevel = 0;
            }
            if (this.boredomLevel > 600) {
                if (typeof GraffitiModule !== 'undefined') {
                    const graffitiTarget = GraffitiModule.findTarget();
                    if (graffitiTarget) {
                        this.targetElement = graffitiTarget;
                        this.state = 'ARTIST';
                        this.say("Boring...");
                        this.element.classList.add('thief-walking');
                    }
                    this.boredomLevel = 0;
                }
            }
        } else if (this.state === 'WANDERING') {
            if (this.moveTowards(this.targetX, this.targetY)) {
                this.state = 'IDLE';
                this.element.classList.remove('thief-walking');
            }
        } else if (this.state === 'ARTIST') {
            if (!this.targetElement || !document.body.contains(this.targetElement)) {
                this.state = 'IDLE';
                return;
            }
            const rect = this.targetElement.getBoundingClientRect();
            if (this.moveTowards(rect.left + window.scrollX, rect.top + window.scrollY)) {
                GraffitiModule.applyGraffiti(this.targetElement);
                const reactions = ["Much better.", "Fixed it.", "Hehe.", "Art."];
                this.say(reactions[Math.floor(Math.random() * reactions.length)]);
                this.state = 'IDLE';
                this.targetElement = null;
                this.element.classList.remove('thief-walking');
                this.element.style.transform += ' translateY(-10px)';
                setTimeout(() => {
                    this.element.style.transform = this.element.style.transform.replace(' translateY(-10px)', '');
                }, 200);
            }
        } else if (this.state === 'HUNTING') {
            if (!this.targetElement || !document.body.contains(this.targetElement)) {
                this.state = 'IDLE';
                return;
            }
            const rect = this.targetElement.getBoundingClientRect();
            if (this.moveTowards(rect.left + window.scrollX, rect.top + window.scrollY)) {
                this.steal();
            }
        } else if (this.state === 'ESCAPING') {
            if (this.moveTowards(this.burrowX, this.burrowY)) {
                if (this.stolenItem) {
                    this.stolenItem.style.display = 'none';
                    this.stolenItem = null;
                    console.log("Item successfully stolen.");
                }

                this.state = 'IDLE';
                this.speed = 3;
                this.element.classList.remove('thief-walking');
                //basically a teleport to random edge lmao i love this racoon
                this.respawnTimer = setTimeout(() => {
                    this.x = Math.random() * (window.innerWidth - 50);
                    this.y = window.innerHeight - 60;
                    this.updatePosition();
                }, 2000);
            }
        }

        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }
    startLoop() {
        this.gameLoop();
    }
    destroy() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
        if (this.respawnTimer) clearTimeout(this.respawnTimer);
        if (this.stolenItem) Object.assign(this.stolenItem.style, this.stolenOriginalStyles);
        if (this.element && this.element.parentNode) this.element.parentNode.removeChild(this.element);
    }
}
let currentThief = null;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "spawn") {
        if (!currentThief) {
            currentThief = new Thief();
        }
    } else if (request.action === "kill") {
        if (currentThief) {
            currentThief.destroy();
            currentThief = null;
        }
    }
});
setTimeout(() => {
    if (!currentThief) currentThief = new Thief();
}, 1000);