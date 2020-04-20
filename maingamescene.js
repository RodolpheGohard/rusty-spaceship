import {HEIGHT, WIDTH} from "./constants.js";
import {LevelManager} from "./levelmanager.js";


const FUEL_CONSUMPTION = 1;
const FUEL_WASTE_RATE = 3;
const WATER_WASTE_RATE = 3;
const CATASTROPHE_CHAIN_DELAY = 3000;
const WALK_VELOCITY = 270;
const CLIMB_VELOCITY = 170;
const CHEAT_DISTANCE_MULTIPLIER = 1;

let motorSound;
document.addEventListener('click',  () => {
	if (motorSound) {
		return;
	}
	const AudioContext = window.AudioContext || window.webkitAudioContext;
	const context = new AudioContext();
	const generators = [
		new MotorSound.NoiseGenerator(),
		new MotorSound.LinearGenerator()
	];
	motorSound = new MotorSound(context, generators[0]);
	window.motorSound = motorSound;
	function regenerateSound() {
		motorSound.regenerate();
		// motorSound.start();
	}
	regenerateSound();

	motorSound.setSpeed(.32);
	motorSound.setVolume(.2);
});

// TODO: not needed anymore, since in level data

class Score {
	get total() {
		return Object.keys(this).reduce( (acc,item) => acc+this[item], 0);
	}

	markScore(success, score) {
		if (!this[success]) this[success] = 0;
		this[success] += score;
	}
}

export const spaceshipStats = {
	score: new Score(),
	fuel: 3000,
	fuelOnFloor: 0,
	water: 2000,
	waterOnFloor: 0,
	pilotHealth: 100,
	pilotDeviation: 0,
	distanceLeft: 140000,
	o2: 20
};
/* probabilities for each interactive to fail, in one second */
export const failureProbabilities = {
	fuelTank: 1/120,
	chair: 1/40,
	o2Recycler: 1/200,
	powerGenerator: 1/100,
	engineTop: 1/60,
	spaceTimeFolder: 1/400
};

let timState = "STAND";

class MainGameScene extends Phaser.Scene {
	constructor(key = 'GameScene') {

		super(key);
	}

	init(levelData) {
		Object.assign(spaceshipStats, levelData.spaceshipStats);
		Object.assign(failureProbabilities, levelData.failureProbabilities);
	}

	preload() {
		this.load.image('spaceship', 'assets/spaceship.png');
		this.load.image('engine', 'assets/engine.png');
		this.load.image('wall', 'assets/wall.png');
		this.load.image('pilot', 'assets/pilot.png');
		this.load.multiatlas('tim', 'assets/tim/tim.json', 'assets/tim');

		// particles
		this.load.image('smoke', 'assets/smoke.png');
		this.load.image('drop', 'assets/drop.png');
		this.load.image('successStar', 'assets/star.png');


		this.load.audio('rusty-spaceship', ['assets/JohnDuff - Rusty Spaceship (original).mp3'/*, 'assets/audio/bodenstaendig_2000_in_rock_4bit.ogg'*/]);

	}

	create() {
		const music = this.sound.add('rusty-spaceship', {
			mute: false,
			volume: 1,
			rate: 1,
			detune: 0,
			seek: 0,
			loop: true,
			delay: 0
		});

		// music.play();

		const spaceship = this.add.image(WIDTH/2, HEIGHT/2, 'spaceship');

		const actualFrameNames = Object.keys(this.anims.textureManager.get('tim').frames).slice(1);

		/* Creatings walls and platforms on the plane */
		const platforms = this.physics.add.staticGroup();
		// grounds
		platforms.create(950, 120, 'wall').setScale(110,1).refreshBody();
		platforms.create(950, 310, 'wall').setScale(110,1).refreshBody();
		platforms.create(950, 500, 'wall').setScale(110,1).refreshBody();
		platforms.create(950, 690, 'wall').setScale(110,1).refreshBody();
		// walls
		platforms.create(400, 360, 'wall').setScale(1, 80).refreshBody();
		platforms.create(1460, 360, 'wall').setScale(1, 80).refreshBody();
		platforms.create(1220, 160, 'wall').setScale(1, 30).refreshBody();
		platforms.setVisible(false);
		this.platforms = platforms;

		/* Anims for Tim */
		this.anims.create({ key: 'walk', frames: actualFrameNames.map(frameName => ({ key: 'tim', frame: frameName })).reverse(), frameRate: 9, repeat: -1 });
		this.anims.create({ key: 'stand', frames: [{ key: 'tim', frame: actualFrameNames[8] }], frameRate: 7, repeat: -1 });
		this.anims.create({ key: 'climb', frames: [{ key: 'tim', frame: actualFrameNames[3] }, { key: 'tim', frame: actualFrameNames[6] }], frameRate: 4, repeat: -1 });

		/* TIM */
		const tim = this.physics.add.sprite(WIDTH/2-500, HEIGHT/2-125, 'tim');
		tim.setX(WIDTH/2+100); //cheat
		tim.setScale(0.55); //.refreshBody();
		tim.enableBody();
		// tim.anims.play('walk');
		tim.anims.play('stand');


		/* Pilot */
		const pilot = this.physics.add.sprite(1416, HEIGHT/2-139, 'pilot');
		pilot.setImmovable(true);
		pilot.disableBody(true);
		pilot.setScale(0.1); //.refreshBody();
		// pilot.enableBody();
		this.pilot = pilot;

		/* LADDERS */
		const ladders = this.physics.add.staticGroup();
		const frontLadder = ladders.create(1143, HEIGHT/2 - 120, 'wall').setScale(5, 37).refreshBody();
		frontLadder.setVisible(false);
		this.ladders = ladders;


		/* Initializing interactives - objects in the space you can interact with */
		const interactives = this.physics.add.staticGroup();
		this.interactives = interactives;

		const chair = interactives.create(1400, HEIGHT/2-125, 'wall').setScale(8,18).refreshBody();
		chair.progress = 100;
		chair.interactiveName = "chair";
		this.chair = chair;

		const fuelTank = interactives.create(740, HEIGHT/2+65, 'wall').setScale(5,8).refreshBody();
		fuelTank.progress = 100;
		fuelTank.interactiveName = "fuel tank";
		this.fuelTank = fuelTank;

		const powerGenerator = interactives.create(940, HEIGHT/2+65, 'wall').setScale(5,8).refreshBody();
		powerGenerator.progress = 100;
		powerGenerator.interactiveName = "power generator";
		this.powerGenerator = powerGenerator;

		const waterSupply = interactives.create(1140, HEIGHT/2+65, 'wall').setScale(5,8).refreshBody();
		waterSupply.progress = 100;
		waterSupply.interactiveName = "water supply";
		this.waterSupply = waterSupply;

		// TODO: break it to timewarp to next levels
		const spaceTimeFolder = interactives.create(1355, HEIGHT/2+65, 'wall').setScale(5,8).refreshBody();
		spaceTimeFolder.progress = 100;
		spaceTimeFolder.interactiveName = "space time folder";
		this.spaceTimeFolder = spaceTimeFolder;

		const o2Recycler = interactives.create(1010, HEIGHT/2-265, 'wall').setScale(5,8).refreshBody();
		o2Recycler.progress = 100;
		o2Recycler.interactiveName = "O2 recycler";
		this.o2Recycler = o2Recycler;

		const airConditioner = interactives.create(810, HEIGHT/2-265, 'wall').setScale(5,8).refreshBody();
		airConditioner.progress = 100;
		airConditioner.interactiveName = "air conditioner";
		this.airConditioner = airConditioner;


		this.createEngine(415, HEIGHT/2-315, 'engineTop',"top engine");
		this.createEngine(415, HEIGHT/2-120, 'engineMiddle',"middle engine");
		this.createEngine(415, HEIGHT/2+75, 'engineBottom',"bottom engine");

		this.createRepairParticles();

		interactives.setVisible(false);

		/* Tooltip for interactives */
		const tooltipText = this.add.text(0, 0, 'Broken Chair\n Repair', { font: '25px Courier', fill: '#ffffff', backgroundColor: 'black' });
		tooltipText.setVisible(false);
		this.activateTooltip = function activateTooltip(interactive) {
			tooltipText.setVisible(true);
			tooltipText.setText(`Broken ${interactive.interactiveName}\n Repair (${interactive.progress<100 ? Math.floor(interactive.progress)+'%' : 'complete'})`);
			tooltipText.setX(interactive.x);
			tooltipText.setY(interactive.y - 120)
		};
		this.hideTooltip = function hideTooltip() {
			tooltipText.setVisible(false);
		};
		// Success tooltip
		this.repairSuccessTooltip = this.add.text(0, 0, 'Repair Success', { font: '25px Courier', fill: '#22AA66', backgroundColor: '#BBFFBB' });
		this.repairSuccessTooltip.setVisible(false);

		this.cursors = this.input.keyboard.createCursorKeys();
		this.player = tim;

		this.cameras.main.zoom = 1.5;
		this.cameras.main.startFollow(tim);
	}

	createEngine(x, y, name, text) {
		const engineTop = this.interactives.create(x+50, y, 'wall').setScale(5,8).refreshBody();
		const engineSprite = this.add.sprite(x, y, 'engine');
		engineTop.progress = 100;
		engineTop.interactiveName = text;
		this[name] = engineTop;

		const particles = this.add.particles('wall');
		const particlesEmitter = particles.createEmitter({
			// frame: 'blue',
			x: x - 95,
			y: y, //- 60,
			lifespan: 700,
			speed: { min: 200, max: 600 },
			rotate: { onEmit: function () { return Math.random()*360; } },
			angle: 180,
			// gravityY: 300,
			scale: { start: 7, end: 0 },
			quantity: 1,
			blendMode: 'ADD'
		});
		engineTop.particlesEmitter = particlesEmitter;
		engineTop.particles = particles;
	}

	createRepairParticles() {
		const smokeParticles = this.add.particles('smoke');
		const smokeParticlesEmitter = smokeParticles.createEmitter({
			// frame: 'blue',
			x: 500,
			y: 500,
			lifespan: 1000,
			speed: { min: 30, max: 70 },
			gravityY: -30,
			rotate: { onEmit: function () { return Math.random()*360; } },
			angle: { onEmit: function () { return Math.random()*360; } }, // TODO: should be random between 0 and -180
			// gravityY: 300,
			scale: { start: .25, end: .12 },
			alpha: {start: 1, end: 0},
			quantity: 1,
			frequency: 300,
			blendMode: 'NORMAL'
		});

		const dropsParticles = this.add.particles('drop');
		const dropsParticlesEmitter = dropsParticles.createEmitter({
			// frame: 'blue',
			x: 500,
			y: 500,
			lifespan: 1200,
			speed: { min: 20, max: 50 },
			rotate: { onEmit: function () { return Math.random()*360; } },
			angle: { onEmit: function () { return Math.random()*360; } }, // TODO: should be random between 0 and -180
			gravityY: 200, // TODO: apply gravity on sparkles win scene
			scale: .05,
			quantity: 4,
			frequency: 1200,
			blendMode: 'NORMAL'
		});

		const repairSuccessParticles = this.add.particles('successStar'); // TODO: Should be slow, slow done, and fade out
		const repairSuccessParticlesEmitter = repairSuccessParticles.createEmitter({
			// frame: 'blue',
			x: 1500,
			y: 500,
			lifespan: 1700,
			// speed: { min: 50, max: 70 },
			speed: { start: 50, end: 0 },
			rotate: { onEmit: function () { return Math.random()*360; } },
			angle: { onEmit: function () { return Math.random()*360; } }, // TODO: should be random between 0 and -180
			// gravityY: 300, // TODO: apply gravity on sparkles win scene
			scale: { start: .2, end: .1 },
			alpha: {start: 1, end: 0},
			quantity: 5,
			frequency: 1000,
			blendMode: 'NORMAL'
		});

		this.smokeParticlesEmitter = smokeParticlesEmitter;
		this.dropsParticlesEmitter = dropsParticlesEmitter;
		this.repairSuccessParticlesEmitter = repairSuccessParticlesEmitter;

		smokeParticlesEmitter.stop();
		dropsParticlesEmitter.stop();
		repairSuccessParticlesEmitter.stop();
	}

	update(time, deltaMs) {
		if (this.finished) {
			console.log('scene is finished. Why is phaser even trying to update ?');
			return;
		}
		const tim = this.player;
		const interactives = this.interactives;

		const delta = deltaMs / 1000;

		// Check for available interactions
		this.hideTooltip();
		let activeInteractive;
		this.physics.overlap(tim, interactives, (tim, interactive) => {
			activeInteractive = interactive;
			this.activateTooltip(interactive);
			switch(interactive) {
				case this.chair:
					// this.activateTooltip(interactive);
					break;
			}
		});


		const thrust = spaceshipStats.fuel>0 ? (this.engineTop.progress / 100) : 0;

		this.updateSpaceshipStats(delta, thrust);

		this.updateGravity();

		this.updateCamera();

		this.updateEngineParticles(thrust);

		this.updateEngineSound(thrust);

		this.runCatastrophePlanner(delta);

		let canClimb = false;
		this.physics.overlap(tim, this.ladders, (tim, ladders) => {
			canClimb = true;
		});

		if (timState !== 'CLIMB')
			this.physics.collide(tim, this.platforms);


		// tim.setVelocityX(0);
		// tim.setVelocityY(0);
		this.processPlayerAction(canClimb, activeInteractive);

		// if (cursors.up.isDown && tim.body.touching.down)
		// {
		// 	tim.setVelocityY(-330);
		// }

		// tim.body.debugShowBody = true;
		this.updateGoals();


	}

	updateCamera() {
		this.cameras.main.setRotation(spaceshipStats.pilotDeviation);
	}

	updateSpaceshipStats(delta, thrust) {
		// fuel
		if (spaceshipStats.fuel > 0) {
			spaceshipStats.fuel -= delta * FUEL_CONSUMPTION;
			let fuelWaste = delta * (1 - +this.fuelTank.progress/100) * FUEL_WASTE_RATE ;
			spaceshipStats.fuel -= fuelWaste;
			spaceshipStats.fuelOnFloor += delta * fuelWaste;
		} else {
			// TODO: trigger out of fuel alert
		}

		let FUEL_EVAPORATION_EXP = 1.023373892; // exp( -ln(1/2)/30 )
		spaceshipStats.fuelOnFloor = Math.max( Math.pow(FUEL_EVAPORATION_EXP, -delta) -1, 0 );

		// TODO: If too much fuel on the floor, explosion

		// TODO: If too few fuel, crash landing

		let waterWaste = delta * (1 - +this.waterSupply.progress/100) * WATER_WASTE_RATE;
		spaceshipStats.water -= waterWaste;

		spaceshipStats.distanceLeft -= 1119*thrust*delta*Math.cos(spaceshipStats.pilotDeviation)*CHEAT_DISTANCE_MULTIPLIER;

		let o2increaseRate = (this.o2Recycler.progress*.3/35 - (65*0.3/35));
		spaceshipStats.o2 = Math.min(Math.max( spaceshipStats.o2 + o2increaseRate * delta, 0), 20);
		// IDEA: too much oxygen, it explodes


		if (this.pilot.hasFainted || this.pilot.isDead) {
			spaceshipStats.pilotDeviation += -.03*delta;
		} else if (spaceshipStats.pilotDeviation !== 0) {
			spaceshipStats.pilotDeviation %= 2*Math.PI;
			spaceshipStats.pilotDeviation += -Math.sign(Math.sin(spaceshipStats.pilotDeviation))*.1*delta;
		}
	}

	updateGoals() {
		if (spaceshipStats.o2 < 10) {
			this.pilot.hasFainted = true;
			spaceshipStats.pilotHealth = 50;
		}
		if (spaceshipStats.o2 > 15) {
			this.pilot.hasFainted = false;
		}
		if (spaceshipStats.o2 <= 0) {
			this.finished = true;
			LevelManager.instance.loseLevel('OUT_OF_OXYGEN');
		}
		if (spaceshipStats.o2 >= 40) {
			this.finished = true;
			LevelManager.instance.loseLevel('OXYGEN_EXPLODES');
		}


		if (spaceshipStats.fuel <= 0) {
			// TODO: out of fuel
			this.finished = true;
			LevelManager.instance.loseLevel('OUT_OF_FUEL');
		}
		if (spaceshipStats.fuelOnFloor > 100) {
			// TODO: raise fuel spill warning
		}
		if (spaceshipStats.fuelOnFloor > 200) {
			// TODO: fuel explodes
			this.finished = true;
			LevelManager.instance.loseLevel('FUEL_EXPLODES');
		}
		if (spaceshipStats.water === 0) {
			// TODO: start thrist damage
		}
		if (spaceshipStats.distanceLeft < 300) {
			motorSound && motorSound.stop(); // TODO: schedule something aftewerards is probably still running
			// this.scene.start('WinScene');
			// this.scene.stop('GameScene');
			// this.scene.stop('HudScene');
			this.finished = true;
			LevelManager.instance.winLevel();

		}
	}

	updateGravity() {
		if (this.spaceTimeFolder.progress<50) {
			// TODO: change game gravity
			this.physics.world.gravity.set(0,-1000);
		} else {
			this.physics.world.gravity.set(0,1000);
		}
	}

	updateEngineSound(thrust) {
		if (!motorSound) {
			// audio context and stuff may not be initialized - chrome forbids it without user interaction
			return;
		}
		motorSound.setSpeed(.52*thrust);
		let distance = Math.max(1, Phaser.Math.Distance.Between(this.player.x, this.player.y, this.engineTop.x, this.engineTop.y)/50);
		if (distance > 10 || thrust == 0) {
			motorSound.stop();
		} else {
			motorSound.start();
		}
		let volume = .2*(1/(distance*distance));
		motorSound.setVolume(volume );
		// console.log(volume, distance);
	}

	updateEngineParticles(thrust) {
		const particleEmitter = this.engineTop.particlesEmitter;
		if (thrust === 0) {
			// scene.engineTop.particlesEmitter.setQuantity(0);
			particleEmitter.stop();
		}
		// scene.engineTop.particlesEmitter.setSpeed(400 * scene.engineTop.progress/100);
		particleEmitter.setSpeed({ min: 200* thrust, max: 600* this.engineTop.progress/100 });
		particleEmitter.setScale({ start: 2+5* thrust, end: 0 });
		// scene.engineTop.particlesEmitter.setTint(0xff6666)
		// scene.engineTop.particlesEmitter.setLifespan(1000 * scene.engineTop.progress/100);
	}

	runCatastrophePlanner(delta) {
		let lastEvent;

		const now = new Date;

		if (!lastEvent || (now.getTime() - lastEvent.getTime()) > CATASTROPHE_CHAIN_DELAY ) {
			for (let eventable of Object.keys(failureProbabilities)) {
				// run a simulation
				const probability = failureProbabilities[eventable] * delta;
				let KARMA = 3;
				const itsHappening = Math.random() > 1 - probability*KARMA;

				if (itsHappening) {
					// console.log('its happening ! ', eventable, ' breaks');
					lastEvent = now;
					this.catastrophe(this[eventable]);
					break;
				}
			}
		}
	}

	catastrophe(interactive) {
		if (!interactive) {
			console.error("bad interactive");
			return;
		}

		// set damage
		interactive.progress = 30;

		this.createAlert(interactive)
	}

	createAlert(interactive) {
		console.log('shit happens for ', interactive);
		if (!interactive.alert) {
			interactive.alert = this.add.text(interactive.x, interactive.y, '⚠️', { font: '25px Courier', fill: 'red', backgroundColor: 'yellow' }); //thats an emoji
		} else {
			interactive.alert.setVisible(true);
		}
	}

	/* state -> action -> new state */
	fsm = {
		"STAND": {
			"WALK_LEFT": "WALK",
			"WALK_RIGHT": "WALK",
			"CLIMB_DOWN": "CLIMB",
			"CLIMB_UP": "CLIMB",
			"WORK": "WORK",
			"STAND": "STAND"
		}
	}; // We ll see later
	stateAction(action) {
		const resultingState = this.fsm["STAND"][action];

		if (resultingState !== timState) {
			console.log("previous state:", timState, "newState:", resultingState, "action", action);
			// trigger exit state actions
			switch (timState) {
				case 'WORK':
					this.dropsParticlesEmitter.stop();
					this.smokeParticlesEmitter.stop();
					break;
			}
			// trigger enterstate actions
			switch (resultingState) {
				case 'WORK':
					this.smokeParticlesEmitter.start();
					this.dropsParticlesEmitter.start();
			}
			timState = resultingState;
		}
	}

	processPlayerAction(canClimb, activeInteractive) {
		const tim = this.player;

		if (this.cursors.left.isDown) {
			this.stateAction("WALK_LEFT");
			tim.setVelocityX(-WALK_VELOCITY);
			tim.anims.play('walk', true);
			tim.setFlipX(true);
		} else if (this.cursors.right.isDown) {
			this.stateAction("WALK_RIGHT");
			tim.setVelocityX(WALK_VELOCITY);
			tim.anims.play('walk', true);
			tim.setFlipX(false);
		} else if (this.cursors.down.isDown && canClimb) {
			this.stateAction("CLIMB_DOWN");
			tim.setVelocityY(CLIMB_VELOCITY);
			tim.anims.play('climb', true);
		} else if (this.cursors.up.isDown && canClimb) {
			this.stateAction("CLIMB_UP");
			tim.setVelocityY(-CLIMB_VELOCITY);
			tim.anims.play('climb', true);
		} else if (this.cursors.space.isDown) {
			// check interactive
			if (activeInteractive) {
				if (activeInteractive.progress < 100) {
					this.stateAction("WORK");
					// REPAIRING STUFF
					this.smokeParticlesEmitter.setPosition(activeInteractive.x, activeInteractive.y+30); // Or position to interactive ?
					this.dropsParticlesEmitter.setPosition(tim.x, tim.y-40); // Or position to interactive ?

					activeInteractive.progress += .5;

					if (activeInteractive.progress >= 100) {
						this.repairSuccess(activeInteractive);
					}
				} else {
					activeInteractive.alert && activeInteractive.alert.setVisible(false);
				}
			}
		} else {
			this.stateAction("STAND");
			tim.setVelocityX(0);
			tim.setVelocityY(0);

			tim.anims.play('stand');
		}

	}

	repairSuccess(activeInteractive) {
		const bonusScore = 10;
		spaceshipStats.score.markScore('REPAIR_SUCCESS', 10);

		this.repairSuccessParticlesEmitter.explode(5,activeInteractive.x, activeInteractive.y);

		this.repairSuccessTooltip.setText("Repair Success ! +" + bonusScore);
		this.repairSuccessTooltip.setPosition(activeInteractive.x, activeInteractive.y-30);
		this.repairSuccessTooltip.setVisible(true);
		this.tweens.add({
			targets: this.repairSuccessTooltip,
			alpha: 0.3,
			duration: 3300,
			ease: 'Power2'
		}).setCallback('onComplete', () => {
			this.repairSuccessTooltip.setVisible(false);
			this.repairSuccessTooltip.setAlpha(1);
		}, [], this);

	}
}


export default MainGameScene;