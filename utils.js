// Utility Functions
const TextUtils = {
    copyToClipboard: async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            console.error('Copy failed:', error);
            return false;
        }
    },

    downloadAsFile: (text, filename = 'extracted_text.txt') => {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    },

    getWordCount: (text) => {
        return text.split(/\s+/).filter(w => w.length > 0).length;
    },

    getLineCount: (text) => {
        return text.split('\n').filter(l => l.trim().length > 0).length;
    },

    getCharacterCount: (text) => {
        return text.length;
    }
};

// Export for use
window.TextUtils = TextUtils;
