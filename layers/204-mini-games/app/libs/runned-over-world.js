
/* responsibility */

// Defines the static world layout and scenery
// for the Runned Over minigame.


export const world = {
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

export const lamps = [
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

export const clouds = [
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

export const skyTowers = [
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

export const sunChunks = [
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

export const skyIslands = [
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

export const laneDashes = buildLaneDashes();
export const edgeTeeth = buildEdgeTeeth();


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
