const loadSiteBtn = document.getElementById('loadSiteBtn');
const urlInput = document.getElementById('urlInput');
const siteFrame = document.getElementById('siteFrame');
const loadingOverlay = document.getElementById('loadingOverlay');

// Get all color pickers
const colorPickers = document.querySelectorAll('input[type="color"]');

loadSiteBtn.addEventListener('click', () => {
    const url = urlInput.value;
    if (url) {
        loadingOverlay.style.visibility = 'visible'; // Show loading
        // CRITICAL: Call our own proxy API, not the direct URL
        // encodeURIComponent ensures special characters in the URL are handled
        siteFrame.src = `/api/proxy?url=${encodeURIComponent(url)}`;
    }
});

// Hide loading overlay when iframe is loaded
siteFrame.addEventListener('load', () => {
    loadingOverlay.style.visibility = 'hidden';
});

function updateAllStyles() {
    try {
        const iframeDocument = siteFrame.contentDocument || siteFrame.contentWindow.document;
        if (!iframeDocument) return;

        let customStyle = iframeDocument.getElementById('my-theme-styler-css');
        if (!customStyle) {
            customStyle = iframeDocument.createElement('style');
            customStyle.id = 'my-theme-styler-css';
            iframeDocument.head.appendChild(customStyle);
        }

        const primary = document.getElementById('primaryColor').value;
        const secondary = document.getElementById('secondaryColor').value;
        const text = document.getElementById('textColor').value;
        const accent = document.getElementById('accentColor').value;

        customStyle.innerHTML = `
            :root {
                --e-global-color-primary: ${primary};
                --e-global-color-secondary: ${secondary};
                --e-global-color-text: ${text};
                --e-global-color-accent: ${accent};
            }
        `;
    } catch (e) {
        // This catch block will prevent errors if the iframe content is not accessible
        console.warn("Could not access iframe content. This might be a security restriction.", e);
    }
}

// Add an event listener to every color picker
colorPickers.forEach(picker => {
    picker.addEventListener('input', updateAllStyles);
});