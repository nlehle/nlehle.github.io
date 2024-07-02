AFRAME.registerComponent('game-logic', {
  init: function () {
    /** @type {"place" | "resetBall"} */
    this.state = "place";

    this.scene = document.querySelector('a-scene');
    let levelFromUrl = new URLSearchParams(window.location.search).get('level')
    levelFromUrl = levelFromUrl ? parseInt(levelFromUrl) -1 : 0
    this.loadLevel(levelFromUrl || 0);

    const nextLevelButton = document.getElementById('nextLevel');
    nextLevelButton.addEventListener('click', () => {
      const currentLevel = new URLSearchParams(window.location.search).get('level');
      document.location.search = `?level=${parseInt(currentLevel) + 1}`;
    });
  },
  setState: /** @param newState {"place" | "resetBall" } */ function (newState) {
    console.info('game-logic setState', newState, 'from', this.state)
    this.state = newState;
    if (newState === 'resetBall') {
      // Make reset ball button visible
      document.getElementById('ARresetBall').style.visibility = 'visible';
    } else {
      document.getElementById('ARresetBall').style.visibility = 'hidden';
    }
  },
  updateLevelCount: function () {
    var levelCount = document.getElementById('levelCount');
    var scene = document.querySelector('a-scene');
    var currentLevel = scene.components['level-loader'].currentLevel;
    levelCount.innerHTML = currentLevel;
  },
  loadLevel: function(levelNumber) {
    if (!this.scene) {
      console.error('No scene found')
      return
    }
    this.scene.components['level-loader'].loadLevel(levelNumber);
  }
})