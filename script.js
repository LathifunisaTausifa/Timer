document.addEventListener("DOMContentLoaded", () => {
    // Select the elements
    const startButton = document.getElementById("start-countdown");
    const pauseButton = document.getElementById("pause-countdown");
    const resumeButton = document.getElementById("resume-countdown");
    const cancelButton = document.getElementById("cancel-countdown");

    // Initial values
    let countdownTimer;
    let endTime;

    // Function to update display
    function updateDisplay(time) {
        const days = Math.floor(time / (1000 * 60 * 60 * 24));
        const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((time % (1000 * 60)) / 1000);
        document.getElementById("days").textContent = days.toString().padStart(2, "0");
        document.getElementById("hours").textContent = hours.toString().padStart(2, "0");
        document.getElementById("minutes").textContent = minutes.toString().padStart(2, "0");
        document.getElementById("seconds").textContent = seconds.toString().padStart(2, "0");
    }

    // Function to reset display and buttons
    function resetDisplayAndButtons() {
        document.querySelector("input[name='target-date']").value = "";
        document.getElementById("days").textContent = "00";
        document.getElementById("hours").textContent = "00";
        document.getElementById("minutes").textContent = "00";
        document.getElementById("seconds").textContent = "00";
        startButton.disabled = false;
        resumeButton.disabled = true;
        pauseButton.disabled = true;
        cancelButton.disabled = true;
    }

    // Function to start countdown
    function startCountdown(duration, isResuming = false) {
        if (!isResuming) {
            endTime = Date.now() + duration;
        }
        countdownTimer = setInterval(() => {
            const now = Date.now();
            const timeLeft = endTime - now;
            if (timeLeft <= 0) {
                clearInterval(countdownTimer);
                displayMessage("Countdown finished");
                localStorage.removeItem("countdownTarget");
                resetDisplayAndButtons();
                return;
            }
            updateDisplay(timeLeft);
            pauseButton.disabled = false;
            cancelButton.disabled = false;
        }, 1000);
    }

    // Function to display message
    function displayMessage(message) {
        const display = document.getElementById("timer-display");
        display.textContent = message;
    }

    // Start button event listener
    startButton.addEventListener("click", function() {
        const targetDateValue = document.querySelector("input[name='target-date']").value;
        if (targetDateValue) {
            const targetDate = new Date(targetDateValue);
            const now = new Date();
            if (targetDate > now) {
                const duration = targetDate - now;
                localStorage.setItem("countdownTarget", targetDate.toString());
                startCountdown(duration);
                startButton.disabled = true;
                resumeButton.disabled = true;
                pauseButton.disabled = false;
                cancelButton.disabled = false;
            } else {
                alert("Please select a future date and time");
            }
        } else {
            alert("Please select a date and time");
        }
    });

    // Pause button event listener
    pauseButton.addEventListener("click", function() {
        clearInterval(countdownTimer);
        pauseButton.disabled = true;
        resumeButton.disabled = false;
    });

    // Resume button event listener
    resumeButton.addEventListener("click", function() {
        const now = new Date();
        const duration = endTime - now;
        startCountdown(duration, true);
        pauseButton.disabled = false;
        resumeButton.disabled = true;
    });

    // Cancel button event listener
    cancelButton.addEventListener("click", function() {
        clearInterval(countdownTimer);
        localStorage.removeItem("countdownTarget");
        resetDisplayAndButtons();
    });

    // Function to load and auto-start countdown if the saved target exists
    const savedDate = localStorage.getItem("countdownTarget");
    if (savedDate) {
        const targetDate = new Date(savedDate);
        const now = new Date();
        if (targetDate > now) {
            const duration = targetDate - now;
            startCountdown(duration);
            startButton.disabled = true;
            resumeButton.disabled = true;
            pauseButton.disabled = false;
            cancelButton.disabled = false;
        } else {
            localStorage.removeItem("countdownTarget");
            resetDisplayAndButtons();
        }
    }
});
