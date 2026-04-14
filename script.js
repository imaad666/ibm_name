// DOM Elements
const textInput = document.getElementById('textInput');
const colorPicker = document.getElementById('colorPicker');
const sizeSelector = document.getElementById('sizeSelector');
const canvas = document.getElementById('textCanvas');
const downloadBtn = document.getElementById('downloadBtn');
const ctx = canvas.getContext('2d');

// Size presets
const sizes = {
    small: { width: 600, height: 300, fontSize: 80 },
    medium: { width: 800, height: 400, fontSize: 100 },
    large: { width: 1000, height: 500, fontSize: 120 }
};

// Initialize canvas with default size
let currentSize = 'medium';
setCanvasSize(currentSize);

// Wait for font to load before rendering
document.fonts.ready.then(() => {
    renderText();
});

// Event Listeners
textInput.addEventListener('input', renderText);
colorPicker.addEventListener('input', renderText);
sizeSelector.addEventListener('change', (e) => {
    currentSize = e.target.value;
    setCanvasSize(currentSize);
    renderText();
});
downloadBtn.addEventListener('click', downloadImage);

/**
 * Set canvas dimensions based on selected size
 */
function setCanvasSize(size) {
    const dimensions = sizes[size];
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
}

/**
 * Render text on canvas with IBM font
 */
function renderText() {
    const text = textInput.value.trim();
    const color = colorPicker.value;
    const dimensions = sizes[currentSize];
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Fill background with white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // If no text, show placeholder
    if (!text) {
        ctx.fillStyle = '#cccccc';
        ctx.font = `${dimensions.fontSize * 0.4}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Enter text to preview', canvas.width / 2, canvas.height / 2);
        downloadBtn.disabled = true;
        return;
    }
    
    // Enable download button
    downloadBtn.disabled = false;
    
    // Set text properties
    ctx.fillStyle = color;
    ctx.font = `${dimensions.fontSize}px 'IBM Logo', Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Calculate optimal font size to fit text
    const maxWidth = canvas.width * 0.9; // 90% of canvas width
    let fontSize = dimensions.fontSize;
    ctx.font = `${fontSize}px 'IBM Logo', Arial, sans-serif`;
    
    // Reduce font size if text is too wide
    while (ctx.measureText(text).width > maxWidth && fontSize > 20) {
        fontSize -= 2;
        ctx.font = `${fontSize}px 'IBM Logo', Arial, sans-serif`;
    }
    
    // Draw text centered
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
