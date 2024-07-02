/**
 * Load a model into the scene using A Frame components
 * @param {string} id Object id
 * @param {string} modelUrl Modell url string
 * @param {Object} options Options for the object
 */
function loadModel(id, modelUrl, options = {}) {
  // Add the asset item to the assets
  var asset = document.querySelector('a-asset');
  var modelId = id + '-model';
  var assetItem = document.querySelector('#' + modelId);
  if (!assetItem) {
    assetItem = document.createElement('a-asset-item');
    assetItem.setAttribute('id', modelId);
    assetItem.setAttribute('src', `${modelUrl}`);
    asset.appendChild(assetItem);
  } else {
    assetItem.setAttribute('src', `${modelUrl}`);
  }

  // New entity with the flag model
  var scene = document.querySelector('a-scene');
  var entity = document.createElement('a-entity');

  entity.setAttribute('id', id);
  entity.setAttribute('gltf-model', `#${modelId}`);

  var { position, rotation, scale, collision, offset } = options;

  position = position || [0, 0, 0];
  entity.setAttribute('position', { x: position[0], y: position[1], z: position[2] });
  if (rotation) entity.setAttribute('rotation', { x: rotation[0], y: rotation[1], z: rotation[2] });
  if (scale) entity.setAttribute('scale', { x: scale[0], y: scale[1], z: scale[2] });

  if (!collision) collision = "none";
  if (!offset) offset = [0, 0, 0];

  const attributeMap = {}
  if (collision === "static") {
    if (!('ammo-body' in attributeMap)) attributeMap['ammo-body'] = []
    if (!('load-shape' in attributeMap)) attributeMap['load-shape'] = []
    attributeMap['ammo-body'].push('type: static')
    attributeMap["load-shape"].push(`offset: ${offset.join(' ')}`)
  }
  for (const key in attributeMap) {
    const value = attributeMap[key].join(';')
    entity.setAttribute(key, value)
  }

  // Enable shadow casting and receiving
  entity.setAttribute('shadow', {
    cast: true,
    receive: true
  });

  entity.setAttribute('scaleAutoUpdate')
  scene.appendChild(entity);
}

/**
 * @typedef {{
 * position: [number, number, number], rotation: [number, number, number], 
 * type: string, file: string, name: string, scale: [number, number, number], 
 * collision: "static" | "none"
 * }} AbstractObject
 */

/**
 * @typedef {{name: string, objects: AbstractObject[]}} Level
 */

/**
 * @typedef {{levels: Level[]}} LevelFile
 */

AFRAME.registerComponent('level-loader', {
  schema: {
    level: {type: 'string', default: 'level1'}
  },
  init: function () {
    var levelFileUrl = './data/levels.json'
    /** @type {LevelFile | null} */
    this.levelsFile = null
    this.currentLevel = this.data.level || 0
    this.el.addEventListener('click', () => {
      this.el.sceneEl.emit('load-level', {level: this.data.level});
    });
    this.loadProgress = fetch(levelFileUrl).then(response => {
      if (!response.ok) {
        throw new Error('Failed to load levels file', response.statusText)
      }
      return response.json();
    }).then(json => {
      this.levelsFile = json
      console.log('levelFile', this.levelsFile)
    })
  },
  loadLevel: async function(levelNumber) {
    console.info('Loading level', levelNumber)
    await this.loadProgress
    /** @type {Level?} */
    var level = this.levelsFile?.levels?.[levelNumber]
    if (!level) {
      console.error('Level not found', levelNumber)
      return
    }

    var { name, objects } = level
    objects.forEach(({ position, rotation, scale, type, file, collision, name, offset }) => {
      console.info('Loading object', name, file)
      loadModel(name.replace(/\s+/g, '-'), `${file}`, {
        position, rotation, scale, collision, offset
      })
    })
  },
  loadNextLevel: function() {
    this.currentLevel++;
    this.loadLevel(this.currentLevel);
  },

  updateLightTarget: function(playgroundId) {
    var light = document.querySelector('#directionalLight');
    if (light) {
      light.setAttribute('light', 'target', `#${playgroundId}`);
    }}

});
