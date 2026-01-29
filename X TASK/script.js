// ==========================================
// 1. YOUTUBE API HANDLING
// ==========================================
let player;
let currentVolume = 50;
const stationIDs = [
    "4xDzrJKXOOY", // Neon (index 0)
    "jfKfPfyJRdk", // Lofi (index 1)
    "x0hbDv_Y63c"  // Anime (index 2)
];

function initYouTubePlayer() {
    if(document.getElementById('youtube-player')) {
        if (player && typeof player.destroy === 'function') return; 
        player = new YT.Player('youtube-player', {
            height: '100%',
            width: '100%',
            videoId: stationIDs[0],
            playerVars: { 
                'autoplay': 0, 
                'controls': 0, 
                'showinfo': 0, 
                'rel': 0, 
                'fs': 0 
            },
            events: { 'onReady': onPlayerReady }
        });
    }
}

window.onYouTubeIframeAPIReady = function() { initYouTubePlayer(); };

function onPlayerReady(event) {
    const volSlider = document.getElementById('volumeSlider');
    if(volSlider) volSlider.value = 50;
    if(event.target) event.target.setVolume(50);
}

// ==========================================
// 2. MAIN APP LOGIC
// ==========================================
document.addEventListener('DOMContentLoaded', () => {

    // --- 🔧 FIX: KILL TOOLTIPS (ปิดแถบดำเด้งๆ) ---
    try {
        // ลบ title attributes ที่ทำให้เกิด tooltip
        document.querySelectorAll('[title], [data-bs-toggle="tooltip"]').forEach(el => {
            el.removeAttribute('title');
            el.removeAttribute('data-bs-toggle');
            el.removeAttribute('data-bs-original-title');
        });
    } catch(e) { console.log("Tooltip cleanup error", e); }

    if (window.YT && window.YT.Player && typeof player === 'undefined') {
        initYouTubePlayer();
    }

    let tasks = [];
    try { 
        tasks = JSON.parse(localStorage.getItem('tasks')) || []; 
    } catch (e) { 
        console.error("Data error", e); 
        tasks = []; 
    }
    
    let currentFilter = 'all';
    let sortAscending = false; 
    let deleteTargetId = null;
    let rainbowTimer = null;
    let hue = 0;

    const taskInput = document.getElementById('taskInput');
    const taskDescInput = document.getElementById('taskDescInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const fileInput = document.getElementById('fileInput'); 
    const addFilePreview = document.getElementById('addFilePreview');
    const fileLabelText = document.getElementById('fileLabelText');
    const priorityInput = document.getElementById('priorityInput');
    const sortInput = document.getElementById('sortInput');
    const addBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const searchInput = document.getElementById('searchInput');
    const filterTabs = document.getElementById('filterTabs');
    const taskStats = document.getElementById('taskStats');
    const emptyState = document.getElementById('emptyState');
    const greetingEl = document.getElementById('greeting');
    const clockEl = document.getElementById('currentClock');
    const themeLauncherBtn = document.getElementById('themeLauncherBtn');
    const customThemeInput = document.getElementById('customThemeInput');
    const rainbowModeBtn = document.getElementById('rainbowModeBtn');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');
    const selectAllBtn = document.getElementById('selectAllBtn'); 
    const importBtn = document.getElementById('importBtn');
    const exportBtn = document.getElementById('exportBtn');
    const importFileInput = document.getElementById('importFileInput');
    const musicBtn = document.getElementById('musicBtn');
    const miniPlayer = document.getElementById('miniPlayer');
    const volumeSlider = document.getElementById('volumeSlider');
    
    let editModal, deleteModal, clearModal, themeModal, universalPreviewModal, toast;
    
    try {
        if (document.getElementById('editModal')) editModal = new bootstrap.Modal(document.getElementById('editModal'));
        if (document.getElementById('deleteModal')) deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
        if (document.getElementById('clearModal')) clearModal = new bootstrap.Modal(document.getElementById('clearModal'));
        if (document.getElementById('themeModal')) themeModal = new bootstrap.Modal(document.getElementById('themeModal'));
        if (document.getElementById('universalPreviewModal')) universalPreviewModal = new bootstrap.Modal(document.getElementById('universalPreviewModal'));
        
        // Disable Bootstrap Tooltip Initialization
        // const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        // [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

        if (document.getElementById('liveToast')) toast = new bootstrap.Toast(document.getElementById('liveToast'));
    } catch (e) { console.error("BS Init Error:", e); }

    const editTaskIdInput = document.getElementById('editTaskId');
    const editTaskTitleInput = document.getElementById('editTaskTitle');
    const editTaskDescInput = document.getElementById('editTaskDesc');
    const editTaskDueDateInput = document.getElementById('editTaskDueDate'); 
    const saveEditBtn = document.getElementById('saveEditBtn');
    const editFilesPreview = document.getElementById('editFilesPreview');
    
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const confirmClearBtn = document.getElementById('confirmClearBtn');
    
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');
    
    const universalPreviewBody = document.getElementById('universalPreviewBody');
    const previewFileName = document.getElementById('previewFileName');
    const previewDownloadBtn = document.getElementById('previewDownloadBtn');
    const previewOpenBtn = document.getElementById('previewOpenBtn');

    // ==========================================
    // 3. ROUTINE SYSTEM
    // ==========================================
    const defaultRoutineData = {
        "Monday": [ { time: "09:00", title: "Main Mission", desc: "Focus on core work / Coding" }, { time: "18:00", title: "Recharge", desc: "Dinner & Rest" }, { time: "20:00", title: "Side Project", desc: "X TASK Development" }, { time: "22:00", title: "Gaming", desc: "Valorant / Anime" } ],
        "Tuesday": [ { time: "09:00", title: "Main Mission", desc: "Work" }, { time: "20:00", title: "Learning", desc: "Study New Tech Stack" } ],
        "Wednesday": [ { time: "09:00", title: "Main Mission", desc: "Work" }, { time: "20:00", title: "Coding", desc: "Refactor Code" }, { time: "22:00", title: "Movie", desc: "Netflix Night" } ],
        "Thursday": [ { time: "09:00", title: "Main Mission", desc: "Work" }, { time: "20:00", title: "Gaming", desc: "Ranked Match" } ],
        "Friday": [ { time: "09:00", title: "Wrap Up", desc: "Clear Weekly Tasks" }, { time: "19:00", title: "Freedom", desc: "Party / Chill" } ],
        "Saturday": [ { time: "11:00", title: "Maintenance", desc: "Room Cleaning / Laundry" }, { time: "14:00", title: "Relax", desc: "Reading / Hobby" }, { time: "20:00", title: "Free Time", desc: "Anything goes" } ],
        "Sunday": [ { time: "11:00", title: "Slow Start", desc: "Coffee" }, { time: "15:00", title: "Creative", desc: "Design / Ideas" }, { time: "20:00", title: "Weekly Plan", desc: "Prepare for Monday" } ]
    };

    let routineData = {};
    try {
        const savedRoutines = localStorage.getItem('routineData');
        routineData = savedRoutines ? JSON.parse(savedRoutines) : JSON.parse(JSON.stringify(defaultRoutineData));
    } catch (e) { routineData = JSON.parse(JSON.stringify(defaultRoutineData)); }

    const routineBtn = document.getElementById('routineBtn');
    const deployRoutineBtn = document.getElementById('deployRoutineBtn');
    const resetRoutineBtn = document.getElementById('resetRoutineBtn');
    const routineModalEl = document.getElementById('routineModal');
    let routineModal;
    if (routineModalEl) routineModal = new bootstrap.Modal(routineModalEl);

    const deleteRoutineModalEl = document.getElementById('deleteRoutineModal');
    let deleteRoutineModal;
    if (deleteRoutineModalEl) deleteRoutineModal = new bootstrap.Modal(deleteRoutineModalEl);
    const confirmDeleteRoutineBtn = document.getElementById('confirmDeleteRoutineBtn');
    const deleteRoutineDayInput = document.getElementById('deleteRoutineDay');
    const deleteRoutineIndexInput = document.getElementById('deleteRoutineIndex');

    const addRoutineBtn = document.getElementById('addRoutineBtn');
    const newTimeInput = document.getElementById('newRoutineTime');
    const newTitleInput = document.getElementById('newRoutineTitle');
    const newDescInput = document.getElementById('newRoutineDesc');

    function saveRoutineData() { localStorage.setItem('routineData', JSON.stringify(routineData)); }
    function getActiveRoutineDay() { const activeBtn = document.querySelector('#routineTabs .nav-link.active'); return activeBtn ? activeBtn.getAttribute('data-day-full') : "Monday"; }

    function renderRoutineModal() {
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        const jsDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const todayName = jsDays[new Date().getDay()];
        
        const dayLabel = document.getElementById('currentDayName');
        if(dayLabel) dayLabel.innerText = todayName;

        const tabsContainer = document.getElementById('routineTabs');
        const contentContainer = document.getElementById('routineContent');
        const currentActiveDay = getActiveRoutineDay() || todayName;

        tabsContainer.innerHTML = ''; 
        contentContainer.innerHTML = '';

        days.forEach(day => {
            const isActive = (day === currentActiveDay) ? 'active' : '';
            tabsContainer.innerHTML += `
                <li class="nav-item">
                    <button class="nav-link ${isActive}" id="tab-${day}" data-bs-toggle="pill" data-bs-target="#content-${day}" data-day-full="${day}" type="button">
                        ${day.substring(0,3)}
                    </button>
                </li>`;
            
            const tasks = routineData[day] || [];
            tasks.sort((a, b) => a.time.localeCompare(b.time));
            
            let tasksHtml = tasks.map((t, index) => `
                <div class="routine-card fade-in-up">
                    <div class="routine-time">${t.time}</div>
                    <div class="routine-info">
                        <div class="routine-title">${t.title}</div>
                        <div class="routine-desc">${t.desc}</div>
                    </div>
                    <button class="btn-delete-routine" onclick="deleteRoutine('${day}', ${index})" title="Delete">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>`).join('');
            
            if (tasks.length === 0) tasksHtml = `<div class="text-center text-muted py-4 opacity-50">No protocols set for ${day}</div>`;
            contentContainer.innerHTML += `<div class="tab-pane fade ${isActive ? 'show active' : ''}" id="content-${day}">${tasksHtml}</div>`;
        });
    }

    if (routineBtn) {
        routineBtn.addEventListener('click', () => { renderRoutineModal(); routineModal.show(); });
    }

    if (addRoutineBtn) {
        addRoutineBtn.addEventListener('click', () => {
            const time = newTimeInput.value; 
            const title = newTitleInput.value.trim(); 
            const desc = newDescInput.value.trim(); 
            const activeDay = getActiveRoutineDay();
            
            if (!time || !title) { alert("Time and Title are required!"); return; }
            if (!routineData[activeDay]) routineData[activeDay] = [];
            
            routineData[activeDay].push({ time, title, desc });
            saveRoutineData(); 
            newTitleInput.value = ''; newDescInput.value = '';
            renderRoutineModal();
        });
    }

    window.deleteRoutine = function(day, index) {
        if (deleteRoutineDayInput) deleteRoutineDayInput.value = day;
        if (deleteRoutineIndexInput) deleteRoutineIndexInput.value = index;
        if (deleteRoutineModal) deleteRoutineModal.show();
    };

    if (confirmDeleteRoutineBtn) {
        confirmDeleteRoutineBtn.addEventListener('click', () => {
            const day = deleteRoutineDayInput.value; 
            const index = parseInt(deleteRoutineIndexInput.value);
            if (routineData[day]) {
                routineData[day].splice(index, 1);
                saveRoutineData(); 
                renderRoutineModal(); 
                showToast("Protocol removed.", "danger");
            }
            deleteRoutineModal.hide();
        });
    }

    if (resetRoutineBtn) {
        resetRoutineBtn.addEventListener('click', () => {
            if(confirm("Reset all protocols to factory default?")) {
                routineData = JSON.parse(JSON.stringify(defaultRoutineData));
                saveRoutineData(); 
                renderRoutineModal(); 
                showToast("Protocols reset.");
            }
        });
    }

    if (deployRoutineBtn) {
        deployRoutineBtn.addEventListener('click', () => {
            const jsDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const todayName = jsDays[new Date().getDay()];
            const todaysTasks = routineData[todayName] || [];
            
            if (todaysTasks.length > 0) {
                let count = 0;
                todaysTasks.forEach(rt => {
                    const exists = tasks.some(t => t.text === rt.title && !t.completed && new Date(t.createdAt).toDateString() === new Date().toDateString());
                    if (!exists) {
                        const newTask = { 
                            id: Math.floor(Date.now() * Math.random()), 
                            text: rt.title, 
                            description: rt.desc ? `${rt.desc} [${rt.time}]` : `[${rt.time}]`, 
                            priority: 'Medium', 
                            dueDate: '', 
                            attachments: [], 
                            completed: false, 
                            createdAt: new Date().toISOString() 
                        };
                        tasks.unshift(newTask); 
                        count++;
                    }
                });
                if (count > 0) { 
                    saveTasks(); 
                    showToast(`${count} protocols initiated!`); 
                    routineModal.hide(); 
                    renderTasks(); 
                } else { 
                    showToast("Tasks already active.", "warning"); 
                }
            } else { 
                showToast(`No protocols for ${todayName}.`, "warning"); 
            }
        });
    }

    // ==========================================
    // 4. UTILS & HELPERS
    // ==========================================
    const fpMain = flatpickr("#dueDateInput", { enableTime: true, dateFormat: "Y-m-d H:i", altInput: true, altFormat: "F j, H:i", time_24hr: true, disableMobile: "true", placeholder: "Select Deadline..." });
    const fpEdit = flatpickr("#editTaskDueDate", { enableTime: true, dateFormat: "Y-m-d H:i", altInput: true, altFormat: "F j, H:i", time_24hr: true, disableMobile: "true", placeholder: "No Deadline" });
    const fpRoutine = flatpickr("#newRoutineTime", { enableTime: true, noCalendar: true, dateFormat: "H:i", time_24hr: true, disableMobile: "true", minuteIncrement: 15 });

    if(musicBtn) { musicBtn.addEventListener('click', () => { if(miniPlayer) miniPlayer.classList.toggle('d-none'); }); }
    window.togglePlayer = function() { if(miniPlayer) miniPlayer.classList.toggle('d-none'); };
    window.playStation = function(index) {
        if(player && player.loadVideoById) { player.loadVideoById(stationIDs[index]); player.setVolume(currentVolume); }
        document.querySelectorAll('.station-btn').forEach((btn, i) => { if (i === index) btn.classList.add('active'); else btn.classList.remove('active'); });
    };
    if(volumeSlider) { volumeSlider.addEventListener('input', (e) => { currentVolume = e.target.value; if(player && player.setVolume) player.setVolume(currentVolume); }); }

    function dataURItoBlob(dataURI) {
        try { const byteString = atob(dataURI.split(',')[1]); const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]; const ab = new ArrayBuffer(byteString.length); const ia = new Uint8Array(ab); for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i); return new Blob([ab], {type: mimeString}); } catch (e) { return null; }
    }
    
    window.viewFile = function(data, type, name) {
        if(!universalPreviewModal || !universalPreviewBody) return;
        previewFileName.innerText = name || 'File Preview'; universalPreviewBody.innerHTML = ''; 
        if(previewDownloadBtn) { previewDownloadBtn.href = data; previewDownloadBtn.download = name || 'download'; }
        if(previewOpenBtn) { try { const blob = dataURItoBlob(data); if (blob) { const blobUrl = URL.createObjectURL(blob); previewOpenBtn.href = blobUrl; } else { previewOpenBtn.href = data; } } catch(e) { previewOpenBtn.href = data; } }
        
        if (type.startsWith('image/')) { 
            const img = document.createElement('img'); img.src = data; img.className = 'img-fluid h-100 w-100'; img.style.objectFit = 'contain'; universalPreviewBody.appendChild(img); 
        } else if (type === 'application/pdf') { 
            const embed = document.createElement('embed'); embed.src = data; embed.type = 'application/pdf'; embed.className = 'pdf-embed'; universalPreviewBody.appendChild(embed); 
        } else { 
            universalPreviewBody.innerHTML = `<div class="d-flex flex-column align-items-center justify-content-center h-100 text-muted"><i class="bi bi-file-earmark-break fs-1 mb-3"></i><p>Preview not available inside modal.</p></div>`; 
        }
        universalPreviewModal.show();
    };

    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const dataToExport = { tasks: tasks, preferences: { themeColor: localStorage.getItem('themeColor'), themeGradient: localStorage.getItem('themeGradient'), themeMode: localStorage.getItem('themeMode') }, meta: { version: "2.4.8", date: new Date().toISOString() } };
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport));
            const dlNode = document.createElement('a'); dlNode.setAttribute("href", dataStr); dlNode.setAttribute("download", "xtask_backup_" + new Date().toISOString().split('T')[0] + ".json"); document.body.appendChild(dlNode); dlNode.click(); dlNode.remove(); showToast("Backup exported!");
        });
    }
    if (importBtn && importFileInput) {
        importBtn.addEventListener('click', () => importFileInput.click());
        importFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0]; if (!file) return; const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importedData = JSON.parse(event.target.result);
                    if (importedData.tasks) { tasks = importedData.tasks; localStorage.setItem('tasks', JSON.stringify(tasks)); renderTasks(); }
                    if (importedData.preferences) { const prefs = importedData.preferences; if (prefs.themeMode === 'rainbow') startRainbowMode(); else if (prefs.themeColor && prefs.themeGradient) setTheme(prefs.themeColor, prefs.themeGradient); }
                    showToast("Data restored!");
                } catch (err) { alert("Invalid file!"); } importFileInput.value = '';
            }; reader.readAsText(file);
        });
    }

    function startRainbowMode() {
        if (rainbowTimer) cancelAnimationFrame(rainbowTimer);
        function loop() { hue = (hue + 1) % 360; const color = `hsl(${hue}, 100%, 60%)`; const gradient = `linear-gradient(135deg, hsl(${hue}, 100%, 70%) 0%, hsl(${(hue + 60) % 360}, 100%, 50%) 100%)`; document.documentElement.style.setProperty('--primary-color', color); const gradientEl = document.querySelector('.text-gradient'); if(gradientEl) gradientEl.style.backgroundImage = gradient; rainbowTimer = requestAnimationFrame(loop); }
        loop(); localStorage.setItem('themeMode', 'rainbow'); updateClock();
    }
    function stopRainbowMode() { if (rainbowTimer) { cancelAnimationFrame(rainbowTimer); rainbowTimer = null; } localStorage.removeItem('themeMode'); }
    function setTheme(color, gradient) {
        stopRainbowMode(); document.documentElement.style.setProperty('--primary-color', color);
        const gradientEl = document.querySelector('.text-gradient'); if(gradientEl) gradientEl.style.backgroundImage = gradient;
        const encodedColor = color.replace('#', '%23'); const cursorSvg = `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 2L11 20L13 11L22 9L2 2Z' fill='${encodedColor}' stroke='%23ffffff' stroke-width='1.5' stroke-linejoin='round'/%3E%3C/svg%3E"), auto`; document.body.style.cursor = cursorSvg;
        localStorage.setItem('themeColor', color); localStorage.setItem('themeGradient', gradient); updateClock();
    }
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode === 'rainbow') startRainbowMode(); else { const savedColor = localStorage.getItem('themeColor'); const savedGradient = localStorage.getItem('themeGradient'); if (savedColor && savedGradient) { setTheme(savedColor, savedGradient); if(customThemeInput) customThemeInput.value = savedColor; } }
    
    if(themeLauncherBtn) themeLauncherBtn.addEventListener('click', () => themeModal.show());
    if(rainbowModeBtn) rainbowModeBtn.addEventListener('click', () => { startRainbowMode(); themeModal.hide(); });
    document.querySelectorAll('.theme-btn-lg:not(.rainbow-btn)').forEach(btn => { btn.addEventListener('click', () => { setTheme(btn.getAttribute('data-color'), btn.getAttribute('data-gradient')); themeModal.hide(); }); });
    if(customThemeInput) { customThemeInput.addEventListener('input', (e) => { const color = e.target.value; setTheme(color, `linear-gradient(135deg, ${color} 0%, #ffffff 100%)`); }); }

    async function readFiles(fileList) {
        const promises = Array.from(fileList).map(file => { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve({ name: file.name, type: file.type, data: reader.result }); reader.onerror = reject; reader.readAsDataURL(file); }); }); return Promise.all(promises);
    }
    function generateFilePreviewHtml(attachments) {
        if (!attachments || attachments.length === 0) return ''; let html = '';
        attachments.forEach(file => {
            if (file.type.startsWith('image/')) { html += `<img src="${file.data}" class="attachment-thumb" onclick="viewFile('${file.data}', '${file.type}', '${file.name}')" title="${file.name}">`; } 
            else if (file.type === 'application/pdf') { html += `<div class="file-thumb-card pdf-card" onclick="viewFile('${file.data}', '${file.type}', '${file.name}')" title="${file.name}"><i class="bi bi-file-earmark-pdf-fill"></i></div>`; } 
            else { let icon = 'bi-file-earmark-text'; if (file.type.includes('zip')) icon = 'bi-file-earmark-zip'; else if (file.type.includes('word')) icon = 'bi-file-earmark-word'; html += `<a href="${file.data}" download="${file.name}" class="attachment-chip"><i class="bi ${icon}"></i> <span>${file.name}</span></a>`; }
        }); return html;
    }
    if(fileInput) { fileInput.addEventListener('change', async () => { if (fileInput.files.length > 0) { if(fileLabelText) fileLabelText.innerText = `${fileInput.files.length} Files`; const attachments = await readFiles(fileInput.files); if(addFilePreview) addFilePreview.innerHTML = generateFilePreviewHtml(attachments); } else { if(fileLabelText) fileLabelText.innerText = "Attach Files"; if(addFilePreview) addFilePreview.innerHTML = ''; } }); }

    document.addEventListener('mousemove', function(e) { if(Math.random() > 0.5) return; const trail = document.createElement('div'); trail.classList.add('cursor-trail'); trail.style.left = e.pageX + 'px'; trail.style.top = e.pageY + 'px'; document.body.appendChild(trail); setTimeout(() => { trail.remove(); }, 500); });
    function parseDate(dateStr) { if (!dateStr) return null; return new Date(dateStr.replace(" ", "T")); }
    function updateClock() {
        const now = new Date(); clockEl.innerText = now.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const hour = now.getHours(); let greeting = "Welcome back";
        if (hour === 0) greeting = "It's Midnight"; else if (hour >= 1 && hour < 4) greeting = "Burning the Oil"; else if (hour >= 4 && hour < 6) greeting = "Early Dawn"; else if (hour >= 6 && hour < 12) greeting = "Good Morning"; else if (hour >= 12 && hour < 17) greeting = "Good Afternoon"; else if (hour >= 17 && hour < 22) greeting = "Good Evening"; else greeting = "Silent Night";
        greetingEl.innerHTML = `${greeting}, <span class="text-primary-custom fw-bold">Commander</span>`;
    }
    updateClock(); setInterval(updateClock, 1000); setInterval(renderTasks, 60000);
    function showToast(message, type = 'success') { if(!toast) return; toastMessage.innerText = message; toastIcon.className = type === 'success' ? 'bi bi-check-circle-fill' : 'bi bi-trash-fill text-danger'; if(type === 'success') toastIcon.style.color = "var(--primary-color)"; else toastIcon.style.color = ""; toast.show(); }

    const sortOrderBtn = document.getElementById('sortOrderBtn');
    const sortIcon = document.getElementById('sortIcon');
    if (sortOrderBtn) {
        sortOrderBtn.addEventListener('click', () => {
            sortAscending = !sortAscending;
            if (sortAscending) { sortIcon.classList.replace('bi-sort-down', 'bi-sort-up'); sortOrderBtn.classList.add('active'); } 
            else { sortIcon.classList.replace('bi-sort-up', 'bi-sort-down'); sortOrderBtn.classList.remove('active'); }
            renderTasks();
        });
    }

    function saveTasks() { try { localStorage.setItem('tasks', JSON.stringify(tasks)); } catch (e) { alert("Storage Limit Reached!"); } renderTasks(); }
    
    async function addTask() {
        if (!taskInput) return; 
        const text = taskInput.value.trim(); 
        const desc = taskDescInput.value.trim(); 
        const priority = priorityInput ? priorityInput.value : 'Medium'; 
        const dueDate = dueDateInput.value; 
        const files = fileInput ? fileInput.files : [];
        
        if (text === '') { alert('Please enter a task name.'); return; }
        
        let attachments = []; 
        if (files.length > 0) { 
            let totalSize = 0; for(let f of files) totalSize += f.size; 
            if(totalSize > 10 * 1024 * 1024) { alert("Files too large!"); return; } 
            try { attachments = await readFiles(files); } catch (err) { return; } 
        }
        
        const newTask = { id: Date.now(), text, description: desc, priority, dueDate, attachments, completed: false, createdAt: new Date().toISOString() };
        tasks.unshift(newTask); 
        taskInput.value = ''; taskDescInput.value = ''; 
        if(fileInput) fileInput.value = ''; 
        if(fileLabelText) fileLabelText.innerText = "Attach Files"; 
        if(addFilePreview) addFilePreview.innerHTML = ''; 
        if(fpMain) fpMain.clear(); 
        saveTasks(); 
        showToast("Mission deployed!"); 
        taskInput.focus();
    }

    function toggleTask(id) { const task = tasks.find(t => t.id === id); if (task) { task.completed = !task.completed; saveTasks(); } }
    
    function toggleAllTasks() { 
        const hasUncompleted = tasks.some(t => !t.completed); 
        tasks.forEach(t => { t.completed = hasUncompleted; }); 
        saveTasks(); showToast("All systems updated."); 
    }
    
    function openDeleteModal(id) { deleteTargetId = id; deleteModal.show(); }
    
    confirmDeleteBtn.addEventListener('click', () => { 
        if (deleteTargetId) { 
            tasks = tasks.filter(t => t.id !== deleteTargetId); 
            saveTasks(); deleteModal.hide(); showToast("Mission terminated.", "danger"); 
        } 
    });
    
    clearCompletedBtn.addEventListener('click', () => { if (tasks.filter(t => t.completed).length === 0) return; clearModal.show(); });
    
    confirmClearBtn.addEventListener('click', () => { 
        tasks = tasks.filter(t => !t.completed); 
        saveTasks(); clearModal.hide(); showToast("Archives wiped.", "danger"); 
    });
    
    function openEditModal(id) { 
        const task = tasks.find(t => t.id === id); 
        if (task) { 
            editTaskIdInput.value = task.id; editTaskTitleInput.value = task.text; editTaskDescInput.value = task.description || ''; 
            if (task.dueDate) fpEdit.setDate(task.dueDate); else fpEdit.clear(); 
            let filesHtml = ''; 
            if (task.attachments) filesHtml = generateFilePreviewHtml(task.attachments); 
            else if (task.image) filesHtml = `<img src="${task.image}" class="attachment-thumb" onclick="viewFile('${task.image}', 'image/png', 'image')">`; 
            if(editFilesPreview) editFilesPreview.innerHTML = filesHtml ? `<div class="attachment-grid">${filesHtml}</div>` : '<span class="text-muted small">No files</span>'; 
            editModal.show(); 
        } 
    }
    
    function saveEdit() { 
        const id = parseInt(editTaskIdInput.value); const task = tasks.find(t => t.id === id); 
        if (task) { 
            task.text = editTaskTitleInput.value.trim(); task.description = editTaskDescInput.value.trim(); task.dueDate = editTaskDueDateInput.value; 
            saveTasks(); editModal.hide(); showToast("Mission updated."); 
        } 
    }
    
    function sortTasks(tasksArr) {
        const criteria = sortInput ? sortInput.value : 'newest';
        tasksArr.sort((a, b) => {
            let comparison = 0;
            if (criteria === 'newest') { comparison = new Date(a.createdAt || 0) - new Date(b.createdAt || 0); } 
            else if (criteria === 'priority') { const map = { 'High': 3, 'Medium': 2, 'Low': 1 }; comparison = map[a.priority || 'Medium'] - map[b.priority || 'Medium']; } 
            else if (criteria === 'date') { const dA = a.dueDate ? parseDate(a.dueDate) : null; const dB = b.dueDate ? parseDate(b.dueDate) : null; if (!dA && !dB) comparison = 0; else if (!dA) comparison = -1; else if (!dB) comparison = 1; else comparison = dA - dB; }
            return sortAscending ? comparison : -comparison;
        });
        return tasksArr;
    }
    
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
    
    function renderTasks() {
        if(!taskList) return; 
        taskList.innerHTML = ''; 
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : ''; 
        const now = new Date();
        
        let filteredTasks = tasks.filter(task => { 
            const taskText = task.text ? task.text.toLowerCase() : ""; 
            const matchesSearch = taskText.includes(searchTerm); 
            const taskDate = parseDate(task.dueDate); 
            const isOverdue = !task.completed && taskDate && taskDate < now; 
            
            let matchesFilter = true; 
            if (currentFilter === 'active') matchesFilter = !task.completed; 
            else if (currentFilter === 'completed') matchesFilter = task.completed; 
            else if (currentFilter === 'overdue') matchesFilter = isOverdue; 
            
            return matchesSearch && matchesFilter; 
        });
        
        filteredTasks = sortTasks(filteredTasks);
        
        if (filteredTasks.length === 0) { 
            if(emptyState) emptyState.classList.remove('d-none'); 
            if(document.getElementById('emptyTitle')) { 
                const eTitle = document.getElementById('emptyTitle'); 
                const eDesc = document.getElementById('emptyDesc'); 
                if (currentFilter === 'overdue') { eTitle.innerText = "No Critical Threats"; eDesc.innerText = "No overdue missions."; } 
                else if (currentFilter === 'completed') { eTitle.innerText = "Archives Empty"; eDesc.innerText = "No completed tasks."; } 
                else { eTitle.innerText = "System Clear"; eDesc.innerText = "No active tasks."; } 
            } 
        } else { 
            if(emptyState) emptyState.classList.add('d-none'); 
        }
        
        filteredTasks.forEach((task, index) => {
            const checked = task.completed ? 'checked' : ''; 
            const completedClass = task.completed ? 'completed' : ''; 
            const safePriority = task.priority || 'Medium'; 
            const priorityClass = `priority-${safePriority.toLowerCase()}`; 
            
            let timeDisplay = ''; 
            const createdHtml = `<span class="text-muted" title="Created"><i class="bi bi-clock"></i> ${formatCreatedDate(task.createdAt)}</span>`;
            if (task.dueDate) { 
                const taskDate = parseDate(task.dueDate); 
                const isOverdue = !task.completed && taskDate && taskDate < now; 
                const dueClass = isOverdue ? 'text-danger fw-bold' : 'text-warning'; 
                const dueIcon = isOverdue ? 'bi-exclamation-circle-fill' : 'bi-calendar-event'; 
                const dueText = isOverdue ? 'OVERDUE' : 'Due'; 
                timeDisplay = `<span class="${dueClass} me-3"><i class="bi ${dueIcon}"></i> ${dueText}: ${formatDueDate(taskDate)}</span>` + createdHtml; 
            } else { timeDisplay = createdHtml; }
            
            let filesHtml = ''; 
            if (task.attachments && task.attachments.length > 0) filesHtml = `<div class="attachment-grid">${generateFilePreviewHtml(task.attachments)}</div>`; 
            else if (task.image) filesHtml = `<div class="attachment-grid"><img src="${task.image}" class="attachment-thumb" onclick="viewFile('${task.image}', 'image/png', 'image')"></div>`;
            
            let descHtml = task.description ? `<div class="task-description">${task.description}</div>` : ''; 
            const badgeHtml = getPriorityBadge(safePriority);
            
            const html = `
                <div class="task-item ${priorityClass} ${completedClass} fade-in-up" style="animation-delay: ${index * 0.05}s">
                    <div class="task-header">
                        <div class="d-flex align-items-center gap-3" style="width:100%">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" ${checked} data-action="toggle" data-id="${task.id}">
                            </div>
                            <div class="d-flex flex-column" style="flex:1">
                                <span class="task-title fw-medium fs-5 text-break">${task.text || '(No Title)'}</span>
                                <div class="d-flex flex-wrap align-items-center gap-2 mt-1">
                                    ${badgeHtml}
                                    <small style="font-size: 0.75rem;">${timeDisplay}</small>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex gap-2 ms-3">
                            <button class="btn btn-sm btn-dark bg-transparent border-0 text-info" data-action="edit" data-id="${task.id}">
                                <i class="bi bi-pencil-square fs-5"></i>
                            </button>
                            <button class="btn btn-sm btn-dark bg-transparent border-0 text-danger" data-action="delete" data-id="${task.id}">
                                <i class="bi bi-trash fs-5"></i>
                            </button>
                        </div>
                    </div>
                    ${(descHtml || filesHtml) ? `<div class="task-body">${descHtml}${filesHtml}</div>` : ''}
                </div>`;
            taskList.insertAdjacentHTML('beforeend', html);
        });
        updateStats();
    }

    // --- MAIN EVENT LISTENERS ---
    if (addBtn) addBtn.addEventListener('click', addTask); 
    if (taskInput) taskInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTask(); }); 
    if (searchInput) searchInput.addEventListener('input', renderTasks); 
    if (sortInput) sortInput.addEventListener('change', renderTasks); 
    
    if (filterTabs) filterTabs.addEventListener('click', (e) => { 
        if (e.target.classList.contains('nav-link')) { 
            document.querySelectorAll('.nav-link').forEach(btn => btn.classList.remove('active')); 
            e.target.classList.add('active'); 
            currentFilter = e.target.dataset.filter; 
            renderTasks(); 
        } 
    });
    
    if (clearCompletedBtn) clearCompletedBtn.addEventListener('click', () => { 
        if (tasks.filter(t => t.completed).length === 0) return; 
        clearModal.show(); 
    });
    
    if (selectAllBtn) selectAllBtn.addEventListener('click', toggleAllTasks); 
    if (saveEditBtn) saveEditBtn.addEventListener('click', saveEdit); 
    
    if (taskList) taskList.addEventListener('click', (e) => { 
    const target = e.target.closest('[data-action]'); 
    if (!target) return; 
    const action = target.dataset.action; 

    // --- แก้ไขบรรทัดนี้จาก parseInt เป็น Number ---
    const id = Number(target.dataset.id); 
    
    if (action === 'toggle') toggleTask(id); 
    if (action === 'delete') openDeleteModal(id); 
    if (action === 'edit') openEditModal(id); 
});
// --- ฟังก์ชันอัปเดตสถิติและสถานะปุ่ม Clear ---
    function updateStats() {
    if (!taskStats) return;
    
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // ออกแบบใหม่ให้เป็นสไตล์ System HUD
    taskStats.innerHTML = `
        <div class="stats-hud-container d-flex align-items-center gap-3">
            <div class="stat-block">
                <i class="bi bi-activity text-primary-custom me-1"></i>
                <span class="stat-label">TOTAL</span>
                <span class="stat-value text-primary-custom">${total}</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-progress-wrapper">
                <div class="stat-progress-bar" style="width: ${percentage}%"></div>
                <span class="stat-percentage">${percentage}% SYNCED</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-block">
                <i class="bi bi-shield-check text-primary-custom me-1"></i>
                <span class="stat-label">SECURED</span>
                <span class="stat-value text-primary-custom">${completed}</span>
            </div>
        </div>
    `;

    if (clearCompletedBtn) {
        if (completed > 0) clearCompletedBtn.classList.remove('d-none');
        else clearCompletedBtn.classList.add('d-none');
    }
}
    // Start App
    renderTasks();
});