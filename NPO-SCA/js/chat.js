/**
 * PROJECT: ECHOE Mental Health Digital Platform
 * AUTHOR: Alex Dong (Co-Founder and Lead IT Developer)
 * LICENSE: GNU General Public License v3.0
 *
 * Copyright (c) 2026 Alex Dong. All Rights Reserved.
 * This file is part of the ECHOE project. Unauthorized removal of
 * author credits is a violation of the GPL license.
 */

// Gemini AI Chat Integration with Content Moderation
document.addEventListener('DOMContentLoaded', async function () {
    // 检查Flask服务器状态
    const isFlaskRunning = await checkFlaskServer();
    if (!isFlaskRunning) {
        alert('语音功能需要Flask服务支持。请确保Flask服务器正在运行。');
        // 禁用语音相关功能
        const voiceToggle = document.getElementById('voiceToggle');
        if (voiceToggle) {
            voiceToggle.disabled = true;
            voiceToggle.style.opacity = '0.5';
            voiceToggle.title = 'Flask服务未运行';
        }
        return;
    }

    // Create chat widget elements
    createChatWidget();

    // Set up event listeners
    setupChatEvents();

    // 添加语音功能
    const voiceToggle = document.getElementById('voiceToggle');
    const voiceSelect = document.getElementById('voiceSelect');
    let recognition = null;
    let synthesis = window.speechSynthesis;
    let isListening = false;

    // 初始化语音识别
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = function () {
            isListening = true;
            voiceToggle.classList.add('active');
            showVoiceIndicator();
        };

        recognition.onend = function () {
            if (isListening) {  // 只有在主动停止时才重新开始
                recognition.start();
            } else {
                voiceToggle.classList.remove('active');
                hideVoiceIndicator();
            }
        };

        recognition.onresult = function (event) {
            const transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');

            if (event.results[0].isFinal) {
                // 将语音输入添加到聊天
                addMessageToChat('user', transcript);
                // 发送到AI处理
                processAIResponse(transcript);
            }
        };
    }

    // 语音切换按钮事件
    voiceToggle.addEventListener('click', async function () {
        if (!recognition) {
            alert('语音识别在您的浏览器中不可用');
            return;
        }

        // 再次检查Flask服务器状态
        const isFlaskRunning = await checkFlaskServer();
        if (!isFlaskRunning) {
            alert('Flask服务器未运行，无法使用语音功能');
            return;
        }

        if (isListening) {
            isListening = false;
            recognition.stop();
            voiceToggle.innerHTML = '<i class="fas fa-microphone"></i><span>Start Voice</span>';
        } else {
            isListening = true;
            recognition.start();
            voiceToggle.innerHTML = '<i class="fas fa-microphone-slash"></i><span>Stop Voice</span>';
        }
    });

    // 语音合成
    function speakAIResponse(text) {
        if (synthesis.speaking) {
            synthesis.cancel();
        }

        // 更强大的emoji移除正则表达式
        const cleanText = text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
            .replace(/:[a-zA-Z_]+:/g, '') // 移除 :emoji: 格式的文本
            .trim();

        // 将文本分成句子
        const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];

        let currentSentence = 0;

        const speakNextSentence = () => {
            if (currentSentence < sentences.length) {
                const utterance = new SpeechSynthesisUtterance(sentences[currentSentence]);
                utterance.voice = synthesis.getVoices().find(voice =>
                    voice.name === voiceSelect.value) || synthesis.getVoices()[0];
                utterance.pitch = 1;
                utterance.rate = 1;
                utterance.volume = 1;
                utterance.onend = () => {
                    currentSentence++;
                    speakNextSentence();
                };
                synthesis.speak(utterance);
            }
        };

        speakNextSentence();
    }

    // 显示语音指示器
    function showVoiceIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'voice-indicator active';
        for (let i = 0; i < 4; i++) {
            indicator.appendChild(document.createElement('div')).className = 'voice-bar';
        }
        document.querySelector('.chat-header').appendChild(indicator);
    }

    // 隐藏语音指示器
    function hideVoiceIndicator() {
        const indicator = document.querySelector('.voice-indicator');
        if (indicator) {
            indicator.remove();
        }
        voiceToggle.innerHTML = '<i class="fas fa-microphone"></i><span>Start Voice</span>';
    }

    // 加载可用的语音
    synthesis.onvoiceschanged = function () {
        const voices = synthesis.getVoices();
        voiceSelect.innerHTML = voices
            .filter(voice => voice.lang.includes('en'))
            .map(voice => `<option value="${voice.name}">${voice.name}</option>`)
            .join('');
    };

    // 处理AI响应
    async function processAIResponse(userInput) {
        addTypingIndicator();

        try {
            const response = await fetchGeminiResponse(userInput);
            removeTypingIndicator();
            addMessageToChat('ai', response);

            // 保存聊天记录到数据库
            await fetch('http://localhost:5000/save-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: getCurrentUserId(), // 你需要实现这个函数
                    message: userInput,
                    response: response
                })
            });

            if (isListening) {
                speakAIResponse(response);
            }
        } catch (error) {
            console.error('AI Response Error:', error);
            removeTypingIndicator();
            addMessageToChat('ai', "I'm sorry, I couldn't process your request.");
        }
    }
});

function createChatWidget() {
    // Create chat widget container
    const chatWidget = document.createElement('div');
    chatWidget.className = 'chat-widget';
    chatWidget.innerHTML = `
        <button class="chat-button">
            <span class="chat-icon">💬</span>
            <span class="chat-label">Need to talk?</span>
        </button>
        <div class="chat-container">
            <div class="chat-header">
                <h3>Light in Silence AI Support</h3>
                <div class="response-type">
                    <span class="response-indicator">AI Support</span>
                    <div class="dropdown-content">
                        <a href="#" data-type="supportive">Supportive Response</a>
                        <a href="#" data-type="practical">Practical Advice</a>
                        <a href="#" data-type="reflective">Reflective Response</a>
                    </div>
                </div>
                <button class="chat-close">&times;</button>
            </div>
            <div class="chat-messages">
                <div class="message ai-message">
                    <p>Hello! I'm here to listen and provide support. Feel free to share what's on your mind. Remember, this is a safe space.</p>
                    <p class="message-note">Note: For immediate crisis support, please call your local helpline.</p>
                </div>
            </div>
            <div class="moderation-notice" style="display: none;">
                <div class="moderation-icon">⚠️</div>
                <p>Our AI is reviewing this conversation to ensure it's supportive and safe.</p>
            </div>
            <div class="chat-input">
                <textarea id="user-message" placeholder="Type your message here..."></textarea>
                <button id="send-message">Send</button>
            </div>
        </div>
    `;

    // Append to body
    document.body.appendChild(chatWidget);
}

function setupChatEvents() {
    // Toggle chat window
    const chatButton = document.querySelector('.chat-button');
    const chatContainer = document.querySelector('.chat-container');
    const chatClose = document.querySelector('.chat-close');

    chatButton.addEventListener('click', function () {
        chatContainer.classList.toggle('active');
        chatButton.classList.toggle('active');
    });

    chatClose.addEventListener('click', function () {
        chatContainer.classList.remove('active');
        chatButton.classList.remove('active');
    });

    // Response type selection
    const responseTypeLinks = document.querySelectorAll('.dropdown-content a');
    const responseIndicator = document.querySelector('.response-indicator');

    responseTypeLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const type = this.getAttribute('data-type');
            responseIndicator.textContent = this.textContent;
            responseIndicator.setAttribute('data-current-type', type);
        });
    });

    // Send message
    const sendButton = document.getElementById('send-message');
    const userMessageInput = document.getElementById('user-message');
    const chatMessages = document.querySelector('.chat-messages');
    const moderationNotice = document.querySelector('.moderation-notice');

    sendButton.addEventListener('click', function () {
        sendMessage();
    });

    userMessageInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    function sendMessage() {
        const message = userMessageInput.value.trim();
        if (!message) return;

        // Add user message to chat
        addMessageToChat('user', message);

        // Clear input
        userMessageInput.value = '';

        // Show typing indicator
        addTypingIndicator();

        // First run content moderation
        moderateContent(message);
    }

    function addMessageToChat(sender, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.innerHTML = `<p>${content}</p>`;
        chatMessages.appendChild(messageDiv);

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message typing';
        typingDiv.innerHTML = '<p>Thinking<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span></p>';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        const typingIndicator = document.querySelector('.typing');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    async function moderateContent(message) {
        // Show moderation notice briefly
        moderationNotice.style.display = 'flex';

        // This is where you'd call a real content moderation API
        // For demonstration, we'll simulate content moderation
        try {
            // Simple keyword-based moderation
            const flaggedKeywords = ['suicide', 'kill myself', 'end my life', 'hurt myself', 'self-harm'];

            let isFlagged = false;
            for (const keyword of flaggedKeywords) {
                if (message.toLowerCase().includes(keyword)) {
                    isFlagged = true;
                    break;
                }
            }

            // Wait briefly to simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Hide moderation notice
            moderationNotice.style.display = 'none';

            if (isFlagged) {
                // Handle flagged content with crisis response
                removeTypingIndicator();
                addMessageToChat('ai', "I notice you've mentioned something concerning. If you're in crisis, please call your local crisis line immediately. In Canada, you can call 1-833-456-4566, or text 45645. Would you like me to provide more support resources?");

                // Show follow-up system message
                setTimeout(() => {
                    addSystemMessage("A human supporter has been notified and will review this conversation soon. In the meantime, please know that help is available.");
                }, 1000);
            } else {
                // Content is safe, continue with normal response
                const responseType = document.querySelector('.response-indicator').getAttribute('data-current-type') || 'supportive';
                fetchGeminiResponse(message, responseType);
            }
        } catch (error) {
            console.error("Moderation Error:", error);
            moderationNotice.style.display = 'none';
            removeTypingIndicator();
            addMessageToChat('ai', "I'm sorry, I couldn't process your message. Please try again.");
        }
    }

    function addSystemMessage(content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message system-message';
        messageDiv.innerHTML = `<p>${content}</p>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

async function fetchGeminiResponse(prompt, responseType = 'supportive') {
    const apiKey = "AIzaSyCwHDbqWCE4Fi6y18GnNZ-Wem_7p_z2TvM"; // Replace with your actual API key
    const chatMessages = document.querySelector('.chat-messages');

    // Customize prompt based on response type
    let systemPrompt;
    switch (responseType) {
        case 'practical':
            systemPrompt = `You are a practical AI companion for the Light in Silence mental health platform. 
                          Offer concrete, actionable advice while being supportive and compassionate.
                          Focus on small, manageable steps the user can take.
                          Keep responses supportive, practical and relatively brief.
                          User message: ${prompt}`;
            break;
        case 'reflective':
            systemPrompt = `You are a reflective AI companion for the Light in Silence mental health platform. 
                          Ask thoughtful questions to help the user explore their feelings and situation more deeply.
                          Help them gain insight through gentle reflection rather than direct advice.
                          Keep responses supportive, thought-provoking and relatively brief.
                          User message: ${prompt}`;
            break;
        case 'supportive':
        default:
            systemPrompt = `You are a supportive AI companion for the Light in Silence mental health platform. 
                          Respond with empathy and care. Do not diagnose or provide medical advice.
                          Focus on emotional support and validation of feelings.
                          Keep responses supportive, thoughtful and relatively brief.
                          User message: ${prompt}`;
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: systemPrompt
                    }]
                }]
            })
        });

        const data = await response.json();

        // Remove typing indicator
        removeTypingIndicator();

        if (data && data.candidates && data.candidates.length > 0) {
            // Add AI response to chat
            const aiResponse = data.candidates[0].content.parts.map(part => part.text).join(" ");
            addMessageToChat('ai', aiResponse);

            // Randomly add system message sometimes to demonstrate default responses
            if (Math.random() < 0.3) {
                setTimeout(() => {
                    addSystemMessage(getRandomDefaultResponse());
                }, 1000);
            }
        } else {
            // Handle error
            addMessageToChat('ai', "I'm sorry, I'm having trouble responding right now. Please try again later.");
        }
    } catch (error) {
        console.error("API Error:", error);
        removeTypingIndicator();
        addMessageToChat('ai', "I'm sorry, I'm having trouble connecting. Please try again later.");
    }
}

function getRandomDefaultResponse() {
    const defaultResponses = [
        "Remember that our volunteers are also available to reply to your messages within 48 hours if you'd prefer a human connection.",
        "If you found this conversation helpful, you might also benefit from exploring our resources section.",
        "While I'm here 24/7, sometimes writing your thoughts in a letter can also be therapeutic. You can try our letter submission option anytime.",
        "Your wellbeing matters. Don't hesitate to reach out whenever you need support.",
        "Connection is important. Have you considered joining one of our community events?"
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

function addMessageToChat(sender, content) {
    const chatMessages = document.querySelector('.chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.innerHTML = `<p>${content}</p>`;
    chatMessages.appendChild(messageDiv);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addSystemMessage(content) {
    const chatMessages = document.querySelector('.chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message system-message';
    messageDiv.innerHTML = `<p>${content}</p>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.querySelector('.typing');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// 添加Flask服务器检查函数
async function checkFlaskServer() {
    try {
        const response = await fetch('http://localhost:5000/health-check', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Flask server is not responding');
        }

        // 获取语音设置
        const voiceSettings = await fetch('http://localhost:5000/voice-settings').then(res => res.json());

        // 更新语音选择下拉框
        const voiceSelect = document.getElementById('voiceSelect');
        if (voiceSelect) {
            voiceSelect.innerHTML = voiceSettings.available_voices
                .map(voice => `<option value="${voice.name}">${voice.label}</option>`)
                .join('');
            voiceSelect.value = voiceSettings.default_voice;
        }

        return true;
    } catch (error) {
        console.error('Flask server check failed:', error);
        return false;
    }
} 