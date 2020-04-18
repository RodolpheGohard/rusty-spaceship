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
			debug: true
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

function create() {
	this.add.image(WIDTH/2, HEIGHT/2, 'spaceship');

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
	chair.progress = 30;
	chair.interactiveName = "chair";
	this.chair = chair;

	const fuelTank = interactives.create(740, HEIGHT/2+65, 'wall').setScale(5,8).refreshBody();
	fuelTank.progress = 30;
	fuelTank.interactiveName = "fuel tank";
	this.fuelTank = fuelTank;

	const powerGenerator = interactives.create(940, HEIGHT/2+65, 'wall').setScale(5,8).refreshBody();
	powerGenerator.progress = 30;
	powerGenerator.interactiveName = "power generator";
	this.powerGenerator = powerGenerator;

	const waterSupply = interactives.create(1140, HEIGHT/2+65, 'wall').setScale(5,8).refreshBody();
	waterSupply.progress = 30;
	waterSupply.interactiveName = "water supply";
	this.waterSupply = waterSupply;

	// TODO: break it to timewarp to next levels
	const spaceTimeFolder = interactives.create(1355, HEIGHT/2+65, 'wall').setScale(5,8).refreshBody();
	spaceTimeFolder.progress = 30;
	spaceTimeFolder.interactiveName = "space time folder";
	this.spaceTimeFolder = spaceTimeFolder;

	const o2recycler = interactives.create(1010, HEIGHT/2-265, 'wall').setScale(5,8).refreshBody();
	o2recycler.progress = 30;
	o2recycler.interactiveName = "O2 recycler";
	this.o2recycler = o2recycler;

	const airConditioner = interactives.create(810, HEIGHT/2-265, 'wall').setScale(5,8).refreshBody();
	airConditioner.progress = 30;
	airConditioner.interactiveName = "air conditioner";
	this.airConditioner = airConditioner;

	const engineTop = interactives.create(445, HEIGHT/2-265, 'wall').setScale(5,8).refreshBody();
	engineTop.progress = 30;
	engineTop.interactiveName = "top engine";
	this.engineTop = engineTop;



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

	// /* Physics with TIM */
	// const collider =this.physics.add.collider(tim, platforms);
	// collider.active = false

	this.cursors = this.input.keyboard.createCursorKeys();
	this.player = tim;
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
			}
		}
		// Make progess on interactive
	}

	// if (cursors.up.isDown && tim.body.touching.down)
	// {
	// 	tim.setVelocityY(-330);
	// }

	tim.body.debugShowBody = true;

}