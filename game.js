let WIDTH = 1920;
let HEIGHT = 1080;

const config = {
	type: Phaser.AUTO,
	width: WIDTH,
	height: HEIGHT,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {y: 1000},
			debug: false
		},
	},
	scale: {
		// mode: Phaser.Scale.FIT,
		// autoCenter: Phaser.Scale.CENTER_BOTH,
		parent: 'thegame',
		// width: 640,
		// height: 960
	},
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};

const game = new Phaser.Game(config);

function preload() {
	this.load.image('spaceship', 'assets/spaceship.png');
	this.load.image('wall', 'assets/wall.png');
	this.load.multiatlas('tim', 'assets/tim/tim.json', 'assets/tim');
}

const spaceshipStats = {
	fuel: 300,
	fuelOnFloor: 0,
	water: 2000,
	waterOnFloor: 0,
	pilotHealth: 100,
	distanceLeft: 280000
};

function create() {
	const scene = this;

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
	tim.setScale(0.666); //.refreshBody();
	tim.enableBody();
	// tim.anims.play('walk');
	tim.anims.play('stand');


	/* LADDERS */
	const ladders = this.physics.add.staticGroup();
	const frontLadder = ladders.create(1143, HEIGHT/2 - 120, 'wall').setScale(5, 30).refreshBody();
	frontLadder.setVisible(false);
	this.ladders = ladders;


	/* Initializing interactives - objects in the space you can interact with */
	const interactives = this.physics.add.staticGroup();

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

	const o2recycler = interactives.create(1010, HEIGHT/2-265, 'wall').setScale(5,8).refreshBody();
	o2recycler.progress = 100;
	o2recycler.interactiveName = "O2 recycler";
	this.o2recycler = o2recycler;

	const airConditioner = interactives.create(810, HEIGHT/2-265, 'wall').setScale(5,8).refreshBody();
	airConditioner.progress = 100;
	airConditioner.interactiveName = "air conditioner";
	this.airConditioner = airConditioner;

	const engineTop = interactives.create(445, HEIGHT/2-265, 'wall').setScale(5,8).refreshBody();
	engineTop.progress = 100;
	engineTop.interactiveName = "top engine";
	this.engineTop = engineTop;

	const particles = this.add.particles('wall');
	const particlesEmitter = particles.createEmitter({
		// frame: 'blue',
		x: 300,
		y: HEIGHT/2-325,
		lifespan: 700,
		speed: { min: 200, max: 600 },
		rotate: { onEmit: function () { return Math.random()*360; } },
		angle: 180,
		// gravityY: 300,
		scale: { start: 7, end: 0 },
		quantity: 1,
		blendMode: 'ADD'
	});
	engineTop.particles = particlesEmitter;

	this.interactives = interactives;
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

	// HUD
	const hudCam = this.cameras.add(0,0,350,200);
	const hud = this.hud = this.add.text(0, 0, '-', { font: '25px Courier', fill: 'white', backgroundColor: 'black' });
	const camList = this.cameras.cameras;
	function setCamera(cam) {

		let l = (1 << camList.length) - 1;

		return l & ~cam.id;
	}
	this.hud.cameraFilter = setCamera(hudCam);
	hudCam.ignore([spaceship, tim, interactives, platforms, particles]); // Ignore everything but hud, unfortunately phaser hasn't though this through, it seems ...


	// /* Physics with TIM */
	// const collider =this.physics.add.collider(tim, platforms);
	// collider.active = false

	this.cursors = this.input.keyboard.createCursorKeys();
	this.player = tim;

	// Camera
	// this.cameras.main.setBounds(0, 0, 800, 400);
	this.cameras.main.zoom = 1.5;
	this.cameras.main.startFollow(tim);
	this.cameras.main.ignore(hud);
}

let timState = "STAND";

function update() {
	const scene = this;

	const cursors = this.cursors;
	const tim = this.player;
	const interactives = this.interactives;

	this.hideTooltip();
	let activeInteractive;
	scene.physics.overlap(tim, interactives, (tim, interactive) => {
		activeInteractive = interactive;
		this.activateTooltip(interactive);
		switch(interactive) {
			case this.chair:
				// this.activateTooltip(interactive);
				break;
		}
	});


	const delta = 1/60; // in sec, Shit Phaser and its shitty doc, can't find it, so setting constant from 60hz

	function updateSpaceshipStats() {
		// fuel
		let FUEL_CONSUMPTION = 1;
		spaceshipStats.fuel -= delta * FUEL_CONSUMPTION;

		let FUEL_WASTE_RATE = 3;
		let fuelWaste = delta * (1 - +scene.fuelTank.progress/100) * FUEL_WASTE_RATE ;
		spaceshipStats.fuel -= fuelWaste;
		spaceshipStats.fuelOnFloor += delta * fuelWaste;
		let FUEL_EVAPORATION_EXP = 1.023373892; // exp( -ln(1/2)/30 )
		spaceshipStats.fuelOnFloor = Math.max( Math.pow(FUEL_EVAPORATION_EXP, -delta) -1, 0 );

		// TODO: If too much fuel on the floor, explosion

		// TODO: If too few fuel, crash landing

		let WATER_WASTE_RATE = 3;
		let waterWaste = delta * (1 - +scene.waterSupply.progress/100) * WATER_WASTE_RATE;
		spaceshipStats.water -= waterWaste;

		spaceshipStats.distanceLeft -= 1119*(scene.engineTop.progress/100)*delta;
	}
	updateSpaceshipStats();

	function createAlert(interactive) {
		// TODO: implement me
		console.log('shit happens for ', interactive);
		if (!interactive.alert) {
			interactive.alert = scene.add.text(interactive.x, interactive.y, '⚠️', { font: '25px Courier', fill: 'red', backgroundColor: 'yellow' }); //thats an emoji
		} else {
			interactive.alert.setVisible(true);
		}
	}

	function catastrophe(interactive) {
		if (!interactive) {
			console.error("bad interactive");
			return;
		}

		// set damage
		interactive.progress = 30;

		// pop alert
		createAlert(interactive)
	}

	function runCatastrophePlanner() {
		let lastEvent;

		/* probabilities for each interactive to fail, in one second */
		const probabilities = {
			fuelTank: 1/120,
			chair: 1/40,
			o2recycler: 1/200,
			powerGenerator: 1/100,
			engineTop: 1/60
		};
		const now = new Date;

		let CATASTROPHE_CHAIN_DELAY = 3000;
		if (!lastEvent || (now.getTime() - lastEvent.getTime()) > CATASTROPHE_CHAIN_DELAY ) {
			for (let eventable of Object.keys(probabilities)) {
				// run a simulation
				const probability = probabilities[eventable] * delta;
				let KARMA = 3;
				const itsHappening = Math.random() > 1 - probability*KARMA;

				if (itsHappening) {
					console.log('its happening ! ', eventable, ' breaks');
					lastEvent = now;
					catastrophe(scene[eventable]);
					break;
				}
			}
		}
	}

	runCatastrophePlanner();

	let canClimb = false;
	scene.physics.overlap(tim, this.ladders, (tim, ladders) => {
		canClimb = true;
	});

	if (timState != 'CLIMB')
		scene.physics.collide(tim, this.platforms);


	let WALK_VELOCITY = 270;
	let CLIMB_VELOCITY = 170;
	// tim.setVelocityX(0);
	// tim.setVelocityY(0);

	if (cursors.left.isDown)
	{
		timState = "WALK";
		tim.setVelocityX(-WALK_VELOCITY);
		tim.anims.play('walk', true);
		tim.setFlipX(true);
	}
	else if (cursors.right.isDown)
	{
		timState = "WALK";
		tim.setVelocityX(WALK_VELOCITY);
		tim.anims.play('walk', true);
		tim.setFlipX(false);
	}
	else if (cursors.down.isDown && canClimb)
	{
		timState = "CLIMB";
		tim.setVelocityY(CLIMB_VELOCITY);
		tim.anims.play('climb', true);
	}
	else if (cursors.up.isDown && canClimb)
	{
		timState = "CLIMB";
		tim.setVelocityY(-CLIMB_VELOCITY);
		tim.anims.play('climb', true);
	}
	else
	{
		timState = "STAND";
		tim.setVelocityX(0);
		tim.setVelocityY(0);

		tim.anims.play('stand');
	}

	if (cursors.space.isDown) {
		timState = "WORK";
		// check interactive
		if (activeInteractive) {
			if (activeInteractive.progress <100) {
				activeInteractive.progress += .5;
			} else {
				activeInteractive.alert && activeInteractive.alert.setVisible(false);
			}
		}
		// Make progess on interactive
	}

	// if (cursors.up.isDown && tim.body.touching.down)
	// {
	// 	tim.setVelocityY(-330);
	// }

	function updateHud() {
		scene.hud.setText(
`FUEL: ${Math.floor(spaceshipStats.fuel)}
WATER: ${Math.floor(spaceshipStats.water)}
PILOT: ${spaceshipStats.pilotHealth}
DISTANCE: ${Math.floor(spaceshipStats.distanceLeft)}`
		);
	}
	updateHud();

	tim.body.debugShowBody = true;

}