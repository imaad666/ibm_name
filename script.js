// DOM Elements
const textInput = document.getElementById('textInput');
const colorPicker = document.getElementById('colorPicker');
const canvas = document.getElementById('textCanvas');
const downloadBtn = document.getElementById('downloadBtn');
const errorMessage = document.getElementById('errorMessage');
const previewSection = document.getElementById('previewSection');
const ctx = canvas.getContext('2d');

// Fixed canvas size
const canvasWidth = 800;
const canvasHeight = 400;
const baseFontSize = 100;

// Initialize canvas
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Wait for font to load before rendering
document.fonts.ready.then(() => {
    renderText();
});

// Event Listeners
textInput.addEventListener('input', handleInput);
colorPicker.addEventListener('input', renderText);
downloadBtn.addEventListener('click', downloadImage);

/**
 * Handle input with validation
 */
function handleInput(e) {
    const value = e.target.value;
    
    // Check if input contains only letters and spaces
    const lettersOnly = /^[a-zA-Z\s]*$/;
    
    if (value && !lettersOnly.test(value)) {
        // Show error message
        errorMessage.classList.add('show');
        // Remove invalid characters
        e.target.value = value.replace(/[^a-zA-Z\s]/g, '');
        
        // Hide error after 3 seconds
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 3000);
    } else {
        errorMessage.classList.remove('show');
    }
    
    renderText();
}

/**
 * Render text on canvas with IBM font
 */
function renderText() {
    const text = textInput.value.trim();
    const color = colorPicker.value;
    
    // Clear canvas with transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // If no text, hide preview and download button
    if (!text) {
        previewSection.classList.remove('show');
        downloadBtn.classList.remove('show');
        return;
    }
    
    // Show preview section and download button
    previewSection.classList.add('show');
    downloadBtn.classList.add('show');
    
    // Set text properties
    ctx.fillStyle = color;
    ctx.font = `${baseFontSize}px 'IBM Logo', Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Calculate optimal font size to fit text
    const maxWidth = canvas.width * 0.9; // 90% of canvas width
    let fontSize = baseFontSize;
    ctx.font = `${fontSize}px 'IBM Logo', Arial, sans-serif`;
    
    // Reduce font size if text is too wide
    while (ctx.measureText(text).width > maxWidth && fontSize > 20) {
        fontSize -= 2;
        ctx.font = `${fontSize}px 'IBM Logo', Arial, sans-serif`;
    }
    
    // Draw text centered (transparent background)
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}

/**
 * Download canvas as PNG with dynamic filename
 */
function downloadImage() {
    const text = textInput.value.trim();
    
    // Validate text input
    if (!text) {
        alert('Please enter some text before downloading!');
        return;
    }
    
    // Sanitize filename - remove special characters and spaces
    const sanitizedText = text
        .replace(/[^a-zA-Z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '')
        .substring(0, 50); // Limit filename length
    
    const filename = `${sanitizedText}_IBM_Style.png`;
    
    // Convert canvas to blob and download
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, 'image/png');
}

// Initial render
renderText();

// Made with Bob
