// Main chat functionality
let recognition;
let isListening = false;
let currentVoice = null;
let voices = [];
let chatContainer;

// AI Chat Widget - Dual Mode Support
// Light in Silence - Chat Widget
let chatMode = null; // 'customer-service' or 'companion'
let chatButton, welcomeScreen, chatMessages, chatInput;
let isMinimized = false;

// Initialize the chat widget when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initializeChatWidget();
    setupChatEvents();
    loadVoices();
    checkFlaskServer();
});

// Load available voices for speech synthesis
function loadVoices() {
    voices = speechSynthesis.getVoices();
    if (voices.length === 0) {
        speechSynthesis.addEventListener('voiceschanged', () => {
            voices = speechSynthesis.getVoices();
            populateVoiceSelect();
        });
    } else {
        populateVoiceSelect();
    }
}

function populateVoiceSelect() {
    const voiceSelect = document.getElementById('voiceSelect');
    if (!voiceSelect) return;
    
    voiceSelect.innerHTML = '';
    voices.forEach((voice, index) => {
        if (voice.lang.includes('en')) {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${voice.name} (${voice.lang})`;
            voiceSelect.appendChild(option);
        }
    });
    
    if (voiceSelect.options.length > 0) {
        currentVoice = voices[voiceSelect.value];
        voiceSelect.addEventListener('change', (e) => {
            currentVoice = voices[e.target.value];
        });
    }
}

// Speech synthesis function
function speakAIResponse(text) {
    if (!currentVoice) return;
    
    // Cancel any ongoing speech
    speechSynthesis.cancel();
    
    // Split text into sentences for better speech flow
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    let currentSentence = 0;
    
    const speakNextSentence = () => {
        if (currentSentence >= sentences.length) return;
        
        const utterance = new SpeechSynthesisUtterance(sentences[currentSentence].trim());
        utterance.voice = currentVoice;
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        
        utterance.onend = () => {
            currentSentence++;
            if (currentSentence < sentences.length) {
                setTimeout(speakNextSentence, 300); // Brief pause between sentences
            }
        };
        
        speechSynthesis.speak(utterance);
    };
    
    speakNextSentence();
}

// Voice recognition functions
function showVoiceIndicator() {
    const indicator = document.querySelector('.voice-indicator');
    if (indicator) {
        indicator.classList.add('active');
    }
}

function hideVoiceIndicator() {
    const indicator = document.querySelector('.voice-indicator');
    if (indicator) {
        indicator.classList.remove('active');
    }
}

function startVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        addSystemMessage('Voice recognition is not supported in your browser.');
        return;
    }

    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        isListening = true;
        showVoiceIndicator();
        document.querySelector('.voice-toggle').classList.add('active');
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById('messageInput').value = transcript;
        hideVoiceIndicator();
    };

    recognition.onerror = (event) => {
        hideVoiceIndicator();
        addSystemMessage('Voice recognition error: ' + event.error);
    };

    recognition.onend = () => {
        isListening = false;
        hideVoiceIndicator();
        document.querySelector('.voice-toggle').classList.remove('active');
    };

    recognition.start();
}

// AI Response processing
async function processAIResponse(userInput) {
    const responseType = document.getElementById('responseType')?.value || 'supportive';
    
    try {
        const response = await fetchGeminiResponse(userInput, responseType);
        addMessageToChat('ai', response);
        
        // Speak the response if voice is enabled
        const voiceToggle = document.querySelector('.voice-toggle');
        if (voiceToggle && voiceToggle.classList.contains('active') && currentVoice) {
            setTimeout(() => speakAIResponse(response), 500);
        }
    } catch (error) {
        console.error('Error processing AI response:', error);
        const fallbackResponse = getRandomDefaultResponse();
        addMessageToChat('ai', fallbackResponse);
        
        if (voiceToggle && voiceToggle.classList.contains('active') && currentVoice) {
            setTimeout(() => speakAIResponse(fallbackResponse), 500);
        }
    }
}

function createChatWidget() {
    const chatHTML = `
        <div class="chat-widget" id="chatWidget">
            <button class="chat-button" id="chatButton">
                <i class="fas fa-comments chat-icon"></i>
                <span class="chat-label">Support Chat</span>
            </button>
            
            <div class="chat-container" id="chatContainer">
                <div class="chat-header">
                    <h3>Support Chat</h3>
                    <div class="response-type">
                        <span class="response-indicator">AI Response</span>
                        <div class="dropdown-content">
                            <a href="#" data-type="supportive">Supportive</a>
                            <a href="#" data-type="reflective">Reflective</a>
                            <a href="#" data-type="practical">Practical</a>
                        </div>
                    </div>
                    <button class="chat-close" id="chatClose">&times;</button>
                </div>
                
                <div class="voice-controls">
                    <button class="voice-toggle" id="voiceToggle">
                        <i class="fas fa-microphone"></i>
                        <span>Voice</span>
                    </button>
                    <div class="voice-settings">
                        <select class="voice-select" id="voiceSelect">
                            <option>Loading voices...</option>
                        </select>
                    </div>
                    <div class="voice-indicator">
                        <div class="voice-bar"></div>
                        <div class="voice-bar"></div>
                        <div class="voice-bar"></div>
                        <div class="voice-bar"></div>
                    </div>
                </div>
                
                <div class="chat-messages" id="chatMessages">
                    <div class="system-message">
                        Welcome! I'm here to listen and provide support. How are you feeling today?
                    </div>
                </div>
                
                <div class="moderation-notice" id="moderationNotice">
                    <i class="fas fa-shield-alt moderation-icon"></i>
                    <p>All messages are reviewed for safety and appropriateness.</p>
                </div>
                
                <div class="chat-input">
                    <textarea id="messageInput" placeholder="Type your message here..." rows="1"></textarea>
                    <button id="sendMessage"></button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', chatHTML);
    chatContainer = document.getElementById('chatContainer');
}

function setupChatEvents() {
    const chatButton = document.getElementById('chatButton');
    const chatClose = document.getElementById('chatClose');
    const sendBtn = document.getElementById('sendMessage');
    const messageInput = document.getElementById('messageInput');
    const voiceToggle = document.getElementById('voiceToggle');
    const responseTypeLinks = document.querySelectorAll('.dropdown-content a');

    // Gracefully exit if elements don't exist (not on a chat-enabled page)
    if (!chatButton || !chatClose || !messageInput || !voiceToggle) {
        return;
    }

    chatButton.addEventListener('click', () => {
        chatButton.classList.add('active');
        chatContainer.classList.add('active');
    });

    chatClose.addEventListener('click', () => {
        chatButton.classList.remove('active');
        chatContainer.classList.remove('active');
    });

    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            sendMessage();
        });
    }
    
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    voiceToggle.addEventListener('click', () => {
        if (isListening) {
            recognition.stop();
        } else {
            startVoiceRecognition();
        }
    });

    responseTypeLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const type = e.target.dataset.type;
            document.querySelector('.response-indicator').textContent = 
                type.charAt(0).toUpperCase() + type.slice(1) + ' Response';
            // Store the selected type for later use
            document.getElementById('responseType').value = type;
        });
    });
    
    // Add hidden input for response type
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.id = 'responseType';
    hiddenInput.value = 'supportive';
    document.body.appendChild(hiddenInput);
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    addMessageToChat('user', message);
    messageInput.value = '';
    
    // Add typing indicator
    addTypingIndicator();
    
    // Process the message
    setTimeout(() => {
        removeTypingIndicator();
        processAIResponse(message);
    }, 1500);
}

function addMessageToChat(sender, content) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const messageContent = document.createElement('p');
    messageContent.textContent = content;
    messageDiv.appendChild(messageContent);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message typing';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = '<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Content moderation (placeholder)
async function moderateContent(message) {
    // Implement content moderation logic here
    // This is a placeholder that always returns true
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simple keyword filter
            const flaggedWords = ['violence', 'harm', 'suicide'];
            const containsFlaggedWords = flaggedWords.some(word => 
                message.toLowerCase().includes(word)
            );
            
            if (containsFlaggedWords) {
                // Show moderation notice
                const moderationNotice = document.getElementById('moderationNotice');
                moderationNotice.style.display = 'flex';
                setTimeout(() => {
                    moderationNotice.style.display = 'none';
                }, 5000);
                
                resolve({
                    flagged: true,
                    reason: 'Content requires review'
                });
            } else {
                resolve({
                    flagged: false
                });
            }
        }, 500);
    });
}

function addSystemMessage(content) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'system-message';
    messageDiv.textContent = content;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// AI Response fetching
async function fetchGeminiResponse(prompt, responseType = 'supportive') {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: prompt,
                type: responseType
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return (data.message || data.response) || getRandomDefaultResponse();
    } catch (error) {
        console.error('Error fetching AI response:', error);
        throw error;
    }
}

function getRandomDefaultResponse() {
    const responses = [
        "Thank you for sharing with me. Your feelings are valid, and it's important that you've reached out.",
        "I hear you, and I want you to know that you're not alone in this. Many people struggle with similar feelings.",
        "It takes courage to express what you're going through. How are you taking care of yourself right now?",
        "Your wellbeing matters. Have you considered speaking with a mental health professional about these feelings?",
        "I appreciate you trusting me with your thoughts. Remember that seeking support is a sign of strength."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}

function addMessageToChat(sender, content) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.innerHTML = `<p>${content}</p>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addSystemMessage(content) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'system-message';
    messageDiv.textContent = content;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Check if Flask server is running
async function checkFlaskServer() {
    try {
        const response = await fetch('/api/health');
        if (response.ok) {
            console.log('Flask server is running');
        }
    } catch (error) {
        console.log('Flask server might not be running, using fallback responses');
        addSystemMessage('Note: Advanced AI features may not be available right now.');
    }
}

function initializeChatWidget() {
    // Get DOM elements
    chatContainer = document.getElementById('chatContainer');
    chatButton = document.getElementById('chatButton');
    welcomeScreen = document.getElementById('welcomeScreen');
    chatMessages = document.getElementById('chatMessages');
    chatInput = document.getElementById('chatInput');
    
    if (!chatContainer || !chatButton) {
        console.error('Chat widget elements not found');
        return;
    }
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize chat state
    resetChatWidget();
}

function setupEventListeners() {
    // Chat button - open widget
    chatButton.addEventListener('click', function() {
        openChatWidget();
    });
    
    // Close button
    const closeBtn = document.getElementById('chatClose');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            closeChatWidget();
        });
    }
    
    // Back button
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            goBackToModeSelection();
        });
    }
    
    // Minimize button
    const minimizeBtn = document.getElementById('minimizeBtn');
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', function() {
            toggleMinimize();
        });
    }
    
    // Mode selection buttons
    const customerServiceBtn = document.getElementById('customerServiceMode');
    const companionBtn = document.getElementById('companionMode');
    
    if (customerServiceBtn) {
        customerServiceBtn.addEventListener('click', function() {
            selectChatMode('customer-service');
        });
    }
    
    if (companionBtn) {
        companionBtn.addEventListener('click', function() {
            selectChatMode('companion');
        });
    }
    
    // Send message
    const sendBtn = document.getElementById('sendMessage');
    if (sendBtn) {
        sendBtn.addEventListener('click', function() {
            sendMessage();
        });
    }
    
    // Message input events
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        // Enter key to send message
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        // Auto-resize textarea
        messageInput.addEventListener('input', function() {
            autoResizeTextarea(this);
        });
    }
}

function openChatWidget() {
    chatContainer.classList.add('active');
    chatButton.classList.add('active');
    
    // If no mode selected, show welcome screen
    if (!chatMode) {
        showWelcomeScreen();
    }
}

function closeChatWidget() {
    chatContainer.classList.remove('active');
    chatButton.classList.remove('active');
    isMinimized = false;
    chatContainer.classList.remove('minimized');
    
    // Reset chat state so user can choose mode again next time
    resetChatWidget();
}

function toggleMinimize() {
    isMinimized = !isMinimized;
    chatContainer.classList.toggle('minimized');
    
    // Update minimize button icon
    const minimizeBtn = document.getElementById('minimizeBtn');
    if (minimizeBtn) {
        const icon = minimizeBtn.querySelector('i');
        if (icon) {
            if (isMinimized) {
                icon.className = 'fas fa-window-maximize';
            } else {
                icon.className = 'fas fa-minus';
            }
        }
    }
}

function showWelcomeScreen() {
    if (welcomeScreen) welcomeScreen.style.display = 'flex';
    if (chatInput) chatInput.style.display = 'none';
    
    // Hide back button on welcome screen
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.style.display = 'none';
    }
    
    // Reset chat title
    const chatTitle = document.getElementById('chatTitle');
    if (chatTitle) {
        chatTitle.textContent = 'Chat Support';
    }
    
    // Clear any existing chat messages
    if (chatMessages) {
        const existingMessages = chatMessages.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());
    }
}

function selectChatMode(mode) {
    chatMode = mode;
    if (welcomeScreen) welcomeScreen.style.display = 'none';
    if (chatInput) chatInput.style.display = 'flex';
    
    // Show back button when a mode is selected
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.style.display = 'block';
    }
    
    // Update chat title and appearance
    const chatTitle = document.getElementById('chatTitle');
    if (chatTitle) {
        if (mode === 'customer-service') {
            chatTitle.textContent = 'Website Help';
            addSystemMessage("Hi! I'm here to help you navigate our website and find information. How can I assist you today?");
        } else if (mode === 'companion') {
            chatTitle.textContent = 'AI Companion';
            addSystemMessage("Hello! I'm here to provide emotional support and have a conversation with you. How are you feeling today?");
        }
    }
    
    // Focus on input
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.focus();
    }
}

function goBackToModeSelection() {
    // Reset chat mode and show welcome screen
    chatMode = null;
    showWelcomeScreen();
    
    // Clear chat messages except system messages
    if (chatMessages) {
        const existingMessages = chatMessages.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());
    }
}

function resetChatWidget() {
    chatMode = null;
    isMinimized = false;
    if (chatContainer) chatContainer.classList.remove('minimized');
    showWelcomeScreen();
    
    // Clear chat messages
    if (chatMessages) {
        const existingMessages = chatMessages.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());
    }
    
    // Reset minimize button
    const minimizeBtn = document.getElementById('minimizeBtn');
    if (minimizeBtn) {
        const icon = minimizeBtn.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-minus';
        }
    }
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    if (!messageInput) return;
    
    const message = messageInput.value.trim();
    if (!message) return;
    
    // Add user message to chat
    addMessage('user', message);
    messageInput.value = '';
    autoResizeTextarea(messageInput);
    
    // Show typing indicator
    addTypingIndicator();
    
    // Process AI response based on mode
    setTimeout(() => {
        processAIResponse(message);
    }, 1000);
}

function addMessage(sender, content, extraClass = '') {
    if (!chatMessages) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message ${extraClass}`;
    
    const messageContent = document.createElement('p');
    messageContent.textContent = content;
    messageElement.appendChild(messageContent);
    
    // Insert before typing indicator if it exists
    const typingIndicator = chatMessages.querySelector('.typing-indicator');
    if (typingIndicator) {
        chatMessages.insertBefore(messageElement, typingIndicator);
    } else {
        chatMessages.appendChild(messageElement);
    }
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addSystemMessage(content) {
    if (!chatMessages) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = 'message system-message';
    
    const messageContent = document.createElement('p');
    messageContent.textContent = content;
    messageElement.appendChild(messageContent);
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addTypingIndicator() {
    if (!chatMessages) return;
    
    const typingElement = document.createElement('div');
    typingElement.className = 'message ai-message typing-indicator';
    typingElement.innerHTML = `
        <div class="typing">
            <span class="dot">●</span>
            <span class="dot">●</span>
            <span class="dot">●</span>
        </div>
    `;
    
    chatMessages.appendChild(typingElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    if (!chatMessages) return;
    
    const typingIndicator = chatMessages.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

async function processAIResponse(userMessage) {
    try {
        let responseData;
        
        if (chatMode === 'customer-service') {
            responseData = await getCustomerServiceResponse(userMessage);
        } else if (chatMode === 'companion') {
            responseData = await getCompanionResponse(userMessage);
        }
        
        removeTypingIndicator();
        
        if (responseData && responseData.message) {
            const extraClass = chatMode === 'customer-service' ? 'customer-service-message' : 'companion-message';
            addMessage('ai', responseData.message, extraClass);
        } else {
            addMessage('ai', "I'm sorry, I'm having trouble responding right now. Please try again in a moment.");
        }
        
    } catch (error) {
        console.error('Error processing AI response:', error);
        removeTypingIndicator();
        addMessage('ai', "I apologize, but I'm experiencing technical difficulties. Please try again later.");
    }
}

async function getCustomerServiceResponse(message) {
    return await fetchAIResponse(message, 'practical');
}

async function getCompanionResponse(message) {
    return await fetchAIResponse(message, 'supportive');
}

async function fetchAIResponse(prompt, type) {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: prompt,
                type: type
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Error fetching AI response:', error);
        return {
            message: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment."
        };
    }
}

function autoResizeTextarea(textarea) {
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
}

// Add CSS for typing animation
const style = document.createElement('style');
style.textContent = `
    .typing {
        display: inline-flex;
        align-items: center;
        gap: 4px;
    }
    
    .typing .dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #666;
        animation: typing 1.4s infinite ease-in-out;
    }
    
    .typing .dot:nth-child(1) { animation-delay: 0s; }
    .typing .dot:nth-child(2) { animation-delay: 0.2s; }
    .typing .dot:nth-child(3) { animation-delay: 0.4s; }
    
    @keyframes typing {
        0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
        }
        30% {
            transform: translateY(-10px);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style); 