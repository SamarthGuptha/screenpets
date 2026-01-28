const PhantomModule = {
    thief: null,
    isActive: false,
    whackAMoleMode: false,

    init: function(thiefInstance) {
        this.thief = thiefInstance;
        document.addEventListener('selectionchange', () => {
           if (this.isActive && !window.getSelection().toString()) this.handleRejection();
        });
},
    findReadingTarget: function() {
        const centerY = window.innerHeight/2;
        const paragraphs = document.querySelectorAll('p, li, article, h2, span');
        let bestCandidate = null;
        let minDistance = Infinity;

        paragraphs.forEach(p => {
           const rect = p.getBoundingClientRect();
           if (rect.top> 0 && rect.bottom < window.innerHeight&&p.innerText.length>50) {
               const distance = Math.abs((rect.top+rect.height/2)-centerY);
               if(distance<minDistance) {
                   minDistance=distance;
                   bestCandidate=p;
               }
           }

        });
        return bestCandidate;
    },

    triggerSelection: function(targetElement) {
        if (!targetElement) return;
        this.isActive = true;
        const range = document.createRange();
        const selection = window.getSelection();

        try {
            if (targetElement.firstChild) {
                range.selectNodeContents(targetElement);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        } catch (e) {console.log("Phantom selection failed.", e);}
    },
    handleRejection: function() {
        if (this.whackAMoleMode) return;
        this.whackAMoleMode = true;
        this.isActive = false;
        if (this.thief) {
            this.thief.say("Hey! I was reading that!", 1500);

            setTimeout(() => {
                const newTarget = this.findReadingTarget();
                if (newTarget) {
                    this.thief.targetElement = newTarget;
                    this.thief.state = 'PHANTOM';
                    this.thief.say("Read this instead.", 1000);
                    this.triggerSelection(newTarget);
                    setTimeout(()=>{ this.whackAmoleMode = false; }, 2000);
                }
            }, 800);
        }
    }
};