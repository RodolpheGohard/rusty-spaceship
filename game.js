let WIDTH = 1920;
let HEIGHT = 1080;

const config = {
	type: Phaser.AUTO,
	width: WIDTH,
	height: HEIGHT,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {y: 0},
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
	// this.load.setBaseURL('http://labs.phaser.io');

	this.load.image('spaceship', 'assets/spaceship.png');
	this.load.image('wall', 'assets/wall.png');
	this.load.multiatlas('tim', 'assets/tim/tim.json', 'assets/tim');

	// this.load.spritesheet('walker', 'assets/walker-spritesheet.png', { frameWidth: 114, frameHeight: 200 });
	// this.load.spritesheet('mage', 'assets/mage-spritesheet.png', { frameWidth: 134, frameHeight: 200 });
}

let walkerGroup;
let boltGroup;
function create() {
	this.add.image(WIDTH/2, HEIGHT/2, 'spaceship');

	// Fuck those shitty helpers
	// const frameNames = this.anims.generateFrameNames('tim', {
	// 	start: 1, end: 8, zeroPad: 4,
	// 	prefix: '/', suffix: '.png'
	// });
	// const frameNumbers = this.anims.generateFrameNumbers('tim');
	//
	// console.log(frameNumbers);

	const actualFrameNames = Object.keys(this.anims.textureManager.get('tim').frames).slice(1);
	console.log(actualFrameNames);

	this.anims.create({ key: 'walk', frames: actualFrameNames.map(frameName => ({ key: 'tim', frame: frameName })).reverse(), frameRate: 7, repeat: -1 });
	this.anims.create({ key: 'stand', frames: [{ key: 'tim', frame: actualFrameNames[8] }], frameRate: 7, repeat: -1 });



	const platforms = this.physics.add.staticGroup();
	platforms.create(980, 500, 'wall').setScale(110,1).refreshBody();
	// x = phaser.add.sprite(0, 1150);x.body.debug = true;

	platforms.create(400, 360, 'wall').setScale(1, 40).refreshBody();


	const tim = this.physics.add.sprite(WIDTH/2-500, HEIGHT/2-125, 'tim');
	tim.setScale(0.666); //.refreshBody();
	tim.enableBody();
	// tim.anims.play('walk');
	tim.anims.play('stand');


	const interactives = this.physics.add.staticGroup();
	const chair = interactives.create(1400, HEIGHT/2-125, 'wall').setScale(8,18);
	chair.progress = 30;
	this.interactives = interactives;

	const tooltipText = this.add.text(0, 0, 'Broken Chair\n Repair', { font: '25px Courier', fill: '#ffffff', backgroundColor: 'black' });
	tooltipText.setVisible(false);
	function activateTooltip(interactive) {
		tooltipText.setVisible(true);
		tooltipText.setX(interactive.x);
		tooltipText.setY(interactive.y - 120)
	}

	this.physics.add.collider(tim, platforms);
	this.physics.add.overlap(tim, interactives, (_, interactive) => {
		switch(interactive) {
			case chair:
				// console.log('overlaping chair', interactive);
				activateTooltip(chair);
				break;
		}
	});

	// const particles = this.add.particles('red');

	// const emitter = particles.createEmitter({
	// 	speed: 100,
	// 	scale: {start: 1, end: 0},
	// 	blendMode: 'ADD'
	// });

	// const logo = this.physics.add.image(400, 100, 'logo');

	// logo.setVelocity(100, 200);
	// logo.setBounce(1, 1);
	// logo.setCollideWorldBounds(true);

	// emitter.startFollow(logo);
	const scene = this;

	this.cursors = this.input.keyboard.createCursorKeys();
	this.player = tim;
}

function update() {
	const scene = this;

	const cursors = this.cursors;
	const tim = this.player;
	const interactives = this.interactives;

	// scene.physics.collide(tim, interactives, (tim, chair) => {
	// 	console.log('chair active', tim, chair);
	// });


	let WALK_VELOCITY = 270;
	if (cursors.left.isDown)
	{
		tim.setVelocityX(-WALK_VELOCITY);

		tim.anims.play('walk', true);
	}
	else if (cursors.right.isDown)
	{
		tim.setVelocityX(WALK_VELOCITY);

		tim.anims.play('walk', true);
	}
	else
	{
		tim.setVelocityX(0);

		tim.anims.play('stand');
	}

	if (cursors.space.isDown) {
		// check interactive

		// Make progess on interactive
	}

	// if (cursors.up.isDown && tim.body.touching.down)
	// {
	// 	tim.setVelocityY(-330);
	// }

	tim.body.debugShowBody = true;

}