import confetti from 'canvas-confetti';

// State management
let alertTriggered = false;
let notificationsEnabled = false;
let showResults = false;
let audioCtx: AudioContext | null = null;

// DOM Element Selections
const loginTimeInput = document.getElementById('loginTime') as HTMLInputElement | null;
const shiftHoursInput = document.getElementById('shiftHours') as HTMLInputElement | null;
const notifyBtn = document.getElementById('notifyBtn') as HTMLButtonElement | null;
const bellIcon = document.getElementById('bellIcon') as SVGElement | null;
const currentTimeEl = document.getElementById('currentTime') as HTMLDivElement | null;
const breaksContainer = document.getElementById('breaks') as HTMLDivElement | null;
const addBreakBtn = document.getElementById('addBreakBtn') as HTMLButtonElement | null;
const calculateBtn = document.getElementById('calculateBtn') as HTMLButtonElement | null;

const displayEl = document.getElementById('display') as HTMLDivElement | null;
const timeLeftEl = document.getElementById('timeLeft') as HTMLDivElement | null;

const timelineContainer = document.getElementById('timelineContainer') as HTMLDivElement | null;
const timelineBar = document.getElementById('timelineBar') as HTMLDivElement | null;
const timelinePercent = document.getElementById('timelinePercent') as HTMLSpanElement | null;
const timelineStart = document.getElementById('timelineStart') as HTMLSpanElement | null;
const timelineEnd = document.getElementById('timelineEnd') as HTMLSpanElement | null;

// Update current time clock every second
function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    if (currentTimeEl) {
        currentTimeEl.textContent = `Current Time: ${timeStr}`;
    }

    // Auto-refresh calculation if it is currently displayed
    if (timeLeftEl && !timeLeftEl.classList.contains('hidden')) {
        updateDisplay(false);
    }
}
setInterval(updateClock, 1000);

// Add dynamic break input
function addBreak(value: string | number = "", shouldUpdate = true) {
    if (!breaksContainer) return;

    const newBreak = document.createElement('div');
    newBreak.className = 'flex gap-3 mb-3';

    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'breakInput flex-1 p-4 rounded-2xl bg-white/10 border border-white/20 text-lg font-medium shadow-inner';
    input.placeholder = 'Min';
    input.value = value.toString();
    input.addEventListener('input', () => {
        saveState();
        updateDisplay(false);
    });

    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn-remove w-14 flex items-center justify-center rounded-2xl text-xl font-bold shadow-lg';
    removeBtn.textContent = '−';
    removeBtn.addEventListener('click', () => {
        newBreak.remove();
        saveState();
        updateDisplay(false);
    });

    newBreak.appendChild(input);
    newBreak.appendChild(removeBtn);
    breaksContainer.appendChild(newBreak);

    if (shouldUpdate) {
        saveState();
        updateDisplay(false);
    }
}

// Save current application state to localStorage
function saveState() {
    if (!loginTimeInput || !shiftHoursInput) return;
    const loginTime = loginTimeInput.value;
    const shiftHours = shiftHoursInput.value;
    const breaks = Array.from(document.querySelectorAll('.breakInput')).map(input => (input as HTMLInputElement).value);

    const state = { loginTime, shiftHours, breaks, showResults };
    localStorage.setItem('shiftTimerState', JSON.stringify(state));
}

// Load application state from localStorage
function loadState() {
    const stateStr = localStorage.getItem('shiftTimerState');
    if (!stateStr) return;
    try {
        const state = JSON.parse(stateStr);
        if (state.loginTime && loginTimeInput) loginTimeInput.value = state.loginTime;
        if (state.shiftHours && shiftHoursInput) shiftHoursInput.value = state.shiftHours;

        if (state.breaks && state.breaks.length > 0 && breaksContainer) {
            // Clear default breaks
            breaksContainer.querySelectorAll('.flex').forEach(el => el.remove());
            state.breaks.forEach((val: string) => {
                addBreak(val, false);
            });
        }
        showResults = state.showResults || false;
        if (showResults) {
            updateDisplay(false);
        }
    } catch (e) {
        console.error("Error loading stored state:", e);
    }
}

// Play pleasant synthesizer chime using Web Audio API
function playChime() {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        if (!audioCtx) return;
        const now = audioCtx.currentTime;

        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, now); // C5
        osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(659.25, now + 0.05); // E5
        osc2.frequency.exponentialRampToValueAtTime(1046.50, now + 0.25); // C6

        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc1.start(now);
        osc1.stop(now + 0.8);

        osc2.start(now + 0.05);
        osc2.stop(now + 0.85);
    } catch (e) {
        console.error("Failed to play audio chime alert:", e);
    }
}

// Toggle native system notifications
function toggleNotifications() {
    if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                notificationsEnabled = true;
                updateBellIcon(true);
                localStorage.setItem('shiftTimerNotifications', 'true');
                new Notification("Notifications Enabled!", {
                    body: "Shift Timer will now notify you when your shift ends.",
                    icon: "ic_launcher-playstore.png"
                });
            } else {
                notificationsEnabled = false;
                updateBellIcon(false);
                localStorage.setItem('shiftTimerNotifications', 'false');
            }
        });
    } else if (Notification.permission === 'granted') {
        notificationsEnabled = !notificationsEnabled;
        updateBellIcon(notificationsEnabled);
        localStorage.setItem('shiftTimerNotifications', notificationsEnabled ? 'true' : 'false');
    } else {
        alert("Notification permission is blocked. Please enable notifications in your browser settings.");
        updateBellIcon(false);
        localStorage.setItem('shiftTimerNotifications', 'false');
    }
}

function updateBellIcon(enabled: boolean) {
    if (!bellIcon || !notifyBtn) return;
    if (enabled) {
        notifyBtn.classList.remove('text-white/40');
        notifyBtn.classList.add('text-yellow-400', 'bg-yellow-400/10');
        bellIcon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        `;
    } else {
        notifyBtn.classList.add('text-white/40');
        notifyBtn.classList.remove('text-yellow-400', 'bg-yellow-400/10');
        bellIcon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        `;
    }
}

// Main logic and UI calculations
function updateDisplay(showAnimation = true) {
    if (!loginTimeInput || !shiftHoursInput) return;
    const loginTime = loginTimeInput.value;
    const shiftHours = parseFloat(shiftHoursInput.value) || 0;
    const breaks = Array.from(document.querySelectorAll('.breakInput')).map(input => parseInt((input as HTMLInputElement).value) || 0);
    const totalBreakMinutes = breaks.reduce((a, b) => a + b, 0);

    if (!loginTime) return;
    if (showAnimation) {
        showResults = true;
    }

    const [loginH, loginM] = loginTime.split(':').map(Number);
    const totalShiftMinutes = (shiftHours * 60) + totalBreakMinutes;

    // Calculate Logout Time
    const endTotalMinutes = (loginH * 60) + loginM + totalShiftMinutes;
    const endH = Math.floor(endTotalMinutes / 60) % 24;
    const endM = endTotalMinutes % 60;

    const endTimeStr = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
    if (displayEl) {
        displayEl.textContent = `Logout Time: ${endTimeStr}`;

        if (showAnimation) {
            displayEl.classList.add('scale-110');
            setTimeout(() => displayEl.classList.remove('scale-110'), 200);
        }
    }

    // Set dates and smart midnight crossovers
    const now = new Date();
    const startDate = new Date(now);
    startDate.setHours(loginH, loginM, 0, 0);

    if (startDate.getTime() - now.getTime() > 12 * 60 * 60 * 1000) {
        startDate.setDate(startDate.getDate() - 1);
    }

    const logoutDate = new Date(startDate.getTime() + totalShiftMinutes * 60000);
    const diff = logoutDate.getTime() - now.getTime();

    // Visual Timeline Calculations
    const totalDuration = totalShiftMinutes * 60000;
    const elapsed = now.getTime() - startDate.getTime();
    const percent = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));

    if (timelineContainer && timelineBar && timelinePercent && timelineStart && timelineEnd) {
        timelineContainer.classList.remove('hidden');
        timelineStart.textContent = `Login: ${loginTime}`;
        timelineEnd.textContent = `Logout: ${endTimeStr}`;

        if (percent >= 100) {
            timelineBar.style.width = '100%';
            timelineBar.className = 'h-full rounded-full bg-gradient-to-r from-rose-500 to-red-600 transition-all duration-1000';
            timelinePercent.textContent = `100% (Completed)`;
        } else if (percent >= 90) {
            timelineBar.style.width = `${percent}%`;
            timelineBar.className = 'h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-1000';
            timelinePercent.textContent = `${Math.floor(percent)}%`;
        } else {
            timelineBar.style.width = `${percent}%`;
            timelineBar.className = 'h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000';
            timelinePercent.textContent = `${Math.floor(percent)}%`;
        }
    }

    // Calculate Time Left or Overtime Counter
    if (timeLeftEl) {
        if (diff <= 0) {
            const absDiff = Math.abs(diff);
            const otH = Math.floor(absDiff / 3600000);
            const otM = Math.floor((absDiff % 3600000) / 60000);
            const otS = Math.floor((absDiff % 60000) / 1000);

            timeLeftEl.textContent = `Shift Ended! (Overtime: ${otH}h ${otM}m ${otS}s)`;
            timeLeftEl.classList.add('bg-rose-500/20', 'text-rose-300', 'border-rose-500/30');
            timeLeftEl.classList.remove('bg-emerald-500/20', 'text-emerald-300', 'border-emerald-500/30');

            // Trigger Alert / Notification
            if (!alertTriggered) {
                playChime();
                confetti({
                    particleCount: 150,
                    spread: 80,
                    origin: { y: 0.6 }
                });
                if (notificationsEnabled) {
                    new Notification("Shift Complete! 🎉", {
                        body: `Your shift ended at ${endTimeStr}. It's time to log out!`,
                        icon: "ic_launcher-playstore.png"
                    });
                }
                alertTriggered = true;
            }
        } else {
            const diffHours = Math.floor(diff / 3600000);
            const diffMinutes = Math.floor((diff % 3600000) / 60000);
            const diffSeconds = Math.floor((diff % 60000) / 1000);

            timeLeftEl.textContent = `Time Left: ${diffHours}h ${diffMinutes}m ${diffSeconds}s`;
            timeLeftEl.classList.add('bg-emerald-500/20', 'text-emerald-300', 'border-emerald-500/30');
            timeLeftEl.classList.remove('bg-rose-500/20', 'text-rose-300', 'border-rose-500/30');

            alertTriggered = false; // Reset trigger if time extended
        }
        timeLeftEl.classList.remove('hidden');
    }
}

// Bind Event Listeners
window.addEventListener('load', () => {
    updateClock();
    loadState();
    const savedNotif = localStorage.getItem('shiftTimerNotifications');
    if (savedNotif === 'true' && Notification.permission === 'granted') {
        notificationsEnabled = true;
        updateBellIcon(true);
    }
});

notifyBtn?.addEventListener('click', toggleNotifications);
loginTimeInput?.addEventListener('input', () => { saveState(); updateDisplay(false); });
shiftHoursInput?.addEventListener('input', () => { saveState(); updateDisplay(false); });

addBreakBtn?.addEventListener('click', () => addBreak());
calculateBtn?.addEventListener('click', () => {
    updateDisplay(true);
    saveState();
});

// Bind preset chips
document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLButtonElement;
        const minutes = parseInt(target.getAttribute('data-minutes') || '0', 10);
        if (minutes > 0) {
            addBreak(minutes);
        }
    });
});

// Bind initial default break input event listener
const initialBreakInput = document.querySelector('.breakInput') as HTMLInputElement | null;
initialBreakInput?.addEventListener('input', () => {
    saveState();
    updateDisplay(false);
});
