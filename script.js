// State Management
const state = {
    images: {},
    replies: [],
    context: '',
    caseId: '',
    reportedUser: '',
    incidentDate: '',
    windowCount: 2,
    zoomLevels: { 1: 1, 2: 1, 3: 1 },
    colors: {
        primary: '#3498db',
        secondary: '#2ecc71',
        accent: '#e74c3c',
        bg: '#ecf0f1'
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeColorSettings();
    setupEventListeners();
    loadFromLocalStorage();
});

// ============= Color Management =============
function initializeColorSettings() {
    const savedColors = localStorage.getItem('evidenceColors');
    if (savedColors) {
        state.colors = JSON.parse(savedColors);
        applyColors();
    }

    const settingsBtn = document.getElementById('settingsBtn');
    const modal = document.getElementById('settingsModal');
    const closeBtn = modal.querySelector('.close');

    settingsBtn.addEventListener('click', () => {
        modal.classList.add('show');
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    // Color inputs
    document.getElementById('primaryColor').value = state.colors.primary;
    document.getElementById('secondaryColor').value = state.colors.secondary;
    document.getElementById('accentColor').value = state.colors.accent;
    document.getElementById('bgColor').value = state.colors.bg;

    document.getElementById('primaryColor').addEventListener('change', (e) => {
        state.colors.primary = e.target.value;
        applyColors();
        saveState();
    });

    document.getElementById('secondaryColor').addEventListener('change', (e) => {
        state.colors.secondary = e.target.value;
        applyColors();
        saveState();
    });

    document.getElementById('accentColor').addEventListener('change', (e) => {
        state.colors.accent = e.target.value;
        applyColors();
        saveState();
    });

    document.getElementById('bgColor').addEventListener('change', (e) => {
        state.colors.bg = e.target.value;
        applyColors();
        saveState();
    });

    document.getElementById('resetColors').addEventListener('click', resetColors);
}

function applyColors() {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', state.colors.primary);
    root.style.setProperty('--secondary-color', state.colors.secondary);
    root.style.setProperty('--accent-color', state.colors.accent);
    root.style.setProperty('--bg-color', state.colors.bg);
}

function resetColors() {
    state.colors = {
        primary: '#3498db',
        secondary: '#2ecc71',
        accent: '#e74c3c',
        bg: '#ecf0f1'
    };
    
    document.getElementById('primaryColor').value = state.colors.primary;
    document.getElementById('secondaryColor').value = state.colors.secondary;
    document.getElementById('accentColor').value = state.colors.accent;
    document.getElementById('bgColor').value = state.colors.bg;
    
    applyColors();
    saveState();
}

// ============= Event Listeners Setup =============
function setupEventListeners() {
    // Case information
    document.getElementById('caseId').addEventListener('change', (e) => {
        state.caseId = e.target.value;
        saveState();
    });

    document.getElementById('reportedUser').addEventListener('change', (e) => {
        state.reportedUser = e.target.value;
        saveState();
    });

    document.getElementById('incidentDate').addEventListener('change', (e) => {
        state.incidentDate = e.target.value;
        saveState();
    });

    // Context
    document.getElementById('contextText').addEventListener('input', (e) => {
        state.context = e.target.value;
        document.getElementById('contextCount').textContent = state.context.length;
        saveState();
    });

    // Image placeholders click
    for (let i = 1; i <= 3; i++) {
        const placeholder = document.getElementById(`imgPlaceholder${i}`);
        if (placeholder) {
            placeholder.addEventListener('click', function() {
                const input = this.parentElement.querySelector('.image-input');
                input.click();
            });
        }
    }
}

// ============= Image Management =============
function loadImage(windowNum, event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = document.getElementById(`img${windowNum}`);
        const placeholder = document.getElementById(`imgPlaceholder${windowNum}`);
        
        img.src = e.target.result;
        img.style.display = 'block';
        placeholder.style.display = 'none';
        
        state.images[windowNum] = e.target.result;
        state.zoomLevels[windowNum] = 1;
        
        saveState();
    };
    reader.readAsDataURL(file);
}

function removeWindow(windowNum) {
    if (state.windowCount <= 2) {
        alert('You must keep at least 2 image windows!');
        return;
    }

    const window = document.getElementById(`imgWindow${windowNum}`);
    window.style.display = 'none';
    state.windowCount--;
    delete state.images[windowNum];
    delete state.zoomLevels[windowNum];
    saveState();
}

function addWindow() {
    if (state.windowCount >= 3) {
        alert('Maximum 3 image windows allowed!');
        return;
    }

    state.windowCount++;
    const window = document.getElementById(`imgWindow${state.windowCount}`);
    window.style.display = 'block';
    saveState();
}

function zoomImage(windowNum, factor) {
    const img = document.getElementById(`img${windowNum}`);
    if (!img || img.style.display === 'none') return;

    state.zoomLevels[windowNum] *= factor;
    state.zoomLevels[windowNum] = Math.max(0.5, Math.min(3, state.zoomLevels[windowNum]));
    img.style.transform = `scale(${state.zoomLevels[windowNum]})`;
    saveState();
}

function downloadImage(windowNum) {
    const img = document.getElementById(`img${windowNum}`);
    if (!img || img.style.display === 'none') {
        alert('No image to download!');
        return;
    }

    const link = document.createElement('a');
    link.href = img.src;
    link.download = `evidence-image-${windowNum}-${Date.now()}.png`;
    link.click();
}

// ============= Section Collapsing =============
function toggleSection(headerElement) {
    const content = headerElement.nextElementSibling;
    const arrow = headerElement.querySelector('.arrow');

    headerElement.classList.toggle('collapsed');
    content.classList.toggle('collapsed');

    if (headerElement.classList.contains('collapsed')) {
        arrow.style.transform = 'rotate(-90deg)';
    } else {
        arrow.style.transform = 'rotate(0deg)';
    }
}

// ============= Replies Management =============
function addReply() {
    const userInput = document.getElementById('replyUserInput');
    const contentInput = document.getElementById('replyContentInput');

    if (!userInput.value.trim() || !contentInput.value.trim()) {
        alert('Please fill in both user name and reply content!');
        return;
    }

    const reply = {
        id: Date.now(),
        user: userInput.value,
        content: contentInput.value,
        timestamp: new Date().toLocaleString()
    };

    state.replies.push(reply);
    renderReplies();
    userInput.value = '';
    contentInput.value = '';
    saveState();
}

function deleteReply(replyId) {
    state.replies = state.replies.filter(r => r.id !== replyId);
    renderReplies();
    saveState();
}

function renderReplies() {
    const repliesList = document.getElementById('repliesList');
    repliesList.innerHTML = '';

    if (state.replies.length === 0) {
        repliesList.innerHTML = '<p class="text-muted text-center">No replies yet. Add one above!</p>';
        return;
    }

    state.replies.forEach(reply => {
        const replyElement = document.createElement('div');
        replyElement.className = 'reply-item';
        replyElement.innerHTML = `
            <div class="reply-header">
                <span class="reply-user">
                    <i class="fas fa-user-circle"></i> ${escapeHtml(reply.user)}
                </span>
                <span class="reply-time">${reply.timestamp}</span>
                <button class="reply-delete-btn" onclick="deleteReply(${reply.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
            <div class="reply-content">${escapeHtml(reply.content)}</div>
        `;
        repliesList.appendChild(replyElement);
    });
}

// ============= Export Functions =============
function exportJSON() {
    const exportData = {
        caseInfo: {
            caseId: state.caseId,
            reportedUser: state.reportedUser,
            incidentDate: state.incidentDate
        },
        context: state.context,
        replies: state.replies,
        imageCount: Object.keys(state.images).length,
        exportDate: new Date().toISOString(),
        colors: state.colors
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    downloadFile(dataStr, 'evidence-report.json', 'application/json');
}

function exportHTML() {
    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Moderation Evidence Report</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            color: #333;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
            border-bottom: 3px solid #3498db;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #3498db;
            margin: 0;
        }
        .case-info {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 30px;
        }
        .info-box {
            background: #ecf0f1;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #3498db;
        }
        .info-box h3 {
            margin: 0 0 10px 0;
            color: #3498db;
        }
        .section {
            margin-bottom: 30px;
        }
        .section h2 {
            color: #2c3e50;
            border-bottom: 2px solid #2ecc71;
            padding-bottom: 10px;
        }
        .context-box {
            background: #f9f9f9;
            padding: 15px;
            border-left: 4px solid #2ecc71;
            border-radius: 8px;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        .reply {
            background: #ecf0f1;
            padding: 15px;
            border-left: 4px solid #3498db;
            margin-bottom: 15px;
            border-radius: 8px;
        }
        .reply-user {
            font-weight: bold;
            color: #3498db;
        }
        .reply-time {
            font-size: 0.9em;
            color: #7f8c8d;
        }
        .reply-content {
            margin-top: 8px;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        .images-info {
            background: #ffeaa7;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #f39c12;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #bdc3c7;
            color: #7f8c8d;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛡️ Moderation Evidence Report</h1>
        </div>

        <div class="case-info">
            <div class="info-box">
                <h3>Case ID</h3>
                <p>${escapeHtml(state.caseId || 'N/A')}</p>
            </div>
            <div class="info-box">
                <h3>Reported User</h3>
                <p>${escapeHtml(state.reportedUser || 'N/A')}</p>
            </div>
            <div class="info-box">
                <h3>Incident Date</h3>
                <p>${state.incidentDate || 'N/A'}</p>
            </div>
        </div>

        <div class="section">
            <h2>📋 Context</h2>
            <div class="context-box">${escapeHtml(state.context || 'No context provided')}</div>
        </div>

        <div class="section">
            <h2>🖼️ Evidence Images</h2>
            <div class="images-info">
                <strong>Total Images:</strong> ${Object.keys(state.images).length} image(s) attached
                <br><em>Note: Images are not included in this HTML export. Please use the JSON export to preserve image data.</em>
            </div>
        </div>

        <div class="section">
            <h2>💬 Replies (${state.replies.length})</h2>
            ${state.replies.length === 0 ? '<p class="text-muted">No replies recorded.</p>' : state.replies.map(reply => `
                <div class="reply">
                    <div>
                        <span class="reply-user">${escapeHtml(reply.user)}</span>
                        <span class="reply-time">${reply.timestamp}</span>
                    </div>
                    <div class="reply-content">${escapeHtml(reply.content)}</div>
                </div>
            `).join('')}
        </div>

        <div class="footer">
            <p>Report generated on ${new Date().toLocaleString()}</p>
            <p>Moderation Evidence Template v1.0</p>
        </div>
    </div>
</body>
</html>
    `;

    downloadFile(html, 'evidence-report.html', 'text/html');
}

function downloadFile(content, filename, mimeType) {
    const element = document.createElement('a');
    element.setAttribute('href', `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function clearAll() {
    if (confirm('Are you sure you want to clear all data? This cannot be undone!')) {
        state.images = {};
        state.replies = [];
        state.context = '';
        state.caseId = '';
        state.reportedUser = '';
        state.incidentDate = '';
        state.zoomLevels = { 1: 1, 2: 1, 3: 1 };

        document.getElementById('caseId').value = '';
        document.getElementById('reportedUser').value = '';
        document.getElementById('incidentDate').value = '';
        document.getElementById('contextText').value = '';
        document.getElementById('contextCount').textContent = '0';

        for (let i = 1; i <= 3; i++) {
            const img = document.getElementById(`img${i}`);
            const placeholder = document.getElementById(`imgPlaceholder${i}`);
            const input = document.querySelector(`#imgWindow${i} .image-input`);
            if (img) img.style.display = 'none';
            if (placeholder) placeholder.style.display = 'flex';
            if (input) input.value = '';
        }

        renderReplies();
        localStorage.removeItem('evidenceState');
        alert('All data has been cleared!');
    }
}

// ============= Image Viewer Modal =============
function openImageViewer(windowNum) {
    const img = document.getElementById(`img${windowNum}`);
    if (!img || img.style.display === 'none') return;

    const modal = document.getElementById('imageViewerModal');
    const modalImg = document.getElementById('modalImage');
    modalImg.src = img.src;
    modal.classList.add('show');
}

function closeImageViewer() {
    document.getElementById('imageViewerModal').classList.remove('show');
}

function rotateImage() {
    const img = document.getElementById('modalImage');
    const currentRotation = img.style.transform ? 
        parseInt(img.style.transform.match(/\d+/)[0]) : 0;
    const newRotation = (currentRotation + 90) % 360;
    img.style.transform = `rotate(${newRotation}deg)`;
}

function toggleFullscreen() {
    const modal = document.getElementById('imageViewerModal');
    if (modal.requestFullscreen) {
        modal.requestFullscreen();
    }
}

// ============= Local Storage =============
function saveState() {
    localStorage.setItem('evidenceState', JSON.stringify(state));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('evidenceState');
    if (saved) {
        const savedState = JSON.parse(saved);
        Object.assign(state, savedState);

        // Restore form values
        document.getElementById('caseId').value = state.caseId || '';
        document.getElementById('reportedUser').value = state.reportedUser || '';
        document.getElementById('incidentDate').value = state.incidentDate || '';
        document.getElementById('contextText').value = state.context || '';
        document.getElementById('contextCount').textContent = state.context.length || 0;

        // Restore images
        Object.entries(state.images).forEach(([windowNum, imageSrc]) => {
            const img = document.getElementById(`img${windowNum}`);
            const placeholder = document.getElementById(`imgPlaceholder${windowNum}`);
            if (img && placeholder) {
                img.src = imageSrc;
                img.style.display = 'block';
                placeholder.style.display = 'none';
            }
        });

        // Restore window visibility
        for (let i = 3; i > state.windowCount; i--) {
            const window = document.getElementById(`imgWindow${i}`);
            if (window) window.style.display = 'none';
        }

        // Restore replies
        renderReplies();
    }
}

// ============= Utility Functions =============
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make functions global for HTML onclick handlers
window.loadImage = loadImage;
window.removeWindow = removeWindow;
window.addWindow = addWindow;
window.zoomImage = zoomImage;
window.downloadImage = downloadImage;
window.toggleSection = toggleSection;
window.addReply = addReply;
window.deleteReply = deleteReply;
window.exportJSON = exportJSON;
window.exportHTML = exportHTML;
window.clearAll = clearAll;
window.openImageViewer = openImageViewer;
window.closeImageViewer = closeImageViewer;
window.rotateImage = rotateImage;
window.toggleFullscreen = toggleFullscreen;