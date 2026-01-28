class Thief {
    constructor() {
        this.element = null;
        this.bubble = null;
        this.x = 0;
        this.y = 0;
        this.state = 'IDLE';
        this.targetElement = null;
        this.stolenItem = null;
        this.stolenOriginalStyles = {};
        this.speed = 3;
        this.lastMouseX = window.innerWidth / 2;
        this.lastMouseY = window.innerHeight / 2;
        this.mouseVelocity = 0;
        this.lastInputTime = Date.now();
        this.lastScrollTime = Date.now();
        this.isScrolling = false;
        this.handleMouseMove = (e) => {
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
        };
        this.setupInputTracking();
        this.createPet();
        if (typeof pawnshopModule !== 'undefined') {
            pawnshopModule.init(this);
        }
        if (typeof PhantomModule !== 'undefined') PhantomModule.init(this);
        const isCringe = typeof CringeModule !== 'undefined' && CringeModule.isCringeSite();
        const isSerious = typeof AuthorityModule !== 'undefined' && AuthorityModule.isSeriousSite();
        if (isCringe) {
            this.becomeCringeMirror();
        } else if (isSerious) {
            this.becomeRespectful();
        } else {
            this.startLoop();
        }
    }
    setupInputTracking() {
        document.addEventListener('mousemove', (e) => {
            const dx = e.clientX - this.lastMouseX;
            const dy = e.clientY - this.lastMouseY;
            this.mouseVelocity = Math.sqrt(dx*dx + dy*dy);
            if (this.handleMouseMove) this.handleMouseMove(e);
            this.lastInputTime = Date.now();
        });

        document.addEventListener('scroll', () => {
            this.lastScrollTime = Date.now();
            this.lastInputTime = Date.now();
            this.isScrolling = true;
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(() => {
                this.isScrolling = false;
            }, 200);
        });
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
        this.element.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleClick();
        });
    }
    handleClick() {
        if (typeof pawnshopModule !== 'undefined' && pawnshopModule.hasStolenGoods()) {
            pawnshopModule.openShop();
            return;
        }
        if (this.stolenItem) {
            this.dropLoot();
            return;
        }
        this.say("Hisss!");
        this.element.style.transform += ' scale(1.2)';
        setTimeout(() => this.element.style.transform = this.element.style.transform.replace(' scale(1.2)', ''), 200);
    }

    say(text, duration = 2000) {
        this.bubble.textContent = text;
        this.bubble.classList.add('visible');
        setTimeout(() => {
            this.bubble.classList.remove('visible');
        }, duration);
    }

    scanForLoot() {
        const candidates = document.querySelectorAll('img, button, a.btn, input');
        const visibleTargets = [];

        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        candidates.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= viewportHeight &&
                rect.right <= viewportWidth &&
                rect.width > 20 && rect.height > 20 &&
                el.id !== 'the-thief-pet' &&
                !this.element.contains(el)
            ) {
                visibleTargets.push(el);
            }
        });

        return visibleTargets.length > 0
            ? visibleTargets[Math.floor(Math.random() * visibleTargets.length)]
            : null;
    }
    becomeRespectful() {
        this.state = 'RESPECTFUL';
        //AuthorityModule.equipSuit(this.element);
        this.x = window.innerWidth - 90;
        this.y = window.innerHeight - 60;
        this.updatePosition();
        this.startLoop();
        setTimeout(() => this.say("Good day, officer.", 3000), 500);
    }

    becomeCringeMirror() {
        this.state = 'CRINGE';
        CringeModule.equipClown(this.element);
        this.startLoop();
        this.say("Look, it's you.", 3000);
    }

    decideBehavior() {
        const timeSinceInput = Date.now() - this.lastInputTime;
        const timeSinceScroll = Date.now() - this.lastScrollTime;
        if (timeSinceInput > 4000 && timeSinceScroll < 10000 && !this.isScrolling) {
            if (typeof PhantomModule !== 'undefined') {
                const readingTarget = PhantomModule.findReadingTarget();
                if (readingTarget) {
                    this.targetElement = readingTarget;
                    this.state = 'PHANTOM';
                    this.say("Whatcha reading?");
                    this.element.classList.add('thief-walking');
                    return;
                }
            }
        }
        if (this.mouseVelocity > 0 && this.mouseVelocity < 5) {
            const hovered = document.elementFromPoint(this.lastMouseX, this.lastMouseY);
            if (hovered && (hovered.tagName === 'BUTTON' || hovered.tagName === 'IMG' || hovered.tagName === 'A')) {
                if (Math.random() < 0.05) {
                    this.targetElement = hovered;
                    this.state = 'HUNTING';
                    this.say("I want that.");
                    this.element.classList.add('thief-walking');
                    return;
                }
            }
        }
        if (Math.random() < 0.004) {
            const loot = this.scanForLoot();
            if (loot) {
                this.targetElement = loot;
                this.state = 'HUNTING';
                this.say("Mine.");
                this.element.classList.add('thief-walking');
                return;
            }
        }
        if (timeSinceInput > 10000 && Math.random() < 0.01) {
            if (typeof GraffitiModule !== 'undefined') {
                const target = GraffitiModule.findTarget();
                if (target) {
                    this.targetElement = target;
                    this.state = 'ARTIST';
                    this.say("So boring...");
                    this.element.classList.add('thief-walking');
                    return;
                }
            }
        }
        if (Math.random() < 0.02) {
            this.targetX = Math.random() * (window.innerWidth - 50);
            this.targetY = (window.innerHeight / 2) + (Math.random() * (window.innerHeight / 2) - 60);
            this.state = 'WANDERING';
            this.element.classList.add('thief-walking');
        }
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
        }
    }
    gameLoop() {
        if (this.state === 'RESPECTFUL') {
            this.x = window.innerWidth-90;
            this.y = window.innerHeight-90;
            this.updatePosition();
            this.animationId = requestAnimationFrame(() => this.gameLoop());
            return;
        }
        if (this.state === 'CRINGE') {
            const targetX = this.lastMouseX + 20;
            const targetY = this.lastMouseY + 20;
            this.speed = 6;
            this.moveTowards(targetX, targetY);
            this.animationId = requestAnimationFrame(() => this.gameLoop());
            return;
        }

        if (this.state === 'IDLE') {
            this.decideBehavior();
        }

        else if (this.state === 'WANDERING') {
            if (this.moveTowards(this.targetX, this.targetY)) {
                this.state = 'IDLE';
                this.element.classList.remove('thief-walking');
            }
        }
        else if (this.state === 'PHANTOM') {
            if (!this.targetElement) { this.state = 'IDLE'; return; }
            const rect = this.targetElement.getBoundingClientRect();
            const destX = rect.left - 60 + window.scrollX;
            const destY = rect.top + window.scrollY;

            if (this.moveTowards(destX, destY)) {
                PhantomModule.triggerSelection(this.targetElement);
                this.state = 'IDLE';
                this.element.classList.remove('thief-walking');
            }
        }
        else if (this.state === 'ARTIST') {
            if (!this.targetElement) { this.state = 'IDLE'; return; }
            const rect = this.targetElement.getBoundingClientRect();
            if (this.moveTowards(rect.left + window.scrollX, rect.top + window.scrollY)) {
                GraffitiModule.applyGraffiti(this.targetElement);
                this.say("Art.");
                this.state = 'IDLE';
                this.element.classList.remove('thief-walking');
                this.element.style.transform += ' translateY(-10px)';
                setTimeout(() => this.element.style.transform = this.element.style.transform.replace(' translateY(-10px)', ''), 200);
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
                }
                this.state = 'IDLE';
                this.speed = 3;
                this.element.classList.remove('thief-walking');
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
        if (!currentThief) currentThief = new Thief();
    } else if (request.action === "kill") {
        if (currentThief) { currentThief.destroy(); currentThief = null; }
    }
});
setTimeout(() => {
    if (!currentThief) currentThief = new Thief();
}, 1000);