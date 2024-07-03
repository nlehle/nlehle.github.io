document.addEventListener('DOMContentLoaded', () => {
    const levelLabel = document.getElementById('level-label');
    const shotsLabel = document.getElementById('shots-label');
    const strikePowerProgress = document.getElementById('strike-power-progress');
    const strikeButton = document.getElementById('strike-button');
    const homeButton = document.getElementById('home-button');

    let currentLevel = 1;
    let shots = 0;  // Initialize shots to 0
    let charging = false;

    // Set initial values
    // levelLabel.textContent = `Level: ${currentLevel}`;
    // shotsLabel.textContent = `Shots: ${shots}`;

    strikeButton.addEventListener('mousedown', startCharging);
    strikeButton.addEventListener('mouseup', stopCharging);
    strikeButton.addEventListener('touchstart', startCharging);
    strikeButton.addEventListener('touchend', stopCharging);

    homeButton.addEventListener('click', () => {
        window.location.href = 'gameMenu2.html'; 
    });
    homeButton.addEventListener('touchstart', () => {
        window.location.href = 'gameMenu2.html'; 
    });

    function startCharging() {
        charging = true;
        chargePower();
    }

    function stopCharging() {
        charging = false;
        onStrike();
    }

    function chargePower() {
        if (charging) {
            let newValue = parseInt(strikePowerProgress.value) + 1;
            if (newValue > 100) {
                newValue = 100;
            }
            strikePowerProgress.value = newValue;
            updateProgressColor(newValue);
            setTimeout(chargePower, 100);
        }
    }

    function onStrike() {
        const power = strikePowerProgress.value;
        console.log(`Strike Power: ${power}`);
        // Add your game logic here for the strike
        strikePowerProgress.value = 0; // Reset strike power after the strike
        updateProgressColor(0); // Reset color after the strike
        shots += 1;  // Increment shots
        // shotsLabel.textContent = `Shots: ${shots}`;  // Update shots label
        const shotPower = Math.max(1, power + 1);  // Calculate the shot power (minimum 2)
        pushBall(shotPower);  // Call the pushBall function with the power value
    }

    function updateProgressColor(value) {
        const percent = value / 100;
        const green = Math.floor(255 * percent);
        const grey = 192;
        strikePowerProgress.style.setProperty('--progress-color', `rgb(${grey}, ${green}, 0)`);
    }
});
