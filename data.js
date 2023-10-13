let data = {
  shrek: {
    hitbox: {
      x: 45,
      y: 90
    },
    life: 3,
    lifeMax: 3,
    speed: 260,
    maxJumpVel: 300,
    sprite: {
      default: images.shrek.default
    },
    spriteDimensions: {
      x: 122,
      y: 122
    },
    spriteOffset: {
      x: 0,
      y: -10,
    },
    offset: {
      x: 0,
      y: 0,
    },
    // stamina: 100,
    // stamina_recharge: 85,
    stamina: 60,
    stamina_recharge: 65,
    dash: {
      distance: 360,
      duration: 380,
      cooldown: 2200,
    },
    invulnerableWindow: 1500,
    umbrellaIndicator: {
      size: {
        x: 50,
        y: 50
      }
    },
    staminaIndicator: {
      size: {
        x: 12,
        y: 70
      },
      padding: 2,
      minHeight: 8,
      offset: {
        x: -38,
        y: -12
      },
    }
  },
  npc: {
    // boulderman: {
    //   hitbox: {
    //     x: 45,
    //     y: 90
    //   },
    //   sprite: {
    //     default: images.npc_boulderman.right
    //   },
    //   spriteDimensions: {
    //     x: 120,
    //     y: 120
    //   },
    //   spriteOffset: {
    //     x: 0,
    //     y: 0,
    //   },
    //   offset: {
    //     x: 0,
    //     y: 0,
    //   },
    // },
    javelineer: {
      hitbox: {
        x: 45,
        y: 104
      },
      attackArea: {
        pos: { // this is automatically calculated inside the class
          x: 0,
          y: 0,
        },
        hitbox:  {
          x: 45,
          y: 22
        },
        offset: {
          x: 45,
          y: 5
        }
      },
      sprite: {
        right: images.npc_javelineer.right,
        left: images.npc_javelineer.left
      },
      spriteDimensions: {
        x: 150,
        y: 150
      },
      spriteOffset: {
        x: 0,
        y: 0,
      },
      offset: {
        x: 0,
        y: -62,
      },
      turnFrequency: 1200, //in ms
    },
  },
  umbrella: {
    hitbox: {
      x: 70,
      y: 70
    },
    sprite: {
      default: images.umbrella.default,
      super: images.umbrella.super,
    },
    spriteDimensions: {
      x: 75,
      y: 75
    },
    spriteOffset: {
      x: 0,
      y: 0,
    },
    offset: {
      x: 0,
      y: 0,
    },
    variants: {
      default: {
        duration: 6000
      },
      super: {
        duration: 9000
      },
    },
    fallReduction: 0.82,
    fallSpeedMod: 0.55,
  },
  cloud: {
    hitbox: {
      x: 70,
      y: 40
    },
    sprite: {
      default: images.cloud.default
    },
    spriteDimensions: {
      x: 100,
      y: 100
    },
    spriteOffset: {
      x: 0,
      y: 0,
    },
    offset: {
      x: 0,
      y: 0,
    },
    duration: 6000,
    fallSpeedMod: 1,
    speedReduction: 0.8,
  },
  onion: {
    hitbox: {
      x: 70,
      y: 70
    },
    sprite: {
      default: images.onion.default
    },
    spriteDimensions: {
      x: 75,
      y: 75
    },
    spriteOffset: {
      x: 0,
      y: 0,
    },
    offset: {
      x: 0,
      y: 0,
    },
    fallSpeedMod: 1,
    duration: 10000,
  },
  heart: {
    hitbox: {
      x: 50,
      y: 50
    },
    sprite: {
      regular: images.heart.regular,
      empty: images.heart.empty,
      golden: images.heart.golden
    },
    spriteDimensions: {
      x: 32,
      y: 32
    },
    spriteOffset: {
      x: 0,
      y: 0,
    },
    offset: {
      x: 0,
      y: 0,
    },
    value: 1,
    fallSpeedMod: 1,
  },
  spike: {
    hitbox: {
      x: 24,
      y: 52,
    },
    sprite: {
      default: images.spike.default
    },
    spriteDimensions: {
      x: 85,
      y: 85
    },
    spriteOffset: {
      x: 0,
      y: 0,
    },
    offset: {
      x: 0,
      y: 40,
    },
  },
  boulder: {
    hitbox: {
      x: 53,
      y: 53
    },
    sprite: {
      default: images.boulder.default
    },
    spriteDimensions: {
      x: 90,
      y: 90,
    },
    spriteOffset: {
      x: 0,
      y: 0,
    },
    offset: {
      x: 0,
      y: 40,
    },
    fallSpeedMod: 1.5
  },
  explosion: {
    sprite: {
      default: images.explosion.default
    },
    spriteDimensions: {
      x: 240,
      y: 240,
    },
    spriteOffset: {
      x: 0,
      y: -65,
    },
    life: 1000,
  },
  platforms: {
    basic: {
      hitbox: {
        x: 125,
        y: 24
      },
      sprite: {
        default: images.platform_basic.default
      },
      spriteDimensions: {
        x: 150,
        y: 150
      },
      spriteOffset: {
        x: 0,
        y: 0,
      },
      offset: {
        x: 0,
        y: 0,
      },
    },
    timed: {
      hitbox: {
        x: 125,
        y: 24
      },
      sprite: {
        default: images.platform_timed.default
      },
      spriteDimensions: {
        x: 150,
        y: 150
      },
      spriteOffset: {
        x: 0,
        y: 0,
      },
      offset: {
        x: 0,
        y: 0,
      },
      standTime: 640 // 1000
    },
    icy: {
      hitbox: {
        x: 125,
        y: 24,
      },
      sprite: {
        default: images.platform_icy.default
      },
      spriteDimensions: {
        x: 150,
        y: 150
      },
      spriteOffset: {
        x: 0,
        y: 0,
      },
      offset: {
        x: 0,
        y: 0,
      },
      friction: 0.95,
      timeToFade: 200, //after the platform breaks
    },
    explosive: {
      hitbox: {
        x: 125,
        y: 24,
      },
      sprite: {
        default: images.platform_explosive.default
      },
      spriteDimensions: {
        x: 150,
        y: 150
      },
      spriteOffset: {
        x: 0,
        y: 0,
      },
      offset: {
        x: 0,
        y: 0,
      },
      explosionStrength: 600,
      immobilizeFor: 500,
      angleVariance: 15
    },
  },
  stage: {
    test: {
      name: "Testing stage",
      scrollSpeed: 110,
      background: images.background.shrek_i,
      chance_default: {
        spike: 16,
        soldier: 18,
        collectible: 22,
        two_platforms: 5,
      },
      canSpawn: {
        platforms: {
          basic: true,
          timed: true,
          icy: true,
          explosive: true,
        },
        special: {
          outhouse: true
        },
        collectibles: {
          heart: true,
          onion: true,
          cloud: true,
          umbrella: true,
        },
        hazards: {
          spike: true,
          soldier: true,
        },
      }
    },
    first: {
      name: "Shrek I",
      scrollSpeed: 110,
      background: images.background.shrek_i,
      chance_default: {
        spike: 16,
        soldier: 18,
        collectible: 22,
        two_platforms: 5,
      },
      canSpawn: {
        platforms: {
          basic: true,
          timed: true,
          icy: true,
          explosive: false,
        },
        special: {
          outhouse: false
        },
        collectibles: {
          heart: true,
          onion: false,
          cloud: false,
          umbrella: false,
        },
        hazards: {
          spike: true,
          soldier: false,
        },
      }
    },
  },
  overlays: {
    score_plus: {
      sprite: {
        default: images.overlay_score_plus.default
      },
      spriteDimensions: {
        x: 42,
        y: 42
      },
      offset: {
        x: -75,
        y: -5
      },
      offsetRandom: {
        x: 10,
        y: 20
      },
      life: 1000
    },
    score_minus: {
      sprite: {
        default: images.overlay_score_minus.default
      },
      spriteDimensions: {
        x: 42,
        y: 42
      },
      offset: {
        x: -75,
        y: -5
      },
      offsetRandom: {
        x: 10,
        y: 20
      },
      life: 1000
    },
    score_plus_five: {
      sprite: {
        default: images.overlay_score_plus_five.default
      },
      spriteDimensions: {
        x: 42,
        y: 42
      },
      offset: {
        x: -75,
        y: -5
      },
      offsetRandom: {
        x: 10,
        y: 20
      },
      life: 1000
    },
    shrek_super_jump: {
      sprite: {
        default: images.overlay_shrek_super_jump.default
      },
      spriteDimensions: {
        x: 140,
        y: 140
      },
      offset: {
        x: 0,
        y: 0
      },
      offsetRandom: {
        x: 0,
        y: 0
      },
      life: 500
    },
    onion_meter: {
      size: {
        x: 100,
        y: 20
      },
      padding: 2,
      minWidth: 8,
      offset: {
        x: 55,
        y: 70
      },
    }
  }
}
