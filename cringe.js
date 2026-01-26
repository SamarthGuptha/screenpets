const CringeModule = {
    cringeKeywords: [
        'linkedin',
        'tiktok',
        'twitter',
        'x.com',
        'instagram',
        'facebook'
    ],
    isCringeSite: function() {
        const url = window.location.href.toLowerCase();
        return this.cringeKeywords.some(keyword => url.includes(keyword));
    },
    equipClown: function(thiefElement) {
        const clown = document.createElement('div');
        clown.className = 'thief-clown-emoji';
        clown.textContent = '🤡';
        thiefElement.appendChild(clown);
    }
};