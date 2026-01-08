// OCR Service Module
class OCRService {
    constructor() {
        this.worker = null;
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;
        
        try {
            console.log('Initializing Tesseract worker...');
            const { createWorker } = Tesseract;
            this.worker = await createWorker('eng', 1, {
                workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@v2/dist/worker.min.js'
            });
            this.initialized = true;
            console.log('Tesseract worker initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Tesseract:', error);
            throw new Error('Failed to initialize OCR service. Please refresh the page.');
        }
    }

    async extractText(imageSource, onProgress) {
        if (!this.initialized) {
            await this.initialize();
        }

        try {
            console.log('Starting text extraction...');
            
            const result = await this.worker.recognize(imageSource, {
                logger: (msg) => {
                    if (msg.status === 'recognizing') {
                        const progress = Math.round(msg.progress * 100);
                        onProgress?.(progress);
                        console.log(`OCR Progress: ${progress}%`);
                    }
                }
            });

            console.log('Text extraction completed');
            return result.data.text;
        } catch (error) {
            console.error('OCR Error:', error);
            throw new Error('Failed to extract text. Please try with a different image.');
        }
    }

    async cleanup() {
        if (this.worker) {
            await this.worker.terminate();
            this.initialized = false;
        }
    }
}

// Export for use
window.OCRService = OCRService;
