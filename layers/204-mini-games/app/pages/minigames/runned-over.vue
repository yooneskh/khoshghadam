<script setup>

/* page */

definePageMeta({
  name: 'mini-games.runned-over',
});


/* seo */

useHead({
  title: 'Runned Over',
});

useSeoMeta({
  description: 'A tiny arcade dodge-em-up on a sky platform. Things come in fast. Try not to get runned over.',
});

useJsonld({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Minigames',
          'item': 'https://khoshghadam.com/minigames',
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Runned Over',
          'item': 'https://khoshghadam.com/minigames/runned-over',
        },
      ],
    },
    {
      '@type': 'VideoGame',
      'name': 'Runned Over',
      'description': 'A tiny arcade dodge-em-up on a sky platform. Things come in fast. Try not to get runned over.',
      'url': 'https://khoshghadam.com/minigames/runned-over',
      'gamePlatform': 'Web browser',
      'playMode': 'SinglePlayer',
    },
  ],
});


/* score */

const bestScore = useLocalStorage(`--${useAppConfig().brand.id}-minigames-runned-over-best-score--`, 0);
const score = ref(0);
const flashOpacity = ref(0);
const flashColor = ref('255 255 255');
const banner = ref('');
const sceneTint = ref('#6ea3b6');
const vignette = ref(0.28);


/* state */

const phase = ref('menu');
const overReason = ref('hit');


const overTitle = computed(() => {
  if (overReason.value === 'fall') {
    return 'You yeeted yourself off the sky.';
  }
  else {
    return 'SPLAT. They turned you into pavement.';
  }
});


const sim = {
  spawnAcc: 0,
  playTime: 0,
  lookYaw: 0.35,
  lookPitch: -0.06,
  shake: 0,
  grace: 0,
  needsCameraSnap: true,
  playerX: 0,
  playerY: 0,
  playerZ: 0,
  playerYaw: 0,
  playerVx: 0,
  playerVz: 0,
  touchX: 0,
  touchZ: 0,
  lookPointerId: null,
  lookLastX: 0,
  lookLastY: 0,
  timeScale: 1,
  fovKick: 0,
  dustAcc: 0,
  bannerUntil: 0,
  elapsed: 0,
  bonusScore: 0,
  wasOnPlatform: true,
};


/* input */

const gameSurfaceEl = useTemplateRef('gameSurfaceEl');


const documentVisibility = useDocumentVisibility();
const isCoarsePointer = useMediaQuery('(pointer: coarse)');
const { w, a, s, d, arrowup, arrowdown, arrowleft, arrowright } = useMagicKeys();
const { lock: lockPointer, unlock: unlockPointer, element: pointerLockElement } = usePointerLock(gameSurfaceEl);


const isPageVisible = computed(() => {
  return documentVisibility.value === 'visible';
});

const isPointerLocked = computed(() => {
  return !!pointerLockElement.value;
});


useEventListener(
  document,
  'mousemove',
  handleMouseLook,
);

useEventListener(
  document,
  'keydown',
  handlePlayKeydown,
  {
    passive: false,
  },
);


function readMoveInput() {

  let inputX = sim.touchX;
  let inputZ = sim.touchZ;


  if (a?.value || arrowleft?.value) {
    inputX -= 1;
  }

  if (d?.value || arrowright?.value) {
    inputX += 1;
  }

  if (w?.value || arrowup?.value) {
    inputZ += 1;
  }

  if (s?.value || arrowdown?.value) {
    inputZ -= 1;
  }


  const length = Math.hypot(inputX, inputZ);

  if (length > 1) {
    return {
      x: inputX / length,
      z: inputZ / length,
    };
  }
  else {
    return {
      x: inputX,
      z: inputZ,
    };
  }

}

function handleMouseLook(event) {

  if (phase.value !== 'playing' || isCoarsePointer.value) {
    return;
  }

  if (!event.movementX && !event.movementY) {
    return;
  }


  sim.lookYaw -= event.movementX * 0.0034;
  sim.lookPitch = Math.min(0.5, Math.max(-0.62, sim.lookPitch - event.movementY * 0.0026));

}

function handlePlayKeydown(event) {

  if (phase.value !== 'playing') {
    return;
  }


  if (event.code === 'ArrowUp' || event.code === 'ArrowDown' || event.code === 'ArrowLeft' || event.code === 'ArrowRight' || event.code === 'Space') {
    event.preventDefault();
  }

}

function handleLookPointerDown(event) {

  if (phase.value !== 'playing') {
    return;
  }


  sim.lookPointerId = event.pointerId;
  sim.lookLastX = event.clientX;
  sim.lookLastY = event.clientY;
  event.currentTarget.setPointerCapture(event.pointerId);

}

function handleLookPointerMove(event) {

  if (sim.lookPointerId !== event.pointerId) {
    return;
  }


  sim.lookYaw -= (event.clientX - sim.lookLastX) * 0.008;
  sim.lookPitch = Math.min(0.42, Math.max(-0.55, sim.lookPitch - (event.clientY - sim.lookLastY) * 0.006));
  sim.lookLastX = event.clientX;
  sim.lookLastY = event.clientY;

}

function handleLookPointerUp(event) {

  if (sim.lookPointerId !== event.pointerId) {
    return;
  }


  sim.lookPointerId = null;

}

function handleTouchPress(axis, value, event) {
  sim[axis] = value;
  event.currentTarget.setPointerCapture(event.pointerId);
}

function handleTouchRelease(axis) {
  sim[axis] = 0;
}


/* world */

const world = {
  platformWidth: 36,
  platformDepth: 18,
  platformHalfWidth: 18,
  platformHalfDepth: 9,
  spawnX: 21,
  moveSpeed: 6.35,
  gravity: 24,
  playerHalfWidth: 0.22,
  playerHalfDepth: 0.18,
  lanes: [
    -7.2,
    -4.32,
    -1.44,
    1.44,
    4.32,
    7.2,
  ],
  vehicleColors: [
    '#7a2e2a',
    '#2b2b2b',
    '#5c4a32',
    '#2f4454',
    '#4a3b2f',
    '#3d2a33',
  ],
};

const lamps = [
  {
    id: 'lamp-1',
    x: -16.4,
    z: -7.6,
  },
  {
    id: 'lamp-2',
    x: 16.4,
    z: -7.6,
  },
  {
    id: 'lamp-3',
    x: -16.4,
    z: 7.6,
  },
  {
    id: 'lamp-4',
    x: 16.4,
    z: 7.6,
  },
  {
    id: 'lamp-5',
    x: 0,
    z: -8.2,
  },
  {
    id: 'lamp-6',
    x: 5.4,
    z: 8.2,
  },
];

const clouds = [
  {
    id: 'cloud-1',
    position: [
      10,
      11,
      -14,
    ],
    size: [
      3.4,
      0.7,
      1.8,
    ],
  },
  {
    id: 'cloud-2',
    position: [
      11.6,
      11.5,
      -13.2,
    ],
    size: [
      1.8,
      0.55,
      1.3,
    ],
  },
  {
    id: 'cloud-3',
    position: [
      -14,
      10.2,
      8,
    ],
    size: [
      2.8,
      0.6,
      1.6,
    ],
  },
  {
    id: 'cloud-4',
    position: [
      -12.6,
      10.7,
      8.6,
    ],
    size: [
      1.5,
      0.45,
      1.1,
    ],
  },
  {
    id: 'cloud-5',
    position: [
      4,
      12.4,
      16,
    ],
    size: [
      3.8,
      0.65,
      2,
    ],
  },
];

const skyTowers = [
  {
    id: 'tower-1',
    position: [
      -24,
      4.2,
      -12,
    ],
    size: [
      1.4,
      8.2,
      1.4,
    ],
    color: '#6d736e',
  },
  {
    id: 'tower-2',
    position: [
      -22.4,
      2.6,
      -10.6,
    ],
    size: [
      1,
      5.1,
      1,
    ],
    color: '#7d6f62',
  },
  {
    id: 'tower-3',
    position: [
      23,
      5.1,
      11,
    ],
    size: [
      1.6,
      9.8,
      1.3,
    ],
    color: '#5e6866',
  },
  {
    id: 'tower-4',
    position: [
      24.6,
      3.4,
      12.4,
    ],
    size: [
      0.9,
      6.4,
      0.9,
    ],
    color: '#8a7b6a',
  },
  {
    id: 'tower-5',
    position: [
      -8,
      3.8,
      24,
    ],
    size: [
      1.2,
      7.4,
      1.2,
    ],
    color: '#71786f',
  },
];

const sunChunks = [
  {
    id: 'sun-core',
    position: [
      18,
      16,
      -22,
    ],
    size: [
      2.4,
      2.4,
      2.4,
    ],
  },
  {
    id: 'sun-a',
    position: [
      19.6,
      16.2,
      -21.4,
    ],
    size: [
      1.1,
      1.1,
      1.1,
    ],
  },
  {
    id: 'sun-b',
    position: [
      17,
      17.2,
      -22.6,
    ],
    size: [
      1,
      1,
      1,
    ],
  },
  {
    id: 'sun-c',
    position: [
      16.8,
      15.1,
      -21.2,
    ],
    size: [
      0.85,
      0.85,
      0.85,
    ],
  },
];


function buildLaneDashes() {

  const dashes = [];

  const zs = [
    -5.76,
    -2.88,
    0,
    2.88,
    5.76,
  ];

  for (const z of zs) {
    for (let x = -16.2; x <= 16.2; x += 1.9) {
      dashes.push({
        id: `dash-${z}-${x}`,
        x,
        z,
      });
    }
  }


  return dashes;

}

function buildEdgeTeeth() {

  const teeth = [];
  let index = 0;

  for (let x = -17.5; x <= 17.5; x += 0.72) {

    teeth.push({
      id: `tooth-n-${index}`,
      position: [
        x,
        0.32,
        -8.86,
      ],
      color: index % 2 === 0 ? '#e07a2f' : '#1c1c1c',
    });

    index += 1;

    teeth.push({
      id: `tooth-s-${index}`,
      position: [
        x,
        0.32,
        8.86,
      ],
      color: index % 2 === 0 ? '#e07a2f' : '#1c1c1c',
    });

    index += 1;

  }


  return teeth;

}


const laneDashes = buildLaneDashes();
const edgeTeeth = buildEdgeTeeth();

const skyIslands = [
  {
    id: 'island-1',
    position: [
      20,
      7.2,
      -17,
    ],
    size: [
      3.4,
      0.42,
      2.5,
    ],
    color: '#b7c4b3',
  },
  {
    id: 'island-2',
    position: [
      -18,
      5.4,
      -20,
    ],
    size: [
      2.6,
      0.36,
      2.1,
    ],
    color: '#c3b49c',
  },
  {
    id: 'island-3',
    position: [
      8,
      9.5,
      22,
    ],
    size: [
      4.1,
      0.4,
      2.8,
    ],
    color: '#aeb9b4',
  },
  {
    id: 'island-4',
    position: [
      -22,
      8.1,
      14,
    ],
    size: [
      2.2,
      0.34,
      1.8,
    ],
    color: '#c9c2b4',
  },
  {
    id: 'island-5',
    position: [
      26,
      4.8,
      6,
    ],
    size: [
      1.8,
      0.3,
      1.6,
    ],
    color: '#9eaaa6',
  },
];


const skyGroup = shallowRef();


function updateSky(elapsed) {

  if (!skyGroup.value) {
    return;
  }


  skyGroup.value.rotation.y = elapsed * 0.016;

}


/* player */

const playerGroup = shallowRef();


function isOnPlatform(x, z) {
  return Math.abs(x) <= world.platformHalfWidth && Math.abs(z) <= world.platformHalfDepth;
}

function getLookAxes() {
  return {
    forwardX: Math.sin(sim.lookYaw),
    forwardZ: Math.cos(sim.lookYaw),
    rightX: Math.cos(sim.lookYaw),
    rightZ: -Math.sin(sim.lookYaw),
  };
}

function getMoveAxes() {

  const camera = playerCamera.value;

  if (!camera) {
    return getLookAxes();
  }


  const elements = camera.matrixWorld.elements;
  let rightX = elements[0];
  let rightZ = elements[2];
  let forwardX = -elements[8];
  let forwardZ = -elements[10];
  const rightLength = Math.hypot(rightX, rightZ);
  const forwardLength = Math.hypot(forwardX, forwardZ);

  if (rightLength < 0.0001 || forwardLength < 0.0001) {
    return getLookAxes();
  }


  return {
    forwardX: forwardX / forwardLength,
    forwardZ: forwardZ / forwardLength,
    rightX: rightX / rightLength,
    rightZ: rightZ / rightLength,
  };

}

function updatePlayer(step, elapsed) {

  const input = readMoveInput();
  const axes = getMoveAxes();
  const desiredVx = (axes.forwardX * input.z + axes.rightX * input.x) * world.moveSpeed;
  const desiredVz = (axes.forwardZ * input.z + axes.rightZ * input.x) * world.moveSpeed;
  const blend = Math.min(1, step * 16);


  sim.playerVx += (desiredVx - sim.playerVx) * blend;
  sim.playerVz += (desiredVz - sim.playerVz) * blend;
  sim.playerX += sim.playerVx * step;
  sim.playerZ += sim.playerVz * step;
  sim.playerYaw = Math.atan2(axes.forwardX, axes.forwardZ);


  const onPlatform = isOnPlatform(sim.playerX, sim.playerZ);

  if (sim.wasOnPlatform && !onPlatform) {
    burstCrumbs(sim.playerX, 0.16, sim.playerZ, 10, '#c4b8a5', 3.4, false);
    playBeep(210, 0.08, 0.028);
    sim.fovKick = 5;
  }

  sim.wasOnPlatform = onPlatform;


  if (onPlatform) {
    sim.playerY = 0;
  }
  else {

    sim.playerY -= world.gravity * step;

    if (sim.playerY < -10) {
      endRun('fall');
    }

  }


  if (!playerGroup.value) {
    return;
  }


  const moving = Math.hypot(sim.playerVx, sim.playerVz) > 0.35;
  const bob = moving && sim.playerY >= 0 ? Math.sin(elapsed * 11) * 0.045 : 0;

  playerGroup.value.position.set(sim.playerX, sim.playerY + bob, sim.playerZ);
  playerGroup.value.rotation.y = sim.playerYaw;
  playerGroup.value.visible = phase.value !== 'over' || overReason.value === 'fall';

  if (sim.grace > 0) {
    playerGroup.value.visible = Math.sin(elapsed * 30) > -0.15;
  }


  if (moving && sim.playerY >= 0 && phase.value === 'playing') {

    sim.dustAcc += step;

    if (sim.dustAcc > 0.11) {
      sim.dustAcc = 0;
      burstCrumbs(sim.playerX, 0.08, sim.playerZ, 2, '#c4b8a5', 1.1, false);
    }

  }

}


/* hazards */

const hazards = ref([]);


let nextHazardId = 1;


function createHazard() {

  const fromLeft = Math.random() < 0.5;
  const isHeavy = Math.random() < 0.18;
  const length = isHeavy ? 3.35 + Math.random() * 0.45 : 1.45 + Math.random() * 1.55;
  const width = 0.72 + Math.random() * 0.34;
  const height = isHeavy ? 1.05 + Math.random() * 0.25 : 0.52 + Math.random() * 0.5;
  const speed = (fromLeft ? 1 : -1) * (7.4 + Math.random() * 4.2 + Math.min(8, sim.playTime * 0.22));


  return {
    id: nextHazardId++,
    x: fromLeft ? -world.spawnX : world.spawnX,
    z: world.lanes[Math.floor(Math.random() * world.lanes.length)],
    length,
    width,
    height,
    speed,
    color: world.vehicleColors[Math.floor(Math.random() * world.vehicleColors.length)],
    mesh: null,
    nearMissed: false,
  };

}

function bindHazardMesh(hazard, mesh) {

  hazard.mesh = mesh || null;

  if (mesh) {
    mesh.position.set(hazard.x, hazard.height * 0.5, hazard.z);
    mesh.rotation.y = hazard.speed >= 0 ? 0 : Math.PI;
  }

}

function spawnHazard() {

  const hazard = createHazard();

  const blocked = hazards.value.some(it => {
    return it.z === hazard.z && Math.abs(it.x - hazard.x) < it.length + hazard.length + 2.4;
  });


  if (blocked) {
    return;
  }


  hazards.value = [
    ...hazards.value,
    hazard,
  ];

}

function updateHazards(step) {

  const keep = [];

  for (const hazard of hazards.value) {

    hazard.x += hazard.speed * step;

    if (hazard.mesh) {
      hazard.mesh.position.x = hazard.x;
    }

    if (Math.abs(hazard.x) < world.spawnX + 2) {
      keep.push(hazard);
    }

  }


  if (keep.length !== hazards.value.length) {
    hazards.value = keep;
  }

}

function spawnTraffic(step, rate) {

  sim.spawnAcc += step;


  const interval = Math.max(0.3, 1.08 - sim.playTime * 0.02);

  if (sim.spawnAcc < interval / rate) {
    return;
  }


  sim.spawnAcc = 0;
  spawnHazard();


  if (sim.playTime > 18 && Math.random() < 0.32) {
    spawnHazard();
  }

}

function isPlayerHit() {

  for (const hazard of hazards.value) {

    const overlapX = Math.abs(sim.playerX - hazard.x) < world.playerHalfWidth + hazard.length * 0.5;
    const overlapZ = Math.abs(sim.playerZ - hazard.z) < world.playerHalfDepth + hazard.width * 0.5;

    if (overlapX && overlapZ && sim.playerY > -0.15) {
      return true;
    }

  }


  return false;

}

function checkNearMisses() {
  for (const hazard of hazards.value) {

    if (hazard.nearMissed || sim.playerY < -0.05) {
      continue;
    }


    const gapX = Math.abs(sim.playerX - hazard.x) - (world.playerHalfWidth + hazard.length * 0.5);
    const gapZ = Math.abs(sim.playerZ - hazard.z) - (world.playerHalfDepth + hazard.width * 0.5);

    if (gapX < 0.62 && gapZ < 0.42 && gapX > -0.02) {
      hazard.nearMissed = true;
      triggerNearMiss(hazard);
    }

  }
}

function triggerNearMiss(hazard) {

  sim.timeScale = 0.32;
  sim.fovKick = 9;
  sim.shake = Math.max(sim.shake, 0.26);
  flashColor.value = '255 170 70';
  flashOpacity.value = 0.28;
  banner.value = 'CLOSE ONE!';
  sim.bannerUntil = sim.elapsed + 0.7;
  sim.bonusScore += 15;


  burstCrumbs(hazard.x, hazard.height * 0.4, hazard.z, 8, '#ffd27a', 4.2, true);
  playBeep(740, 0.07, 0.035);
  playBeep(980, 0.05, 0.025);

}


/* crumbs */

const crumbs = ref([]);


let nextCrumbId = 1;


function burstCrumbs(x, y, z, count, color, speed, spark) {

  const next = crumbs.value.slice();

  for (let index = 0; index < count; index += 1) {

    const angle = Math.random() * Math.PI * 2;
    const lift = 2.4 + Math.random() * 5.5;

    next.push({
      id: nextCrumbId++,
      x,
      y,
      z,
      vx: Math.cos(angle) * speed * (0.4 + Math.random()),
      vy: lift * (spark ? 0.7 : 0.35),
      vz: Math.sin(angle) * speed * (0.4 + Math.random()),
      life: 0.45 + Math.random() * 0.7,
      size: spark ? 0.08 + Math.random() * 0.1 : 0.1 + Math.random() * 0.14,
      color,
      spark,
      mesh: null,
    });

  }


  crumbs.value = next.slice(-80);

}

function bindCrumbMesh(crumb, mesh) {

  crumb.mesh = mesh || null;


  if (mesh) {
    mesh.position.set(crumb.x, crumb.y, crumb.z);
  }

}

function updateCrumbs(step) {

  const keep = [];

  for (const crumb of crumbs.value) {

    crumb.vy -= 22 * step;
    crumb.x += crumb.vx * step;
    crumb.y += crumb.vy * step;
    crumb.z += crumb.vz * step;
    crumb.life -= step;

    if (crumb.y < -1.2) {
      crumb.y = -1.2;
      crumb.vy *= -0.18;
      crumb.vx *= 0.6;
      crumb.vz *= 0.6;
    }

    if (crumb.mesh) {
      crumb.mesh.position.set(crumb.x, crumb.y, crumb.z);
      crumb.mesh.rotation.x += step * 8;
      crumb.mesh.rotation.z += step * 6;
    }

    if (crumb.life > 0) {
      keep.push(crumb);
    }

  }


  if (keep.length !== crumbs.value.length) {
    crumbs.value = keep;
  }

}


/* camera */

const playerCamera = shallowRef();


function updateCamera(step) {

  if (!playerCamera.value) {
    return;
  }


  const distance = 3.2;
  const height = 1.68;
  const shoulder = 0.64;
  const lookAhead = 2.55;
  const facingX = Math.sin(sim.lookYaw);
  const facingZ = Math.cos(sim.lookYaw);
  const rightX = Math.cos(sim.lookYaw);
  const rightZ = -Math.sin(sim.lookYaw);
  const shakeX = (Math.random() - 0.5) * sim.shake;
  const shakeY = (Math.random() - 0.5) * sim.shake;
  const targetX = sim.playerX - facingX * distance + rightX * shoulder + shakeX;
  const targetY = sim.playerY + height + sim.lookPitch * 0.85 + shakeY;
  const targetZ = sim.playerZ - facingZ * distance + rightZ * shoulder;
  const lookX = sim.playerX + facingX * lookAhead;
  const lookY = sim.playerY + 1.18 + sim.lookPitch * 1.55;
  const lookZ = sim.playerZ + facingZ * lookAhead;


  if (sim.needsCameraSnap) {
    playerCamera.value.position.set(targetX, targetY, targetZ);
    sim.needsCameraSnap = false;
  }
  else {
    const follow = Math.min(1, step * 10);
    playerCamera.value.position.x += (targetX - playerCamera.value.position.x) * follow;
    playerCamera.value.position.y += (targetY - playerCamera.value.position.y) * follow;
    playerCamera.value.position.z += (targetZ - playerCamera.value.position.z) * follow;
  }


  const speedBoost = Math.min(7, Math.hypot(sim.playerVx, sim.playerVz) * 0.4);

  playerCamera.value.fov = 58 + sim.fovKick + speedBoost;
  playerCamera.value.updateProjectionMatrix();
  playerCamera.value.lookAt(lookX, lookY, lookZ);
  playerCamera.value.updateMatrixWorld();

}

function updateBoothCamera(step, elapsed) {
  if (!playerCamera.value) {
    return;
  }


  const breathe = Math.sin(elapsed * 0.62) * 0.05;
  const sway = Math.sin(elapsed * 0.18) * 0.16;
  const follow = Math.min(1, step * 2.3);
  const targetX = 0.38 + sway;
  const targetY = 1.86 + breathe;
  const targetZ = 3.28;

  playerCamera.value.position.x += (targetX - playerCamera.value.position.x) * follow;
  playerCamera.value.position.y += (targetY - playerCamera.value.position.y) * follow;
  playerCamera.value.position.z += (targetZ - playerCamera.value.position.z) * follow;
  playerCamera.value.fov += (50 - playerCamera.value.fov) * follow;
  playerCamera.value.updateProjectionMatrix();
  playerCamera.value.lookAt(0, 1.7 + breathe * 0.25, 8.12);
  playerCamera.value.updateMatrixWorld();

}


/* audio */

let audioContext;


function getAudioContext() {

  if (import.meta.server) {
    return null;
  }


  if (!audioContext) {
    audioContext = new AudioContext();
  }


  return audioContext;

}

function playBeep(frequency, duration, gainValue) {

  const context = getAudioContext();

  if (!context) {
    return;
  }


  if (context.state === 'suspended') {
    context.resume();
  }


  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = 'square';
  oscillator.frequency.value = frequency;
  gain.gain.value = gainValue;

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
  oscillator.stop(context.currentTime + duration);

}


/* signs */

import { CanvasTexture, SRGBColorSpace } from 'three';


const boardSign = shallowRef(null);
const scoreSign = shallowRef(null);
const bestSign = shallowRef(null);
const playSign = shallowRef(null);
const bannerSign = shallowRef(null);
const goSign = shallowRef(null);
const againSign = shallowRef(null);
const backSign = shallowRef(null);
const hoveredWorldButton = ref('');


function createSign(width, height) {

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;

  return {
    canvas,
    ctx,
    texture,
  };

}

function fillParagraph(ctx, text, x, y, maxWidth, lineHeight) {

  const words = text.split(' ');
  let line = '';
  let cursorY = y;

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;

    if (ctx.measureText(next).width > maxWidth && line) {
      ctx.fillText(line, x, cursorY);
      line = word;
      cursorY += lineHeight;
    }
    else {
      line = next;
    }
  }


  if (line) {
    ctx.fillText(line, x, cursorY);
  }

}

function paintPanel(sign, background, draw) {
  if (!sign) {
    return;
  }


  const { ctx, canvas, texture } = sign;

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#e07a2f';
  ctx.lineWidth = Math.max(10, canvas.height * 0.045);
  ctx.strokeRect(14, 14, canvas.width - 28, canvas.height - 28);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  draw(ctx, canvas);
  texture.needsUpdate = true;

}

function paintBoard() {
  paintPanel(boardSign.value, '#161410', (ctx, canvas) => {
    if (phase.value === 'over') {
      ctx.fillStyle = '#ffe08a';
      ctx.font = '900 64px ui-sans-serif, system-ui';
      fillParagraph(ctx, overTitle.value, canvas.width / 2, 180, 880, 72);
      ctx.fillStyle = '#efe7d8';
      ctx.font = '700 36px ui-sans-serif, system-ui';
      ctx.fillText(`You lasted ${score.value}. Best so far is ${bestScore.value}.`, canvas.width / 2, 430);
    }
    else {
      ctx.fillStyle = '#ffe08a';
      ctx.font = '900 92px ui-sans-serif, system-ui';
      ctx.fillText('RUNNED OVER', canvas.width / 2, 150);
      ctx.fillStyle = '#efe7d8';
      ctx.font = '700 34px ui-sans-serif, system-ui';
      fillParagraph(ctx, 'You\'re on a floating slab. Big dumb boxes are doing 90. Don\'t become a stain.', canvas.width / 2, 300, 860, 44);
      ctx.fillStyle = '#c4b8a5';
      ctx.font = '600 28px ui-sans-serif, system-ui';
      ctx.fillText('WASD to scoot  ·  mouse to look  ·  stay on the island', canvas.width / 2, 520);
    }
  });
}

function paintScore() {
  paintPanel(scoreSign.value, '#1b1713', (ctx, canvas) => {
    ctx.fillStyle = '#c4b8a5';
    ctx.font = '800 32px ui-sans-serif, system-ui';
    ctx.fillText('SCORE', canvas.width / 2, 78);
    ctx.fillStyle = '#ffe08a';
    ctx.font = '900 92px ui-sans-serif, system-ui';
    ctx.fillText(String(score.value), canvas.width / 2, 168);
  });
}

function paintBest() {
  paintPanel(bestSign.value, '#1b1713', (ctx, canvas) => {
    ctx.fillStyle = '#c4b8a5';
    ctx.font = '800 32px ui-sans-serif, system-ui';
    ctx.fillText('BEST', canvas.width / 2, 78);
    ctx.fillStyle = '#efe7d8';
    ctx.font = '900 92px ui-sans-serif, system-ui';
    ctx.fillText(String(bestScore.value), canvas.width / 2, 168);
  });
}

function paintPlay() {
  paintPanel(playSign.value, '#161410', (ctx, canvas) => {
    ctx.fillStyle = '#ffe08a';
    ctx.font = '900 56px ui-sans-serif, system-ui';
    ctx.fillText(`SCORE ${score.value}`, canvas.width * 0.32, canvas.height / 2);
    ctx.fillStyle = '#efe7d8';
    ctx.font = '800 40px ui-sans-serif, system-ui';
    ctx.fillText(`BEST ${bestScore.value}`, canvas.width * 0.74, canvas.height / 2);
  });
}

function paintBanner() {
  paintPanel(bannerSign.value, '#3a140e', (ctx, canvas) => {
    ctx.fillStyle = '#ffe08a';
    ctx.font = '900 92px ui-sans-serif, system-ui';
    ctx.fillText(banner.value || '', canvas.width / 2, canvas.height / 2);
  });
}

function paintButton(sign, label, hot) {
  paintPanel(sign, hot ? '#2f6d2b' : '#211c17', (ctx, canvas) => {
    ctx.fillStyle = hot ? '#f4ffd8' : '#ffe08a';
    ctx.font = '900 56px ui-sans-serif, system-ui';
    ctx.fillText(label, canvas.width / 2, canvas.height / 2);
  });
}

function paintAllSigns() {
  paintBoard();
  paintScore();
  paintBest();
  paintPlay();
  paintBanner();
  paintButton(goSign.value, 'LET\'S GO', hoveredWorldButton.value === 'go');
  paintButton(againSign.value, 'ONE MORE', hoveredWorldButton.value === 'again');
  paintButton(backSign.value, 'THE LINEUP', hoveredWorldButton.value === 'back');
}

function handleWorldButtonEnter(name) {
  hoveredWorldButton.value = name;

  if (import.meta.client) {
    document.body.style.cursor = 'pointer';
  }

}

function handleWorldButtonLeave(name) {
  if (hoveredWorldButton.value === name) {
    hoveredWorldButton.value = '';
  }

  if (import.meta.client) {
    document.body.style.cursor = '';
  }

}

function handleBackToLineup() {
  navigateTo({
    name: 'mini-games.list',
  });
}


watchImmediate(
  () => [
    phase.value,
    score.value,
    bestScore.value,
    banner.value,
    overTitle.value,
    hoveredWorldButton.value,
  ],
  paintAllSigns,
);


onMounted(() => {
  boardSign.value = createSign(1024, 640);
  scoreSign.value = createSign(512, 256);
  bestSign.value = createSign(512, 256);
  playSign.value = createSign(768, 192);
  bannerSign.value = createSign(1024, 256);
  goSign.value = createSign(512, 192);
  againSign.value = createSign(512, 192);
  backSign.value = createSign(512, 192);
  paintAllSigns();
});


/* run */

function resetRun() {
  hazards.value = [];
  crumbs.value = [];
  score.value = 0;
  flashOpacity.value = 0;
  flashColor.value = '255 255 255';
  banner.value = '';
  sceneTint.value = '#6ea3b6';
  vignette.value = 0.28;
  sim.spawnAcc = 0;
  sim.playTime = 0;
  sim.lookYaw = 0;
  sim.lookPitch = -0.04;
  sim.shake = 0;
  sim.grace = 0.85;
  sim.needsCameraSnap = true;
  sim.playerX = 0;
  sim.playerY = 0;
  sim.playerZ = 0;
  sim.playerYaw = 0;
  sim.playerVx = 0;
  sim.playerVz = 0;
  sim.touchX = 0;
  sim.touchZ = 0;
  sim.timeScale = 1;
  sim.fovKick = 0;
  sim.dustAcc = 0;
  sim.bannerUntil = 0;
  sim.bonusScore = 0;
  sim.wasOnPlatform = true;
}

function endRun(reason) {

  if (phase.value !== 'playing') {
    return;
  }


  phase.value = 'over';
  overReason.value = reason;
  sim.timeScale = 0.18;
  sim.fovKick = reason === 'hit' ? 14 : 8;
  sim.shake = reason === 'hit' ? 0.62 : 0.28;
  flashColor.value = reason === 'hit' ? '220 40 28' : '180 210 230';
  flashOpacity.value = reason === 'hit' ? 0.7 : 0.38;
  banner.value = reason === 'hit' ? 'SPLAT!' : 'AIRMAIL!';
  sim.bannerUntil = sim.elapsed + 1.4;
  vignette.value = 0.62;


  if (reason === 'hit') {
    burstCrumbs(sim.playerX, 0.8, sim.playerZ, 28, '#2a2a2a', 7.2, false);
    burstCrumbs(sim.playerX, 0.9, sim.playerZ, 14, '#ff6a3a', 8.4, true);
    playBeep(90, 0.22, 0.05);
    playBeep(48, 0.34, 0.04);
  }
  else {
    burstCrumbs(sim.playerX, sim.playerY + 0.4, sim.playerZ, 16, '#c4b8a5', 3.6, false);
    playBeep(160, 0.18, 0.04);
    playBeep(90, 0.28, 0.035);
  }


  if (score.value > bestScore.value) {
    bestScore.value = score.value;
  }


  unlockPointer();

}


/* loop */

function handleReady(context) {

  const renderer = context.renderer?.instance ?? context.renderer;

  if (renderer?.shadowMap) {
    renderer.shadowMap.enabled = true;
  }

  if (renderer && 'toneMappingExposure' in renderer) {
    renderer.toneMappingExposure = 1.08;
  }

}

function handleLoop({ delta, elapsed }) {

  const raw = Math.min(delta || 0.016, 0.05);

  sim.elapsed = elapsed;
  sim.timeScale += (1 - sim.timeScale) * Math.min(1, raw * 3.6);
  sim.fovKick += (0 - sim.fovKick) * Math.min(1, raw * 5.5);


  const step = raw * sim.timeScale;


  updateSky(elapsed);
  updateHazards(step);
  updateCrumbs(step);
  spawnTraffic(step, phase.value === 'playing' ? 1 : 0.62);

  sim.shake = Math.max(0, sim.shake - raw * 1.7);
  flashOpacity.value = Math.max(0, flashOpacity.value - raw * 1.05);
  vignette.value += ((phase.value === 'playing' ? 0.32 : 0.42) - vignette.value) * Math.min(1, raw * 3);

  if (banner.value && elapsed > sim.bannerUntil) {
    banner.value = '';
  }


  if (phase.value !== 'playing') {
    sceneTint.value = '#6ea3b6';
    updateBoothCamera(raw, elapsed);
    return;
  }


  if (!isPageVisible.value) {
    return;
  }


  sim.playTime += step;
  sim.grace = Math.max(0, sim.grace - step);
  score.value = Math.floor(sim.playTime * 10) + sim.bonusScore;

  const dusk = Math.min(0.45, sim.playTime * 0.006);
  sceneTint.value = dusk > 0.08 ? '#7f8ea0' : '#6ea3b6';


  updateCamera(raw);
  updatePlayer(step, elapsed);
  checkNearMisses();


  if (sim.grace <= 0 && isPlayerHit()) {
    endRun('hit');
  }

}


onBeforeUnmount(() => {
  unlockPointer();
  audioContext?.close();
  audioContext = undefined;

  if (import.meta.client) {
    document.body.style.cursor = '';
  }

  for (const sign of [boardSign.value, scoreSign.value, bestSign.value, playSign.value, bannerSign.value, goSign.value, againSign.value, backSign.value]) {
    sign?.texture?.dispose();
  }

});


/* handlers */

async function handleStart() {

  resetRun();
  phase.value = 'playing';
  banner.value = 'GO GO GO';
  sim.bannerUntil = sim.elapsed + 1.1;
  sim.fovKick = 6;
  burstCrumbs(0, 0.2, 0, 12, '#efe7d8', 3.2, false);
  playBeep(320, 0.06, 0.03);
  playBeep(520, 0.08, 0.03);


  try {
    await lockPointer();
  }
  catch {
    // Pointer lock can be denied; keyboard and touch still work.
  }

}

async function handleReplay() {
  await handleStart();
}

function handleSurfaceClick() {
  if (phase.value === 'playing' && !isPointerLocked.value) {
    lockPointer();
  }
}

</script>


<template>
  <window-base
    pito="game-controller"
    title="Runned Over">
    <div
      ref="gameSurfaceEl"
      class="relative h-full min-h-[28rem] overflow-hidden"
      :style="{
        backgroundColor: sceneTint,
      }"
      @click="handleSurfaceClick">

      <TresCanvas
        shadows
        :clear-color="sceneTint"
        class="absolute inset-0"
        @ready="handleReady"
        @loop="handleLoop">

        <tres-perspective-camera
          ref="playerCamera"
          :args="[58, 1, 0.12, 160]"
          :position="[2.4, 1.7, -3.1]"
        />

        <tres-fog
          :args="[
            sceneTint,
            14,
            62,
          ]"
        />

        <tres-hemisphere-light
          :args="[
            '#d5e8ef',
            '#8a7a64',
            0.78,
          ]"
        />

        <tres-ambient-light :intensity="0.22" />

        <tres-directional-light
          :position="[16, 24, 10]"
          :intensity="3.15"
          :cast-shadow="true"
          :shadow-mapSize-width="2048"
          :shadow-mapSize-height="2048"
          :shadow-bias="-0.00025"
          :shadow-camera-near="2"
          :shadow-camera-far="70"
          :shadow-camera-left="-22"
          :shadow-camera-right="22"
          :shadow-camera-top="16"
          :shadow-camera-bottom="-16"
        />

        <tres-mesh
          :position="[0, -0.18, 0]"
          :receive-shadow="true">
          <tres-box-geometry
            :args="[
              37.2,
              0.2,
              19.2,
            ]"
          />
          <tres-mesh-standard-material
            color="#8d8273"
            :roughness="1"
            :metalness="0"
          />
        </tres-mesh>

        <tres-mesh
          :position="[0, 0, 0]"
          :receive-shadow="true">
          <tres-box-geometry
            :args="[
              world.platformWidth,
              0.48,
              world.platformDepth,
            ]"
          />
          <tres-mesh-standard-material
            color="#c4b8a5"
            :roughness="0.94"
            :metalness="0.02"
          />
        </tres-mesh>

        <template v-for="dash in laneDashes" :key="dash.id">
          <tres-mesh
            :position="[dash.x, 0.248, dash.z]"
            :receive-shadow="true">
            <tres-box-geometry
              :args="[
                0.9,
                0.02,
                0.12,
              ]"
            />
            <tres-mesh-standard-material
              color="#efe7d8"
              :roughness="0.62"
              :metalness="0"
            />
          </tres-mesh>
        </template>

        <template v-for="tooth in edgeTeeth" :key="tooth.id">
          <tres-mesh
            :position="tooth.position"
            :cast-shadow="true"
            :receive-shadow="true">
            <tres-box-geometry
              :args="[
                0.62,
                0.16,
                0.28,
              ]"
            />
            <tres-mesh-standard-material
              :color="tooth.color"
              :roughness="0.7"
              :metalness="0.04"
              :emissive="tooth.color === '#e07a2f' ? '#5a2208' : '#000000'"
            />
          </tres-mesh>
        </template>

        <template v-for="lamp in lamps" :key="lamp.id">
          <tres-group
            :position="[
              lamp.x,
              0,
              lamp.z,
            ]">
            <tres-mesh
              :position="[0, 1.05, 0]"
              :cast-shadow="true">
              <tres-box-geometry
                :args="[
                  0.16,
                  2.1,
                  0.16,
                ]"
              />
              <tres-mesh-standard-material
                color="#2d2d2d"
                :roughness="0.55"
                :metalness="0.2"
              />
            </tres-mesh>
            <tres-mesh
              :position="[0, 2.18, 0]"
              :cast-shadow="true">
              <tres-box-geometry
                :args="[
                  0.42,
                  0.22,
                  0.42,
                ]"
              />
              <tres-mesh-standard-material
                color="#ffd27a"
                :emissive="'#ffb347'"
                :emissiveIntensity="1.4"
                :roughness="0.35"
                :metalness="0.05"
              />
            </tres-mesh>
          </tres-group>
        </template>

        <tres-group ref="playerGroup">
          <tres-mesh
            :position="[0, 0.74, 0]"
            :cast-shadow="true"
            :receive-shadow="true">
            <tres-box-geometry
              :args="[
                0.42,
                0.74,
                0.28,
              ]"
            />
            <tres-mesh-standard-material
              color="#2a2a2a"
              :roughness="0.62"
              :metalness="0.08"
            />
          </tres-mesh>

          <tres-mesh
            :position="[0.2, 0.96, 0]"
            :cast-shadow="true">
            <tres-box-geometry
              :args="[
                0.16,
                0.14,
                0.3,
              ]"
            />
            <tres-mesh-standard-material
              color="#d8d1c5"
              :roughness="0.55"
              :metalness="0.04"
            />
          </tres-mesh>

          <tres-mesh
            :position="[0, 1.24, 0]"
            :cast-shadow="true">
            <tres-box-geometry
              :args="[
                0.28,
                0.28,
                0.28,
              ]"
            />
            <tres-mesh-standard-material
              color="#3a3a3a"
              :roughness="0.58"
              :metalness="0.06"
            />
          </tres-mesh>

          <tres-mesh :position="[-0.07, 1.28, 0.15]">
            <tres-box-geometry
              :args="[
                0.07,
                0.07,
                0.05,
              ]"
            />
            <tres-mesh-standard-material
              color="#7fe7ff"
              :emissive="'#3ad4ff'"
              :emissiveIntensity="1.6"
              :roughness="0.2"
              :metalness="0"
            />
          </tres-mesh>

          <tres-mesh :position="[0.07, 1.28, 0.15]">
            <tres-box-geometry
              :args="[
                0.07,
                0.07,
                0.05,
              ]"
            />
            <tres-mesh-standard-material
              color="#7fe7ff"
              :emissive="'#3ad4ff'"
              :emissiveIntensity="1.6"
              :roughness="0.2"
              :metalness="0"
            />
          </tres-mesh>

          <tres-mesh
            :position="[-0.12, 0.22, 0]"
            :cast-shadow="true">
            <tres-box-geometry
              :args="[
                0.14,
                0.36,
                0.16,
              ]"
            />
            <tres-mesh-standard-material
              color="#1f1f1f"
              :roughness="0.7"
              :metalness="0.04"
            />
          </tres-mesh>

          <tres-mesh
            :position="[0.12, 0.22, 0]"
            :cast-shadow="true">
            <tres-box-geometry
              :args="[
                0.14,
                0.36,
                0.16,
              ]"
            />
            <tres-mesh-standard-material
              color="#1f1f1f"
              :roughness="0.7"
              :metalness="0.04"
            />
          </tres-mesh>
        </tres-group>

        <template v-for="hazard in hazards" :key="hazard.id">
          <tres-group :ref="it => bindHazardMesh(hazard, it)">
            <tres-mesh
              :cast-shadow="true"
              :receive-shadow="true">
              <tres-box-geometry
                :args="[
                  hazard.length,
                  hazard.height,
                  hazard.width,
                ]"
              />
              <tres-mesh-standard-material
                :color="hazard.color"
                :roughness="0.48"
                :metalness="0.16"
              />
            </tres-mesh>

            <tres-mesh
              :position="[hazard.length * 0.22, hazard.height * 0.28, 0]"
              :cast-shadow="true">
              <tres-box-geometry
                :args="[
                  hazard.length * 0.36,
                  hazard.height * 0.4,
                  hazard.width * 0.7,
                ]"
              />
              <tres-mesh-standard-material
                color="#d5dbe0"
                :roughness="0.22"
                :metalness="0.08"
              />
            </tres-mesh>

            <tres-mesh
              :position="[hazard.length * 0.48, -hazard.height * 0.12, hazard.width * 0.28]">
              <tres-box-geometry
                :args="[
                  0.12,
                  0.12,
                  0.12,
                ]"
              />
              <tres-mesh-standard-material
                color="#ffe08a"
                :emissive="'#ffc14d'"
                :emissiveIntensity="2"
                :roughness="0.3"
                :metalness="0"
              />
            </tres-mesh>

            <tres-mesh
              :position="[hazard.length * 0.48, -hazard.height * 0.12, -hazard.width * 0.28]">
              <tres-box-geometry
                :args="[
                  0.12,
                  0.12,
                  0.12,
                ]"
              />
              <tres-mesh-standard-material
                color="#ffe08a"
                :emissive="'#ffc14d'"
                :emissiveIntensity="2"
                :roughness="0.3"
                :metalness="0"
              />
            </tres-mesh>

            <tres-mesh
              :position="[-hazard.length * 0.46, -hazard.height * 0.08, hazard.width * 0.26]">
              <tres-box-geometry
                :args="[
                  0.1,
                  0.1,
                  0.16,
                ]"
              />
              <tres-mesh-standard-material
                color="#ff4d3a"
                :emissive="'#ff2a1a'"
                :emissiveIntensity="1.5"
                :roughness="0.35"
                :metalness="0"
              />
            </tres-mesh>

            <tres-mesh
              :position="[-hazard.length * 0.46, -hazard.height * 0.08, -hazard.width * 0.26]">
              <tres-box-geometry
                :args="[
                  0.1,
                  0.1,
                  0.16,
                ]"
              />
              <tres-mesh-standard-material
                color="#ff4d3a"
                :emissive="'#ff2a1a'"
                :emissiveIntensity="1.5"
                :roughness="0.35"
                :metalness="0"
              />
            </tres-mesh>

            <tres-mesh
              :position="[hazard.length * 0.18, -hazard.height * 0.38, hazard.width * 0.38]"
              :cast-shadow="true">
              <tres-box-geometry
                :args="[
                  hazard.length * 0.28,
                  0.16,
                  0.16,
                ]"
              />
              <tres-mesh-standard-material
                color="#141414"
                :roughness="0.8"
                :metalness="0.15"
              />
            </tres-mesh>

            <tres-mesh
              :position="[hazard.length * 0.18, -hazard.height * 0.38, -hazard.width * 0.38]"
              :cast-shadow="true">
              <tres-box-geometry
                :args="[
                  hazard.length * 0.28,
                  0.16,
                  0.16,
                ]"
              />
              <tres-mesh-standard-material
                color="#141414"
                :roughness="0.8"
                :metalness="0.15"
              />
            </tres-mesh>
          </tres-group>
        </template>

        <template v-for="crumb in crumbs" :key="crumb.id">
          <tres-mesh :ref="it => bindCrumbMesh(crumb, it)">
            <tres-box-geometry
              :args="[
                crumb.size,
                crumb.size,
                crumb.size,
              ]"
            />
            <tres-mesh-standard-material
              :color="crumb.color"
              :emissive="crumb.spark ? crumb.color : '#000000'"
              :emissiveIntensity="crumb.spark ? 1.8 : 0"
              :roughness="0.55"
              :metalness="0.05"
            />
          </tres-mesh>
        </template>

        <tres-group ref="skyGroup">
          <template v-for="island in skyIslands" :key="island.id">
            <tres-mesh
              :position="island.position"
              :cast-shadow="true"
              :receive-shadow="true">
              <tres-box-geometry :args="island.size" />
              <tres-mesh-standard-material
                :color="island.color"
                :roughness="0.96"
                :metalness="0"
              />
            </tres-mesh>
          </template>

          <template v-for="tower in skyTowers" :key="tower.id">
            <tres-mesh
              :position="tower.position"
              :cast-shadow="true"
              :receive-shadow="true">
              <tres-box-geometry :args="tower.size" />
              <tres-mesh-standard-material
                :color="tower.color"
                :roughness="0.92"
                :metalness="0.03"
              />
            </tres-mesh>
          </template>

          <template v-for="cloud in clouds" :key="cloud.id">
            <tres-mesh :position="cloud.position">
              <tres-box-geometry :args="cloud.size" />
              <tres-mesh-standard-material
                color="#eef4f6"
                :roughness="1"
                :metalness="0"
              />
            </tres-mesh>
          </template>
        </tres-group>

        <template v-for="chunk in sunChunks" :key="chunk.id">
          <tres-mesh :position="chunk.position">
            <tres-box-geometry :args="chunk.size" />
            <tres-mesh-standard-material
              color="#ffd36a"
              :emissive="'#ffb020'"
              :emissiveIntensity="1.8"
              :roughness="0.4"
              :metalness="0"
            />
          </tres-mesh>
        </template>

        <tres-group
          :position="[-4.85, 0, 8.05]"
          :rotation="[0, 0.38, 0]">
          <tres-mesh
            :position="[0, 1.15, 0]"
            :cast-shadow="true">
            <tres-box-geometry
              :args="[
                0.28,
                2.3,
                0.28,
              ]"
            />
            <tres-mesh-standard-material
              color="#2a2420"
              :roughness="0.7"
              :metalness="0.08"
            />
          </tres-mesh>
          <template v-if="scoreSign">
            <tres-mesh
              :position="[0, 2.55, 0.12]"
              :cast-shadow="true">
              <tres-box-geometry
                :args="[
                  2.1,
                  1.05,
                  0.16,
                ]"
              />
              <tres-mesh-standard-material
                color="#1b1713"
                :roughness="0.8"
                :metalness="0"
              />
            </tres-mesh>
            <tres-mesh :position="[0, 2.55, 0.21]">
              <tres-plane-geometry
                :args="[
                  1.92,
                  0.9,
                ]"
              />
              <tres-mesh-basic-material
                :map="scoreSign.texture"
                :tone-mapped="false"
              />
            </tres-mesh>
          </template>
        </tres-group>

        <tres-group
          :position="[4.85, 0, 8.05]"
          :rotation="[0, -0.38, 0]">
          <tres-mesh
            :position="[0, 1.15, 0]"
            :cast-shadow="true">
            <tres-box-geometry
              :args="[
                0.28,
                2.3,
                0.28,
              ]"
            />
            <tres-mesh-standard-material
              color="#2a2420"
              :roughness="0.7"
              :metalness="0.08"
            />
          </tres-mesh>
          <template v-if="bestSign">
            <tres-mesh
              :position="[0, 2.55, 0.12]"
              :cast-shadow="true">
              <tres-box-geometry
                :args="[
                  2.1,
                  1.05,
                  0.16,
                ]"
              />
              <tres-mesh-standard-material
                color="#1b1713"
                :roughness="0.8"
                :metalness="0"
              />
            </tres-mesh>
            <tres-mesh :position="[0, 2.55, 0.21]">
              <tres-plane-geometry
                :args="[
                  1.92,
                  0.9,
                ]"
              />
              <tres-mesh-basic-material
                :map="bestSign.texture"
                :tone-mapped="false"
              />
            </tres-mesh>
          </template>
        </tres-group>

        <tres-mesh
          :position="[-5.6, 1.7, 0]"
          :cast-shadow="true">
          <tres-box-geometry
            :args="[
              0.26,
              3.4,
              0.26,
            ]"
          />
          <tres-mesh-standard-material
            color="#2a2420"
            :roughness="0.7"
            :metalness="0.08"
          />
        </tres-mesh>

        <tres-mesh
          :position="[5.6, 1.7, 0]"
          :cast-shadow="true">
          <tres-box-geometry
            :args="[
              0.26,
              3.4,
              0.26,
            ]"
          />
          <tres-mesh-standard-material
            color="#2a2420"
            :roughness="0.7"
            :metalness="0.08"
          />
        </tres-mesh>

        <tres-mesh
          :position="[0, 3.38, 0]"
          :cast-shadow="true">
          <tres-box-geometry
            :args="[
              11.6,
              0.22,
              0.3,
            ]"
          />
          <tres-mesh-standard-material
            color="#2a2420"
            :roughness="0.68"
            :metalness="0.1"
          />
        </tres-mesh>

        <template v-if="banner && bannerSign">
          <tres-mesh :position="[0, 2.92, 0]">
            <tres-box-geometry
              :args="[
                3.4,
                0.72,
                0.12,
              ]"
            />
            <tres-mesh-standard-material
              color="#3a140e"
              :roughness="0.7"
              :metalness="0"
            />
          </tres-mesh>
          <tres-mesh :position="[0, 2.92, 0.07]">
            <tres-plane-geometry
              :args="[
                3.2,
                0.6,
              ]"
            />
            <tres-mesh-basic-material
              :map="bannerSign.texture"
              :tone-mapped="false"
            />
          </tres-mesh>
          <tres-mesh
            :position="[0, 2.92, -0.07]"
            :rotation="[0, Math.PI, 0]">
            <tres-plane-geometry
              :args="[
                3.2,
                0.6,
              ]"
            />
            <tres-mesh-basic-material
              :map="bannerSign.texture"
              :tone-mapped="false"
            />
          </tres-mesh>
        </template>
        <template v-else-if="playSign">
          <tres-mesh :position="[0, 2.92, 0]">
            <tres-box-geometry
              :args="[
                3.4,
                0.58,
                0.12,
              ]"
            />
            <tres-mesh-standard-material
              color="#1b1713"
              :roughness="0.78"
              :metalness="0"
            />
          </tres-mesh>
          <tres-mesh :position="[0, 2.92, 0.07]">
            <tres-plane-geometry
              :args="[
                3.2,
                0.48,
              ]"
            />
            <tres-mesh-basic-material
              :map="playSign.texture"
              :tone-mapped="false"
            />
          </tres-mesh>
          <tres-mesh
            :position="[0, 2.92, -0.07]"
            :rotation="[0, Math.PI, 0]">
            <tres-plane-geometry
              :args="[
                3.2,
                0.48,
              ]"
            />
            <tres-mesh-basic-material
              :map="playSign.texture"
              :tone-mapped="false"
            />
          </tres-mesh>
        </template>

        <tres-group
          :position="[0, 0, 8.42]"
          :rotation="[0, Math.PI, 0]">
          <tres-mesh
            :position="[-1.55, 1.2, 0]"
            :cast-shadow="true">
            <tres-box-geometry
              :args="[
                0.3,
                2.4,
                0.3,
              ]"
            />
            <tres-mesh-standard-material
              color="#2a2420"
              :roughness="0.7"
              :metalness="0.08"
            />
          </tres-mesh>
          <tres-mesh
            :position="[1.55, 1.2, 0]"
            :cast-shadow="true">
            <tres-box-geometry
              :args="[
                0.3,
                2.4,
                0.3,
              ]"
            />
            <tres-mesh-standard-material
              color="#2a2420"
              :roughness="0.7"
              :metalness="0.08"
            />
          </tres-mesh>
          <tres-mesh
            :position="[0, 0.42, 0.38]"
            :cast-shadow="true"
            :receive-shadow="true">
            <tres-box-geometry
              :args="[
                3.5,
                0.18,
                0.9,
              ]"
            />
            <tres-mesh-standard-material
              color="#3d3228"
              :roughness="0.78"
              :metalness="0.04"
            />
          </tres-mesh>
          <template v-if="boardSign">
            <tres-mesh
              :position="[0, 2.12, 0.08]"
              :cast-shadow="true">
              <tres-box-geometry
                :args="[
                  3.55,
                  2.05,
                  0.16,
                ]"
              />
              <tres-mesh-standard-material
                color="#1b1713"
                :roughness="0.75"
                :metalness="0.04"
              />
            </tres-mesh>
            <tres-mesh :position="[0, 2.12, 0.17]">
              <tres-plane-geometry
                :args="[
                  3.32,
                  1.86,
                ]"
              />
              <tres-mesh-basic-material
                :map="boardSign.texture"
                :tone-mapped="false"
              />
            </tres-mesh>
          </template>

          <template v-if="phase === 'menu' && goSign">
            <tres-group
              :position="[0, 0.78, 0.52]"
              :scale="hoveredWorldButton === 'go' ? 1.08 : 1"
              @click="handleStart"
              @pointerenter="handleWorldButtonEnter('go')"
              @pointerleave="handleWorldButtonLeave('go')">
              <tres-mesh :cast-shadow="true">
                <tres-box-geometry
                  :args="[
                    1.46,
                    0.4,
                    0.28,
                  ]"
                />
                <tres-mesh-standard-material
                  :color="hoveredWorldButton === 'go' ? '#3d8a3a' : '#2c5f2a'"
                  :emissive="hoveredWorldButton === 'go' ? '#1d4a1c' : '#0d220c'"
                  :roughness="0.55"
                  :metalness="0.08"
                />
              </tres-mesh>
              <tres-mesh :position="[0, 0, 0.15]">
                <tres-plane-geometry
                  :args="[
                    1.34,
                    0.3,
                  ]"
                />
                <tres-mesh-basic-material
                  :map="goSign.texture"
                  :tone-mapped="false"
                />
              </tres-mesh>
            </tres-group>
          </template>

          <template v-if="phase === 'over' && againSign && backSign">
            <tres-group
              :position="[-0.82, 0.78, 0.52]"
              :scale="hoveredWorldButton === 'again' ? 1.08 : 1"
              @click="handleReplay"
              @pointerenter="handleWorldButtonEnter('again')"
              @pointerleave="handleWorldButtonLeave('again')">
              <tres-mesh :cast-shadow="true">
                <tres-box-geometry
                  :args="[
                    1.32,
                    0.38,
                    0.28,
                  ]"
                />
                <tres-mesh-standard-material
                  :color="hoveredWorldButton === 'again' ? '#3d8a3a' : '#2c5f2a'"
                  :emissive="hoveredWorldButton === 'again' ? '#1d4a1c' : '#0d220c'"
                  :roughness="0.55"
                  :metalness="0.08"
                />
              </tres-mesh>
              <tres-mesh :position="[0, 0, 0.15]">
                <tres-plane-geometry
                  :args="[
                    1.2,
                    0.28,
                  ]"
                />
                <tres-mesh-basic-material
                  :map="againSign.texture"
                  :tone-mapped="false"
                />
              </tres-mesh>
            </tres-group>

            <tres-group
              :position="[0.82, 0.78, 0.52]"
              :scale="hoveredWorldButton === 'back' ? 1.08 : 1"
              @click="handleBackToLineup"
              @pointerenter="handleWorldButtonEnter('back')"
              @pointerleave="handleWorldButtonLeave('back')">
              <tres-mesh :cast-shadow="true">
                <tres-box-geometry
                  :args="[
                    1.32,
                    0.38,
                    0.28,
                  ]"
                />
                <tres-mesh-standard-material
                  :color="hoveredWorldButton === 'back' ? '#6a5340' : '#3d3228'"
                  :emissive="hoveredWorldButton === 'back' ? '#2a2018' : '#100c09'"
                  :roughness="0.6"
                  :metalness="0.06"
                />
              </tres-mesh>
              <tres-mesh :position="[0, 0, 0.15]">
                <tres-plane-geometry
                  :args="[
                    1.2,
                    0.28,
                  ]"
                />
                <tres-mesh-basic-material
                  :map="backSign.texture"
                  :tone-mapped="false"
                />
              </tres-mesh>
            </tres-group>
          </template>
        </tres-group>

      </TresCanvas>

      <div
        class="absolute inset-0 pointer-events-none"
        :style="{
          boxShadow: `inset 0 0 140px rgb(0 0 0 / ${vignette}), inset 0 0 0 9999px rgb(${flashColor} / ${flashOpacity})`,
        }"
      />

      <template v-if="phase === 'playing' && isCoarsePointer">
        <div class="absolute bottom-10 left-3 grid grid-cols-3 gap-1.5 pointer-events-auto">
          <div />
          <u-button
            icon="lucide:chevron-up"
            class="size-11"
            @pointerdown="handleTouchPress('touchZ', 1, $event)"
            @pointerup="handleTouchRelease('touchZ')"
            @pointercancel="handleTouchRelease('touchZ')"
          />
          <div />
          <u-button
            icon="lucide:chevron-left"
            class="size-11"
            @pointerdown="handleTouchPress('touchX', -1, $event)"
            @pointerup="handleTouchRelease('touchX')"
            @pointercancel="handleTouchRelease('touchX')"
          />
          <u-button
            icon="lucide:chevron-down"
            class="size-11"
            @pointerdown="handleTouchPress('touchZ', -1, $event)"
            @pointerup="handleTouchRelease('touchZ')"
            @pointercancel="handleTouchRelease('touchZ')"
          />
          <u-button
            icon="lucide:chevron-right"
            class="size-11"
            @pointerdown="handleTouchPress('touchX', 1, $event)"
            @pointerup="handleTouchRelease('touchX')"
            @pointercancel="handleTouchRelease('touchX')"
          />
        </div>

        <div
          class="absolute inset-y-16 right-0 w-2/5 pointer-events-auto"
          @pointerdown.stop="handleLookPointerDown"
          @pointermove.stop="handleLookPointerMove"
          @pointerup.stop="handleLookPointerUp"
          @pointercancel.stop="handleLookPointerUp"
        />
      </template>

    </div>
  </window-base>
</template>
