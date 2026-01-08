// Main React Component
const { useState, useRef, useEffect } = React;

const ImageTextConverter = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const fileInputRef = useRef(null);
    const textAreaRef = useRef(null);
    const ocrServiceRef = useRef(null);

    // Initialize OCR Service
    useEffect(() => {
        const initOCR = async () => {
            try {
                ocrServiceRef.current = new window.OCRService();
                await ocrServiceRef.current.initialize();
                console.log('OCR Service ready');
            } catch (err) {
                console.error('OCR Initialization Error:', err);
                setError('OCR service is loading. Please wait a moment and try again.');
            }
        };

        initOCR();

        return () => {
            if (ocrServiceRef.current) {
                ocrServiceRef.current.cleanup();
            }
        };
    }, []);

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('❌ Please select a valid image file (JPG, PNG, GIF, etc.)');
                return;
            }
            
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                setError('❌ Image file is too large. Please select an image under 10MB.');
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                setSelectedImage(event.target.result);
                setError('');
                setExtractedText('');
                setSuccessMessage('');
            };
            reader.readAsDataURL(file);
        }
    };

    const extractText = async () => {
        if (!selectedImage) {
            setError('❌ Please select an image first');
            return;
        }

        if (!ocrServiceRef.current?.initialized) {
            setError('⏳ OCR service is still loading. Please wait a moment...');
            return;
        }

        setIsProcessing(true);
        setError('');
        setSuccessMessage('');
        setProgress(0);

        try {
            console.log('Starting extraction with image:', selectedImage.substring(0, 50) + '...');
            
            const text = await ocrServiceRef.current.extractText(
                selectedImage,
                (p) => setProgress(p)
            );

            if (!text || text.trim().length === 0) {
                setError('⚠️ No text found in the image. Please try with a clearer image.');
                setExtractedText('');
            } else {
                setExtractedText(text);
                setSuccessMessage('✅ Text extracted successfully!');
            }
        } catch (err) {
            console.error('Extraction Error:', err);
            setError(`❌ ${err.message}`);
            setExtractedText('');
        } finally {
            setIsProcessing(false);
            setProgress(0);
        }
    };

    const copyToClipboard = async () => {
        if (!extractedText) return;
        
        const success = await window.TextUtils.copyToClipboard(extractedText);
        if (success) {
            setSuccessMessage('✅ Text copied to clipboard!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } else {
            setError('Failed to copy text');
        }
    };

    const downloadAsFile = () => {
        if (!extractedText) return;
        window.TextUtils.downloadAsFile(extractedText);
        setSuccessMessage('✅ File downloaded successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const clearAll = () => {
        setSelectedImage(null);
        setExtractedText('');
        setError('');
        setSuccessMessage('');
        setProgress(0);
        fileInputRef.current.value = '';
    };

    const stats = extractedText ? {
        chars: window.TextUtils.getCharacterCount(extractedText),
        words: window.TextUtils.getWordCount(extractedText),
        lines: window.TextUtils.getLineCount(extractedText)
    } : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
            {/* Navigation */}
            <nav className="glassmorphism rounded-lg mb-8 p-4 max-w-6xl mx-auto">
                <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-white flex items-center gap-2">
                        <span className="text-3xl">🖼️</span>
                        <span>ImageText Pro</span>
                    </div>
                    <div className="text-white text-sm">Professional OCR SaaS v2.0</div>
                </div>
            </nav>

            {/* Main Container */}
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Panel - Image Upload */}
                    <div className="fade-in">
                        <div className="glassmorphism rounded-2xl p-8 h-full">
                            <h2 className="text-2xl font-bold text-white mb-6">📸 Upload Image</h2>
                            
                            {/* Image Upload Area */}
                            <div 
                                className="border-2 border-dashed border-white border-opacity-30 rounded-xl p-8 text-center cursor-pointer hover:border-opacity-60 transition-all mb-6"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />
                                <div className="text-5xl mb-3">📤</div>
                                <p className="text-white text-lg font-semibold mb-2">
                                    Drop your image here or click to browse
                                </p>
                                <p className="text-white text-opacity-70 text-sm">
                                    Supports: JPG, PNG, GIF, WebP (Max 10MB)
                                </p>
                            </div>

                            {/* Selected Image Preview */}
                            {selectedImage && (
                                <div className="mb-6">
                                    <p className="text-white text-sm mb-2 font-semibold">Image Preview:</p>
                                    <img 
                                        src={selectedImage} 
                                        alt="Selected" 
                                        className="w-full rounded-lg border-2 border-white border-opacity-20 max-h-96 object-contain"
                                    />
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-500 bg-opacity-20 border border-red-400 text-red-200 px-4 py-3 rounded-lg mb-6 fade-in">
                                    {error}
                                </div>
                            )}

                            {/* Success Message */}
                            {successMessage && (
                                <div className="bg-green-500 bg-opacity-20 border border-green-400 text-green-200 px-4 py-3 rounded-lg mb-6 fade-in">
                                    {successMessage}
                                </div>
                            )}

                            {/* Processing Progress */}
                            {isProcessing && (
                                <div className="mb-6 fade-in">
                                    <div className="flex items-center justify-center gap-3 mb-3">
                                        <div className="spinner"></div>
                                        <span className="text-white font-semibold">Processing Image...</span>
                                    </div>
                                    <div className="w-full bg-white bg-opacity-20 rounded-full h-3 overflow-hidden">
                                        <div 
                                            className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-white text-sm text-center mt-2 font-semibold">{progress}% Complete</p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    onClick={extractText}
                                    disabled={!selectedImage || isProcessing}
                                    className="flex-1 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold py-3 px-6 rounded-lg hover:from-green-500 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                                >
                                    {isProcessing ? '⏳ Processing...' : '✨ Extract Text'}
                                </button>
                                <button
                                    onClick={clearAll}
                                    className="flex-1 bg-red-500 bg-opacity-30 text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-50 transition-all"
                                >
                                    🗑️ Clear
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Extracted Text */}
                    <div className="fade-in">
                        <div className="glassmorphism rounded-2xl p-8 h-full flex flex-col">
                            <h2 className="text-2xl font-bold text-white mb-6">📝 Extracted Text</h2>
                            
                            {/* Text Area */}
                            <textarea
                                ref={textAreaRef}
                                value={extractedText}
                                onChange={(e) => setExtractedText(e.target.value)}
                                className="flex-1 w-full bg-white bg-opacity-10 text-white placeholder-gray-300 rounded-lg p-4 border border-white border-opacity-20 focus:outline-none focus:border-opacity-50 resize-none mb-6 font-mono text-sm"
                                placeholder="Your extracted text will appear here..."
                            />

                            {/* Text Stats */}
                            {stats && (
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
                                        <p className="text-white text-opacity-70 text-sm">Characters</p>
                                        <p className="text-white text-2xl font-bold">{stats.chars}</p>
                                    </div>
                                    <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
                                        <p className="text-white text-opacity-70 text-sm">Words</p>
                                        <p className="text-white text-2xl font-bold">{stats.words}</p>
                                    </div>
                                    <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
                                        <p className="text-white text-opacity-70 text-sm">Lines</p>
                                        <p className="text-white text-2xl font-bold">{stats.lines}</p>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    onClick={copyToClipboard}
                                    disabled={!extractedText}
                                    className="flex-1 bg-blue-500 bg-opacity-30 text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    📋 Copy
                                </button>
                                <button
                                    onClick={downloadAsFile}
                                    disabled={!extractedText}
                                    className="flex-1 bg-purple-500 bg-opacity-30 text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    💾 Download
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="mt-12">
                    <h3 className="text-3xl font-bold text-white text-center mb-8">Why Choose ImageText Pro?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glassmorphism rounded-xl p-6 text-center hover:scale-105 transition-transform">
                            <p className="text-3xl mb-3">⚡</p>
                            <h4 className="text-white font-bold text-lg mb-2">Lightning Fast</h4>
                            <p className="text-white text-opacity-70">Advanced OCR technology for instant text extraction</p>
                        </div>
                        <div className="glassmorphism rounded-xl p-6 text-center hover:scale-105 transition-transform">
                            <p className="text-3xl mb-3">🔒</p>
                            <h4 className="text-white font-bold text-lg mb-2">100% Secure & Private</h4>
                            <p className="text-white text-opacity-70">Processing happens locally in your browser - no data sent</p>
                        </div>
                        <div className="glassmorphism rounded-xl p-6 text-center hover:scale-105 transition-transform">
                            <p className="text-3xl mb-3">🎯</p>
                            <h4 className="text-white font-bold text-lg mb-2">Highly Accurate</h4>
                            <p className="text-white text-opacity-70">Support for 100+ languages with precision extraction</p>
                        </div>
                    </div>
                </div>

                {/* How to Use */}
                <div className="mt-12 glassmorphism rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-white mb-6 text-center">📖 How to Use</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-4xl mb-3">1️⃣</div>
                            <p className="text-white font-semibold">Upload Image</p>
                            <p className="text-white text-opacity-70 text-sm mt-2">Select or drag an image</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-3">2️⃣</div>
                            <p className="text-white font-semibold">Extract Text</p>
                            <p className="text-white text-opacity-70 text-sm mt-2">Click the extract button</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-3">3️⃣</div>
                            <p className="text-white font-semibold">Edit & Copy</p>
                            <p className="text-white text-opacity-70 text-sm mt-2">Modify or copy the text</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-3">4️⃣</div>
                            <p className="text-white font-semibold">Download</p>
                            <p className="text-white text-opacity-70 text-sm mt-2">Save as text file</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="text-center mt-12 text-white text-opacity-70 pb-8">
                    <p>© 2026 ImageText Pro | Professional OCR SaaS Platform</p>
                    <p className="text-sm mt-2">Powered by Tesseract.js • 100% Browser-based Processing</p>
                </footer>
            </div>
        </div>
    );
};

// Render the app
ReactDOM.createRoot(document.getElementById('root')).render(<ImageTextConverter />);
