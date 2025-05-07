// Question banks for different roles
const questionBanks = {
    'ux-ui': [
        "How do you approach user research in a new project?",
        "Describe your process for creating user personas.",
        "How do you handle feedback from stakeholders that conflicts with user needs?",
        "Walk me through your design thinking process.",
        "How do you ensure accessibility in your designs?",
        "Describe a challenging UX problem you solved.",
        "How do you measure the success of your designs?",
        "What's your approach to mobile-first design?",
        "How do you handle design critiques?",
        "Describe your ideal design system.",
        "Tell me about a time when you had to defend your design decisions to stakeholders.",
        "Describe a situation where you had to work with a difficult team member.",
        "Share an example of when you had to meet a tight deadline.",
        "Tell me about a time when you had to pivot your design approach.",
        "Describe a situation where you had to balance user needs with business goals."
    ],
    'product': [
        "How do you approach product strategy and vision?",
        "Describe your process for identifying and solving user problems.",
        "How do you balance user needs with business objectives?",
        "Walk me through your product design process from discovery to delivery.",
        "How do you measure product success?",
        "Describe your approach to product iteration and improvement.",
        "How do you handle competing priorities in product development?",
        "What's your process for gathering and incorporating user feedback?",
        "How do you ensure product consistency across different platforms?",
        "Describe your experience with product analytics and data-driven design.",
        "Tell me about a time when you had to make a difficult product decision.",
        "Describe a situation where you had to influence stakeholders without authority.",
        "Share an example of when you had to pivot a product strategy.",
        "Tell me about a time when you had to balance technical constraints with user needs.",
        "Describe a situation where you had to handle conflicting user feedback."
    ],
    'graphic': [
        "How do you stay current with design trends?",
        "Describe your creative process from concept to final design.",
        "How do you handle tight deadlines?",
        "What's your approach to brand consistency?",
        "How do you handle client feedback?",
        "Describe your experience with different design software.",
        "How do you ensure your designs are print-ready?",
        "What's your process for creating a visual identity?",
        "How do you handle creative block?",
        "Describe your experience with typography.",
        "Tell me about a time when you had to work with a difficult client.",
        "Describe a situation where you had to meet an impossible deadline.",
        "Share an example of when you had to defend your design choices.",
        "Tell me about a time when you had to adapt your style to match a brand.",
        "Describe a situation where you had to handle conflicting feedback."
    ],
    'social': [
        "How do you develop a social media strategy?",
        "Describe your approach to content calendar planning.",
        "How do you measure social media success?",
        "How do you handle negative comments or feedback?",
        "What's your experience with social media analytics?",
        "How do you stay current with social media trends?",
        "Describe your approach to community management.",
        "How do you create engaging content?",
        "What's your experience with paid social campaigns?",
        "How do you handle a social media crisis?",
        "Tell me about a time when you had to handle a social media crisis.",
        "Describe a situation where you had to deal with negative feedback.",
        "Share an example of when you had to change your strategy based on analytics.",
        "Tell me about a time when you had to work with a difficult client.",
        "Describe a situation where you had to manage multiple social media platforms."
    ],
    'creative': [
        "How do you lead and inspire creative teams?",
        "Describe your approach to creative direction.",
        "How do you balance creativity with business objectives?",
        "How do you handle creative disagreements?",
        "Describe your experience with brand development.",
        "How do you maintain creative quality across projects?",
        "What's your approach to innovation?",
        "How do you mentor junior creatives?",
        "Describe your experience with cross-functional collaboration.",
        "How do you handle creative burnout in your team?",
        "Tell me about a time when you had to make a difficult creative decision.",
        "Describe a situation where you had to manage team conflict.",
        "Share an example of when you had to pivot a creative strategy.",
        "Tell me about a time when you had to balance creative vision with budget constraints.",
        "Describe a situation where you had to handle a major creative failure."
    ]
};

// DOM Elements
const roleSelect = document.getElementById('role');
const currentQuestion = document.getElementById('current-question');
const answerInput = document.getElementById('answer-input');
const nextQuestionBtn = document.getElementById('next-question');
const resetTimerBtn = document.getElementById('reset-timer');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const timerButtons = document.querySelectorAll('.timer-buttons button');
const historyContainer = document.getElementById('history-container');
const clearHistoryBtn = document.getElementById('clear-history');
const toggleHistoryBtn = document.getElementById('toggle-history');
const customAlert = document.getElementById('custom-alert');
const alertClose = document.getElementById('alert-close');

// Timer variables
let timer;
let timeLeft;
let currentRole = 'ux-ui';
let currentQuestionIndex = 0;
let interviewHistory = JSON.parse(localStorage.getItem('interviewHistory')) || [];
let lastSelectedDuration = 180; // Default to 3 minutes
const timerDisplay = document.querySelector('.timer-display');

// Add these new variables at the top
const recommendedLengths = {
    short: { min: 100, max: 200 },
    medium: { min: 200, max: 400 },
    long: { min: 400, max: 600 }
};

// Add keyword sets for different question types
const keywordSets = {
    process: ['process', 'approach', 'method', 'strategy', 'steps', 'workflow', 'framework'],
    experience: ['experience', 'worked', 'handled', 'managed', 'led', 'created', 'developed'],
    problem: ['problem', 'challenge', 'issue', 'solution', 'resolved', 'fixed', 'addressed'],
    collaboration: ['team', 'stakeholder', 'client', 'collaborate', 'work with', 'partner'],
    metrics: ['measure', 'success', 'metrics', 'analytics', 'data', 'results', 'outcome'],
    tools: ['tool', 'software', 'platform', 'technology', 'system', 'application'],
    user: ['user', 'customer', 'audience', 'persona', 'needs', 'feedback', 'research']
};

// Add these new variables at the top
let currentSetting = 'startup';
const settingSelect = document.getElementById('setting');

// Add setting-specific question modifiers
const settingModifiers = {
    startup: {
        prefix: "In a fast-paced startup environment, ",
        focus: [
            "rapid iteration",
            "resource constraints",
            "quick decision-making",
            "flexibility",
            "innovation"
        ]
    },
    agency: {
        prefix: "In an agency setting, ",
        focus: [
            "client relationships",
            "collaboration",
            "brand consistency",
            "project management",
            "creative excellence"
        ]
    },
    corporate: {
        prefix: "In a corporate environment, ",
        focus: [
            "process adherence",
            "stakeholder management",
            "risk mitigation",
            "scalability",
            "compliance"
        ]
    }
};

// Initialize the first question
function initializeQuestion() {
    const questions = questionBanks[currentRole];
    let question = questions[currentQuestionIndex];
    
    // Modify question based on setting
    const modifier = settingModifiers[currentSetting];
    if (Math.random() < 0.3) { // 30% chance to modify the question
        question = modifier.prefix + question.toLowerCase();
    }
    
    currentQuestion.textContent = question;
}

// Timer functions
function startTimer(duration) {
    clearInterval(timer);
    timeLeft = duration;
    updateTimerDisplay();
    
    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            showCustomAlert();
            return;
        }
        
        timeLeft--;
        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');

    // Add warning state when less than 30 seconds remaining
    if (timeLeft <= 30) {
        timerDisplay.classList.add('warning');
    } else {
        timerDisplay.classList.remove('warning');
    }

    // Add ending state when less than 10 seconds remaining
    if (timeLeft <= 10) {
        timerDisplay.classList.add('ending');
    } else {
        timerDisplay.classList.remove('ending');
    }
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = 0;
    minutesDisplay.textContent = '00';
    secondsDisplay.textContent = '00';
    timerDisplay.classList.remove('warning', 'ending');
}

// Event Listeners
roleSelect.addEventListener('change', (e) => {
    currentRole = e.target.value;
    currentQuestionIndex = 0;
    initializeQuestion();
    resetTimer();
    startTimer(lastSelectedDuration);
});

nextQuestionBtn.addEventListener('click', () => {
    saveToHistory();
    const questions = questionBanks[currentRole];
    currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
    initializeQuestion();
    resetTimer();
    startTimer(lastSelectedDuration);
});

resetTimerBtn.addEventListener('click', resetTimer);

timerButtons.forEach(button => {
    button.addEventListener('click', () => {
        const duration = parseInt(button.dataset.time);
        lastSelectedDuration = duration;
        startTimer(duration);
    });
});

// Add this function to analyze the answer
function analyzeAnswer(question, answer) {
    const wordCount = answer.trim().split(/\s+/).length;
    const feedback = {
        length: analyzeLength(wordCount),
        keywords: analyzeKeywords(question, answer),
        suggestions: []
    };

    // Add suggestions based on analysis
    if (feedback.length.status === 'too short') {
        feedback.suggestions.push('Consider expanding your answer with more details and examples.');
    } else if (feedback.length.status === 'too long') {
        feedback.suggestions.push('Consider being more concise and focusing on key points.');
    }

    if (feedback.keywords.missing.length > 0) {
        feedback.suggestions.push(`Consider addressing: ${feedback.keywords.missing.join(', ')}`);
    }

    return feedback;
}

// Add this function to analyze answer length
function analyzeLength(wordCount) {
    if (wordCount < recommendedLengths.short.min) {
        return { status: 'too short', wordCount };
    } else if (wordCount > recommendedLengths.long.max) {
        return { status: 'too long', wordCount };
    } else if (wordCount >= recommendedLengths.short.min && wordCount <= recommendedLengths.short.max) {
        return { status: 'short', wordCount };
    } else if (wordCount >= recommendedLengths.medium.min && wordCount <= recommendedLengths.medium.max) {
        return { status: 'medium', wordCount };
    } else {
        return { status: 'long', wordCount };
    }
}

// Add this function to analyze keywords
function analyzeKeywords(question, answer) {
    const questionLower = question.toLowerCase();
    const answerLower = answer.toLowerCase();
    const relevantKeywords = [];
    const missingKeywords = [];

    // Add setting-specific keywords
    const settingFocus = settingModifiers[currentSetting].focus;
    relevantKeywords.push(...settingFocus);

    // Determine which keyword sets are relevant based on the question
    Object.entries(keywordSets).forEach(([category, keywords]) => {
        if (keywords.some(keyword => questionLower.includes(keyword))) {
            relevantKeywords.push(...keywords);
        }
    });

    // Check which keywords are present and missing
    relevantKeywords.forEach(keyword => {
        if (!answerLower.includes(keyword)) {
            missingKeywords.push(keyword);
        }
    });

    return {
        found: relevantKeywords.filter(keyword => answerLower.includes(keyword)),
        missing: missingKeywords
    };
}

// Modify the saveToHistory function to include setting
function saveToHistory() {
    const answer = answerInput.value.trim();
    if (!answer) return;

    const analysis = analyzeAnswer(currentQuestion.textContent, answer);

    const historyItem = {
        timestamp: new Date().toLocaleString(),
        role: roleSelect.options[roleSelect.selectedIndex].text,
        setting: settingSelect.options[settingSelect.selectedIndex].text,
        question: currentQuestion.textContent,
        answer: answer,
        analysis: analysis
    };

    interviewHistory.unshift(historyItem);
    localStorage.setItem('interviewHistory', JSON.stringify(interviewHistory));
    updateHistoryDisplay();
    answerInput.value = '';
}

// Update the updateHistoryDisplay function to show setting
function updateHistoryDisplay() {
    historyContainer.innerHTML = '';
    
    interviewHistory.forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const analysisSection = `
            <div class="analysis-section">
                <div class="length-analysis ${item.analysis.length.status}">
                    <span>Length: ${item.analysis.length.wordCount} words (${item.analysis.length.status})</span>
                </div>
                <div class="keyword-analysis">
                    <div class="found-keywords">
                        <strong>Keywords found:</strong> ${item.analysis.keywords.found.join(', ') || 'None'}
                    </div>
                    <div class="missing-keywords">
                        <strong>Keywords to consider:</strong> ${item.analysis.keywords.missing.join(', ') || 'None'}
                    </div>
                </div>
                <div class="suggestions">
                    ${item.analysis.suggestions.map(suggestion => `<p>${suggestion}</p>`).join('')}
                </div>
            </div>
        `;

        historyItem.innerHTML = `
            <div class="timestamp">${item.timestamp}</div>
            <div class="role">${item.role}</div>
            <div class="setting">${item.setting}</div>
            <div class="question">Q: ${item.question}</div>
            <div class="answer">A: ${item.answer}</div>
            ${analysisSection}
        `;
        historyContainer.appendChild(historyItem);
    });
}

function clearHistory() {
    if (confirm('Are you sure you want to clear all interview history?')) {
        interviewHistory = [];
        localStorage.removeItem('interviewHistory');
        updateHistoryDisplay();
    }
}

function toggleHistory() {
    const isVisible = historyContainer.style.display !== 'none';
    historyContainer.style.display = isVisible ? 'none' : 'block';
}

clearHistoryBtn.addEventListener('click', clearHistory);
toggleHistoryBtn.addEventListener('click', toggleHistory);

// Initialize the first question
initializeQuestion();

// Initialize history display
updateHistoryDisplay();

// Custom alert functions
function showCustomAlert() {
    if (customAlert) {
        customAlert.style.display = 'flex';
    }
}

function hideCustomAlert() {
    if (customAlert) {
        customAlert.style.display = 'none';
    }
}

// Make sure the alert close button is properly initialized
document.addEventListener('DOMContentLoaded', () => {
    if (alertClose) {
        alertClose.addEventListener('click', hideCustomAlert);
    }
    
    // Initialize timer
    startTimer(lastSelectedDuration);

    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    function switchTab(tabName) {
        // Hide all tab contents
        tabContents.forEach(content => {
            content.classList.remove('active');
        });

        // Remove active class from all buttons
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected tab content and activate button
        document.getElementById(`${tabName}-tab`).classList.add('active');
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    }

    // Add click event listeners to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    // Initialize with practice tab
    switchTab('practice');
});

// Add this to make the timer draggable (optional)
document.addEventListener('DOMContentLoaded', () => {
    const floatingTimer = document.querySelector('.floating-timer');
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    floatingTimer.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === floatingTimer) {
            isDragging = true;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, floatingTimer);
        }
    }

    function dragEnd() {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }
});

// Update the role select options in the HTML
document.getElementById('role').innerHTML = `
    <option value="ux-ui">UX/UI Designer</option>
    <option value="product">Product Designer</option>
    <option value="graphic">Graphic Designer</option>
    <option value="social">Social Media Manager</option>
    <option value="creative">Creative Director</option>
`;

// Add setting change handler
settingSelect.addEventListener('change', (e) => {
    currentSetting = e.target.value;
    document.body.className = `setting-${currentSetting}`;
    initializeQuestion();
});

// Initialize the setting
document.addEventListener('DOMContentLoaded', () => {
    document.body.className = `setting-${currentSetting}`;
    // ... rest of your existing DOMContentLoaded code ...
});
