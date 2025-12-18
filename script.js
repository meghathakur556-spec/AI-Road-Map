/* 
   SCRIPT.JS - Interactive functionality for AI Roadmap Web UI
   This file handles all the dynamic behavior and user interactions
*/

// ==========================================
// 1. PAGE INITIALIZATION
// ==========================================

/* This function runs when the page first loads */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded successfully!');
    // Load any previously saved progress from browser storage
    loadProgress();
    // Update progress bar based on completed phases
    updateProgressBar();
    // Add event listeners to all checkboxes
    attachCheckboxListeners();
});

// ==========================================
// 2. CHECKBOX FUNCTIONALITY
// ==========================================

/*
   This function attaches event listeners to all checkboxes
   so we can track when they're checked/unchecked
*/
function attachCheckboxListeners() {
    // Get all checkbox elements on the page
    const checkboxes = document.querySelectorAll('.topic-checkbox');
    
    // For each checkbox, add a listener for when it changes
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Save progress whenever a checkbox changes
            saveProgress();
            // Update progress bar
            updateProgressBar();
        });
    });
}

// ==========================================
// 3. PROGRESS TRACKING
// ==========================================

/*
   This function calculates and displays overall progress
   Progress = (Completed Topics / Total Topics) * 100
*/
function updateProgressBar() {
    // Get all checkboxes on the page
    const allCheckboxes = document.querySelectorAll('.topic-checkbox');
    // Count how many are checked
    const checkedCheckboxes = document.querySelectorAll('.topic-checkbox:checked');
    
    // Calculate percentage
    const totalTopics = allCheckboxes.length;
    const completedTopics = checkedCheckboxes.length;
    const progressPercentage = totalTopics > 0 
        ? Math.round((completedTopics / totalTopics) * 100) 
        : 0;
    
    // Update the progress bar display
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-percentage');
    
    progressFill.style.width = progressPercentage + '%';
    progressText.textContent = progressPercentage + '%';
    
    console.log(`Progress: ${progressPercentage}% (${completedTopics}/${totalTopics} topics completed)`);
}

// ==========================================
// 4. PHASE COMPLETION
// ==========================================

/*
   This function handles marking an entire phase as complete
   It changes the styling and saves the progress
*/
function completePhase(button) {
    // Get the parent phase card
    const phaseCard = button.closest('.phase-card');
    
    // Toggle the 'completed' class (adds or removes it)
    phaseCard.classList.toggle('completed');
    
    // Update button styling based on completion status
    if (phaseCard.classList.contains('completed')) {
        button.textContent = '✓ Phase Completed';
        button.classList.add('completed');
    } else {
        button.textContent = 'Mark Phase Complete';
        button.classList.remove('completed');
    }
    
    // Save progress to browser storage
    saveProgress();
    updateProgressBar();
}

// ==========================================
// 5. LOCAL STORAGE - SAVING PROGRESS
// ==========================================

/*
   Local Storage allows us to save data in the browser
   so progress persists even after closing the page
*/

/*
   This function saves all progress to browser storage
*/
function saveProgress() {
    // Get all checkboxes and their checked status
    const checkboxStates = {};
    const checkboxes = document.querySelectorAll('.topic-checkbox');
    
    checkboxes.forEach((checkbox, index) => {
        checkboxStates[`checkbox_${index}`] = checkbox.checked;
    });
    
    // Get all phase completion statuses
    const phaseStates = {};
    const phaseCards = document.querySelectorAll('.phase-card');
    
    phaseCards.forEach((card, index) => {
        phaseStates[`phase_${index}`] = card.classList.contains('completed');
    });
    
    // Get profile information
    const profileData = {
        name: document.querySelector('.editable-input').value,
        goal: document.querySelectorAll('.editable-input')[1].value
    };
    
    // Get all notes
    const notesData = {};
    const textareas = document.querySelectorAll('.notes-input');
    
    textareas.forEach((textarea, index) => {
        notesData[`notes_${index}`] = textarea.value;
    });
    
    // Store all data in browser's localStorage
    localStorage.setItem('roadmapCheckboxes', JSON.stringify(checkboxStates));
    localStorage.setItem('roadmapPhases', JSON.stringify(phaseStates));
    localStorage.setItem('roadmapProfile', JSON.stringify(profileData));
    localStorage.setItem('roadmapNotes', JSON.stringify(notesData));
    
    console.log('Progress saved successfully!');
}

/*
   This function loads previously saved progress from browser storage
*/
function loadProgress() {
    // Load checkbox states
    const savedCheckboxes = localStorage.getItem('roadmapCheckboxes');
    if (savedCheckboxes) {
        const checkboxStates = JSON.parse(savedCheckboxes);
        const checkboxes = document.querySelectorAll('.topic-checkbox');
        
        checkboxes.forEach((checkbox, index) => {
            if (checkboxStates[`checkbox_${index}`]) {
                checkbox.checked = true;
            }
        });
    }
    
    // Load phase completion states
    const savedPhases = localStorage.getItem('roadmapPhases');
    if (savedPhases) {
        const phaseStates = JSON.parse(savedPhases);
        const phaseCards = document.querySelectorAll('.phase-card');
        
        phaseCards.forEach((card, index) => {
            if (phaseStates[`phase_${index}`]) {
                card.classList.add('completed');
                const button = card.querySelector('.complete-btn');
                if (button) {
                    button.textContent = '✓ Phase Completed';
                    button.classList.add('completed');
                }
            }
        });
    }
    
    // Load profile information
    const savedProfile = localStorage.getItem('roadmapProfile');
    if (savedProfile) {
        const profileData = JSON.parse(savedProfile);
        const inputs = document.querySelectorAll('.editable-input');
        if (inputs[0]) inputs[0].value = profileData.name;
        if (inputs[1]) inputs[1].value = profileData.goal;
    }
    
    // Load notes
    const savedNotes = localStorage.getItem('roadmapNotes');
    if (savedNotes) {
        const notesData = JSON.parse(savedNotes);
        const textareas = document.querySelectorAll('.notes-input');
        
        textareas.forEach((textarea, index) => {
            if (notesData[`notes_${index}`]) {
                textarea.value = notesData[`notes_${index}`];
            }
        });
    }
    
    console.log('Progress loaded from previous session!');
}

// ==========================================
// 6. RESET FUNCTIONALITY
// ==========================================

/*
   This function clears all progress and resets the roadmap
*/
function resetProgress() {
    // Ask for confirmation before deleting progress
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
        // Clear all localStorage data
        localStorage.removeItem('roadmapCheckboxes');
        localStorage.removeItem('roadmapPhases');
        localStorage.removeItem('roadmapProfile');
        localStorage.removeItem('roadmapNotes');
        
        // Uncheck all checkboxes
        const checkboxes = document.querySelectorAll('.topic-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Remove 'completed' class from all phases
        const phaseCards = document.querySelectorAll('.phase-card');
        phaseCards.forEach(card => {
            card.classList.remove('completed');
            const button = card.querySelector('.complete-btn');
            if (button) {
                button.textContent = 'Mark Phase Complete';
                button.classList.remove('completed');
            }
        });
        
        // Clear all notes
        const textareas = document.querySelectorAll('.notes-input');
        textareas.forEach(textarea => {
            textarea.value = '';
        });
        
        // Update progress bar
        updateProgressBar();
        
        console.log('All progress has been reset!');
        alert('All progress has been reset!');
    }
}

// ==========================================
// 7. EXPORT FUNCTIONALITY
// ==========================================

/*
   This function exports progress as a text file for backup
   User can download their progress and save it
*/
function exportProgress() {
    // Create a text summary of the progress
    let exportText = '=================================\n';
    exportText += 'AI ENGINEERING ROADMAP - PROGRESS REPORT\n';
    exportText += '=================================\n\n';
    
    // Add profile information
    const nameInput = document.querySelector('.editable-input');
    const goalInput = document.querySelectorAll('.editable-input')[1];
    exportText += `Name: ${nameInput.value}\n`;
    exportText += `Goal: ${goalInput.value}\n`;
    exportText += `Export Date: ${new Date().toLocaleString()}\n\n`;
    
    // Add progress percentage
    const progressText = document.getElementById('progress-percentage').textContent;
    exportText += `Overall Progress: ${progressText}\n\n`;
    
    // Add detailed phase information
    exportText += '--- PHASES ---\n';
    const phaseCards = document.querySelectorAll('.phase-card');
    
    phaseCards.forEach((card, index) => {
        const phaseNumber = card.getAttribute('data-phase');
        const title = card.querySelector('.phase-header h3').textContent;
        const isCompleted = card.classList.contains('completed') ? 'COMPLETED' : 'IN PROGRESS';
        
        exportText += `\nPhase ${phaseNumber}: ${title}\nStatus: ${isCompleted}\n`;
        
        // Add checked topics
        const checkboxes = card.querySelectorAll('.topic-checkbox');
        const checkedTopics = card.querySelectorAll('.topic-checkbox:checked');
        exportText += `Topics Completed: ${checkedTopics.length}/${checkboxes.length}\n`;
        
        // List all topics with checkmark status
        checkboxes.forEach(checkbox => {
            const label = checkbox.nextElementSibling.textContent;
            const status = checkbox.checked ? '✓' : '○';
            exportText += `  ${status} ${label}\n`;
        });
        
        // Add notes if any
        const notesTextarea = card.querySelector('.notes-input');
        if (notesTextarea.value) {
            exportText += `Notes: ${notesTextarea.value}\n`;
        }
    });
    
    // Create a blob (file) from the text
    const blob = new Blob([exportText], { type: 'text/plain' });
    
    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI_Roadmap_Progress_${new Date().toISOString().split('T')[0]}.txt`;
    
    // Trigger the download
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    console.log('Progress exported successfully!');
    alert('Your progress has been exported as a text file!');
}

// ==========================================
// 8. AUTO-SAVE FUNCTIONALITY
// ==========================================

/*
   This automatically saves progress every 30 seconds
   as user takes notes or makes changes
*/
setInterval(() => {
    saveProgress();
}, 30000); // 30000 milliseconds = 30 seconds

// Also save before user leaves the page
window.addEventListener('beforeunload', () => {
    saveProgress();
});

console.log('AI Roadmap Interactive Script Loaded Successfully!');
