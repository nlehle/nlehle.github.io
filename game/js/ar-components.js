AFRAME.registerComponent('hide-in-ar-mode', {
  init: function () {
    console.info('hide-in-ar-mode init')
    this.el.sceneEl.addEventListener('enter-vr', (ev) => {
      if (this.el.sceneEl.is('ar-mode')) {
        this.el.setAttribute('visible', false);
      }
    });
    this.el.sceneEl.addEventListener('exit-vr', (ev) => {
      this.el.setAttribute('visible', true);
    });
  }
})

AFRAME.registerComponent('force-pushable', {
  schema: {
    force: { default: 10 }
  },
  init: function () {
    this.pStart = new THREE.Vector3();
    this.sourceEl = this.el.sceneEl.querySelector('[camera]');
  },

  forcePushCannon: function () {
    var force,
      el = this.el,
      pStart = this.pStart.copy(this.sourceEl.getAttribute('position'));

    // Compute direction of force, normalize, then scale.
    force = el.body.position.vsub(pStart);
    force.normalize();
    force.scale(this.data.force, force);

    el.body.applyImpulse(force, el.body.position);
  }
})

AFRAME.registerComponent('exit-ar-button', {
  schema: {
    element: { type: 'selector' }
  },
  init: function () {
    this.data.element.addEventListener('click', ev => {
      console.info('exit-ar-button click')
      document.querySelector('[game-logic]').components['game-logic'].setState('place');
      this.el.sceneEl.renderer.xr.getSession().end();
    });
  }
});

AFRAME.registerComponent('click-to-place', {
  init: function () {
    console.info('click-to-place init')
    this.el.addEventListener('ar-hit-test-start', (...args) => {
      console.info('ar-hit-test-start', args)
    })
    this.el.addEventListener('ar-hit-test-achieved', (...args) => {
      console.info('ar-hit-test-achieved', args)
    })
    this.el.addEventListener('ar-hit-test-select', (customEvent, ...args) => {
      console.info('ar-hit-test-select', customEvent, args)
      this.handleClick(customEvent)
    })
  },
  handleClick: function (event) {
    var logic = document.querySelector('[game-logic]').components['game-logic'];
    if (logic.state !== 'place') {
      return;
    }
    console.info('click-to-place handleClick')
    let hitPoint = event.detail.position;
    let orientation = event.detail.orientation;
    let playground = document.querySelector('#playground');

    hitPoint.y -= 2;

    playground.setAttribute('position', hitPoint);
    var children = playground.children;
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      if (child.components['ammo-body']) {
        child.components['ammo-body'].syncToPhysics();
        child.body.activate(); // Need to activate or the object won't move at all because its static
      }
    }
    var gameLogic = document.querySelector('[game-logic]').components['game-logic'];
    gameLogic.setState('resetBall');
    console.info('Set playground position to', playground.getAttribute('position'));

    // playground.setAttribute('rotation', orientation.x + ' ' + orientation.y + ' ' + orientation.z);
    // startNewGame();
  }
});

AFRAME.registerComponent("moving-dynamic-body", {
  init: function() {
    // wait until the physics engine is ready
    this.el.addEventListener("body-loaded", e => {
      // cache the ammo-body component
      this.ammoComponent = this.el.components["ammo-body"];
      // use this vector to zero the velocity
      // keep in mind this needs to be deleted manually from the memory with Ammo.destroy(this.zeroSpeed)
      this.zeroSpeed = new Ammo.btVector3(0, 0, 0);
      this.targetPosition = { x: 0, y: 0, z: 0 };
      this.update = false
    });
  },
  tick: function() {
    // wait for the physics 
    if (!this.ammoComponent) return;
    
    // restore stuff if the "teleport magic" has been done in the last renderloop.
    // this should probably be done in steps instead of tick
    if (this.collisionFlag === 2) {
      // this just tells us that we reverted to normal
      this.collisionFlag = 0;
      // restore the original collision flags
      this.ammoComponent.updateCollisionFlags();
      // reset the speed, or the body will bounce away
      this.ammoComponent.body.setLinearVelocity(this.zeroSpeed);
    }

    if (this.update) {
      this.update = false;
      this.el.object3D.position.set(this.targetPosition.x, this.targetPosition.y, this.targetPosition.z);
      this.collisionFlag = 2;
      this.ammoComponent.body.setCollisionFlags(this.collisionFlag);
      this.ammoComponent.syncToPhysics();
    }
  },

  setTargetPosition: function(pos) {
    this.update = true;
    this.targetPosition = pos;
  }
});

AFRAME.registerComponent("bounce", {
  init: function() {
    this.direction = 1;
    this.position = new THREE.Vector3();
    this.position.copy(this.el.object3D.position);
    setTimeout(() => {
      this.ready = true;
    }, 3000);
    setInterval(() => {
      this.direction = this.direction * -1;
    }, 2000)
  },

  tick: function() {
    if (!this.ready) return;
    var position = this.el.object3D.position.y;
    var scale = this.el.object3D.scale;
    if (position <= 0) {
      this.direction = 1;
    } else if (position >= 5) {
      this.direction = -1;
    }
    var newPos = {
      x: this.position.x,
      y: position + 0.05 * this.direction,
      z: this.position.z
    }
    // const scaleD = this.direction * 0.005;
    this.el.setAttribute('position', newPos);
    // this.el.setAttribute('scale', {x: scale.x + scaleD, y: scale.y + scaleD, z: scale.z + scaleD});
    this.el.components['ammo-body'].syncToPhysics()
    // this.el.object3D.position.set(this.position.x, position + 0.05 * this.direction, this.position.z);
  }
});

AFRAME.registerComponent('cursor-listener', {
  init: function () {
    var lastIndex = -1;
    var COLORS = ['red', 'green', 'blue'];
    this.el.addEventListener('click', function (evt) {
      lastIndex = (lastIndex + 1) % COLORS.length;
      this.setAttribute('material', 'color', COLORS[lastIndex]);
      console.log('I was clicked at: ', evt.detail.intersection.point);
    });
  }
});

AFRAME.registerComponent('load-shape', {
  schema: {
    model: {default: ''},
    body: {type: 'string', default: 'static'}, //dynamic: A freely-moving object.
    shape: {type: 'string', default: 'mesh'},  //hull: Convex hull shape.
    offset: {type: 'string', default: '0 0 0'},
  },
  init: function () {
    this.el.addEventListener('model-loaded', () => {
      setTimeout(() => {
        console.info('Pos 1', this.el.object3D.position, this.data.offset)
        this.el.setAttribute('ammo-shape', {type: this.data.shape, offset: this.data.offset, fit: 'all'});
      }, 200)
    })
  }
})
