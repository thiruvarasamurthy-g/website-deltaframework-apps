// ========== DOM Elements ==========
const elements = {
    // Zoom & Theme
    zoomSlider: document.getElementById('zoomSlider'),
    zoomLabel: document.getElementById('zoomLabel'),
    zoomInBtn: document.getElementById('zoomInBtn'),
    zoomOutBtn: document.getElementById('zoomOutBtn'),
    themeToggle: document.getElementById('themeToggle'),

    // Request Elements
    httpMethod: document.getElementById('httpMethod'),
    apiUrl: document.getElementById('apiUrl'),
    payload: document.getElementById('payload'),
    headersContainer: document.getElementById('headersContainer'),

    // Response Elements
    response: document.getElementById('response'),
    responseMeta: document.getElementById('responseMeta'),
    responseEmpty: document.getElementById('responseEmpty'),

    // Buttons
    sendRequestBtn: document.getElementById('sendRequestBtn'),
    saveRequestBtn: document.getElementById('saveRequestBtn'),
    addHeaderBtn: document.getElementById('addHeaderBtn'),
    copyResponseBtn: document.getElementById('copyResponseBtn'),
    clearResponseBtn: document.getElementById('clearResponseBtn'),
    pastePayloadBtn: document.getElementById('pastePayloadBtn'),
    copyPayloadBtn: document.getElementById('copyPayloadBtn'),

    // Request Collection Elements
    requestCollectionGroups: document.getElementById('requestCollectionGroups'),
    addRequestCollectionGroupBtn: document.getElementById('addRequestCollectionGroupBtn'),
    deleteRequestCollectionGroupBtn: document.getElementById('deleteRequestCollectionGroupBtn'),
    requestCollectionRequests: document.getElementById('requestCollectionRequests'),
    loadRequestBtn: document.getElementById('loadRequestBtn'),
    deleteRequestBtn: document.getElementById('deleteRequestBtn'),
    exportCollectionsBtn: document.getElementById('exportCollectionsBtn'),
    importCollectionsBtn: document.getElementById('importCollectionsBtn'),

    // Toast
    toast: document.getElementById('toast')
};

// ========== Card Collapse/Expand Functionality ==========
const collapseState = {
    'request-collection': false,
    'request': false,
    'response': false,
    'status-codes': false
};

/**
 * Initialize the collapse system for cards
 * Loads saved states from localStorage and applies them
 */
function initCollapseSystem() {
    // Load saved collapse states from localStorage
    const savedStates = JSON.parse(localStorage.getItem('cardCollapseStates') || '{}');
    Object.assign(collapseState, savedStates);

    // Apply initial states
    Object.keys(collapseState).forEach(cardId => {
        const isCollapsed = collapseState[cardId];
        if (isCollapsed) {
            collapseCard(cardId, false);
        }
    });

    // Setup event listeners for toggle buttons
    setupCollapseEventListeners();
}

/**
 * Set up event listeners for collapse/expand buttons
 */
function setupCollapseEventListeners() {
    // Toggle buttons for each card
    document.getElementById('toggleRequestCollection').addEventListener('click', () => {
        toggleCard('request-collection');
    });

    document.getElementById('toggleRequest').addEventListener('click', () => {
        toggleCard('request');
    });

    document.getElementById('toggleResponse').addEventListener('click', () => {
        toggleCard('response');
    });

    document.getElementById('toggleStatusCodes').addEventListener('click', () => {
        toggleCard('status-codes');
    });

    // Collapse All button
    document.getElementById('collapseAllBtn').addEventListener('click', () => {
        collapseAllCards();
    });

    // Expand All button
    document.getElementById('expandAllBtn').addEventListener('click', () => {
        expandAllCards();
    });
}

/**
 * Toggle a card between collapsed and expanded states
 * @param {string} cardId - The ID of the card to toggle
 */
function toggleCard(cardId) {
    const isCollapsed = collapseState[cardId];

    if (isCollapsed) {
        expandCard(cardId);
    } else {
        collapseCard(cardId, true);
    }
}

/**
 * Collapse a specific card
 * @param {string} cardId - The ID of the card to collapse
 * @param {boolean} saveToStorage - Whether to save state to localStorage
 */
function collapseCard(cardId, saveToStorage = true) {
    let cardBody;
    let toggleButton;

    // Determine which card to collapse based on ID
    switch (cardId) {
        case 'request-collection':
            cardBody = document.querySelector('.card:has(#requestCollectionGroups) .card-body');
            toggleButton = document.getElementById('toggleRequestCollection');
            break;
        case 'request':
            cardBody = document.querySelector('.card:has(#httpMethod) .card-body');
            toggleButton = document.getElementById('toggleRequest');
            break;
        case 'response':
            cardBody = document.querySelector('.card:has(#response) .card-body');
            toggleButton = document.getElementById('toggleResponse');
            break;
        case 'status-codes':
            cardBody = document.getElementById('statusCodesBody');
            toggleButton = document.getElementById('toggleStatusCodes');
            break;
        default:
            return;
    }

    if (cardBody && toggleButton) {
        cardBody.classList.add('collapsed');
        toggleButton.classList.add('collapsed');
        collapseState[cardId] = true;

        if (saveToStorage) {
            saveCollapseStates();
            showToast('Card collapsed', 'info');
        }
    }
}

/**
 * Expand a specific card
 * @param {string} cardId - The ID of the card to expand
 * @param {boolean} saveToStorage - Whether to save state to localStorage
 */
function expandCard(cardId, saveToStorage = true) {
    let cardBody;
    let toggleButton;

    // Determine which card to expand based on ID
    switch (cardId) {
        case 'request-collection':
            cardBody = document.querySelector('.card:has(#requestCollectionGroups) .card-body');
            toggleButton = document.getElementById('toggleRequestCollection');
            break;
        case 'request':
            cardBody = document.querySelector('.card:has(#httpMethod) .card-body');
            toggleButton = document.getElementById('toggleRequest');
            break;
        case 'response':
            cardBody = document.querySelector('.card:has(#response) .card-body');
            toggleButton = document.getElementById('toggleResponse');
            break;
        case 'status-codes':
            cardBody = document.getElementById('statusCodesBody');
            toggleButton = document.getElementById('toggleStatusCodes');
            break;
        default:
            return;
    }

    if (cardBody && toggleButton) {
        cardBody.classList.remove('collapsed');
        toggleButton.classList.remove('collapsed');
        collapseState[cardId] = false;

        if (saveToStorage) {
            saveCollapseStates();
        }
    }
}

/**
 * Collapse all expandable cards
 */
function collapseAllCards() {
    Object.keys(collapseState).forEach(cardId => {
        collapseCard(cardId, false);
    });
    saveCollapseStates();
    showToast('All cards collapsed', 'info');
}

/**
 * Expand all expandable cards
 */
function expandAllCards() {
    Object.keys(collapseState).forEach(cardId => {
        expandCard(cardId, false);
    });
    saveCollapseStates();
    showToast('All cards expanded', 'info');
}

/**
 * Save current collapse states to localStorage
 */
function saveCollapseStates() {
    localStorage.setItem('cardCollapseStates', JSON.stringify(collapseState));
}

/**
 * Set up keyboard shortcuts for collapse/expand functionality
 * Alt + 1,2,3,4 toggles specific cards
 * Alt + C collapses all cards
 * Alt + E expands all cards
 */
function setupCollapseKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
            switch (e.key) {
                case '1':
                    e.preventDefault();
                    toggleCard('request-collection');
                    break;
                case '2':
                    e.preventDefault();
                    toggleCard('request');
                    break;
                case '3':
                    e.preventDefault();
                    toggleCard('response');
                    break;
                case '4':
                    e.preventDefault();
                    toggleCard('status-codes');
                    break;
                case 'c':
                case 'C':
                    e.preventDefault();
                    collapseAllCards();
                    break;
                case 'e':
                case 'E':
                    e.preventDefault();
                    expandAllCards();
                    break;
            }
        }
    });
}

// ========== Global Dialog System ==========
const DialogSystem = {
    /**
     * Create and show a modal dialog
     * @param {Object} options - Dialog configuration options
     * @returns {Promise} Resolves with user input or action result
     */
    createDialog(options = {}) {
        const {
            title = '',
            message = '',
            type = 'prompt',
            inputs = [],
            defaultValue = '',
            placeholder = '',
            confirmText = 'OK',
            cancelText = 'Cancel',
            danger = false
        } = options;

        return new Promise((resolve) => {
            // Create overlay
            const overlay = document.createElement('div');
            overlay.className = 'dialog-overlay';
            overlay.id = 'globalDialogOverlay';

            // Build dialog content based on type
            let bodyContent = '';
            let footerButtons = '';

            switch (type) {
                case 'prompt':
                    bodyContent = `
                        ${message ? `<p class="dialog-message">${message}</p>` : ''}
                        <div class="dialog-input-group">
                            <input type="text" 
                                   class="dialog-input" 
                                   id="dialogInput" 
                                   value="${defaultValue}" 
                                   placeholder="${placeholder}"
                                   autocomplete="off">
                        </div>
                    `;
                    footerButtons = `
                        <button class="btn dialog-btn-secondary" id="dialogCancelBtn">
                            ${cancelText}
                        </button>
                        <button class="btn ${danger ? 'dialog-btn-danger' : 'dialog-btn-primary'}" id="dialogConfirmBtn">
                            ${confirmText}
                        </button>
                    `;
                    break;

                case 'confirm':
                    bodyContent = `
                        <div class="dialog-confirm-icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <p class="dialog-message">${message}</p>
                    `;
                    footerButtons = `
                        <button class="btn dialog-btn-secondary" id="dialogCancelBtn">
                            ${cancelText}
                        </button>
                        <button class="btn ${danger ? 'dialog-btn-danger' : 'dialog-btn-primary'}" id="dialogConfirmBtn">
                            ${confirmText}
                        </button>
                    `;
                    break;

                case 'alert':
                    bodyContent = `
                        <div class="dialog-alert-icon">
                            <i class="fas fa-info-circle"></i>
                        </div>
                        <p class="dialog-message">${message}</p>
                    `;
                    footerButtons = `
                        <button class="btn dialog-btn-primary" id="dialogConfirmBtn">
                            ${confirmText}
                        </button>
                    `;
                    break;
            }

            // Create dialog HTML
            const dialog = document.createElement('div');
            dialog.className = `dialog ${type === 'prompt' ? 'dialog-sm' : ''}`;
            dialog.innerHTML = `
                <div class="dialog-header">
                    <div class="dialog-title">${title}</div>
                    <button class="dialog-close" id="dialogCloseBtn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="dialog-body">
                    ${bodyContent}
                </div>
                <div class="dialog-footer">
                    ${footerButtons}
                </div>
            `;

            overlay.appendChild(dialog);
            document.body.appendChild(overlay);

            // Show dialog with animation
            setTimeout(() => {
                overlay.classList.add('show');
                toggleBodyScroll(true);
            }, 10);

            // Focus input for prompt dialogs
            if (type === 'prompt') {
                setTimeout(() => {
                    const input = document.getElementById('dialogInput');
                    if (input) {
                        input.focus();
                        input.select();
                    }
                }, 100);
            }

            // Setup event handlers
            const cleanup = () => {
                overlay.classList.remove('show');
                toggleBodyScroll(false); // <-- ADD THIS LINE
                setTimeout(() => {
                    if (overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                }, 300);
            };

            // Confirm button
            const confirmBtn = document.getElementById('dialogConfirmBtn');
            if (confirmBtn) {
                confirmBtn.addEventListener('click', () => {
                    if (type === 'prompt') {
                        const input = document.getElementById('dialogInput');
                        resolve(input ? input.value.trim() : '');
                    } else {
                        resolve(true);
                    }
                    cleanup();
                });
            }

            // Cancel/Close buttons
            const cancelBtn = document.getElementById('dialogCancelBtn');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    resolve(type === 'prompt' ? null : false);
                    cleanup();
                });
            }

            const closeBtn = document.getElementById('dialogCloseBtn');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    resolve(type === 'prompt' ? null : false);
                    cleanup();
                });
            }

            // Close on ESC key
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    resolve(type === 'prompt' ? null : false);
                    cleanup();
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);

            // Close on overlay click
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    resolve(type === 'prompt' ? null : false);
                    cleanup();
                }
            });
        });
    },

    // Helper methods for common dialog types
    async prompt(options) {
        return await this.createDialog({ ...options, type: 'prompt' });
    },

    async confirm(options) {
        return await this.createDialog({ ...options, type: 'confirm' });
    },

    async alert(options) {
        return await this.createDialog({ ...options, type: 'alert' });
    },

    // Quick methods
    async ask(title, message, defaultValue = '') {
        return await this.prompt({ title, message, defaultValue });
    },

    async confirmAction(title, message, danger = false) {
        return await this.confirm({
            title,
            message,
            danger,
            confirmText: danger ? 'Yes, Delete' : 'Yes',
            cancelText: 'Cancel'
        });
    },

    async showInfo(title, message) {
        return await this.alert({ title, message });
    }
};

// ========== Zoom Functionality ==========

/**
 * Set zoom level for the application
 * @param {number} percent - Zoom percentage (50-200)
 * @param {boolean} persist - Whether to save to localStorage
 */
function setZoom(percent, persist = true) {
    const zoomableContent = document.getElementById('zoomable-content');
    if (zoomableContent) {
        zoomableContent.style.transform = `scale(${percent / 100})`;
    }
    elements.zoomSlider.value = percent;
    elements.zoomLabel.textContent = `${percent}%`;
    if (persist) localStorage.setItem('restClientZoom', percent);
}

/**
 * Change zoom by a specific delta
 * @param {number} delta - Amount to change zoom by
 */
function changeZoomBy(delta) {
    const current = parseInt(elements.zoomSlider.value, 10);
    const next = Math.min(200, Math.max(50, current + delta));
    setZoom(next);
}

// ========== Theme Toggle ==========

/**
 * Set application theme (light/dark)
 * @param {boolean} dark - True for dark theme, false for light
 * @param {boolean} persist - Whether to save to localStorage
 */
function setTheme(dark, persist = true) {
    if (dark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        elements.themeToggle.checked = true;
    } else {
        document.documentElement.removeAttribute('data-theme');
        elements.themeToggle.checked = false;
    }
    if (persist) localStorage.setItem('restClientTheme', dark ? 'dark' : 'light');
}

// ========== Headers Management ==========

/**
 * Add a header row to the headers container
 * @param {string} key - Header name
 * @param {string} value - Header value
 */
/**
 * Add a header row to the headers container
 * @param {string} key - Header name
 * @param {string} value - Header value
 */
function addHeader(key = '', value = '') {
    const headerRow = document.createElement('div');
    headerRow.className = 'header-row';

    // Create key input
    const keyInput = document.createElement('input');
    keyInput.type = 'text';
    keyInput.className = 'form-control header-input';
    keyInput.placeholder = 'Header Name';
    keyInput.value = key;

    // Create value input
    const valueInput = document.createElement('input');
    valueInput.type = 'text';
    valueInput.className = 'form-control header-input';
    valueInput.placeholder = 'Header Value';
    valueInput.value = value;

    // Create decode button (only show for Authorization headers or headers containing "token")
    const decodeButton = document.createElement('button');
    decodeButton.className = 'header-decode';
    decodeButton.innerHTML = '<i class="fas fa-code"></i>';
    decodeButton.title = 'Decode Token';
    decodeButton.style.display = 'none'; // Hidden by default

    // Show decode button for Authorization headers or headers with "token" in name
    if (key.toLowerCase().includes('authorization') ||
        key.toLowerCase().includes('token') ||
        key.toLowerCase().includes('jwt')) {
        decodeButton.style.display = 'flex';
    }

    decodeButton.onclick = function () {
        decodeToken(valueInput.value, keyInput.value);
    };

    // Create remove button
    const removeButton = document.createElement('button');
    removeButton.className = 'header-remove';
    removeButton.innerHTML = '<i class="fas fa-times"></i>';
    removeButton.onclick = function () {
        headerRow.remove();
    };

    // Update decode button visibility when key changes
    keyInput.addEventListener('input', function () {
        const keyValue = this.value.toLowerCase();
        if (keyValue.includes('authorization') ||
            keyValue.includes('token') ||
            keyValue.includes('jwt')) {
            decodeButton.style.display = 'flex';
        } else {
            decodeButton.style.display = 'none';
        }
    });

    // Append all elements
    headerRow.appendChild(keyInput);
    headerRow.appendChild(valueInput);
    headerRow.appendChild(decodeButton);
    headerRow.appendChild(removeButton);

    elements.headersContainer.appendChild(headerRow);
}

/**
 * Helper function to remove a header row
 * @param {HTMLElement} button - The remove button that was clicked
 */
function removeHeader(button) {
    const headerRow = button.closest('.header-row');
    if (headerRow && headerRow.parentNode) {
        headerRow.parentNode.removeChild(headerRow);
    }
}

/**
 * Get all headers from the headers container
 * @returns {Object} Headers as key-value pairs
 */
function getHeaders() {
    const headers = {};
    const rows = elements.headersContainer.querySelectorAll('.header-row');
    rows.forEach(row => {
        const inputs = row.querySelectorAll('input');
        const key = inputs[0].value.trim();
        const value = inputs[1].value.trim();
        if (key) headers[key] = value;
    });
    return headers;
}

// ========== Request/Response ==========

/**
 * Send HTTP request based on current configuration
 */
async function sendRequest() {
    const url = elements.apiUrl.value.trim();
    const method = elements.httpMethod.value;
    const payload = elements.payload.value;

    // Show loading state
    const sendBtn = elements.sendRequestBtn;
    const originalHtml = sendBtn.innerHTML;
    sendBtn.innerHTML = '<div class="loading"></div> Sending...';
    sendBtn.disabled = true;

    // Hide empty state
    elements.responseEmpty.classList.add('hidden');
    elements.response.value = '';
    elements.responseMeta.innerHTML = '';

    if (!url) {
        showToast('Please enter a URL', 'error');
        resetSendButton(sendBtn, originalHtml);
        return;
    }

    try {
        const startTime = Date.now();
        const headers = getHeaders();

        // Ensure Content-Type for non-GET requests
        if (!['GET', 'HEAD', 'OPTIONS'].includes(method) && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json';
        }

        const options = {
            method,
            headers,
            mode: 'cors',
            cache: 'no-cache'
        };

        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && payload.trim()) {
            options.body = payload;
        }

        const response = await fetch(url, options);
        const duration = Date.now() - startTime;

        // Parse response text
        let responseText = await response.text();

        // First, try to parse as JSON (the outer JSON string)
        let formattedResponse;

        try {
            // Parse the outer JSON string
            const parsed = JSON.parse(responseText);

            // If the parsed result is a string (like in our case), handle it
            if (typeof parsed === 'string') {
                // Now we have the actual string with \r\n escape sequences
                // Replace literal backslash-r-backslash-n with newlines
                let cleanText = parsed.replace(/\\r\\n/g, '\n');
                cleanText = cleanText.replace(/\\n/g, '\n');
                cleanText = cleanText.replace(/\\r/g, '\n');
                cleanText = cleanText.trim();

                // Format key-value pairs if present
                const lines = cleanText.split('\n').filter(line => line.trim() !== '');

                if (lines.length > 0 && lines[0].includes(':')) {
                    // Find the longest key for alignment
                    let maxKeyLength = 0;
                    lines.forEach(line => {
                        if (line.includes(':')) {
                            const colonIndex = line.indexOf(':');
                            const key = line.substring(0, colonIndex).trim();
                            maxKeyLength = Math.max(maxKeyLength, key.length);
                        }
                    });

                    // Reformat each line with proper alignment
                    const formattedLines = lines.map(line => {
                        if (line.includes(':')) {
                            const colonIndex = line.indexOf(':');
                            const key = line.substring(0, colonIndex).trim();
                            const value = line.substring(colonIndex + 1).trim();
                            return `${key.padEnd(maxKeyLength)} : ${value}`;
                        }
                        return line;
                    });

                    formattedResponse = formattedLines.join('\n');
                } else {
                    formattedResponse = cleanText;
                }
            } else if (typeof parsed === 'object' && parsed !== null) {
                // It's a JSON object, pretty print it
                formattedResponse = JSON.stringify(parsed, null, 2);
            } else {
                // Some other type (number, boolean, etc.)
                formattedResponse = String(parsed);
            }
        } catch (e) {
            // Not JSON - try direct replacement
            let cleanText = responseText;

            // Remove surrounding quotes if present
            if (cleanText.startsWith('"') && cleanText.endsWith('"')) {
                cleanText = cleanText.substring(1, cleanText.length - 1);
            }

            // Replace escape sequences
            cleanText = cleanText.replace(/\\r\\n/g, '\n');
            cleanText = cleanText.replace(/\\n/g, '\n');
            cleanText = cleanText.trim();

            formattedResponse = cleanText;
        }

        // Update response display
        elements.response.value = formattedResponse;

        // Update metadata
        const statusClass = response.ok ? 'success' : 'error';
        elements.responseMeta.innerHTML = `
            <div class="meta-item status ${statusClass}">
                <i class="fas fa-circle"></i>
                ${response.status} ${response.statusText}
            </div>
            <div class="meta-item">
                <i class="fas fa-clock"></i>
                ${duration}ms
            </div>
            <div class="meta-item">
                <i class="fas fa-weight-hanging"></i>
                ${formatBytes(responseText.length)}
            </div>
        `;

        // Add response headers
        const headerItems = [];
        response.headers.forEach((value, key) => {
            headerItems.push(`<div class="meta-item">${key}: ${value}</div>`);
        });

        if (headerItems.length > 0) {
            elements.responseMeta.innerHTML += headerItems.slice(0, 3).join('');
        }

        showToast(`Request completed in ${duration}ms`, 'success');

    } catch (error) {
        elements.response.value = `Error: ${error.message}\n\nPossible causes:\n- CORS issue\n- Network error\n- Invalid URL\n- Server not responding`;
        elements.responseMeta.innerHTML = `
            <div class="meta-item status error">
                <i class="fas fa-exclamation-circle"></i>
                Network Error
            </div>
        `;
        showToast('Request failed: ' + error.message, 'error');
    } finally {
        resetSendButton(sendBtn, originalHtml);
    }
}

/**
 * Reset send button to original state
 * @param {HTMLElement} button - The send button element
 * @param {string} originalHtml - Original HTML content of the button
 */
function resetSendButton(button, originalHtml) {
    button.innerHTML = originalHtml;
    button.disabled = false;
}

/**
 * Format bytes to human readable format
 * @param {number} bytes - Number of bytes
 * @returns {string} Formatted string
 */
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Clear the response panel
 */
function clearResponse() {
    elements.response.value = '';
    elements.responseMeta.innerHTML = '';
    elements.responseEmpty.classList.remove('hidden');
}

// ========== Copy/Paste Functions ==========

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
    }
}

/**
 * Paste text from clipboard
 * @returns {Promise<string|null>} Pasted text or null if failed
 */
async function pasteFromClipboard() {
    try {
        const text = await navigator.clipboard.readText();
        return text;
    } catch (err) {
        showToast('Cannot access clipboard. Please paste manually.', 'error');
        return null;
    }
}

/**
 * Paste content from clipboard into payload field
 */
async function pastePayload() {
    const pastedText = await pasteFromClipboard();
    if (pastedText) {
        elements.payload.value = pastedText;
        showToast('Pasted from clipboard', 'success');
    }
}

/**
 * Copy payload to clipboard
 */
function copyPayload() {
    copyToClipboard(elements.payload.value);
    showToast('Payload copied to clipboard', 'success');
}

/**
 * Copy response to clipboard
 */
function copyResponse() {
    if (!elements.response.value.trim()) {
        showToast('No response to copy', 'error');
        return;
    }
    copyToClipboard(elements.response.value);
    showToast('Response copied to clipboard', 'success');
}

// ========== Toast Notifications ==========

/**
 * Show a toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of toast (success, error, info)
 */
function showToast(message, type = 'success') {
    elements.toast.textContent = message;
    elements.toast.className = `toast ${type}`;
    elements.toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${message}
    `;
    elements.toast.classList.add('show');

    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
}

// ========== Request Collection Groups Functions ==========

/**
 * Add a new request collection group
 */
async function addRequestCollectionGroup() {
    const groupName = await DialogSystem.ask(
        'New Request Collection Group',
        'Enter a name for the new request collection group:',
        'New Group'
    );

    if (!groupName) return;

    let requestCollectionGroups = JSON.parse(localStorage.getItem('requestCollectionGroups') || '{}');

    // Check if group already exists
    if (requestCollectionGroups[groupName]) {
        await DialogSystem.showInfo(
            'Group Already Exists',
            `Request collection group "${groupName}" already exists.`
        );
        return;
    }

    // Create new empty group
    requestCollectionGroups[groupName] = {};
    localStorage.setItem('requestCollectionGroups', JSON.stringify(requestCollectionGroups));

    // Update UI
    populateRequestCollectionGroups();
    elements.requestCollectionGroups.value = groupName;
    onRequestCollectionGroupSelected();

    showToast(`Request collection group "${groupName}" created`, 'success');
}

/**
 * Delete a request collection group
 */
async function deleteRequestCollectionGroup() {
    const groupSelect = elements.requestCollectionGroups;
    const groupName = groupSelect.value;

    if (!groupName) {
        await DialogSystem.showInfo(
            'Select Group',
            'Please select a request collection group to delete.'
        );
        return;
    }

    if (groupName === 'Default') {
        await DialogSystem.showInfo(
            'Cannot Delete Default',
            'Cannot delete the Default request collection group.'
        );
        return;
    }

    const requestCollectionGroups = JSON.parse(localStorage.getItem('requestCollectionGroups') || '{}');

    // Check if group has any requests
    const requestCount = Object.keys(requestCollectionGroups[groupName] || {}).length;

    let message = `Are you sure you want to delete request collection group "${groupName}"?`;
    if (requestCount > 0) {
        message += `\nThis will also delete ${requestCount} request(s) in this group.`;
    }

    const confirmed = await DialogSystem.confirmAction(
        'Delete Request Collection Group',
        message,
        true
    );

    if (!confirmed) return;

    // Delete the group
    delete requestCollectionGroups[groupName];
    localStorage.setItem('requestCollectionGroups', JSON.stringify(requestCollectionGroups));

    // Switch to Default group
    populateRequestCollectionGroups();
    elements.requestCollectionGroups.value = 'Default';
    onRequestCollectionGroupSelected();

    showToast(`Request collection group "${groupName}" deleted`, 'success');
}

/**
 * Populate request collection groups dropdown
 */
function populateRequestCollectionGroups() {
    const requestCollectionGroups = JSON.parse(localStorage.getItem('requestCollectionGroups') || '{}');
    const groupSelect = elements.requestCollectionGroups;
    const currentGroup = groupSelect.value;

    groupSelect.innerHTML = '<option value="">Select a group...</option>';

    // Get all groups, ensure "Default" exists
    const groups = Object.keys(requestCollectionGroups);
    if (!groups.includes('Default')) {
        requestCollectionGroups['Default'] = {};
        localStorage.setItem('requestCollectionGroups', JSON.stringify(requestCollectionGroups));
    }

    // Add "Default" first, then other groups alphabetically
    groupSelect.appendChild(createOption('Default', 'Default'));

    groups
        .filter(group => group !== 'Default')
        .sort()
        .forEach(group => {
            groupSelect.appendChild(createOption(group, group));
        });

    // Restore selected group if it still exists
    if (currentGroup && groups.includes(currentGroup)) {
        groupSelect.value = currentGroup;
    } else {
        groupSelect.value = 'Default';
    }

    // Save current group selection
    localStorage.setItem('currentRequestCollectionGroup', groupSelect.value);
}

/**
 * Create an option element for select dropdown
 * @param {string} value - Option value
 * @param {string} text - Option display text
 * @returns {HTMLOptionElement} Option element
 */
function createOption(value, text) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    return option;
}

/**
 * Handle request collection group selection change
 */
function onRequestCollectionGroupSelected() {
    const groupSelect = elements.requestCollectionGroups;
    const groupName = groupSelect.value;
    const requestCollectionRequestsSelect = elements.requestCollectionRequests;
    const deleteGroupBtn = elements.deleteRequestCollectionGroupBtn;
    const loadRequestBtn = elements.loadRequestBtn;
    const deleteRequestBtn = elements.deleteRequestBtn;

    // Enable/disable group delete button
    deleteGroupBtn.disabled = !groupName || groupName === 'Default';

    if (!groupName) {
        // No group selected, disable request controls
        requestCollectionRequestsSelect.disabled = true;
        requestCollectionRequestsSelect.innerHTML = '<option value="">Select a request...</option>';
        if (loadRequestBtn) loadRequestBtn.disabled = true;
        if (deleteRequestBtn) deleteRequestBtn.disabled = true;
        return;
    }

    // Enable request dropdown and populate it
    requestCollectionRequestsSelect.disabled = false;
    populateRequestCollectionRequests(groupName);

    // Save current group selection
    localStorage.setItem('currentRequestCollectionGroup', groupName);
}

/**
 * Get current request collection group
 * @returns {string} Current group name
 */
function getCurrentRequestCollectionGroup() {
    const groupSelect = elements.requestCollectionGroups;
    return groupSelect.value || 'Default';
}

/**
 * Get requests for a specific group
 * @param {string} groupName - Group name
 * @returns {Object} Requests in the group
 */
function getRequestCollectionGroupRequests(groupName) {
    const requestCollectionGroups = JSON.parse(localStorage.getItem('requestCollectionGroups') || '{}');
    return requestCollectionGroups[groupName] || {};
}

/**
 * Set requests for a specific group
 * @param {string} groupName - Group name
 * @param {Object} requests - Requests to set
 */
function setRequestCollectionGroupRequests(groupName, requests) {
    let requestCollectionGroups = JSON.parse(localStorage.getItem('requestCollectionGroups') || '{}');
    requestCollectionGroups[groupName] = requests;
    localStorage.setItem('requestCollectionGroups', JSON.stringify(requestCollectionGroups));
}

// ========== Request Collection Requests Functions ==========

/**
 * Save current request to request collection
 */
async function saveRequestCollectionRequest() {
    const url = elements.apiUrl.value.trim();
    if (!url) {
        await DialogSystem.showInfo(
            'URL Required',
            'Please enter a URL to save.'
        );
        return;
    }

    const method = elements.httpMethod.value;
    const currentGroup = getCurrentRequestCollectionGroup();

    // Format: "HttpMethod EndpointURL"
    const suggestedName = `${method} ${url}`;

    const name = await DialogSystem.prompt({
        title: 'Save Request',
        message: 'Enter a name for this request collection request:',
        defaultValue: suggestedName,
        placeholder: 'Request name'
    });

    if (!name) return;

    const requestData = {
        url,
        method,
        payload: elements.payload.value,
        headers: getHeaders(),
        timestamp: new Date().toISOString(),
        requestCollectionGroup: currentGroup
    };

    // Get existing requests for current group
    const groupRequests = getRequestCollectionGroupRequests(currentGroup);

    // Check if request with same name already exists in group
    if (groupRequests[name]) {
        const overwrite = await DialogSystem.confirm({
            title: 'Overwrite Request',
            message: `Request collection request "${name}" already exists in group "${currentGroup}". Overwrite?`,
            confirmText: 'Overwrite',
            cancelText: 'Cancel'
        });

        if (!overwrite) {
            return;
        }
    }

    // Save to current group
    groupRequests[name] = requestData;
    setRequestCollectionGroupRequests(currentGroup, groupRequests);

    populateRequestCollectionRequests(currentGroup);
    elements.requestCollectionRequests.value = name;

    showToast(`Request saved to "${currentGroup}" request collection group`, 'success');
}

/**
 * Populate request collection requests dropdown
 * @param {string} groupName - Group name (optional, uses current group if not provided)
 */
function populateRequestCollectionRequests(groupName = null) {
    const actualGroupName = groupName || getCurrentRequestCollectionGroup();
    const groupRequests = getRequestCollectionGroupRequests(actualGroupName);
    const dropdown = elements.requestCollectionRequests;
    const currentValue = dropdown.value;
    const loadRequestBtn = elements.loadRequestBtn;
    const deleteRequestBtn = elements.deleteRequestBtn;

    dropdown.innerHTML = '<option value="">Select a request...</option>';

    Object.keys(groupRequests)
        .sort()
        .forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            dropdown.appendChild(option);
        });

    if (currentValue && groupRequests[currentValue]) {
        dropdown.value = currentValue;
    }

    // Enable/disable request action buttons based on selection
    const hasSelection = !!dropdown.value;
    if (loadRequestBtn) loadRequestBtn.disabled = !hasSelection;
    if (deleteRequestBtn) deleteRequestBtn.disabled = !hasSelection;
}

/**
 * Load selected request from request collection
 */
function loadSelectedRequestCollectionRequest() {
    const name = elements.requestCollectionRequests.value;
    const currentGroup = getCurrentRequestCollectionGroup();

    if (!name) {
        showToast('Please select a request to load', 'error');
        return;
    }

    const groupRequests = getRequestCollectionGroupRequests(currentGroup);
    const request = groupRequests[name];

    if (!request) {
        showToast('Request collection request not found', 'error');
        return;
    }

    // Set method
    elements.httpMethod.value = request.method || 'GET';

    // Set URL and payload
    elements.apiUrl.value = request.url || '';
    elements.payload.value = request.payload || '';

    // Set headers
    elements.headersContainer.innerHTML = '';
    if (request.headers && Object.keys(request.headers).length > 0) {
        Object.entries(request.headers).forEach(([key, value]) => {
            addHeader(key, value);
        });
    } else {
        addHeader('Content-Type', 'application/json');
        addHeader('Accept', 'application/json');
    }

    showToast(`Loaded from "${currentGroup}" request collection group: ${name}`, 'success');
}

/**
 * Delete selected request from request collection
 */
async function deleteSelectedRequestCollectionRequest() {
    const name = elements.requestCollectionRequests.value;
    const currentGroup = getCurrentRequestCollectionGroup();

    if (!name) {
        await DialogSystem.showInfo(
            'Select Request',
            'Please select a request collection request to delete.'
        );
        return;
    }

    const confirmed = await DialogSystem.confirmAction(
        'Delete Request',
        `Are you sure you want to delete "${name}" from "${currentGroup}" request collection group?`,
        true
    );

    if (!confirmed) return;

    const groupRequests = getRequestCollectionGroupRequests(currentGroup);
    delete groupRequests[name];
    setRequestCollectionGroupRequests(currentGroup, groupRequests);

    populateRequestCollectionRequests(currentGroup);
    showToast('Request collection request deleted', 'success');
}

/**
 * Export all request collections to JSON file
 */
function exportRequestCollections() {
    const requestCollectionGroups = JSON.parse(localStorage.getItem('requestCollectionGroups') || '{}');
    const dataStr = JSON.stringify(requestCollectionGroups, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'easy-rest-client-request-collections.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('All request collection groups exported successfully', 'success');
}

/**
 * Import request collections from JSON file
 */
function importRequestCollections() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const imported = JSON.parse(text);

            if (typeof imported !== 'object') {
                throw new Error('Invalid file format');
            }

            const current = JSON.parse(localStorage.getItem('requestCollectionGroups') || '{}');

            // Merge groups, preserving existing requests
            Object.keys(imported).forEach(groupName => {
                if (!current[groupName]) {
                    current[groupName] = {};
                }
                // Merge requests within the group
                current[groupName] = { ...current[groupName], ...imported[groupName] };
            });

            localStorage.setItem('requestCollectionGroups', JSON.stringify(current));

            // Update UI
            populateRequestCollectionGroups();
            const currentGroup = getCurrentRequestCollectionGroup();
            populateRequestCollectionRequests(currentGroup);

            showToast('Request collection groups imported successfully', 'success');
        } catch (error) {
            showToast('Import failed: ' + error.message, 'error');
        }
    };

    input.click();
}

// ========== Keyboard Shortcuts ==========

/**
 * Set up application keyboard shortcuts
 */
function setupAppKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl+Enter to send request
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            sendRequest();
        }

        // Ctrl+S to save request
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveRequestCollectionRequest();
        }

        // Ctrl+V to paste in payload when focused
        if ((e.ctrlKey || e.metaKey) && e.key === 'v' && document.activeElement === elements.payload) {
            // Allow default paste behavior, but also show toast
            setTimeout(() => {
                showToast('Pasted into request body', 'info');
            }, 100);
        }

        // Keyboard shortcuts for zoom
        if ((e.ctrlKey || e.metaKey) && !e.altKey) {
            if (e.key === '+' || e.key === '=') {
                e.preventDefault();
                changeZoomBy(5);
            } else if (e.key === '-') {
                e.preventDefault();
                changeZoomBy(-5);
            } else if (e.key === '0') {
                e.preventDefault();
                setZoom(100);
            }
        }
    });
}

// ========== Initialize ==========

/**
 * Initialize the application
 */
function init() {
    // Set current year in copyright
    const copyrightMessage = document.getElementById('copyrightMessage');
    const now = new Date();
    const currentYear = now.getFullYear();
    copyrightMessage.textContent = copyrightMessage.textContent + currentYear;

    // Initialize zoom
    const savedZoom = parseInt(localStorage.getItem('restClientZoom') || '100', 10);
    setZoom(isNaN(savedZoom) ? 100 : savedZoom, false);

    // REMOVE THIS LINE - theme is already set in <head>
    // const savedTheme = localStorage.getItem('restClientTheme') || 'light';
    // setTheme(savedTheme === 'dark', false);

    // INSTEAD: Just sync the toggle switch with current state
    const currentTheme = document.documentElement.getAttribute('data-theme');
    elements.themeToggle.checked = currentTheme === 'dark';

    // Add initial headers
    addHeader('Content-Type', 'application/json');
    addHeader('Accept', 'application/json');

    // Initialize request collection groups
    const requestCollectionGroups = JSON.parse(localStorage.getItem('requestCollectionGroups') || '{}');

    // Ensure "Default" group exists
    if (!requestCollectionGroups['Default']) {
        requestCollectionGroups['Default'] = {};
        localStorage.setItem('requestCollectionGroups', JSON.stringify(requestCollectionGroups));
    }

    // Populate groups dropdown
    populateRequestCollectionGroups();

    // Restore last selected group or use "Default"
    const lastGroup = localStorage.getItem('currentRequestCollectionGroup') || 'Default';
    elements.requestCollectionGroups.value = lastGroup;

    // Trigger initial group selection
    onRequestCollectionGroupSelected();

    // Show initial state
    elements.responseEmpty.classList.remove('hidden');

    // Setup event listeners
    setupEventListeners();
    setupAppKeyboardShortcuts();
    setupCollapseKeyboardShortcuts();
    initCollapseSystem();

    showToast('Easy REST Client loaded successfully!', 'success');
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // Zoom controls
    elements.zoomSlider.addEventListener('input', () => setZoom(parseInt(elements.zoomSlider.value, 10)));
    elements.zoomInBtn.addEventListener('click', () => changeZoomBy(5));
    elements.zoomOutBtn.addEventListener('click', () => changeZoomBy(-5));

    // Theme toggle
    elements.themeToggle.addEventListener('change', () => setTheme(elements.themeToggle.checked));

    // Request buttons
    elements.sendRequestBtn.addEventListener('click', sendRequest);
    elements.saveRequestBtn.addEventListener('click', saveRequestCollectionRequest);
    elements.addHeaderBtn.addEventListener('click', addHeaderWithAuthScheme);
    elements.copyResponseBtn.addEventListener('click', copyResponse);
    elements.clearResponseBtn.addEventListener('click', clearResponse);
    elements.pastePayloadBtn.addEventListener('click', pastePayload);
    elements.copyPayloadBtn.addEventListener('click', copyPayload);

    // Request collection buttons
    elements.addRequestCollectionGroupBtn.addEventListener('click', addRequestCollectionGroup);
    elements.deleteRequestCollectionGroupBtn.addEventListener('click', deleteRequestCollectionGroup);
    elements.requestCollectionGroups.addEventListener('change', onRequestCollectionGroupSelected);
    elements.loadRequestBtn.addEventListener('click', loadSelectedRequestCollectionRequest);
    elements.deleteRequestBtn.addEventListener('click', deleteSelectedRequestCollectionRequest);
    elements.exportCollectionsBtn.addEventListener('click', exportRequestCollections);
    elements.importCollectionsBtn.addEventListener('click', importRequestCollections);

    // Event listener for requests dropdown change
    elements.requestCollectionRequests.addEventListener('change', function () {
        const hasSelection = !!this.value;
        elements.loadRequestBtn.disabled = !hasSelection;
        elements.deleteRequestBtn.disabled = !hasSelection;

        // Automatically load the request when selected
        if (hasSelection) {
            loadSelectedRequestCollectionRequest();
        }
    });
}

// ========== Authorization Scheme Functions ==========

/**
 * Add header with selected authentication scheme
 */
function addHeaderWithAuthScheme() {
    const authScheme = document.getElementById('authSchemeSelect').value;

    if (!authScheme) {
        // If no auth scheme selected, add empty header
        addHeader();
        return;
    }

    // Show appropriate prompt for selected auth scheme
    showAuthPrompt(authScheme);
}

/**
 * Show authentication prompt based on scheme
 * @param {string} scheme - Authentication scheme
 */
async function showAuthPrompt(scheme) {
    let title = '';
    let inputs = [];

    switch (scheme) {
        case 'bearer':
            title = 'Bearer Token Authentication';
            inputs = [{
                id: 'bearerToken',
                label: 'Bearer Token',
                placeholder: 'Enter your bearer token',
                type: 'text'
            }];
            break;

        case 'basic':
            title = 'Basic Authentication';
            inputs = [
                {
                    id: 'basicUsername',
                    label: 'Username',
                    placeholder: 'Enter username',
                    type: 'text'
                },
                {
                    id: 'basicPassword',
                    label: 'Password',
                    placeholder: 'Enter password',
                    type: 'password'
                }
            ];
            break;

        case 'apikey':
            title = 'API Key Authentication';
            inputs = [
                {
                    id: 'apikeyHeader',
                    label: 'Header Name',
                    placeholder: 'Header name for API key',
                    type: 'text',
                    defaultValue: 'X-API-Key'
                },
                {
                    id: 'apikeyValue',
                    label: 'API Key',
                    placeholder: 'Enter your API key',
                    type: 'text'
                }
            ];
            break;

        case 'digest':
            title = 'Digest Authentication';
            inputs = [
                {
                    id: 'digestUsername',
                    label: 'Username',
                    placeholder: 'Enter username',
                    type: 'text'
                },
                {
                    id: 'digestRealm',
                    label: 'Realm',
                    placeholder: 'Enter realm (e.g., "testrealm@host.com")',
                    type: 'text',
                    defaultValue: 'testrealm@host.com'
                },
                {
                    id: 'digestNonce',
                    label: 'Nonce',
                    placeholder: 'Enter server-provided nonce',
                    type: 'text',
                    defaultValue: 'dcd98b7102dd2f0e8b11d0f600bfb0c093'
                },
                {
                    id: 'digestUri',
                    label: 'URI',
                    placeholder: 'Enter request URI',
                    type: 'text',
                    defaultValue: '/api/resource'
                },
                {
                    id: 'digestQop',
                    label: 'QOP',
                    type: 'select',
                    options: [
                        { value: 'auth', text: 'auth' },
                        { value: 'auth-int', text: 'auth-int' },
                        { value: '', text: 'None' }
                    ],
                    defaultValue: 'auth'
                },
                {
                    id: 'digestNc',
                    label: 'Nonce Count',
                    placeholder: 'Nonce count (e.g., 00000001)',
                    type: 'text',
                    defaultValue: '00000001'
                },
                {
                    id: 'digestCnonce',
                    label: 'Client Nonce',
                    placeholder: 'Client nonce',
                    type: 'text',
                    defaultValue: '0a4f113b'
                },
                {
                    id: 'digestResponse',
                    label: 'Response',
                    placeholder: 'Digest response hash (calculated)',
                    type: 'text',
                    defaultValue: '6629fae49393a05397450978507c4ef1'
                },
                {
                    id: 'digestOpaque',
                    label: 'Opaque',
                    placeholder: 'Opaque data from server (if any)',
                    type: 'text'
                }
            ];
            break;

        case 'oauth2':
            title = 'OAuth 2.0 Authentication';
            inputs = [
                {
                    id: 'oauthTokenType',
                    label: 'Token Type',
                    type: 'select',
                    options: [
                        { value: 'Bearer', text: 'Bearer' },
                        { value: 'MAC', text: 'MAC' },
                        { value: 'JWT', text: 'JWT' }
                    ],
                    defaultValue: 'Bearer'
                },
                {
                    id: 'oauthToken',
                    label: 'Access Token',
                    placeholder: 'Enter your OAuth 2.0 access token',
                    type: 'text'
                }
            ];
            break;

        case 'custom':
            title = 'Custom Authorization Header';
            inputs = [
                {
                    id: 'customHeaderName',
                    label: 'Header Name',
                    placeholder: 'Header name',
                    type: 'text',
                    defaultValue: 'Authorization'
                },
                {
                    id: 'customHeaderValue',
                    label: 'Header Value',
                    placeholder: 'Enter header value',
                    type: 'text'
                }
            ];
            break;
    }

    // Create custom dialog with multiple inputs
    const result = await createMultiInputDialog(title, inputs);

    if (!result) return;

    // Process the result based on the scheme
    switch (scheme) {
        case 'bearer':
            if (result.bearerToken) {
                addHeader('Authorization', `Bearer ${result.bearerToken}`);
                showToast('Bearer token header added', 'success');
            }
            break;

        case 'basic':
            if (result.basicUsername && result.basicPassword) {
                const credentials = btoa(`${result.basicUsername}:${result.basicPassword}`);
                addHeader('Authorization', `Basic ${credentials}`);
                showToast('Basic authentication header added', 'success');
            }
            break;

        case 'apikey':
            if (result.apikeyValue) {
                const headerName = result.apikeyHeader || 'X-API-Key';
                addHeader(headerName, result.apikeyValue);
                showToast('API key header added', 'success');
            }
            break;

        case 'digest':
            if (result.digestUsername) {
                // Build the Digest header with all components
                let headerValue = `Digest username="${result.digestUsername}"`;

                if (result.digestRealm && result.digestRealm.trim()) {
                    headerValue += `, realm="${result.digestRealm}"`;
                }

                if (result.digestNonce && result.digestNonce.trim()) {
                    headerValue += `, nonce="${result.digestNonce}"`;
                }

                if (result.digestUri && result.digestUri.trim()) {
                    headerValue += `, uri="${result.digestUri}"`;
                }

                if (result.digestResponse && result.digestResponse.trim()) {
                    headerValue += `, response="${result.digestResponse}"`;
                }

                if (result.digestQop && result.digestQop.trim()) {
                    headerValue += `, qop=${result.digestQop}`;

                    if (result.digestNc && result.digestNc.trim()) {
                        headerValue += `, nc=${result.digestNc}`;
                    }

                    if (result.digestCnonce && result.digestCnonce.trim()) {
                        headerValue += `, cnonce="${result.digestCnonce}"`;
                    }
                }

                if (result.digestOpaque && result.digestOpaque.trim()) {
                    headerValue += `, opaque="${result.digestOpaque}"`;
                }

                headerValue += `, algorithm=MD5`;

                addHeader('Authorization', headerValue);
                showToast('Digest authentication header template added. Please update values as needed.', 'info');
            }
            break;

        case 'oauth2':
            if (result.oauthToken) {
                const tokenType = result.oauthTokenType || 'Bearer';
                addHeader('Authorization', `${tokenType} ${result.oauthToken}`);
                showToast(`${tokenType} token header added`, 'success');
            }
            break;

        case 'custom':
            if (result.customHeaderValue) {
                const headerName = result.customHeaderName || 'Authorization';
                addHeader(headerName, result.customHeaderValue);
                showToast('Custom authorization header added', 'success');
            }
            break;
    }
}

/**
 * Create multi-input dialog for authentication schemes
 * @param {string} title - Dialog title
 * @param {Array} inputs - Input field configurations
 * @returns {Promise<Object|null>} User input or null if cancelled
 */
async function createMultiInputDialog(title, inputs) {
    return new Promise((resolve) => {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'dialog-overlay';
        overlay.id = 'multiInputDialog';

        // Build form HTML
        let formHTML = '';
        inputs.forEach(input => {
            if (input.type === 'select') {
                formHTML += `
                    <div class="dialog-input-group">
                        <label class="dialog-label">${input.label}</label>
                        <select class="dialog-input" id="${input.id}">
                            ${input.options.map(opt =>
                    `<option value="${opt.value}" ${opt.value === input.defaultValue ? 'selected' : ''}>
                                    ${opt.text}
                                </option>`
                ).join('')}
                        </select>
                    </div>
                `;
            } else {
                formHTML += `
                    <div class="dialog-input-group">
                        <label class="dialog-label">${input.label}</label>
                        <input type="${input.type}" 
                               class="dialog-input" 
                               id="${input.id}" 
                               value="${input.defaultValue || ''}" 
                               placeholder="${input.placeholder || ''}"
                               autocomplete="off">
                    </div>
                `;
            }
        });

        // Create dialog HTML
        const dialog = document.createElement('div');
        dialog.className = 'dialog';
        dialog.innerHTML = `
            <div class="dialog-header">
                <div class="dialog-title">${title}</div>
                <button class="dialog-close" id="multiInputCloseBtn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="dialog-body">
                <form id="multiInputForm">
                    ${formHTML}
                </form>
            </div>
            <div class="dialog-footer">
                <button class="btn dialog-btn-secondary" type="button" id="multiInputCancelBtn">
                    Cancel
                </button>
                <button class="btn dialog-btn-primary" type="submit" form="multiInputForm">
                    Add Header
                </button>
            </div>
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        // Show dialog
        setTimeout(() => {
            overlay.classList.add('show');
            toggleBodyScroll(true);
        }, 10);

        // Focus first input
        setTimeout(() => {
            const firstInput = dialog.querySelector('input, select');
            if (firstInput) firstInput.focus();
        }, 100);

        // Handle form submission
        const form = document.getElementById('multiInputForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Collect all input values
            const result = {};
            inputs.forEach(input => {
                const element = document.getElementById(input.id);
                if (element) {
                    result[input.id] = element.type === 'password' ? element.value : element.value.trim();
                }
            });

            resolve(result);
            cleanup();
        });

        // Handle cancel/close
        const cleanup = () => {
            overlay.classList.remove('show');
            toggleBodyScroll(false);
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
        };

        document.getElementById('multiInputCancelBtn').addEventListener('click', () => {
            resolve(null);
            cleanup();
        });

        document.getElementById('multiInputCloseBtn').addEventListener('click', () => {
            resolve(null);
            cleanup();
        });

        // Close on ESC
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                resolve(null);
                cleanup();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                resolve(null);
                cleanup();
            }
        });
    });
}

// ========== Enhanced Token Decoder ==========

/**
 * Detect token type
 * @param {string} token - The token string
 * @returns {Object} Token type and clean token
 */
function detectTokenType(token) {
    let cleanToken = token.trim();
    let type = 'unknown';
    let prefix = '';

    // Remove common prefixes
    const prefixes = [
        { prefix: 'Bearer ', type: 'bearer' },
        { prefix: 'Basic ', type: 'basic' },
        { prefix: 'Digest ', type: 'digest' },
        { prefix: 'MAC ', type: 'mac' },
        { prefix: 'OAuth ', type: 'oauth' },
        { prefix: 'JWT ', type: 'jwt' },
        { prefix: 'Token ', type: 'token' }
    ];

    for (const { prefix: p, type: t } of prefixes) {
        if (cleanToken.startsWith(p)) {
            cleanToken = cleanToken.substring(p.length);
            prefix = p.trim();
            type = t;
            break;
        }
    }

    // Detect JWT by structure (3 parts separated by dots)
    const parts = cleanToken.split('.');
    if (parts.length === 3) {
        // Check if it's a valid JWT
        try {
            // Try to decode header to confirm
            const header = base64UrlDecode(parts[0]);
            const headerObj = JSON.parse(header);
            if (headerObj && headerObj.typ) {
                type = 'jwt';
            }
        } catch (e) {
            // Not a JWT
        }
    }

    // Detect MAC tokens (commonly base64 encoded)
    if (type === 'unknown' && cleanToken.length >= 32 && cleanToken.length <= 128) {
        try {
            // Try to base64 decode
            atob(cleanToken.replace(/-/g, '+').replace(/_/g, '/'));
            type = 'mac';
        } catch (e) {
            // Not base64
        }
    }

    // Detect OAuth access tokens (often alphanumeric, 40-128 chars)
    if (type === 'unknown' && /^[A-Za-z0-9_\-]+$/.test(cleanToken)) {
        const len = cleanToken.length;
        if (len >= 40 && len <= 128) {
            type = 'oauth';
        }
    }

    return { type, cleanToken, prefix };
}

/**
 * Enhanced decode token function
 * @param {string} token - The token to decode
 * @param {string} headerName - The name of the header
 */
function decodeToken(token, headerName = '') {
    if (!token || token.trim() === '') {
        DialogSystem.showInfo(
            'No Token',
            'Please enter a token in the header value field to decode.'
        );
        return;
    }

    // Detect token type
    const { type, cleanToken, prefix } = detectTokenType(token);

    // Decode based on type
    let decoded;
    switch (type) {
        case 'jwt':
            decoded = decodeJWT(cleanToken);
            break;
        case 'bearer':
            decoded = decodeBearerToken(cleanToken);
            break;
        case 'basic':
            decoded = decodeBasicToken(cleanToken);
            break;
        case 'mac':
            decoded = decodeMACToken(cleanToken);
            break;
        case 'oauth':
            decoded = decodeOAuthToken(cleanToken);
            break;
        case 'digest':
            decoded = decodeDigestToken(cleanToken);
            break;
        default:
            decoded = decodeUnknownToken(cleanToken);
    }

    if (decoded.error) {
        DialogSystem.showInfo(
            'Unable to Decode',
            `Token type: ${type}\nError: ${decoded.error}`
        );
        return;
    }

    // Show the decoded token in a dialog
    showTokenDecoderDialog(decoded, headerName, token, type, prefix);
}

/**
 * Decode JWT token
 * @param {string} token - JWT token
 * @returns {Object} Decoded token data
 */
function decodeJWT(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            return { error: 'Invalid JWT format - expected 3 parts' };
        }

        const header = base64UrlDecode(parts[0]);
        const payload = base64UrlDecode(parts[1]);
        const signature = parts[2];

        const headerObj = JSON.parse(header);
        const payloadObj = JSON.parse(payload);

        const validation = validateJWT(headerObj, payloadObj);

        return {
            type: 'jwt',
            header: headerObj,
            payload: payloadObj,
            signature: signature,
            parts: parts,
            validation: validation,
            raw: {
                header: header,
                payload: payload,
                signature: signature
            },
            algorithm: headerObj.alg,
            tokenType: headerObj.typ
        };
    } catch (error) {
        return { error: `JWT decoding failed: ${error.message}` };
    }
}

/**
 * Decode Bearer token (generic)
 * @param {string} token - Bearer token
 * @returns {Object} Decoded token data
 */
function decodeBearerToken(token) {
    try {
        // Try to detect if it's actually a JWT
        if (token.split('.').length === 3) {
            const jwtDecoded = decodeJWT(token);
            if (!jwtDecoded.error) {
                return {
                    ...jwtDecoded,
                    type: 'jwt',
                    scheme: 'bearer'
                };
            }
        }

        // Try to base64 decode
        let decoded;
        let isBase64 = false;
        try {
            decoded = atob(token.replace(/-/g, '+').replace(/_/g, '/'));
            isBase64 = true;
        } catch (e) {
            decoded = token;
        }

        // Try to parse as JSON
        let parsed;
        let format = 'string';
        try {
            parsed = JSON.parse(decoded);
            format = 'json';
        } catch (e) {
            parsed = decoded;
        }

        // Determine if this is actually a known format or just a string
        let contentType = 'unknown';
        if (isBase64 && format === 'json') {
            contentType = 'json_base64';
        } else if (isBase64) {
            contentType = 'base64';
        } else if (format === 'json') {
            contentType = 'json';
        } else if (token.length < 10) {
            // Very short tokens are likely not secure tokens
            contentType = 'simple_string';
        }

        return {
            type: contentType,
            scheme: 'bearer',
            format: format,
            value: parsed,
            raw: token,
            length: token.length,
            isBase64: isBase64,
            isSimpleString: token.length < 10 && !isBase64 && format === 'string'
        };
    } catch (error) {
        return { error: `Bearer token analysis failed: ${error.message}` };
    }
}

/**
 * Decode Basic authentication token
 * @param {string} token - Base64 encoded username:password
 * @returns {Object} Decoded token data
 */
function decodeBasicToken(token) {
    try {
        // Basic auth is base64 encoded username:password
        const decoded = atob(token);
        const parts = decoded.split(':');

        return {
            type: 'basic',
            username: parts[0] || '',
            password: parts.slice(1).join(':') || '',
            raw: decoded,
            format: 'username:password',
            isBase64: true
        };
    } catch (error) {
        return { error: `Basic auth decoding failed: ${error.message}` };
    }
}

/**
 * Decode MAC token
 * @param {string} token - MAC token
 * @returns {Object} Decoded token data
 */
function decodeMACToken(token) {
    try {
        // MAC tokens are usually base64 encoded
        let decoded;
        try {
            decoded = atob(token.replace(/-/g, '+').replace(/_/g, '/'));
        } catch (e) {
            decoded = token;
        }

        // MAC tokens often have structure: id:nonce:mac
        const parts = decoded.split(':');

        return {
            type: 'mac',
            parts: parts,
            id: parts[0] || null,
            nonce: parts[1] || null,
            mac: parts[2] || token,
            format: parts.length >= 3 ? 'id:nonce:mac' : 'unknown',
            isBase64: decoded !== token,
            raw: token,
            decoded: decoded
        };
    } catch (error) {
        return { error: `MAC token analysis failed: ${error.message}` };
    }
}

/**
 * Decode OAuth token
 * @param {string} token - OAuth token
 * @returns {Object} Decoded token data
 */
function decodeOAuthToken(token) {
    // OAuth tokens can be access tokens or refresh tokens
    // They're typically opaque strings

    const patterns = [
        { pattern: /^[A-Za-z0-9]{40}$/, type: 'access_token_v1' },
        { pattern: /^[A-Za-z0-9_\-]{43}$/, type: 'access_token_v2' },
        { pattern: /^[A-Za-z0-9_\-]{64}$/, type: 'refresh_token' },
        { pattern: /^[A-Za-z0-9_\-]{86}$/, type: 'id_token' }
    ];

    let tokenType = 'unknown';
    for (const { pattern, type } of patterns) {
        if (pattern.test(token)) {
            tokenType = type;
            break;
        }
    }

    return {
        type: 'oauth',
        tokenType: tokenType,
        value: token,
        length: token.length,
        isBase64: /^[A-Za-z0-9_\-]+=*$/.test(token) && token.length % 4 === 0,
        characteristics: {
            hasLetters: /[A-Za-z]/.test(token),
            hasNumbers: /\d/.test(token),
            hasSpecial: /[_\-]/.test(token),
            isAlphanumeric: /^[A-Za-z0-9]+$/.test(token)
        }
    };
}

/**
 * Decode Digest authentication token
 * @param {string} token - Digest token string
 * @returns {Object} Decoded token data
 */
function decodeDigestToken(token) {
    try {
        // Remove "Digest " prefix if present
        let cleanToken = token.trim();
        if (cleanToken.startsWith('Digest ')) {
            cleanToken = cleanToken.substring(7);
        }

        // Parse Digest token components
        const components = {};
        const parts = cleanToken.split(', ');

        parts.forEach(part => {
            const equalsIndex = part.indexOf('=');
            if (equalsIndex !== -1) {
                const key = part.substring(0, equalsIndex).trim();
                let value = part.substring(equalsIndex + 1).trim();

                // Remove surrounding quotes if present
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.substring(1, value.length - 1);
                }

                components[key.toLowerCase()] = value;
            }
        });

        return {
            type: 'digest',
            scheme: 'digest',
            components: components,
            username: components.username,
            realm: components.realm,
            nonce: components.nonce,
            uri: components.uri,
            algorithm: components.algorithm || 'MD5',
            response: components.response,
            opaque: components.opaque,
            qop: components.qop,
            nc: components.nc,
            cnonce: components.cnonce,
            raw: token
        };
    } catch (error) {
        return { error: `Digest token parsing failed: ${error.message}` };
    }
}

/**
 * Decode unknown token
 * @param {string} token - Unknown token
 * @returns {Object} Token analysis
 */
function decodeUnknownToken(token) {
    const analysis = {
        type: 'unknown',
        raw: token,
        length: token.length,
        isBase64: false,
        isJWT: false,
        isJSON: false,
        isBase64Encoded: false,
        analysis: {}
    };

    // Check if it's base64
    try {
        const decoded = atob(token.replace(/-/g, '+').replace(/_/g, '/'));
        analysis.isBase64Encoded = true;
        analysis.base64Decoded = decoded;

        // Check if decoded is JSON
        try {
            const json = JSON.parse(decoded);
            analysis.isJSON = true;
            analysis.jsonParsed = json;
        } catch (e) {
            // Not JSON
        }
    } catch (e) {
        // Not base64
    }

    // Check if it's JWT
    const parts = token.split('.');
    if (parts.length === 3) {
        analysis.isJWT = true;
        analysis.jwtParts = parts.map(part => ({
            length: part.length,
            isBase64Url: /^[A-Za-z0-9_\-]+$/.test(part)
        }));
    }

    // Character analysis
    analysis.characters = {
        total: token.length,
        letters: (token.match(/[A-Za-z]/g) || []).length,
        numbers: (token.match(/\d/g) || []).length,
        special: (token.match(/[^A-Za-z0-9]/g) || []).length,
        uppercase: (token.match(/[A-Z]/g) || []).length,
        lowercase: (token.match(/[a-z]/g) || []).length
    };

    // Common token format detection
    if (/^[A-Za-z0-9]{32}$/.test(token)) {
        analysis.suggestedType = 'API Key / MD5 Hash';
    } else if (/^[A-Za-z0-9]{40}$/.test(token)) {
        analysis.suggestedType = 'SHA-1 Hash / Access Token';
    } else if (/^[A-Za-z0-9]{64}$/.test(token)) {
        analysis.suggestedType = 'SHA-256 Hash / Refresh Token';
    } else if (token.startsWith('eyJ') && parts.length === 3) {
        analysis.suggestedType = 'JWT Token';
    }

    return analysis;
}

/**
 * Decode base64Url encoded string
 * @param {string} str - base64Url encoded string
 * @returns {string} Decoded string
 */
function base64UrlDecode(str) {
    // Replace URL-safe base64 characters
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');

    // Add padding if necessary
    while (base64.length % 4) {
        base64 += '=';
    }

    // Decode and handle UTF-8
    const decoded = atob(base64);
    return decodeURIComponent(
        decoded.split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')
    );
}

/**
 * Validate JWT token structure
 * @param {Object} header - Decoded header
 * @param {Object} payload - Decoded payload
 * @returns {Object} Validation results
 */
function validateJWT(header, payload) {
    const validations = [];

    // Check header
    if (!header.alg) {
        validations.push({ type: 'warning', message: 'No algorithm specified in header' });
    } else {
        validations.push({ type: 'success', message: `Algorithm: ${header.alg}` });
    }

    if (!header.typ || header.typ !== 'JWT') {
        validations.push({ type: 'warning', message: 'Token type is not JWT' });
    } else {
        validations.push({ type: 'success', message: 'Token type: JWT' });
    }

    // Check payload expiration
    if (payload.exp) {
        const expDate = new Date(payload.exp * 1000);
        const now = new Date();

        if (expDate < now) {
            validations.push({
                type: 'danger',
                message: `Token expired on ${expDate.toLocaleString()}`
            });
        } else {
            validations.push({
                type: 'success',
                message: `Token expires on ${expDate.toLocaleString()}`
            });
        }
    } else {
        validations.push({ type: 'info', message: 'No expiration time (exp) in token' });
    }

    // Check issued at
    if (payload.iat) {
        const iatDate = new Date(payload.iat * 1000);
        validations.push({
            type: 'info',
            message: `Token issued at ${iatDate.toLocaleString()}`
        });
    }

    // Check not before
    if (payload.nbf) {
        const nbfDate = new Date(payload.nbf * 1000);
        const now = new Date();

        if (nbfDate > now) {
            validations.push({
                type: 'warning',
                message: `Token not valid until ${nbfDate.toLocaleString()}`
            });
        }
    }

    return validations;
}

/**
 * Show token decoder dialog for any token type
 * @param {Object} decoded - Decoded token data
 * @param {string} headerName - Header name
 * @param {string} originalToken - Original token string
 * @param {string} tokenType - Detected token type
 * @param {string} prefix - Token prefix
 */
async function showTokenDecoderDialog(decoded, headerName, originalToken, tokenType, prefix = '') {
    // Generate dialog content based on token type
    const dialogHTML = generateTokenDialogHTML(decoded, headerName, originalToken, tokenType, prefix);

    // Create and show dialog
    const { dialogElement, closeDialog } = await createCustomDialog('Token Decoder', dialogHTML, `token-decoder-dialog ${tokenType}-token`);

    // Add event listeners
    setupTokenDialogEventListeners(dialogElement, decoded, originalToken, closeDialog);
}

/**
 * Generate dialog HTML based on token type
 */
function generateTokenDialogHTML(decoded, headerName, originalToken, tokenType, prefix) {
    let content = '';
    let displayType = '';

    // Determine what to show in the title based on decoded type
    if (decoded.type === 'jwt' && tokenType === 'bearer') {
        displayType = 'JWT (Bearer)';
    } else if (decoded.type === 'unknown' && tokenType === 'bearer') {
        displayType = 'Bearer Token (Unknown Format)';
    } else if (decoded.type !== tokenType) {
        displayType = `${decoded.type.toUpperCase()} (${tokenType})`;
    } else {
        displayType = tokenType.toUpperCase();
    }

    switch (decoded.type) {
        case 'jwt':
            content = generateJWTContent(decoded);
            break;
        case 'basic':
            content = generateBasicAuthContent(decoded);
            displayType = 'Basic Authentication';
            break;
        case 'mac':
            content = generateMACContent(decoded);
            displayType = 'MAC Token';
            break;
        case 'oauth':
            content = generateOAuthContent(decoded);
            displayType = 'OAuth Token';
            break;
        case 'bearer':
            content = generateBearerContent(decoded);
            displayType = 'Bearer Token';
            break;
        case 'digest':
            content = generateDigestContent(decoded);
            displayType = 'Digest Authentication';
            break;
        default:
            content = generateUnknownTokenContent(decoded);
            displayType = 'Unknown Token';
    }

    return `
        <div class="dialog-header">
            <div class="dialog-title">
                <i class="fas fa-key"></i> Token Decoder - ${displayType}
                ${prefix ? `<span style="font-size: 12px; color: var(--text-tertiary); margin-left: 8px;">(${prefix})</span>` : ''}
            </div>
            <button class="dialog-close" id="tokenDecoderCloseBtn">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="dialog-body">
            ${headerName ? `<div class="dialog-message"><strong>Header:</strong> ${headerName}</div>` : ''}
            
            ${content}
        </div>
        <div class="dialog-footer">
             <!-- Comment out the Analyze button -->
        <!--
        <button class="btn dialog-btn-secondary" id="analyzeTokenBtn">
            <i class="fas fa-search"></i> Analyze
        </button>
        -->
            <button class="btn dialog-btn-secondary" id="copyFullTokenBtn">
                <i class="fas fa-copy"></i> Copy Token
            </button>
            <button class="btn dialog-btn-primary" id="closeTokenDecoderBtn">
                Close
            </button>
        </div>
    `;
}

/**
 * Generate content for simple string tokens
 */
function generateSimpleStringContent(decoded) {
    return `
        <div class="token-parts">
            <div class="token-part" style="border-left-color: #ef4444;">
                <div class="token-part-header">
                    <span> Simple String Token</span>
                </div>
                <div class="token-part-body">
                    <div style="margin-bottom: 16px; padding: 12px; background: rgba(239, 68, 68, 0.1); border-radius: var(--radius-sm);">
                        <i class="fas fa-exclamation-triangle" style="color: #ef4444; margin-right: 8px;"></i>
                        <strong>Security Warning:</strong> This appears to be a simple string token, not a cryptographically secure token format.
                    </div>
                    
                    <div style="margin-bottom: 16px;">
                        <strong>Token Value:</strong>
                        <div class="token-json" style="font-size: 14px; padding: 8px; background: var(--bg-tertiary); border-radius: var(--radius-sm);">
                            ${decoded.value}
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; font-size: 13px;">
                        <div>
                            <strong>Type:</strong> Simple String
                        </div>
                        <div>
                            <strong>Length:</strong> ${decoded.length} chars
                        </div>
                        <div>
                            <strong>Base64:</strong> ${decoded.isBase64 ? 'Yes' : 'No'}
                        </div>
                        <div>
                            <strong>JSON:</strong> ${decoded.format === 'json' ? 'Yes' : 'No'}
                        </div>
                        <div>
                            <strong>Secure:</strong> No
                        </div>
                        <div>
                            <strong>Recommendation:</strong> Use JWT/OAuth
                        </div>
                    </div>
                    
                    <div style="margin-top: 20px; padding: 16px; background: var(--bg-tertiary); border-radius: var(--radius-sm);">
                        <strong>Why this might be insecure:</strong>
                        <ul style="margin-top: 8px; padding-left: 20px; font-size: 12px;">
                            <li>Too short for proper entropy</li>
                            <li>No cryptographic signature</li>
                            <li>Can't expire or be revoked easily</li>
                            <li>No claims/scope information</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Generate Bearer token content
 */
function generateBearerContent(decoded) {
    const isJWT = decoded.type === 'jwt';

    if (isJWT) {
        // If it's actually a JWT, show JWT content
        return generateJWTContent(decoded);
    }

    // Check if it's a simple string
    if (decoded.isSimpleString || (decoded.type === 'simple_string')) {
        return generateSimpleStringContent(decoded);
    }

    return `
        <div class="token-parts">
            <div class="token-part" style="border-left-color: #059669;">
                <div class="token-part-header">
                    <span>Bearer Token Analysis</span>
                </div>
                <div class="token-part-body">
                    <div style="margin-bottom: 16px;">
                        <strong>Token Format:</strong> ${decoded.format || 'string'}
                        ${decoded.isBase64 ? ' (Base64 encoded)' : ''}
                    </div>
                    
                    <div style="margin-bottom: 16px;">
                        <strong>Token Value:</strong>
                        <div class="token-json" style="font-size: 12px; max-height: 150px; overflow-y: auto;">
                            ${typeof decoded.value === 'object'
            ? JSON.stringify(decoded.value, null, 2)
            : decoded.value}
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; font-size: 13px;">
                        <div>
                            <strong>Type:</strong> ${decoded.type || 'Bearer'}
                        </div>
                        <div>
                            <strong>Length:</strong> ${decoded.length} chars
                        </div>
                        <div>
                            <strong>Base64:</strong> ${decoded.isBase64 ? 'Yes' : 'No'}
                        </div>
                        <div>
                            <strong>Structure:</strong> ${decoded.format === 'json' ? 'JSON' : 'Plain text'}
                        </div>
                    </div>
                    
                    ${decoded.isBase64 && decoded.format !== 'json' ? `
                        <div style="margin-top: 16px; padding: 12px; background: var(--bg-tertiary); border-radius: var(--radius-sm);">
                            <strong>Base64 Decoded:</strong>
                            <div class="token-json" style="margin-top: 8px; font-size: 12px; word-break: break-all;">
                                ${decoded.value}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

/**
 * Generate Digest token content
 */
function generateDigestContent(decoded) {
    return `
        <div class="token-parts">
            <div class="token-part" style="border-left-color: #f59e0b;">
                <div class="token-part-header">
                    <span>Digest Authentication</span>
                </div>
                <div class="token-part-body">
                    <div style="margin-bottom: 16px;">
                        <strong>Algorithm:</strong> ${decoded.algorithm}
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 120px 1fr; gap: 8px; margin-bottom: 16px; font-size: 13px;">
                        ${decoded.username ? `<div><strong>Username:</strong></div><div>${decoded.username}</div>` : ''}
                        ${decoded.realm ? `<div><strong>Realm:</strong></div><div>${decoded.realm}</div>` : ''}
                        ${decoded.nonce ? `<div><strong>Nonce:</strong></div><div class="token-json" style="padding: 4px 8px; font-size: 11px;">${decoded.nonce}</div>` : ''}
                        ${decoded.uri ? `<div><strong>URI:</strong></div><div>${decoded.uri}</div>` : ''}
                        ${decoded.response ? `<div><strong>Response:</strong></div><div class="token-json" style="padding: 4px 8px; font-size: 11px; word-break: break-all;">${decoded.response}</div>` : ''}
                        ${decoded.opaque ? `<div><strong>Opaque:</strong></div><div class="token-json" style="padding: 4px 8px; font-size: 11px;">${decoded.opaque}</div>` : ''}
                        ${decoded.qop ? `<div><strong>QOP:</strong></div><div>${decoded.qop}</div>` : ''}
                        ${decoded.nc ? `<div><strong>Nonce Count:</strong></div><div>${decoded.nc}</div>` : ''}
                        ${decoded.cnonce ? `<div><strong>Client Nonce:</strong></div><div class="token-json" style="padding: 4px 8px; font-size: 11px;">${decoded.cnonce}</div>` : ''}
                    </div>
                    
                    <div style="font-size: 12px; color: var(--text-tertiary);">
                        <div>Length: ${decoded.raw.length} characters</div>
                        <div>Scheme: Digest Authentication</div>
                        <div>Components: ${Object.keys(decoded.components || {}).length} key-value pairs</div>
                    </div>
                    
                    <div style="margin-top: 16px; padding: 12px; background: var(--bg-tertiary); border-radius: var(--radius-sm);">
                        <strong>Digest Authentication Flow:</strong>
                        <div style="margin-top: 8px; font-size: 12px;">
                            1. Server challenges with WWW-Authenticate header<br>
                            2. Client computes: HA1 = MD5(username:realm:password)<br>
                            3. Client computes: HA2 = MD5(method:uri)<br>
                            4. Client computes: response = MD5(HA1:nonce:nc:cnonce:qop:HA2)<br>
                            5. Client sends Authorization header with computed response
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Generate Unknown token content
 */
function generateUnknownTokenContent(decoded) {
    return `
        <div class="token-parts">
            <div class="token-part" style="border-left-color: #64748b;">
                <div class="token-part-header">
                    <span>Token Analysis</span>
                    <span style="font-size: 12px; color: var(--text-tertiary);">
                        ${decoded.suggestedType || 'Unknown Format'}
                    </span>
                </div>
                <div class="token-part-body">
                    <div style="margin-bottom: 16px;">
                        <strong>Raw Token:</strong>
                        <div class="token-json" style="font-size: 11px; word-break: break-all; max-height: 100px; overflow-y: auto;">
                            ${decoded.raw}
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 16px; font-size: 13px;">
                        <div>
                            <strong>Length:</strong> ${decoded.length} chars
                        </div>
                        <div>
                            <strong>Base64:</strong> ${decoded.isBase64Encoded ? 'Yes' : 'No'}
                        </div>
                        <div>
                            <strong>JSON:</strong> ${decoded.isJSON ? 'Yes' : 'No'}
                        </div>
                        <div>
                            <strong>JWT:</strong> ${decoded.isJWT ? 'Yes' : 'No'}
                        </div>
                        <div>
                            <strong>Letters:</strong> ${decoded.characters?.letters || 0}
                        </div>
                        <div>
                            <strong>Numbers:</strong> ${decoded.characters?.numbers || 0}
                        </div>
                        <div>
                            <strong>Special:</strong> ${decoded.characters?.special || 0}
                        </div>
                        <div>
                            <strong>Uppercase:</strong> ${decoded.characters?.uppercase || 0}
                        </div>
                        <div>
                            <strong>Lowercase:</strong> ${decoded.characters?.lowercase || 0}
                        </div>
                    </div>
                    
                    ${decoded.isBase64Encoded ? `
                        <div style="margin-bottom: 16px; padding: 12px; background: var(--bg-tertiary); border-radius: var(--radius-sm);">
                            <strong>Base64 Decoded:</strong>
                            <div class="token-json" style="margin-top: 8px; font-size: 11px; word-break: break-all; max-height: 100px; overflow-y: auto;">
                                ${decoded.base64Decoded}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${decoded.isJSON ? `
                        <div style="margin-bottom: 16px; padding: 12px; background: var(--bg-tertiary); border-radius: var(--radius-sm);">
                            <strong>JSON Parsed:</strong>
                            <div class="token-json" style="margin-top: 8px; font-size: 11px; max-height: 150px; overflow-y: auto;">
                                ${JSON.stringify(decoded.jsonParsed, null, 2)}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${decoded.isJWT ? `
                        <div style="padding: 12px; background: var(--bg-tertiary); border-radius: var(--radius-sm);">
                            <strong>JWT Structure Detected:</strong>
                            <div style="margin-top: 8px; font-size: 12px;">
                                <div style="display: flex; flex-direction: column; gap: 6px;">
                                    ${decoded.jwtParts.map((part, index) => `
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <span style="font-weight: 600; width: 80px;">Part ${index + 1}:</span>
                                            <span style="font-family: var(--font-mono); font-size: 11px;">
                                                ${part.length} chars, ${part.isBase64Url ? 'Base64Url' : 'Unknown format'}
                                            </span>
                                        </div>
                                    `).join('')}
                                </div>
                                <button class="btn btn-sm btn-primary" onclick="tryDecodeAsJWT('${encodeURIComponent(decoded.raw)}')" 
                                        style="margin-top: 12px; font-size: 12px;">
                                    <i class="fas fa-code"></i> Try to decode as JWT
                                </button>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

/**
 * Setup token dialog event listeners
 */
function setupTokenDialogEventListeners(dialogElement, decoded, originalToken, closeDialog) {
    // Copy buttons for token parts
    dialogElement.querySelectorAll('.token-copy-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const text = decodeURIComponent(this.getAttribute('data-copy'));
            copyToClipboard(text);
            showToast('Copied to clipboard', 'success');
        });
    });

    // Copy full token button
    dialogElement.querySelector('#copyFullTokenBtn').addEventListener('click', () => {
        copyToClipboard(originalToken);
        showToast('Token copied to clipboard', 'success');
    });

    // ADD THIS SECTION FOR BASIC AUTH PASSWORD SHOW/HIDE
    const showPasswordBtn = dialogElement.querySelector('#showBasicPasswordBtn');
    if (showPasswordBtn) {
        showPasswordBtn.addEventListener('click', function () {
            const passwordDiv = dialogElement.querySelector('#basicPassword');
            if (passwordDiv) {
                //Get the actual password FIRST (outside if/else)
                const actualPassword = passwordDiv.getAttribute('data-password') || '';
                const isBlurred = passwordDiv.style.filter === 'blur(4px)' ||
                    passwordDiv.style.filter.includes('blur');

                if (isBlurred) {
                    passwordDiv.textContent = actualPassword;
                    passwordDiv.style.filter = 'none';
                    this.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Password';
                    showToast('Password revealed', 'info');
                } else {
                    // Hide password
                    const passwordLength = actualPassword.length;
                    passwordDiv.textContent = '•'.repeat(passwordLength || 8);
                    passwordDiv.style.filter = 'blur(4px)';
                    this.innerHTML = '<i class="fas fa-eye"></i> Show Password';
                }
            }
        });
    }

    // Close buttons
    dialogElement.querySelector('#closeTokenDecoderBtn').addEventListener('click', closeDialog);
    dialogElement.querySelector('#tokenDecoderCloseBtn').addEventListener('click', closeDialog);
}

/**
 * Try to decode as JWT (for unknown tokens)
 */
function tryDecodeAsJWT(token) {
    const decoded = decodeJWT(decodeURIComponent(token));
    if (decoded.error) {
        DialogSystem.showInfo(
            'Decode Failed',
            `Cannot decode as JWT: ${decoded.error}`
        );
    } else {
        // Close current dialog and open JWT decoder
        document.querySelectorAll('.dialog-overlay').forEach(overlay => {
            overlay.classList.remove('show');
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
        });

        // Show JWT decoder
        setTimeout(() => {
            showTokenDecoderDialog(decoded, '', decodeURIComponent(token), 'jwt', '');
        }, 350);
    }
}

/**
 * Analyze token details
 */
async function analyzeTokenDetails(decoded, originalToken) {
    let analysis = `Token Analysis Report\n\n`;
    analysis += `Type: ${decoded.type.toUpperCase()}\n`;
    analysis += `Length: ${originalToken.length} characters\n`;
    analysis += `Prefix: ${decoded.prefix || 'None'}\n\n`;

    if (decoded.type === 'jwt') {
        analysis += `JWT Specific:\n`;
        analysis += `- Algorithm: ${decoded.algorithm || 'Unknown'}\n`;
        analysis += `- Token Type: ${decoded.tokenType || 'Unknown'}\n`;
        analysis += `- Header Size: ${JSON.stringify(decoded.header).length} chars\n`;
        analysis += `- Payload Size: ${JSON.stringify(decoded.payload).length} chars\n`;
        analysis += `- Signature Size: ${decoded.signature.length} chars\n\n`;

        if (decoded.payload.exp) {
            const expDate = new Date(decoded.payload.exp * 1000);
            const now = new Date();
            const hoursLeft = Math.round((expDate - now) / (1000 * 60 * 60));
            analysis += `Expiration: ${expDate.toLocaleString()}\n`;
            analysis += `Time Left: ${hoursLeft > 0 ? `${hoursLeft} hours` : 'EXPIRED'}\n`;
        }
    }

    analysis += `\nSecurity Recommendations:\n`;
    if (decoded.type === 'basic') {
        analysis += `Basic authentication is insecure over HTTP. Use HTTPS.\n`;
        analysis += `Consider using Bearer tokens or OAuth instead.\n`;
    } else if (decoded.type === 'jwt' && decoded.algorithm === 'none') {
        analysis += `CRITICAL: JWT uses "none" algorithm - this is insecure!\n`;
    } else if (decoded.type === 'jwt' && decoded.algorithm && decoded.algorithm.startsWith('HS')) {
        analysis += `JWT uses HMAC signature - verify secret key is strong.\n`;
    }

    await DialogSystem.alert({
        title: 'Token Analysis',
        message: `<pre style="font-family: monospace; font-size: 12px; white-space: pre-wrap; max-height: 400px; overflow-y: auto;">${analysis}</pre>`
    });
}

/**
 * Generate JWT token content
 */
function generateJWTContent(decoded) {
    return `
        <div class="token-parts">
            <div class="token-part jwt-header">
                <div class="token-part-header">
                    <span>Header (${decoded.algorithm || 'Unknown Algorithm'})</span>
                    <button class="token-copy-btn" data-copy="${encodeURIComponent(JSON.stringify(decoded.header, null, 2))}">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
                <div class="token-part-body">
                    <div class="token-json">${JSON.stringify(decoded.header, null, 2)}</div>
                </div>
            </div>
            
            <div class="token-part jwt-payload">
                <div class="token-part-header">
                    <span>Payload (Claims)</span>
                    <button class="token-copy-btn" data-copy="${encodeURIComponent(JSON.stringify(decoded.payload, null, 2))}">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
                <div class="token-part-body">
                    <div class="token-json">${JSON.stringify(decoded.payload, null, 2)}</div>
                </div>
            </div>
            
            <div class="token-part jwt-signature">
                <div class="token-part-header">
                    <span>Signature</span>
                    <button class="token-copy-btn" data-copy="${decoded.signature}">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
                <div class="token-part-body">
                    <div style="font-family: var(--font-mono); font-size: 12px; word-break: break-all;">
                        ${decoded.signature}
                    </div>
                    <div style="font-size: 11px; color: var(--text-tertiary); margin-top: 8px;">
                        Length: ${decoded.signature.length} characters
                    </div>
                </div>
            </div>
        </div>
        
        ${decoded.validation && decoded.validation.length > 0 ? `
            <div class="token-validation">
                <h4 style="margin-bottom: 12px;">Token Validation</h4>
                ${decoded.validation.map(validation => `
                    <div class="validation-item ${validation.type}">
                        <i class="fas fa-${getValidationIcon(validation.type)}"></i>
                        <span>${validation.message}</span>
                    </div>
                `).join('')}
            </div>
        ` : ''}
    `;
}

/**
 * Generate Basic Auth content - FIXED VERSION
 */
function generateBasicAuthContent(decoded) {
    // Store the actual password in a data attribute
    const actualPassword = decoded.password || '(empty)';
    const displayPassword = '•'.repeat(decoded.password?.length || 8);

    return `
        <div class="token-parts">
            <div class="token-part" style="border-left-color: #0891b2;">
                <div class="token-part-header">
                    <span>Basic Authentication</span>
                </div>
                <div class="token-part-body">
                    <div style="margin-bottom: 16px;">
                        <strong>Username:</strong>
                        <div class="token-json">${decoded.username || '(empty)'}</div>
                    </div>
                    <div>
                        <strong>Password:</strong>
                        <div class="token-json" 
                             style="filter: blur(4px); font-family: monospace;" 
                             id="basicPassword"
                             data-password="${actualPassword.replace(/"/g, '&quot;')}">
                            ${displayPassword}
                        </div>
                        <button class="btn btn-sm btn-secondary" id="showBasicPasswordBtn"
                                style="margin-top: 8px; font-size: 12px;">
                            <i class="fas fa-eye"></i> Show Password
                        </button>
                    </div>
                    ${decoded.isBase64 ? `
                        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border);">
                            <strong>Base64 Encoded:</strong>
                            <div class="token-json" style="font-size: 11px;">${decoded.raw}</div>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

/**
 * Generate MAC token content
 */
function generateMACContent(decoded) {
    return `
        <div class="token-parts">
            <div class="token-part" style="border-left-color: #d97706;">
                <div class="token-part-header">
                    <span>MAC Authentication Token</span>
                </div>
                <div class="token-part-body">
                    ${decoded.parts && decoded.parts.length >= 3 ? `
                        <div style="margin-bottom: 12px;">
                            <strong>Format:</strong> ${decoded.format}
                        </div>
                        <div style="display: grid; grid-template-columns: 100px 1fr; gap: 8px; margin-bottom: 16px;">
                            <div><strong>ID:</strong></div>
                            <div class="token-json" style="padding: 4px 8px;">${decoded.id || '(not found)'}</div>
                            
                            <div><strong>Nonce:</strong></div>
                            <div class="token-json" style="padding: 4px 8px;">${decoded.nonce || '(not found)'}</div>
                            
                            <div><strong>MAC:</strong></div>
                            <div class="token-json" style="padding: 4px 8px;">${decoded.mac}</div>
                        </div>
                    ` : `
                        <div class="token-json" style="margin-bottom: 12px;">
                            ${decoded.decoded || decoded.raw}
                        </div>
                    `}
                    
                    <div style="font-size: 12px; color: var(--text-tertiary);">
                        <div>Length: ${decoded.raw.length} characters</div>
                        <div>Base64 Encoded: ${decoded.isBase64 ? 'Yes' : 'No'}</div>
                        ${decoded.decoded ? `<div>Decoded Length: ${decoded.decoded.length} characters</div>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Generate OAuth token content
 */
function generateOAuthContent(decoded) {
    return `
        <div class="token-parts">
            <div class="token-part" style="border-left-color: #7c3aed;">
                <div class="token-part-header">
                    <span>OAuth Token</span>
                    <span style="font-size: 12px; color: var(--text-tertiary);">
                        ${decoded.tokenType.replace(/_/g, ' ').toUpperCase()}
                    </span>
                </div>
                <div class="token-part-body">
                    <div style="margin-bottom: 16px;">
                        <div class="token-json" style="font-size: 11px; word-break: break-all;">
                            ${decoded.value}
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; font-size: 13px;">
                        <div>
                            <strong>Length:</strong> ${decoded.length} chars
                        </div>
                        <div>
                            <strong>Type:</strong> ${decoded.tokenType}
                        </div>
                        <div>
                            <strong>Base64:</strong> ${decoded.isBase64 ? 'Yes' : 'No'}
                        </div>
                        <div>
                            <strong>Format:</strong> 
                            ${decoded.characteristics.isAlphanumeric ? 'Alphanumeric' :
            decoded.characteristics.hasSpecial ? 'With special chars' : 'Unknown'}
                        </div>
                    </div>
                    
                    ${decoded.characteristics ? `
                        <div style="margin-top: 16px; padding: 12px; background: var(--bg-tertiary); border-radius: var(--radius-sm);">
                            <strong>Character Analysis:</strong>
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-top: 8px; font-size: 12px;">
                                <div>Letters: ${decoded.characteristics.hasLetters ? 'Yes' : 'No'}</div>
                                <div>Numbers: ${decoded.characteristics.hasNumbers ? 'Yes' : 'No'}</div>
                                <div>Uppercase: ${decoded.characteristics.uppercase || 0}</div>
                                <div>Lowercase: ${decoded.characteristics.lowercase || 0}</div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

/**
 * Get icon for validation type
 * @param {string} type - Validation type
 * @returns {string} Icon name
 */
function getValidationIcon(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'danger': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        case 'info': return 'info-circle';
        default: return 'circle';
    }
}

/**
 * Create a custom dialog with HTML content
 * @param {string} title - Dialog title
 * @param {string} html - HTML content
 * @param {string} className - Additional CSS class
 * @returns {Promise<Object>} Dialog elements
 */
/**
 * Create a custom dialog with HTML content
 * @param {string} title - Dialog title
 * @param {string} html - HTML content
 * @param {string} className - Additional CSS class
 * @returns {Promise<Object>} Dialog elements and close function
 */
function createCustomDialog(title, html, className = '') {
    return new Promise((resolve) => {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'dialog-overlay';
        overlay.id = 'customDialogOverlay';

        // Create dialog
        const dialog = document.createElement('div');
        dialog.className = `dialog ${className}`;
        dialog.innerHTML = html;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        // Show dialog with animation
        setTimeout(() => {
            overlay.classList.add('show');
            toggleBodyScroll(true);
        }, 10);

        // Function to close the dialog
        const closeDialog = () => {
            overlay.classList.remove('show');
            toggleBodyScroll(false);
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
        };

        // ESC key handler
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closeDialog();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeDialog();
            }
        });

        // Resolve with close function
        resolve({ overlay, dialogElement: dialog, closeDialog });
    });
}

/**
 * Set up application keyboard shortcuts
 */
function setupAppKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // ... existing shortcuts ...

        // Alt+D to decode token from focused header
        if (e.altKey && e.key === 'd') {
            e.preventDefault();
            const focusedElement = document.activeElement;
            if (focusedElement && focusedElement.classList.contains('header-input')) {
                const headerRow = focusedElement.closest('.header-row');
                if (headerRow) {
                    const keyInput = headerRow.querySelectorAll('.header-input')[0];
                    const valueInput = headerRow.querySelectorAll('.header-input')[1];
                    if (keyInput && valueInput) {
                        decodeToken(valueInput.value, keyInput.value);
                    }
                }
            }
        }
    });
}

// Simple toggle function
function toggleBodyScroll(lock) {
    if (lock) {
        document.body.classList.add('dialog-lock');
    } else {
        document.body.classList.remove('dialog-lock');
    }
}

// Start the application
document.addEventListener('DOMContentLoaded', init);