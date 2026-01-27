const pawnshopModule = {
    stolenText: null,
    thiefInstance: null,

    garbageFacts: [
        " (PS: I found a half eaten hot dog today.)",
        " (Sent from my burrow)",
        " (raccoon noises)",
        " (Bundle Deal applied)",
        " (Fun fact: Trash smells bettter in the rain.)",
        " (Fun fact: i hate you)",
        " (Not so fun fact: I sometimes regret annoying you :( )"
    ],
    init: function(thief) {
        this.thief=thief;
        document.addEventListener('copy', (e) => this.handleCopy(e));
        document.addEventListener('paste', (e) => this.handlePaste(e));
    },
    handleCopy: function(e) {
        const selection = document.getSelection().toString();
        if (selection && selection.length>0) {
            this.stolenText=selection;
            e.preventDefault();
            if (e.clipboardData) e.clipboardData.setData('text/plain', '[I STOLE WHATEVER YOU COPIED MUAHAHAHA CLICK ME TO NEGOTIATE.]');

            if(this.thief) {
                this.thief.say("Mine now.", 1000);
                this.thief.element.classList.add('thief-holding-loot');
            }
        }
    },
    handlePaste: function(e) {
        navigator.clipboard.readText().then(text => {
            if (text === '[I STOLE WHATEVER YOU COPIED MUAHAHAHA CLICK ME TO NEGOTIATE.]') {
                if (this.thief) this.thief.say("Click me to trade!", 2000)
            }
        });
    },
    hasStolenGoods: function() {
        return this.stolenText !== null;
    },
    openShop: function() {
        if (!this.stolenText) return;
        const existingShop = document.querySelector('.thief-pawn-shop');
        if (existingShop) existingShop.remove();

        const shop = document.createElement('div');
        shop.className = 'thief-pawn-shop';
        const title = document.createElement('h3');
        title.textContent = "Pawn Shop";
        const preview = document.createElement('div');
        preview.className = 'shop-preview';
        preview.textContent = `You want: "${this.stolenText.substring(0, 20)}${this.stolenText.length > 20 ? '...' : ''}"`;
        const dealBtn = document.createElement('button');
        dealBtn.className = 'shop-btn';
        dealBtn.textContent = "Accept Bundle Deal";
        const info = document.createElement('p');
        info.style.fontSize = "10px";
        info.style.color = "#666";
        info.textContent = "*(includes mandatory processing fees.)";

        dealBtn.onclick = (e) => {
          e.stopPropagation();
          this.acceptDeal();
          shop.remove();
        };
        shop.appendChild(title);
        shop.appendChild(preview);
        shop.appendChild(dealBtn);
        shop.appendChild(info);

        const rect = this.thief.element.getBoundingClientRect();
        shop.style.left = (rect.left) + 'px'
        shop.style.bottom = (window.innerHeight - rect.top+10)+'px';
        document.body.appendChild(shop);

        setTimeout(() => {
            document.addEventListener('click', function close(e) {
                if (!shop.contains(e.target)&&e.target !== dealBtn) {
                    shop.remove();
                    document.removeEventListener('click', close);
                }
            }, {once: true});
        }, 100);
    },
    acceptDeal: function() {
        const garbage = this.garbageFacts[Math.floor(Math.random()*this.garbageFacts.length)];
        const bundle = this.stolenText + garbage;
        navigator.clipboard.writeText(bundle).then(() => {
            this.thief.say("Pleasure doing business.", 2000);
            this.stolenText = null;
            this.thief.element.classList.remove('thief-holding-loot');
        }).catch(err => {
           console.error('Failed to write to clipboard', err);
           this.thief.say("Card declined.", 1000);
        });
    }

};