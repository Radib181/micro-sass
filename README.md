# ImageText Pro - Professional OCR SaaS Platform

A modern, professional Image-to-Text Converter web application using React, Tailwind CSS, and Tesseract.js.

## 📁 Project Structure

```
html/
├── index.html           # Main HTML entry point
├── app.js              # React component (main app logic)
├── ocr-service.js      # OCR service module (Tesseract wrapper)
├── utils.js            # Utility functions for text operations
├── styles.css          # Custom CSS styles
└── README.md           # This file
```

## 🚀 Features

- **Image Upload**: Drag-and-drop or click-to-select image files
- **OCR Processing**: Extract text from images using Tesseract.js
- **Real-time Progress**: Visual progress indicator during processing
- **Text Statistics**: Word count, character count, line count
- **Copy to Clipboard**: One-click text copying
- **Download as File**: Save extracted text as .txt file
- **Error Handling**: Comprehensive error messages and validation
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Privacy First**: All processing happens locally in browser

## 🛠️ Technology Stack

- **Frontend Framework**: React 18
- **Styling**: Tailwind CSS + Custom CSS
- **OCR Engine**: Tesseract.js v2
- **State Management**: React Hooks (useState, useRef, useEffect)
- **Build**: No build required - runs directly in browser

## 📦 File Descriptions

### index.html
Main HTML file that:
- Loads all required libraries (React, Tailwind, Tesseract.js)
- Links to local CSS and JS files
- Contains the root div for React rendering

### app.js
Main React component containing:
- Image upload handling
- OCR extraction logic
- State management for UI
- Event handlers for user interactions
- Complete UI rendering

### ocr-service.js
OCR Service class that:
- Initializes Tesseract worker
- Handles image processing
- Manages progress callbacks
- Provides error handling
- Cleanup functionality

### utils.js
Utility functions including:
- `copyToClipboard()` - Copy text to clipboard
- `downloadAsFile()` - Save text as file
- `getWordCount()` - Count words
- `getLineCount()` - Count lines
- `getCharacterCount()` - Count characters

### styles.css
Custom CSS for:
- Glassmorphism effect
- Loading spinner animation
- Fade-in animations
- Custom scrollbar styling
- Responsive breakpoints

## 🎯 How to Use

1. **Open the Application**
   - Open `index.html` in any modern web browser
   - Wait for Tesseract OCR service to initialize

2. **Upload an Image**
   - Click the upload area or drag an image
   - Supported formats: JPG, PNG, GIF, WebP, etc.
   - Max file size: 10MB

3. **Extract Text**
   - Click "Extract Text" button
   - Wait for processing to complete
   - Progress bar shows extraction progress

4. **Edit & Use**
   - Text appears in the right panel
   - Edit text directly in the textarea
   - View character, word, and line statistics

5. **Save or Share**
   - Click "Copy" to copy text to clipboard
   - Click "Download" to save as .txt file

## ⚙️ Configuration

### Image Size Limits
Currently set to 10MB. To change, modify in `app.js`:
```javascript
if (file.size > 10 * 1024 * 1024) { // Change this value
```

### Language Support
Default is English ('eng'). To add more languages, modify `ocr-service.js`:
```javascript
this.worker = await createWorker('eng'); // Change to 'fra', 'deu', etc.
```

### Processing Options
Modify Tesseract worker settings in `ocr-service.js`:
```javascript
this.worker = await createWorker('eng', 1, {
    // Adjust worker count and options here
});
```

## 🔧 Troubleshooting

### "OCR service is loading" error
- **Cause**: Tesseract.js still initializing
- **Solution**: Wait a few seconds and try again

### "No text found in the image"
- **Cause**: Image quality too low or text not visible
- **Solution**: Try with a clearer, higher-contrast image

### "Failed to extract text"
- **Cause**: Browser blocked resources or corrupted image
- **Solution**: Refresh page, try different image format

### Large file size errors
- **Cause**: Image exceeds size limit
- **Solution**: Compress image or reduce dimensions

## 🌐 Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support

## 📊 Performance Tips

1. Use compressed images for faster processing
2. Ensure good lighting for better OCR accuracy
3. Clear browser cache if experiencing slowness
4. Use PNG format for text-heavy images

## 🔒 Privacy & Security

- ✅ No data uploaded to servers
- ✅ All processing happens locally in your browser
- ✅ Images are not stored or transmitted
- ✅ No tracking or analytics

## 🚀 Future Enhancements

- Multiple language selection
- Batch processing multiple images
- Image preprocessing options
- Export to multiple formats (PDF, DOCX)
- Text beautification and formatting tools
- Handwriting recognition
- API endpoint for server deployment

## 📝 License

This project is open source and available for personal and commercial use.

## 👨‍💻 Author

Created as a professional SaaS product for image-to-text conversion.

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify browser compatibility
3. Try clearing browser cache
4. Check browser console for detailed errors

---

**Version**: 2.0  
**Last Updated**: January 2026  
**Status**: Production Ready ✅
