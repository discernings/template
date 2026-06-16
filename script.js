// State
const state = {
    context: '',
    replies: [],
    images: {},
    imageCount: 2,
    colors: {
        primary: '#3498db',
        bg: '#ffffff',
        context: '#e8f4f8',
        replies: '#f8e8e8'
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupColorPicker();
    setupEventListeners();
    loadState();
});

// ============= Color Picker =============
function setupColorPicker() {
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
        if (e.target === modal) modal.classList.remove('show');
    });

    // Color inputs
    document.getElementById('colorPrimary').addEventListener('change', (e) => {
        state.colors.primary = e.target.value;
        applyColors();
        saveState();
    });

    document.getElementById('colorBg').addEventListener('change', (e) => {
        state.colors.bg = e.target.value;
        applyColors();
        saveState();
    });

    document.getElementById('colorContext').addEventListener('change', (e) => {
        state.colors.context = e.target.value;
        applyColors();
        saveState();
    });

    document.getElementById('colorReplies').addEventListener('change', (e) => {
        state.colors.replies = e.target.value;
        applyColors();
        saveState();
    });

    document.getElementById('resetColors').addEventListener('click', () => {
        state.colors = {
            primary: '#3498db',
            bg: '#ffffff',
            context: '#e8f4f8',
            replies: '#f8e8e8'
        };
        updateColorInputs();
        applyColors();
        saveState();
    });
}

function applyColors() {
    document.documentElement.style.setProperty('--color-primary', state.colors.primary);
    document.documentElement.style.setProperty('--color-bg', state.colors.bg);
    document.documentElement.style.setProperty('--color-context', state.colors.context);
    document.documentElement.style.setProperty('--color-replies', state.colors.replies);
}

function updateColorInputs() {
    document.getElementById('colorPrimary').value = state.colors.primary;
    document.getElementById('colorBg').value = state.colors.bg;
    document.getElementById('colorContext').value = state.colors.context;
    document.getElementById('colorReplies').value = state.colors.replies;
}

// ============= Event Listeners =============
function setupEventListeners() {
    document.getElementById('contextInput').addEventListener('input', (e) => {
        state.context = e.target.value;
        saveState();
    });
}

// ============= Image Management =============
function loadImage(windowNum, event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = document.getElementById(`img${windowNum}`);
        const placeholder = document.getElementById(`slot${windowNum}`).querySelector('.image-placeholder');
        
        img.src = e.target.result;
        img.style.display = 'block';
        placeholder.style.display = 'none';
        
        state.images[windowNum] = e.target.result;
        saveState();
    };
    reader.readAsDataURL(file);
}

function toggleImageSlot() {
    const slot3 = document.getElementById('slot3');
    
    if (state.imageCount === 2) {
        slot3.style.display = 'block';
        state.imageCount = 3;
    } else if (state.imageCount === 3) {
        slot3.style.display = 'none';
        state.imageCount = 2;
        delete state.images[3];
    }
    saveState();
}

// ============= Replies Management =============
function addReply() {
    const userInput = document.getElementById('replyUser');
    const contentInput = document.getElementById('replyContent');

    if (!userInput.value.trim() || !contentInput.value.trim()) {
        alert('Preencha o usuário e a resposta!');
        return;
    }

    const reply = {
        id: Date.now(),
        user: userInput.value,
        content: contentInput.value,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    state.replies.push(reply);
    renderReplies();
    userInput.value = '';
    contentInput.value = '';
    saveState();
}

function deleteReply(id) {
    state.replies = state.replies.filter(r => r.id !== id);
    renderReplies();
    saveState();
}

function renderReplies() {
    const repliesList = document.getElementById('repliesList');
    repliesList.innerHTML = '';

    if (state.replies.length === 0) {
        repliesList.innerHTML = '<p style="text-align: center; color: #bdc3c7; font-size: 12px;">Nenhuma resposta</p>';
        return;
    }

    state.replies.forEach(reply => {
        const replyEl = document.createElement('div');
        replyEl.className = 'reply-item';
        replyEl.innerHTML = `
            <div class="reply-header">
                <span class="reply-user">${escapeHtml(reply.user)}</span>
                <span class="reply-time">${reply.time}</span>
                <button class="reply-btn-delete" onclick="deleteReply(${reply.id})">Excluir</button>
            </div>
            <div class="reply-text">${escapeHtml(reply.content)}</div>
        `;
        repliesList.appendChild(replyEl);
    });
}

// ============= Download Functions =============
async function downloadTemplate() {
    try {
        const canvas = await html2canvas(document.getElementById('templateCanvas'), {
            backgroundColor: state.colors.bg,
            scale: 2,
            logging: false,
            useCORS: true
        });

        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/jpeg', 0.95);
        link.download = `template-${Date.now()}.jpeg`;
        link.click();
    } catch (error) {
        console.error('Erro ao baixar JPEG:', error);
        alert('Erro ao gerar imagem!');
    }
}

async function downloadTemplatePNG() {
    try {
        const canvas = await html2canvas(document.getElementById('templateCanvas'), {
            backgroundColor: state.colors.bg,
            scale: 2,
            logging: false,
            useCORS: true
        });

        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `template-${Date.now()}.png`;
        link.click();
    } catch (error) {
        console.error('Erro ao baixar PNG:', error);
        alert('Erro ao gerar imagem!');
    }
}

// ============= Clear All =============
function clearAll() {
    if (confirm('Tem certeza que deseja limpar tudo?')) {
        state.context = '';
        state.replies = [];
        state.images = {};
        state.imageCount = 2;

        document.getElementById('contextInput').value = '';
        document.getElementById('replyUser').value = '';
        document.getElementById('replyContent').value = '';

        for (let i = 1; i <= 3; i++) {
            const img = document.getElementById(`img${i}`);
            const placeholder = document.getElementById(`slot${i}`).querySelector('.image-placeholder');
            const input = document.getElementById(`slot${i}`).querySelector('input');
            if (img) img.style.display = 'none';
            if (placeholder) placeholder.style.display = 'flex';
            if (input) input.value = '';
        }

        document.getElementById('slot3').style.display = 'none';
        renderReplies();
        saveState();
    }
}

// ============= Local Storage =============
function saveState() {
    localStorage.setItem('moderationTemplate', JSON.stringify(state));
}

function loadState() {
    const saved = localStorage.getItem('moderationTemplate');
    if (saved) {
        const savedState = JSON.parse(saved);
        Object.assign(state, savedState);

        // Restore colors
        updateColorInputs();
        applyColors();

        // Restore context
        document.getElementById('contextInput').value = state.context || '';

        // Restore images
        Object.entries(state.images).forEach(([num, src]) => {
            const img = document.getElementById(`img${num}`);
            const placeholder = document.getElementById(`slot${num}`).querySelector('.image-placeholder');
            if (img && placeholder) {
                img.src = src;
                img.style.display = 'block';
                placeholder.style.display = 'none';
            }
        });

        // Restore image slots
        if (state.imageCount === 3) {
            document.getElementById('slot3').style.display = 'block';
        }

        // Restore replies
        renderReplies();
    }
}

// ============= Utility =============
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make functions global
window.loadImage = loadImage;
window.toggleImageSlot = toggleImageSlot;
window.addReply = addReply;
window.deleteReply = deleteReply;
window.downloadTemplate = downloadTemplate;
window.downloadTemplatePNG = downloadTemplatePNG;
window.clearAll = clearAll;