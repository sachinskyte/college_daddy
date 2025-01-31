 
  class PomodoroTimer {
    constructor() {
        this.isRunning = false;
        this.currentPhase = 'work';
        this.completedPomodoros = 0;
        this.totalFocusTime = 0;
        this.currentStreak = 0;
        this.interval = null;
        this.setupElements();
        this.setupEventListeners();
        this.loadSettings();
        this.resetTimer();
    }

    setupElements() {
        // Add settings icon element
        this.settingsIcon = document.getElementById('settings-icon');
        this.settingsPanel = document.getElementById('settings-panel');
        
        // Timer elements
        this.display = document.querySelector('.time-display');
        this.phaseDisplay = document.querySelector('.phase-display');
        this.startBtn = document.getElementById('start');
        this.skipBtn = document.getElementById('skip');
        this.resetBtn = document.getElementById('reset');
        this.progressRing = document.querySelector('.progress-ring circle');
        this.circumference = this.progressRing.getTotalLength();
        this.progressRing.style.strokeDasharray = `${this.circumference} ${this.circumference}`;

        // Settings elements
        this.workDurationInput = document.getElementById('work-duration');
        this.shortBreakInput = document.getElementById('short-break');
        this.longBreakInput = document.getElementById('long-break');
        this.pomodorosCountInput = document.getElementById('pomodoros-count');
        this.applySettingsBtn = document.getElementById('apply-settings');

        // Music elements
        this.youtubeInput = document.getElementById('youtube-url');
        this.addYoutubeBtn = document.getElementById('add-youtube');
        this.youtubeContainer = document.querySelector('.youtube-container');
        this.volumeSlider = document.querySelector('.volume-slider');

        // Stats elements
        this.completedPomodorosDisplay = document.getElementById('completed-pomodoros');
        this.totalFocusTimeDisplay = document.getElementById('total-focus-time');
        this.currentStreakDisplay = document.getElementById('current-streak');
    }

    setupEventListeners() {
        // Add settings icon click listener
        this.settingsIcon.addEventListener('click', () => {
            this.settingsPanel.classList.toggle('show');
        });

        // Close settings panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.settingsPanel.contains(e.target) && 
                !this.settingsIcon.contains(e.target)) {
                this.settingsPanel.classList.remove('show');
            }
        });

        this.startBtn.addEventListener('click', () => this.toggleTimer());
        this.skipBtn.addEventListener('click', () => this.skipPhase());
        this.resetBtn.addEventListener('click', () => this.resetTimer());
        this.applySettingsBtn.addEventListener('click', () => this.applySettings());
        this.addYoutubeBtn.addEventListener('click', () => this.loadYoutubeVideo());
        this.volumeSlider.addEventListener('input', (e) => this.updateVolume(e.target.value));
    }

    loadSettings() {
        this.settings = {
            workDuration: parseInt(this.workDurationInput.value) || 25,
            shortBreak: parseInt(this.shortBreakInput.value) || 5,
            longBreak: parseInt(this.longBreakInput.value) || 15,
            pomodorosUntilLongBreak: parseInt(this.pomodorosCountInput.value) || 4
        };
    }

    applySettings() {
        this.loadSettings();
        this.resetTimer();
        this.showNotification('Settings applied successfully');
    }

    resetTimer() {
        clearInterval(this.interval);
        this.isRunning = false;
        this.startBtn.textContent = 'Start';
        this.currentPhase = 'work';
        this.remainingTime = this.settings.workDuration * 60 * 1000;
        this.initialTime = this.remainingTime;
        this.updateDisplay();
        this.updateProgress(1);
        this.updatePhaseDisplay();
    }

    toggleTimer() {
        if (this.isRunning) {
            this.pauseTimer();
            this.startBtn.textContent = 'Resume';
        } else {
            this.startTimer();
            this.startBtn.textContent = 'Pause';
        }
    }

    startTimer() {
        if (this.remainingTime === 0) return;
        
        this.isRunning = true;
        this.startTime = Date.now() - (this.initialTime - this.remainingTime);
        
        this.interval = setInterval(() => {
            this.remainingTime = Math.max(this.initialTime - (Date.now() - this.startTime), 0);
            
            if (this.remainingTime === 0) {
                this.completePhase();
            }
            
            this.updateDisplay();
            this.updateProgress(this.remainingTime / this.initialTime);
        }, 10);
    }

    pauseTimer() {
        this.isRunning = false;
        clearInterval(this.interval);
    }

    skipPhase() {
        this.completePhase();
    }

    completePhase() {
        clearInterval(this.interval);
        this.isRunning = false;
        this.startBtn.textContent = 'Start';

        if (this.currentPhase === 'work') {
            this.completedPomodoros++;
            this.totalFocusTime += this.settings.workDuration;
            this.currentStreak++;
            this.updateStats();

            if (this.completedPomodoros % this.settings.pomodorosUntilLongBreak === 0) {
                this.currentPhase = 'longBreak';
                this.remainingTime = this.settings.longBreak * 60 * 1000;
            } else {
                this.currentPhase = 'shortBreak';
                this.remainingTime = this.settings.shortBreak * 60 * 1000;
            }
        } else {
            this.currentPhase = 'work';
            this.remainingTime = this.settings.workDuration * 60 * 1000;
        }

        this.initialTime = this.remainingTime;
        this.updateDisplay();
        this.updateProgress(1);
        this.updatePhaseDisplay();
        this.playNotificationSound();
        this.showNotification(`${this.currentPhase === 'work' ? 'Work Time' : 'Break Time'} - Let's go!`);
    }

    updateDisplay() {
        const totalSeconds = Math.ceil(this.remainingTime / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        this.display.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    updateProgress(progress) {
        const offset = this.circumference - (progress * this.circumference);
        this.progressRing.style.strokeDashoffset = offset;
    }

    updatePhaseDisplay() {
        const phaseText = this.currentPhase === 'work' ? 'Work Time' :
                         this.currentPhase === 'shortBreak' ? 'Short Break' : 'Long Break';
        this.phaseDisplay.textContent = phaseText;
    }

    updateStats() {
        this.completedPomodorosDisplay.textContent = this.completedPomodoros;
        this.totalFocusTimeDisplay.textContent = this.totalFocusTime;
        this.currentStreakDisplay.textContent = this.currentStreak;
    }

    loadYoutubeVideo() {
        const url = this.youtubeInput.value;
        const videoId = this.extractVideoId(url);
        
        if (videoId) {
            this.youtubeContainer.innerHTML = `
                <iframe
                    src="https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                ></iframe>
            `;
            this.youtubeContainer.classList.add('active');
        } else {
            this.showNotification('Invalid YouTube URL');
        }
    }

    extractVideoId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    updateVolume(value) {
        const iframe = this.youtubeContainer.querySelector('iframe');
        if (iframe) {
            iframe.contentWindow.postMessage({
                event: 'command',
                func: 'setVolume',
                args: [value]
            }, '*');
        }
    }

    showNotification(message) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    playNotificationSound() {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PurWYcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DstmwhBTGH0fPTgjMGHm7A7+OZSA0PVqzn77BeGQc+ltryxnMpBSl+zPLaizsIGGS57OihUBELTKXh765qHgU2jdXzzn0vBSF1xe/glEILElyx6OyrWBUIQ5zd77lxJAUuhM/z1YU2Bxtqvu7mnEoODlOq5vCzYRoGPJPY88p2KwUme8rx3I4+CRZiturqpVITC0mi4O+ybSAFM4nU89GAPAYeb8Lv45xMDw9WrOfte2IdBiqDz/PXiDkHGWe87emjURIKSqPg77FtIAUxiNPz04Q+Bhxswe/mnk4PD1Sp5PC1YxwGOpDY89F6LgUkedDy3pJCChVfsOnrrFcXCEGa3vC8dSYFL4PP89qLPQcZar7u6KBQEAxQp+TxuGYeBjqQ2PPTfDAFI3fO8uCWRgsUXLLo7a5aGQdAlN3wvngnBS2BzvPcjz8HF2i87+qjUxEMTaTi8LVpIAY3jdbz1oM0BSBxze/kmEoOElqw6O+xXRoGPZjb8MF8KQUrgc3z3pJCChVesenrsF4cBzWL1fPYhjcGH27C7+adTQ8OVKrk8bdnHwY4j9fz1X8yBSF3zPLimUwOEVeu5/CzYBwGN4zW89qJOwYba8Dv6KFQEQxPpuPwtmsgBTaJ1PPahzgGHmzB7+ihUBEMTqXj8LdoIAU2i9Tz2ok6BhpswO/po1IRDEyl4/C4ayAFNYrV89qKOgYabcDv6aJREQxLpePwuGwgBTaL1fPaiToGGmzA7+mjUhEMTKXj8LhrIAU1itXz2oo6BhptwO/polERDEul4/C4bCAFNovV89qJOgYabMDv6aNSEQxMpePwuGsgBTWK1fPaijoGGm3A7+miUREMS6Xj8LhsIAU2i9Xz2ok6BhpswO/po1IRDEyl4/C4ayAFNYrV89qKOgYabcDv6aJREQxLpePwuGwgBTaL1fPaiToGGmzA7+mjUhEMTKXj8LhrIAU1itXz2oo6BhptwO/polERDEul4/C4bCAFNovV89qJOgYabMDv6aNSEQxMpePwuGsgBTWK1fPaijoGGm3A7+miUREMS6Xj8LhsIAU2i9Xz2ok6BhpswO/po1IRDEyl4/C4ayAFNYrV89qKOgYabcDv6aJREQxLpePwuGwgBTaL1fPaiToGGmzA7+mjUhEMTKXj8LhrIAU1itXz2oo6BhptwO/polERDEul4/C4bCAFNovV89qJOgYabMDv6aNSEQxMpePwuGsgBTWK1fPaijoGGm3A7+miUREMS6Xj8LhsIAU2i9Xz2ok6BhpswO/po1IRDEyl4/C4ayAFNYrV89qKOgYabcDv6aJREQxLpePwuGwgBTaL1fPaiToGGmzA7+mjUhEMTKXj8LhrIAU1itXz2oo6BhptwO/polERDEul4/C4bCAFNovV89qJOgYabMDv6aNSEQxMpePwuGsgBTWK1fPaijoGGm3A7+miUREMS6Xj8LhsIAU2i9Xz2ok6BhpswO/po1IRDEyl4/C4ayAFNYrV89qKOgYabcDv6aJREQxLpePwuGwgBTaL1fPaiToGGmzA7+mjUhEMTKXj8LhrIAU1itXz2oo6BhptwO/polERDEul');
        audio.play();
    }
}

// Initialize the timer
const timer = new PomodoroTimer();
