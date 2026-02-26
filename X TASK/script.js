// ==========================================
// 1. SETUP & UTILS
// ==========================================
let player;
let currentVolume = 50;
const stationIDs = ["4xDzrJKXOOY", "jfKfPfyJRdk", "x0hbDv_Y63c"];

// Focus Timer State
let focusTimerInterval = null;
let focusTimeRemaining = 25 * 60;
let isFocusRunning = false;
let currentFocusTask = null;

// Sound Effects
const soundClick = new Audio("https://actions.google.com/sounds/v1/ui/click_on.ogg");
const soundSuccess = new Audio("https://actions.google.com/sounds/v1/cartoon/clank_car_crash.ogg"); 

function playClickSound() { try { soundClick.currentTime = 0; soundClick.volume = 0.2; soundClick.play(); } catch(e){} }

function initYouTubePlayer() {
    if(document.getElementById('youtube-player')) {
        if (player && typeof player.destroy === 'function') return; 
        try {
            player = new YT.Player('youtube-player', {
                height: '100%', width: '100%', videoId: stationIDs[0],
                playerVars: { 'autoplay': 0, 'controls': 0, 'showinfo': 0, 'rel': 0, 'fs': 0 },
                events: { 'onReady': onPlayerReady }
            });
        } catch(e) { console.warn("YouTube API not loaded yet"); }
    }
}
window.onYouTubeIframeAPIReady = function() { initYouTubePlayer(); };
function onPlayerReady(event) {
    const volSlider = document.getElementById('volumeSlider');
    const fVolSlider = document.getElementById('focusVolumeSlider');
    if(volSlider) volSlider.value = 50;
    if(fVolSlider) fVolSlider.value = 50;
    if(event.target) event.target.setVolume(50);
}

// ==========================================
// 2. MAIN LOGIC (DOM READY)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {

    // Prevent Tooltip Errors
    try { document.querySelectorAll('[title], [data-bs-toggle="tooltip"]').forEach(el => { el.removeAttribute('title'); el.removeAttribute('data-bs-toggle'); }); } catch(e) {}
    
    // Init YouTube if ready
    if (window.YT && window.YT.Player && typeof player === 'undefined') initYouTubePlayer();

    // Mouse Parallax
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        document.documentElement.style.setProperty('--mouse-x', x);
        document.documentElement.style.setProperty('--mouse-y', y);
    });

    // Global Click Sound
    document.body.addEventListener('click', (e) => {
        if(e.target.closest('.sound-click') || e.target.closest('button') || e.target.closest('a')) {
            playClickSound();
        }
    });

    // Data Loading
    let tasks = [];
    try { 
        tasks = JSON.parse(localStorage.getItem('tasks')) || []; 
        if (!Array.isArray(tasks)) tasks = []; 
        // Data Sanitizer
        tasks.forEach(t => {
            t.tags = t.tags || [];
            t.links = t.links || [];
            t.subtasks = t.subtasks || [];
            t.attachments = t.attachments || [];
            if(t.isPinned === undefined) t.isPinned = false;
        });
    } catch (e) { tasks = []; }
    
    let currentFilter = 'all';
    let sortAscending = false; 
    let deleteTargetId = null;
    let rainbowTimer = null;
    let hue = 0;
    let tempLinks = [];
    let isBoardView = false;

    // --- ELEMENT SELECTORS ---
    const taskInput = document.getElementById('taskInput');
    const categoryInput = document.getElementById('categoryInput'); 
    const voiceBtn = document.getElementById('voiceCommandBtn');
    const taskDescInput = document.getElementById('taskDescInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const isRecurringInput = document.getElementById('isRecurringInput');
    const fileInput = document.getElementById('fileInput'); 
    const addFilePreview = document.getElementById('addFilePreview');
    const tempLinkPreview = document.getElementById('tempLinkPreview'); 
    const fileLabelText = document.getElementById('fileLabelText');
    const priorityInput = document.getElementById('priorityInput');
    const sortInput = document.getElementById('sortInput');
    const addBtn = document.getElementById('addTaskBtn');
    
    const taskList = document.getElementById('taskList');
    const kanbanBoard = document.getElementById('kanbanBoard'); 
    const viewListBtn = document.getElementById('viewListBtn');
    const viewBoardBtn = document.getElementById('viewBoardBtn');
    const filterContainer = document.getElementById('filterContainer');

    const searchInput = document.getElementById('searchInput');
    const filterTabs = document.getElementById('filterTabs');
    const taskStats = document.getElementById('taskStats');
    const emptyState = document.getElementById('emptyState');
    const greetingEl = document.getElementById('greeting');
    const clockEl = document.getElementById('currentClock');
    const streakContainer = document.getElementById('streakContainer');
    const streakCountEl = document.getElementById('streakCount');
    
    const themeLauncherBtn = document.getElementById('themeLauncherBtn');
    const customThemeInput = document.getElementById('customThemeInput');
    const rainbowModeBtn = document.getElementById('rainbowModeBtn');
    const routineBtn = document.getElementById('routineBtn');
    const statsBtn = document.getElementById('statsBtn');

    const clearCompletedBtn = document.getElementById('clearCompletedBtn');
    const selectAllBtn = document.getElementById('selectAllBtn'); 
    const importBtn = document.getElementById('importBtn');
    const exportBtn = document.getElementById('exportBtn');
    const importFileInput = document.getElementById('importFileInput');
    const musicBtn = document.getElementById('musicBtn');
    const miniPlayer = document.getElementById('miniPlayer');
    const volumeSlider = document.getElementById('volumeSlider');
    const focusVolumeSlider = document.getElementById('focusVolumeSlider');
    
    const focusModeBtn = document.getElementById('focusModeBtn');
    const focusOverlay = document.getElementById('focusOverlay');
    const focusTimerDisplay = document.getElementById('focusTimerDisplay');
    const focusToggleBtn = document.getElementById('focusToggleBtn');
    const focusExitBtn = document.getElementById('focusExitBtn');
    const focusTaskLabel = document.getElementById('focusTaskLabel');

    const quickNotesPanel = document.getElementById('quickNotesPanel');
    const showNotesBtn = document.getElementById('showNotesBtn');
    const toggleNotesBtn = document.getElementById('toggleNotesBtn');
    const quickNotesArea = document.getElementById('quickNotesArea');

    const openLinkModalBtn = document.getElementById('openLinkModalBtn');
    const modalLinkInput = document.getElementById('modalLinkInput');
    const confirmAddLinkBtn = document.getElementById('confirmAddLinkBtn');

    const commandPaletteOverlay = document.getElementById('commandPaletteOverlay');
    const commandInput = document.getElementById('commandInput');
    const commandList = document.getElementById('commandList');
    const cmdBtn = document.getElementById('cmdBtn');

    // Modals Initialization
    let editModal, deleteModal, clearModal, themeModal, universalPreviewModal, linkModal, routineModal, deleteRoutineModal, statsModal, toast;
    try {
        if (document.getElementById('editModal')) editModal = new bootstrap.Modal(document.getElementById('editModal'));
        if (document.getElementById('deleteModal')) deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
        if (document.getElementById('clearModal')) clearModal = new bootstrap.Modal(document.getElementById('clearModal'));
        if (document.getElementById('themeModal')) themeModal = new bootstrap.Modal(document.getElementById('themeModal'));
        if (document.getElementById('routineModal')) routineModal = new bootstrap.Modal(document.getElementById('routineModal'));
        if (document.getElementById('deleteRoutineModal')) deleteRoutineModal = new bootstrap.Modal(document.getElementById('deleteRoutineModal'));
        if (document.getElementById('linkModal')) linkModal = new bootstrap.Modal(document.getElementById('linkModal'));
        if (document.getElementById('statsModal')) statsModal = new bootstrap.Modal(document.getElementById('statsModal'));
        if (document.getElementById('universalPreviewModal')) universalPreviewModal = new bootstrap.Modal(document.getElementById('universalPreviewModal'));
        if (document.getElementById('liveToast')) toast = new bootstrap.Toast(document.getElementById('liveToast'));
    } catch (e) { console.error("Bootstrap Modals Init Failed", e); }

    // Edit Modal Elements
    const editTaskIdInput = document.getElementById('editTaskId');
    const editTaskTitleInput = document.getElementById('editTaskTitle');
    const editTaskDescInput = document.getElementById('editTaskDesc');
    const editTaskCategory = document.getElementById('editTaskCategory'); 
    const editTaskPriority = document.getElementById('editTaskPriority');
    const editTaskDueDateInput = document.getElementById('editTaskDueDate'); 
    const editIsRecurring = document.getElementById('editIsRecurring');
    const editLinkInput = document.getElementById('editLinkInput');
    const editLinksPreview = document.getElementById('editLinksPreview');
    const editAddLinkBtn = document.getElementById('editAddLinkBtn');
    const saveEditBtn = document.getElementById('saveEditBtn');
    const editFilesPreview = document.getElementById('editFilesPreview');
    const editSubtaskList = document.getElementById('editSubtaskList');
    const addSubtaskBtn = document.getElementById('addSubtaskBtn');
    
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const confirmClearBtn = document.getElementById('confirmClearBtn');
    const previewFileName = document.getElementById('previewFileName');
    const previewDownloadBtn = document.getElementById('previewDownloadBtn');
    const previewOpenBtn = document.getElementById('previewOpenBtn');

    // Routine Elements
    const deployRoutineBtn = document.getElementById('deployRoutineBtn');
    const resetRoutineBtn = document.getElementById('resetRoutineBtn');
    const confirmDeleteRoutineBtn = document.getElementById('confirmDeleteRoutineBtn');
    const deleteRoutineDayInput = document.getElementById('deleteRoutineDay');
    const deleteRoutineIndexInput = document.getElementById('deleteRoutineIndex');
    const addRoutineBtn = document.getElementById('addRoutineBtn');
    const newTimeInput = document.getElementById('newRoutineTime');
    const newTitleInput = document.getElementById('newRoutineTitle');
    const newDescInput = document.getElementById('newRoutineDesc');

    // --- FEATURE: QUICK NOTES ---
    if(quickNotesArea) {
        quickNotesArea.value = localStorage.getItem('quickNotes') || '';
        quickNotesArea.addEventListener('input', () => localStorage.setItem('quickNotes', quickNotesArea.value));
    }
    if(showNotesBtn) showNotesBtn.addEventListener('click', () => { if(quickNotesPanel) quickNotesPanel.classList.add('active'); });
    if(toggleNotesBtn) toggleNotesBtn.addEventListener('click', () => { if(quickNotesPanel) quickNotesPanel.classList.remove('active'); });

    // --- FEATURE: VIEW TOGGLE (LIST/KANBAN) ---
    if(viewListBtn && viewBoardBtn) {
        viewListBtn.addEventListener('click', () => {
            isBoardView = false;
            viewListBtn.classList.add('active'); viewBoardBtn.classList.remove('active');
            if(taskList) taskList.classList.remove('d-none');
            if(kanbanBoard) kanbanBoard.classList.add('d-none');
            if(filterContainer) filterContainer.classList.remove('d-none');
            renderTasks();
        });
        viewBoardBtn.addEventListener('click', () => {
            isBoardView = true;
            viewBoardBtn.classList.add('active'); viewListBtn.classList.remove('active');
            if(taskList) taskList.classList.add('d-none');
            if(kanbanBoard) kanbanBoard.classList.remove('d-none');
            if(filterContainer) filterContainer.classList.add('d-none'); 
            renderTasks();
        });
    }

    // --- FEATURE: STREAK ---
    function updateStreak() {
        if (!streakContainer || !streakCountEl) return;
        let streakData = JSON.parse(localStorage.getItem('streakData')) || { currentStreak: 0, lastDate: null };
        const todayStr = new Date().toDateString();
        const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        if (streakData.lastDate && streakData.lastDate !== todayStr && streakData.lastDate !== yesterdayStr) {
            streakData.currentStreak = 0;
            localStorage.setItem('streakData', JSON.stringify(streakData));
        }
        if (streakData.currentStreak > 0) {
            streakContainer.classList.remove('d-none');
            streakCountEl.innerText = streakData.currentStreak;
        } else {
            streakContainer.classList.add('d-none');
        }
    }
    function incrementStreak() {
        let streakData = JSON.parse(localStorage.getItem('streakData')) || { currentStreak: 0, lastDate: null };
        const todayStr = new Date().toDateString();
        if (streakData.lastDate !== todayStr) {
            streakData.currentStreak++;
            streakData.lastDate = todayStr;
            localStorage.setItem('streakData', JSON.stringify(streakData));
            updateStreak();
            showToast(`🔥 Streak increased! ${streakData.currentStreak} Days`);
        }
    }

    // --- FEATURE: THEME SYSTEM ---
    function startRainbowMode() { 
        if (rainbowTimer) cancelAnimationFrame(rainbowTimer); 
        function loop() { 
            hue = (hue + 1) % 360; 
            const color = `hsl(${hue}, 100%, 60%)`; 
            const gradient = `linear-gradient(135deg, hsl(${hue}, 100%, 70%) 0%, hsl(${(hue + 60) % 360}, 100%, 50%) 100%)`; 
            document.documentElement.style.setProperty('--primary-color', color); 
            const gradientEl = document.querySelector('.text-gradient'); 
            if(gradientEl) gradientEl.style.backgroundImage = gradient; 
            rainbowTimer = requestAnimationFrame(loop); 
        } 
        loop(); 
        localStorage.setItem('themeMode', 'rainbow'); 
    }
    function stopRainbowMode() { 
        if (rainbowTimer) { cancelAnimationFrame(rainbowTimer); rainbowTimer = null; } 
        localStorage.removeItem('themeMode'); 
    }
    function setTheme(color, gradient) { 
        stopRainbowMode(); 
        document.documentElement.style.setProperty('--primary-color', color); 
        const gradientEl = document.querySelector('.text-gradient'); 
        if(gradientEl) gradientEl.style.backgroundImage = gradient; 
        const encodedColor = color.replace('#', '%23'); 
        const cursorSvg = `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 2L11 20L13 11L22 9L2 2Z' fill='${encodedColor}' stroke='%23ffffff' stroke-width='1.5' stroke-linejoin='round'/%3E%3C/svg%3E"), auto`; 
        document.body.style.cursor = cursorSvg; 
        localStorage.setItem('themeColor', color); 
        localStorage.setItem('themeGradient', gradient); 
    }
    
    // Load Saved Theme
    const savedMode = localStorage.getItem('themeMode'); 
    if (savedMode === 'rainbow') startRainbowMode(); 
    else { 
        const savedColor = localStorage.getItem('themeColor'); 
        const savedGradient = localStorage.getItem('themeGradient'); 
        if (savedColor && savedGradient) { 
            setTheme(savedColor, savedGradient); 
            if(customThemeInput) customThemeInput.value = savedColor; 
        } 
    }
    
    // Theme Events
    if(themeLauncherBtn) themeLauncherBtn.addEventListener('click', () => themeModal.show()); 
    if(rainbowModeBtn) rainbowModeBtn.addEventListener('click', () => { startRainbowMode(); themeModal.hide(); });
    document.querySelectorAll('.theme-btn-lg:not(.rainbow-btn)').forEach(btn => { 
        btn.addEventListener('click', () => { 
            setTheme(btn.getAttribute('data-color'), btn.getAttribute('data-gradient')); 
            themeModal.hide(); 
        }); 
    });
    if(customThemeInput) { 
        customThemeInput.addEventListener('input', (e) => { 
            const color = e.target.value; 
            setTheme(color, `linear-gradient(135deg, ${color} 0%, #ffffff 100%)`); 
        }); 
    }

    // --- FEATURE: PROTOCOLS ---
    const defaultRoutineData = { "Monday": [ { time: "09:00", title: "Main Mission", desc: "Focus Work" } ] };
    let routineData = {}; try { routineData = JSON.parse(localStorage.getItem('routineData')) || defaultRoutineData; } catch (e) { routineData = defaultRoutineData; }
    
    function saveRoutineData() { localStorage.setItem('routineData', JSON.stringify(routineData)); }
    function getActiveRoutineDay() { const activeBtn = document.querySelector('#routineTabs .nav-link.active'); return activeBtn ? activeBtn.getAttribute('data-day-full') : "Monday"; }
    
    function renderRoutineModal() { 
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]; 
        const dayLabel = document.getElementById('currentDayName'); 
        if(dayLabel) dayLabel.innerText = days[new Date().getDay() - 1] || "Sunday"; 
        
        const tabsContainer = document.getElementById('routineTabs'); 
        const contentContainer = document.getElementById('routineContent'); 
        const currentActiveDay = getActiveRoutineDay() || "Monday"; 
        
        if(tabsContainer && contentContainer) {
            tabsContainer.innerHTML = ''; 
            contentContainer.innerHTML = ''; 
            days.forEach(day => { 
                const isActive = (day === currentActiveDay) ? 'active' : ''; 
                tabsContainer.innerHTML += `<li class="nav-item"><button class="nav-link ${isActive}" id="tab-${day}" data-bs-toggle="pill" data-bs-target="#content-${day}" data-day-full="${day}" type="button">${day.substring(0,3)}</button></li>`; 
                const tasks = routineData[day] || []; 
                tasks.sort((a, b) => a.time.localeCompare(b.time)); 
                let tasksHtml = tasks.map((t, index) => `<div class="routine-card fade-in-up"><div class="routine-time">${t.time}</div><div class="routine-info"><div class="routine-title">${t.title}</div><div class="routine-desc">${t.desc}</div></div><button class="btn-delete-routine" onclick="deleteRoutine('${day}', ${index})" title="Delete"><i class="bi bi-trash"></i></button></div>`).join(''); 
                if (tasks.length === 0) tasksHtml = `<div class="text-center text-muted py-4 opacity-50">No protocols set for ${day}</div>`; 
                contentContainer.innerHTML += `<div class="tab-pane fade ${isActive ? 'show active' : ''}" id="content-${day}">${tasksHtml}</div>`; 
            }); 
        }
    }
    
    if (routineBtn) routineBtn.addEventListener('click', () => { renderRoutineModal(); routineModal.show(); });
    if (addRoutineBtn) addRoutineBtn.addEventListener('click', () => { 
        const time = newTimeInput.value; const title = newTitleInput.value.trim(); const desc = newDescInput.value.trim(); const activeDay = getActiveRoutineDay(); 
        if (!time || !title) { alert("Time and Title required!"); return; } 
        if (!routineData[activeDay]) routineData[activeDay] = []; 
        routineData[activeDay].push({ time, title, desc }); 
        saveRoutineData(); newTitleInput.value = ''; newDescInput.value = ''; renderRoutineModal(); 
    });
    window.deleteRoutine = function(day, index) { 
        if(deleteRoutineDayInput) deleteRoutineDayInput.value = day; 
        if(deleteRoutineIndexInput) deleteRoutineIndexInput.value = index; 
        if(deleteRoutineModal) deleteRoutineModal.show(); 
    };
    if (confirmDeleteRoutineBtn) confirmDeleteRoutineBtn.addEventListener('click', () => { 
        const day = deleteRoutineDayInput.value; const index = parseInt(deleteRoutineIndexInput.value); 
        if (routineData[day]) { routineData[day].splice(index, 1); saveRoutineData(); renderRoutineModal(); showToast("Protocol removed.", "danger"); } 
        deleteRoutineModal.hide(); 
    });
    if (resetRoutineBtn) resetRoutineBtn.addEventListener('click', () => { 
        if(confirm("Reset protocols?")) { routineData = JSON.parse(JSON.stringify(defaultRoutineData)); saveRoutineData(); renderRoutineModal(); showToast("Protocols reset."); } 
    });
    if (deployRoutineBtn) deployRoutineBtn.addEventListener('click', () => { 
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; 
        const todayName = days[new Date().getDay()]; 
        const todaysTasks = routineData[todayName] || []; 
        if (todaysTasks.length > 0) { 
            let count = 0; 
            todaysTasks.forEach(rt => { 
                const exists = tasks.some(t => t.text === rt.title && !t.completed && new Date(t.createdAt).toDateString() === new Date().toDateString()); 
                if (!exists) { 
                    tasks.unshift({ id: Math.floor(Date.now() * Math.random()), text: rt.title, description: rt.desc ? `${rt.desc} [${rt.time}]` : `[${rt.time}]`, priority: 'Medium', category: 'General', dueDate: '', attachments: [], links: [], completed: false, isPinned: false, isRecurring: false, lastCompletedDate: null, subtasks: [], createdAt: new Date().toISOString() }); 
                    count++; 
                } 
            }); 
            if (count > 0) { saveTasks(); showToast(`${count} protocols initiated!`); routineModal.hide(); renderTasks(); } 
            else { showToast("Tasks already active.", "warning"); } 
        } else { showToast(`No protocols for ${todayName}.`, "warning"); } 
    });

    // --- SMART INPUT ---
    function parseSmartInput(text) {
        let title = text; let priority = null; let targetDate = new Date(); let hasDateSet = false; let tags = [];
        const tagMatches = title.match(/#\w+/g);
        if(tagMatches) { tags = tagMatches.map(t => t.replace('#', '')); tagMatches.forEach(t => title = title.replace(t, '')); }
        
        if (text.match(/!high|!h/i)) { priority = 'High'; title = title.replace(/!high|!h/i, ''); }
        else if (text.match(/!low|!l/i)) { priority = 'Low'; title = title.replace(/!low|!l/i, ''); }
        else if (text.match(/!med|!m/i)) { priority = 'Medium'; title = title.replace(/!med|!m/i, ''); }
        
        const inDaysMatch = title.match(/in\s*(\d+)\s*days?/i);
        if (inDaysMatch) { const days = parseInt(inDaysMatch[1]); targetDate.setDate(targetDate.getDate() + days); title = title.replace(inDaysMatch[0], ''); hasDateSet = true; }
        
        if (title.match(/\btomorrow\b|\btmr\b/i)) { targetDate.setDate(targetDate.getDate() + 1); title = title.replace(/\btomorrow\b|\btmr\b/i, ''); hasDateSet = true; }
        else if (title.match(/\btoday\b/i)) { title = title.replace(/\btoday\b/i, ''); hasDateSet = true; }
        
        const timeMatch = title.match(/\bat\s+(\d{1,2})(:(\d{2}))?\s*(am|pm|AM|PM)?\b/);
        if (timeMatch) {
            let hours = parseInt(timeMatch[1]); const minutes = timeMatch[3] ? parseInt(timeMatch[3]) : 0; const period = timeMatch[4] ? timeMatch[4].toLowerCase() : null;
            if (period === 'pm' && hours < 12) hours += 12; if (period === 'am' && hours === 12) hours = 0;
            targetDate.setHours(hours, minutes, 0, 0); title = title.replace(timeMatch[0], ''); hasDateSet = true; 
        } else if (hasDateSet) { targetDate.setHours(9, 0, 0, 0); }
        
        const finalDate = hasDateSet ? targetDate.getFullYear() + "-" + String(targetDate.getMonth() + 1).padStart(2, '0') + "-" + String(targetDate.getDate()).padStart(2, '0') + " " + String(targetDate.getHours()).padStart(2, '0') + ":" + String(targetDate.getMinutes()).padStart(2, '0') : '';
        return { title: title.replace(/\s+/g, ' ').trim(), priority: priority, date: finalDate, tags: tags };
    }

    // --- CORE: ADD TASK ---
    async function addTask() {
        if (!taskInput) return; 
        const rawText = taskInput.value.trim(); 
        if (rawText === '') { alert('Please enter a task name.'); return; }

        const parsed = parseSmartInput(rawText);
        const text = parsed.title;
        // Priority Fix: Use Smart Input -> Dropdown -> Default
        const priority = parsed.priority || priorityInput.value || 'Medium'; 
        const dueDate = parsed.date || dueDateInput.value;
        const tags = parsed.tags;

        const desc = taskDescInput.value.trim(); 
        const category = categoryInput ? categoryInput.value : 'General';
        const isRecurring = isRecurringInput.checked;
        const files = fileInput ? fileInput.files : [];
        let attachments = []; 
        
        if (files.length > 0) { 
            try { attachments = await readFiles(files); } catch (err) { console.error(err); } 
        }
        
        const newTask = { 
            id: Date.now(), text, description: desc, category, priority, dueDate, attachments, links: [...tempLinks], 
            completed: false, isPinned: false, isRecurring, lastCompletedDate: null, subtasks: [], createdAt: new Date().toISOString(),
            tags: tags
        };
        tasks.unshift(newTask); 
        
        // Reset Inputs
        taskInput.value = ''; taskDescInput.value = ''; isRecurringInput.checked = false; tempLinks = []; renderTempLinks(); 
        if(fileInput) fileInput.value = ''; if(fileLabelText) fileLabelText.innerText = "Files"; if(addFilePreview) addFilePreview.innerHTML = ''; 
        if(fpMain) fpMain.clear(); 
        
        saveTasks(); showToast("Mission deployed!"); taskInput.focus();
    }

    if (addBtn) addBtn.addEventListener('click', addTask); 
    if (taskInput) taskInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTask(); }); 

    // --- CORE: RENDER TASKS ---
    function renderTasks() {
        // Prevent stuck on initializing
        updateStats(); updateStreak();
        
        if(!taskList || !kanbanBoard) return; 
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : ''; 
        const now = new Date();
        let displayTasks = [...tasks];

        displayTasks = displayTasks.filter(task => { 
            const taskText = task.text ? task.text.toLowerCase() : ""; const matchesSearch = taskText.includes(searchTerm); 
            const taskDate = parseDate(task.dueDate); const isOverdue = !task.completed && taskDate && taskDate < now; 
            let matchesFilter = true; 
            if (currentFilter === 'active') matchesFilter = !task.completed; 
            else if (currentFilter === 'completed') matchesFilter = task.completed; 
            else if (currentFilter === 'overdue') matchesFilter = isOverdue; 
            return matchesSearch && matchesFilter; 
        });
        
        displayTasks = sortTasks(displayTasks);

        if(isBoardView) {
            const colTodo = document.getElementById('col-todo'); 
            const colActive = document.getElementById('col-active'); 
            const colDone = document.getElementById('col-done');
            
            if(colTodo && colActive && colDone) {
                colTodo.innerHTML = ''; colActive.innerHTML = ''; colDone.innerHTML = '';
                let countTodo = 0, countActive = 0, countDone = 0;
                
                displayTasks.forEach(task => {
                    const card = createKanbanCard(task);
                    if (task.completed) { colDone.insertAdjacentHTML('beforeend', card); countDone++; }
                    else if (task.priority === 'High' || task.isPinned) { colActive.insertAdjacentHTML('beforeend', card); countActive++; }
                    else { colTodo.insertAdjacentHTML('beforeend', card); countTodo++; }
                });
                
                document.getElementById('count-todo').innerText = countTodo; 
                document.getElementById('count-active').innerText = countActive; 
                document.getElementById('count-done').innerText = countDone;
            }
        } else {
            taskList.innerHTML = ''; 
            if (displayTasks.length === 0) { if(emptyState) emptyState.classList.remove('d-none'); } 
            else { if(emptyState) emptyState.classList.add('d-none'); }
            
            displayTasks.forEach((task, index) => {
                const checked = task.completed ? 'checked' : ''; 
                const completedClass = task.completed ? 'completed' : ''; 
                const priorityClass = `priority-${(task.priority || 'Medium').toLowerCase()}`; 
                let timeDisplay = ''; 
                const createdHtml = `<span class="text-muted" title="Created"><i class="bi bi-clock"></i> ${formatCreatedDate(task.createdAt)}</span>`;
                
                let bossClass = '';
                if(task.dueDate) { 
                    const taskDate = parseDate(task.dueDate); const isOverdue = !task.completed && taskDate && taskDate < now; const timeLeft = taskDate ? (taskDate - now) : 0;
                    if(task.priority === 'High' && !task.completed && timeLeft > 0 && timeLeft < 24 * 60 * 60 * 1000) { bossClass = 'task-boss-fight'; }
                    const dueClass = isOverdue ? 'text-danger fw-bold' : 'text-warning'; const dueIcon = isOverdue ? 'bi-exclamation-circle-fill' : 'bi-calendar-event'; const dueText = isOverdue ? 'OVERDUE' : 'Due'; 
                    timeDisplay = `<span class="${dueClass} me-3"><i class="bi ${dueIcon}"></i> ${dueText}: ${formatDueDate(taskDate)}</span>` + createdHtml; 
                } else { timeDisplay = createdHtml; }
                
                // Tags
                let tagsHtml = '';
                if(task.tags && task.tags.length > 0) {
                    tagsHtml = task.tags.map(tag => `<span class="badge bg-primary bg-opacity-25 text-primary-custom border border-primary border-opacity-25 me-1 rounded-pill" style="font-size: 0.65rem;">#${tag}</span>`).join('');
                }

                // Subtask Progress
                let subtaskHtml = '';
                if(task.subtasks && task.subtasks.length > 0) {
                    const totalSt = task.subtasks.length; const doneSt = task.subtasks.filter(st => st.completed).length; const pct = Math.round((doneSt / totalSt) * 100);
                    subtaskHtml = `<div class="mt-2" style="max-width: 200px;"><div class="d-flex justify-content-between small text-muted mb-1" style="font-size: 0.65rem;"><span>Sub-missions</span><span>${doneSt}/${totalSt}</span></div><div class="progress" style="height: 4px; background: rgba(255,255,255,0.1);"><div class="progress-bar bg-info" role="progressbar" style="width: ${pct}%"></div></div></div>`;
                }

                const recurringIcon = task.isRecurring ? '<i class="bi bi-arrow-repeat text-info ms-2" title="Recurring Daily"></i>' : '';
                const pinClass = task.isPinned ? 'text-warning' : 'text-muted opacity-25'; const pinIcon = task.isPinned ? 'bi-pin-angle-fill' : 'bi-pin-angle'; const pinGlow = task.isPinned ? 'box-shadow: 0 0 15px rgba(251, 191, 36, 0.1); border-color: rgba(251, 191, 36, 0.3);' : '';
                const categoryBadge = task.category ? `<span class="badge bg-secondary bg-opacity-25 text-light border border-secondary border-opacity-25 ms-2 rounded-pill px-2" style="font-size: 0.65rem;">${task.category}</span>` : '';

                const html = `
                    <div class="task-item ${priorityClass} ${completedClass} ${bossClass} fade-in-up" data-id="${task.id}" style="animation-delay: ${index * 0.05}s; ${pinGlow}">
                        <div class="task-header">
                            <div class="d-flex align-items-center gap-3" style="width:100%">
                                <div class="drag-handle text-muted opacity-25" style="cursor: grab;"><i class="bi bi-grip-vertical"></i></div>
                                <div class="form-check"><input class="form-check-input sound-click" type="checkbox" ${checked} data-action="toggle" data-id="${task.id}"></div>
                                <div class="d-flex flex-column" style="flex:1">
                                    <span class="task-title fw-medium fs-5 text-break">${task.text || '(No Title)'} ${recurringIcon} ${categoryBadge} ${tagsHtml}</span>
                                    <div class="d-flex flex-wrap align-items-center gap-2 mt-1">${getPriorityBadge(task.priority)}<small style="font-size: 0.75rem;">${timeDisplay}</small></div>
                                    ${subtaskHtml}
                                </div>
                            </div>
                            <div class="d-flex gap-2 ms-3 align-items-center">
                                <button class="btn btn-sm btn-dark bg-transparent border-0 text-primary-custom sound-click" data-action="zen" data-id="${task.id}" title="Enter Zen Mode"><i class="bi bi-crosshair"></i></button>
                                <button class="btn btn-sm btn-dark bg-transparent border-0 ${pinClass} sound-click" data-action="pin" data-id="${task.id}" title="Pin Mission"><i class="bi ${pinIcon} fs-5"></i></button>
                                <button class="btn btn-sm btn-dark bg-transparent border-0 text-info sound-click" data-action="edit" data-id="${task.id}"><i class="bi bi-pencil-square fs-5"></i></button>
                                <button class="btn btn-sm btn-dark bg-transparent border-0 text-danger sound-click" data-action="delete" data-id="${task.id}"><i class="bi bi-trash fs-5"></i></button>
                            </div>
                        </div>
                    </div>`;
                taskList.insertAdjacentHTML('beforeend', html);
            });
        }
        
        // Re-init Sortable after render
        try { initSortable(); } catch(e){}
    }

    // --- FLATPICKR INIT (SAFE) ---
    let fpMain, fpEdit;
    try {
        if(window.flatpickr) {
            fpMain = flatpickr("#dueDateInput", { enableTime: true, dateFormat: "Y-m-d H:i", altInput: true, altFormat: "F j, H:i", time_24hr: true, disableMobile: "true", placeholder: "Select Deadline..." });
            fpEdit = flatpickr("#editTaskDueDate", { enableTime: true, dateFormat: "Y-m-d H:i", altInput: true, altFormat: "F j, H:i", time_24hr: true, disableMobile: "true", placeholder: "No Deadline" });
        }
    } catch(e) { console.error("Flatpickr Failed", e); }

    // --- OTHER EVENT LISTENERS ---
    if (searchInput) searchInput.addEventListener('input', renderTasks); 
    if (sortInput) sortInput.addEventListener('change', renderTasks); 
    if (filterTabs) filterTabs.addEventListener('click', (e) => { 
        if (e.target.classList.contains('nav-link')) { 
            document.querySelectorAll('.nav-link').forEach(btn => btn.classList.remove('active')); e.target.classList.add('active'); currentFilter = e.target.dataset.filter; renderTasks(); 
        } 
    });
    if (selectAllBtn) selectAllBtn.addEventListener('click', () => { const hasUncompleted = tasks.some(t => !t.completed); tasks.forEach(t => { t.completed = hasUncompleted; }); saveTasks(); showToast("All systems updated."); }); 
    if (saveEditBtn) saveEditBtn.addEventListener('click', saveEdit); 
    
    // Delegation for Task Actions
    const handleTaskClick = (e) => {
        const target = e.target.closest('[data-action]'); if (!target) return; 
        const action = target.dataset.action; const id = Number(target.dataset.id); 
        if (action === 'toggle') toggleTask(id); if (action === 'delete') openDeleteModal(id); if (action === 'edit') openEditModal(id); if (action === 'pin') togglePin(id); if (action === 'zen') enterTaskZenMode(id);
    };
    if (taskList) taskList.addEventListener('click', handleTaskClick);
    if (kanbanBoard) kanbanBoard.addEventListener('click', handleTaskClick);

    // Initial Render
    try { renderTasks(); } catch(e){ console.error("Render failed", e); }

    // Helper functions (Hoisted or defined here for safety)
    function toggleTask(id) { 
        const task = tasks.find(t => t.id === id); 
        if (task) { 
            task.completed = !task.completed; 
            if(task.completed) { 
                task.lastCompletedDate = new Date().toDateString(); 
                try { confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } }); } catch(e){}
                incrementStreak();
            }
            saveTasks(); 
        } 
    }
    function togglePin(id) { const task = tasks.find(t => t.id === id); if (task) { task.isPinned = !task.isPinned; saveTasks(); showToast(task.isPinned ? "Mission Pinned" : "Mission Unpinned"); } }
    function openDeleteModal(id) { deleteTargetId = id; deleteModal.show(); }
    function openEditModal(id) { 
        const task = tasks.find(t => t.id === id); 
        if (task) { 
            editTaskIdInput.value = task.id; editTaskTitleInput.value = task.text; editTaskDescInput.value = task.description || ''; 
            if(editTaskCategory) editTaskCategory.value = task.category || 'General'; 
            if(editTaskPriority) editTaskPriority.value = task.priority || 'Medium';
            editIsRecurring.checked = task.isRecurring || false;
            // Links & Subtasks logic omitted for brevity but ensure they are cloned
            currentEditSubtasks = task.subtasks ? JSON.parse(JSON.stringify(task.subtasks)) : [];
            currentEditLinks = task.links ? JSON.parse(JSON.stringify(task.links)) : [];
            renderEditSubtasks(); renderEditLinks();
            if (task.dueDate && fpEdit) fpEdit.setDate(task.dueDate); else if(fpEdit) fpEdit.clear(); 
            let filesHtml = ''; if (task.attachments) filesHtml = generateFilePreviewHtml(task.attachments); 
            if(editFilesPreview) editFilesPreview.innerHTML = filesHtml ? `<div class="attachment-grid">${filesHtml}</div>` : '<span class="text-muted small">No files</span>'; 
            editModal.show(); 
        } 
    }
    function saveEdit() { 
        const id = parseInt(editTaskIdInput.value); const task = tasks.find(t => t.id === id); 
        if (task) { 
            task.text = editTaskTitleInput.value.trim(); task.description = editTaskDescInput.value.trim(); task.category = editTaskCategory.value;
            task.priority = editTaskPriority.value; task.dueDate = editTaskDueDateInput.value; task.isRecurring = editIsRecurring.checked; 
            task.subtasks = JSON.parse(JSON.stringify(currentEditSubtasks)); task.links = JSON.parse(JSON.stringify(currentEditLinks)); 
            saveTasks(); editModal.hide(); showToast("Mission updated."); 
        } 
    }
    function saveTasks() { try { localStorage.setItem('tasks', JSON.stringify(tasks)); } catch (e) { alert("Storage Limit Reached!"); } renderTasks(); }
    function sortTasks(tasksArr) {
        const criteria = sortInput ? sortInput.value : 'newest';
        let pinned = tasksArr.filter(t => t.isPinned); let unpinned = tasksArr.filter(t => !t.isPinned);
        if (criteria !== 'manual') {
            const sortFn = (a, b) => {
                let comparison = 0;
                if (criteria === 'newest') { comparison = new Date(a.createdAt || 0) - new Date(b.createdAt || 0); } 
                else if (criteria === 'priority') { const map = { 'High': 3, 'Medium': 2, 'Low': 1 }; comparison = map[a.priority || 'Medium'] - map[b.priority || 'Medium']; } 
                else if (criteria === 'date') { const dA = a.dueDate ? parseDate(a.dueDate) : null; const dB = b.dueDate ? parseDate(b.dueDate) : null; if (!dA && !dB) comparison = 0; else if (!dA) comparison = -1; else if (!dB) comparison = 1; else comparison = dA - dB; }
                return sortAscending ? comparison : -comparison;
            };
            pinned.sort(sortFn); unpinned.sort(sortFn);
        }
        return [...pinned, ...unpinned];
    }
    
    // Remaining Helpers...
    function parseDate(dateStr) { if (!dateStr) return null; return new Date(dateStr.replace(" ", "T")); }
    function getPriorityBadge(priority) { 
        switch(priority) { 
            case 'High': return '<span class="badge rounded-pill bg-danger bg-opacity-25 text-danger border border-danger border-opacity-25"><i class="bi bi-arrow-up-circle-fill me-1"></i>HIGH</span>'; 
            case 'Medium': return '<span class="badge rounded-pill bg-warning bg-opacity-25 text-warning border border-warning border-opacity-25"><i class="bi bi-dash-circle-fill me-1"></i>MED</span>'; 
            case 'Low': return '<span class="badge rounded-pill bg-success bg-opacity-25 text-success border border-success border-opacity-25"><i class="bi bi-arrow-down-circle-fill me-1"></i>LOW</span>'; 
            default: return ''; 
        } 
    }
    function formatCreatedDate(dateString) { if (!dateString) return '-'; return new Date(dateString).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); }
    function formatDueDate(dateObj) { if (!dateObj) return null; return dateObj.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); }
    function generateFilePreviewHtml(attachments) { if (!attachments || attachments.length === 0) return ''; let html = ''; attachments.forEach(file => { if (file.type.startsWith('image/')) { html += `<img src="${file.data}" class="attachment-thumb" onclick="viewFile('${file.data}', '${file.type}', '${file.name}')" title="${file.name}">`; } else { html += `<a href="${file.data}" download="${file.name}" class="attachment-chip"><i class="bi bi-file-earmark-text"></i> <span>${file.name}</span></a>`; } }); return html; }
    function createKanbanCard(task) {
        const priorityClass = `priority-${(task.priority || 'Medium').toLowerCase()}`;
        return `<div class="task-item ${priorityClass}" data-id="${task.id}" style="cursor: grab;"><div class="d-flex justify-content-between align-items-start"><span class="fw-medium text-break" style="font-size: 0.9rem;">${task.text}</span><button class="btn btn-sm text-muted p-0" data-action="edit" data-id="${task.id}"><i class="bi bi-pencil-square"></i></button></div><div class="mt-2 d-flex justify-content-between align-items-center">${getPriorityBadge(task.priority)}<small class="text-muted" style="font-size: 0.7rem;">${task.category || 'General'}</small></div></div>`;
    }
    function updateStats() {
        if (!taskStats) return;
        const total = tasks.length; const completed = tasks.filter(t => t.completed).length; const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        taskStats.innerHTML = `<div class="stats-hud-container d-flex align-items-center gap-3"><div class="stat-block"><i class="bi bi-activity text-primary-custom me-1"></i><span class="stat-label">TOTAL</span><span class="stat-value text-primary-custom">${total}</span></div><div class="stat-divider"></div><div class="stat-progress-wrapper"><div class="stat-progress-bar" style="width: ${percentage}%"></div><span class="stat-percentage">${percentage}% SYNCED</span></div><div class="stat-divider"></div><div class="stat-block"><i class="bi bi-shield-check text-primary-custom me-1"></i><span class="stat-label">SECURED</span><span class="stat-value text-primary-custom">${completed}</span></div></div>`;
        if (clearCompletedBtn) { if (completed > 0) clearCompletedBtn.classList.remove('d-none'); else clearCompletedBtn.classList.add('d-none'); }
    }
    // Update Clock
    function updateClock() { const now = new Date(); clockEl.innerText = now.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }); const hour = now.getHours(); let greeting = "Welcome back"; if (hour === 0) greeting = "It's Midnight"; else if (hour >= 1 && hour < 4) greeting = "Burning the Oil"; else if (hour >= 4 && hour < 6) greeting = "Early Dawn"; else if (hour >= 6 && hour < 12) greeting = "Good Morning"; else if (hour >= 12 && hour < 17) greeting = "Good Afternoon"; else if (hour >= 17 && hour < 22) greeting = "Good Evening"; else greeting = "Silent Night"; greetingEl.innerHTML = `${greeting}, <span class="text-primary-custom fw-bold">Commander</span>`; }
    updateClock(); setInterval(updateClock, 1000);
    function showToast(message, type = 'success') { if(!toast) return; document.getElementById('toastMessage').innerText = message; document.getElementById('toastIcon').className = type === 'success' ? 'bi bi-check-circle-fill' : 'bi bi-trash-fill text-danger'; document.getElementById('toastIcon').style.color = type === 'success' ? "var(--primary-color)" : ""; toast.show(); }
    
    // Sortable Helpers
    function initSortable() {
        if (typeof Sortable === 'undefined') return;
        if (sortableList) { sortableList.destroy(); sortableList = null; }
        if (sortableTodo) { sortableTodo.destroy(); sortableTodo = null; }
        if (sortableActive) { sortableActive.destroy(); sortableActive = null; }
        if (sortableDone) { sortableDone.destroy(); sortableDone = null; }

        if (isBoardView) {
            const cols = ['col-todo', 'col-active', 'col-done'];
            const sortables = [];
            cols.forEach(id => {
                const el = document.getElementById(id);
                if(el) {
                    sortables.push(new Sortable(el, { 
                        group: 'kanban', animation: 200, delay: 0, forceFallback: true, fallbackClass: "sortable-drag",
                        onEnd: function(evt) {
                            const itemEl = evt.item; if(!itemEl) return;
                            const idBtn = itemEl.getAttribute('data-id'); if(!idBtn) return;
                            const id = Number(idBtn);
                            const task = tasks.find(t => t.id === id);
                            const newStatus = evt.to.getAttribute('data-status'); 
                            if(task) {
                                if(newStatus === 'done') { task.completed = true; try { confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } }); } catch(e){} incrementStreak(); } 
                                else { task.completed = false; }
                                saveTasks();
                            }
                        }
                    }));
                }
            });
            [sortableTodo, sortableActive, sortableDone] = sortables;
        } else {
            const el = document.getElementById('taskList');
            if (el) {
                sortableList = new Sortable(el, { 
                    animation: 200, handle: '.drag-handle', ghostClass: 'sortable-ghost', dragClass: 'sortable-drag', delay: 0, forceFallback: true, fallbackClass: "sortable-drag",
                    onEnd: function (evt) {
                        const newOrderIds = Array.from(el.children).map(child => Number(child.getAttribute('data-id'))).filter(id => id);
                        const sortedVisibleTasks = [];
                        newOrderIds.forEach(id => { const t = tasks.find(x => x.id === id); if(t) sortedVisibleTasks.push(t); });
                        const hiddenTasks = tasks.filter(t => !newOrderIds.includes(t.id));
                        tasks = [...sortedVisibleTasks, ...hiddenTasks];
                        saveTasks();
                    }
                });
            }
        }
    }
    
    // Command Palette Logic
    const commands = [
        { name: "New Task", action: () => { taskInput.focus(); } },
        { name: "Global Focus Mode", action: () => focusModeBtn.click() },
        { name: "View Statistics", action: () => statsBtn.click() },
        { name: "Change Theme", action: () => themeLauncherBtn.click() },
        { name: "View Protocols", action: () => document.getElementById('routineBtn').click() },
        { name: "Toggle Board View", action: () => viewBoardBtn.click() },
        { name: "Toggle List View", action: () => viewListBtn.click() },
        { name: "Quick Notes", action: () => showNotesBtn.click() },
        { name: "Clear Completed", action: () => { if(!clearCompletedBtn.classList.contains('d-none')) clearCompletedBtn.click(); } },
        { name: "Toggle Music", action: () => musicBtn.click() }
    ];
    function toggleCommandPalette() {
        if(commandPaletteOverlay.classList.contains('d-none')) { commandPaletteOverlay.classList.remove('d-none'); commandInput.value = ''; renderCommands(commands); setTimeout(() => commandInput.focus(), 50); } else { commandPaletteOverlay.classList.add('d-none'); }
    }
    function renderCommands(cmdList) {
        commandList.innerHTML = '';
        cmdList.forEach(cmd => {
            const div = document.createElement('div'); div.className = 'command-item'; div.innerHTML = `<i class="bi bi-terminal me-2 text-primary-custom"></i>${cmd.name}`;
            div.addEventListener('click', () => { cmd.action(); commandPaletteOverlay.classList.add('d-none'); }); commandList.appendChild(div);
        });
    }
    if(commandInput) {
        commandInput.addEventListener('input', (e) => { const val = e.target.value.toLowerCase(); const filtered = commands.filter(c => c.name.toLowerCase().includes(val)); renderCommands(filtered); });
        commandInput.addEventListener('keydown', (e) => { if(e.key === 'Enter') { const first = commandList.firstElementChild; if(first) first.click(); } });
    }
    if(cmdBtn) cmdBtn.addEventListener('click', toggleCommandPalette);
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K' || e.code === 'KeyK')) { e.preventDefault(); toggleCommandPalette(); }
        if (e.key === 'Escape' && !commandPaletteOverlay.classList.contains('d-none')) { toggleCommandPalette(); }
    });

    // File Reading
    async function readFiles(fileList) { const promises = Array.from(fileList).map(file => { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve({ name: file.name, type: file.type, data: reader.result }); reader.onerror = reject; reader.readAsDataURL(file); }); }); return Promise.all(promises); }
    if(fileInput) fileInput.addEventListener('change', async () => { if (fileInput.files.length > 0) { if(fileLabelText) fileLabelText.innerText = `${fileInput.files.length} Files`; const attachments = await readFiles(fileInput.files); if(addFilePreview) addFilePreview.innerHTML = generateFilePreviewHtml(attachments); } else { if(fileLabelText) fileLabelText.innerText = "Files"; if(addFilePreview) addFilePreview.innerHTML = ''; } });

    // Link Logic
    if(openLinkModalBtn) openLinkModalBtn.addEventListener('click', () => linkModal.show());
    if(confirmAddLinkBtn) confirmAddLinkBtn.addEventListener('click', () => { const url = modalLinkInput.value.trim(); if(url) { tempLinks.push(url); renderTempLinks(); modalLinkInput.value = ''; linkModal.hide(); showToast("Link attached"); } });
    function renderTempLinks() { tempLinkPreview.innerHTML = ''; tempLinks.forEach((link, index) => { const html = `<div class="attachment-chip"><i class="bi bi-link-45deg"></i><span style="max-width: 150px; overflow: hidden; text-overflow: ellipsis;">${link}</span><i class="bi bi-x-circle text-danger ms-2 cursor-pointer" onclick="removeTempLink(${index})"></i></div>`; tempLinkPreview.insertAdjacentHTML('beforeend', html); }); }
    window.removeTempLink = function(index) { tempLinks.splice(index, 1); renderTempLinks(); };

    // Subtask Logic
    if(addSubtaskBtn) addSubtaskBtn.addEventListener('click', () => { currentEditSubtasks.push({ text: "New Sub-mission", completed: false }); renderEditSubtasks(); });
    window.toggleEditSubtask = function(index) { currentEditSubtasks[index].completed = !currentEditSubtasks[index].completed; renderEditSubtasks(); };
    window.updateEditSubtaskText = function(index, val) { currentEditSubtasks[index].text = val; };
    window.deleteEditSubtask = function(index) { currentEditSubtasks.splice(index, 1); renderEditSubtasks(); };
    window.deleteEditLink = function(index) { currentEditLinks.splice(index, 1); renderEditLinks(); };
    function renderEditSubtasks() { editSubtaskList.innerHTML = ''; currentEditSubtasks.forEach((st, index) => { const html = `<div class="input-group input-group-sm"><div class="input-group-text bg-transparent border-secondary border-opacity-25"><input class="form-check-input mt-0" type="checkbox" ${st.completed ? 'checked' : ''} onchange="toggleEditSubtask(${index})"></div><input type="text" class="form-control custom-input border-start-0" value="${st.text}" onchange="updateEditSubtaskText(${index}, this.value)"><button class="btn btn-outline-danger border-secondary border-opacity-25" type="button" onclick="deleteEditSubtask(${index})"><i class="bi bi-x"></i></button></div>`; editSubtaskList.insertAdjacentHTML('beforeend', html); }); }
    function renderEditLinks() { editLinksPreview.innerHTML = ''; currentEditLinks.forEach((link, index) => { const html = `<div class="attachment-chip"><i class="bi bi-link-45deg"></i> <a href="${link}" target="_blank" class="text-white text-decoration-none me-2" style="max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${link}</a> <i class="bi bi-x-circle text-danger cursor-pointer" onclick="deleteEditLink(${index})"></i></div>`; editLinksPreview.insertAdjacentHTML('beforeend', html); }); }
    if(editAddLinkBtn && editLinkInput) { editAddLinkBtn.addEventListener('click', () => { if(editLinkInput.value.trim()) { currentEditLinks.push(editLinkInput.value.trim()); editLinkInput.value = ''; renderEditLinks(); } }); }

});