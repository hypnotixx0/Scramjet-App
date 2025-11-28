// Your interface integration with Scramjet
class PurgeProxy {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadFromURL();
    }

    setupEventListeners() {
        const goBtn = document.getElementById('goBtn');
        const urlInput = document.getElementById('urlInput');
        const quickLinks = document.querySelectorAll('.quick-link');

        goBtn.addEventListener('click', () => this.navigate());
        urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.navigate();
        });

        quickLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const url = e.target.dataset.url;
                urlInput.value = url;
                this.navigate();
            });
        });
    }

    navigate() {
        const input = document.getElementById('urlInput').value.trim();
        if (!input) return;

        let url;
        
        // Process input (URL or search)
        if (this.isValidUrl(input)) {
            url = input.startsWith('http') ? input : `https://${input}`;
        } else {
            // Treat as search
            url = `https://google.com/search?q=${encodeURIComponent(input)}`;
        }

        // Use Scramjet's proxy system
        if (typeof window.__SCREAMJET_PROXY__ !== 'undefined') {
            // If Scramjet has a built-in navigation method
            window.__SCREAMJET_PROXY__.navigate(url);
        } else {
            // Fallback: redirect through Scramjet's proxy
            const proxyUrl = `/proxy/${btoa(url)}`;
            window.location.href = proxyUrl;
        }
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    loadFromURL() {
        // Load URL from hash or query parameters if needed
        const urlParams = new URLSearchParams(window.location.search);
        const url = urlParams.get('url');
        if (url) {
            document.getElementById('urlInput').value = url;
            this.navigate();
        }
    }
}

// Initialize when ready
document.addEventListener('DOMContentLoaded', () => {
    new PurgeProxy();
});
