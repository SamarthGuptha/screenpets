const AuthorityModule = {
    seriousKeywords : [
        '.gov',
        '.mil',
        'bank',
        'finance',
        'secure',
        'tax',
        'money',
        'auth'
    ],

    isSeriousSite: function() {
        const url = window.location.href.toLowerCase();
        return this.seriousKeywords.some(keyword => url.includes(keyword));
    },
    equipSuit: function(thiefElement) {
        thiefElement.classList.add('thief-suit');
    }
}