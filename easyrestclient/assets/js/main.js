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

    // Create remove button
    const removeButton = document.createElement('button');
    removeButton.className = 'header-remove';
    removeButton.innerHTML = '<i class="fas fa-times"></i>';
    removeButton.onclick = function () {
        headerRow.remove();
    };

    // Append all elements
    headerRow.appendChild(keyInput);
    headerRow.appendChild(valueInput);
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

// Start the application
document.addEventListener('DOMContentLoaded', init);