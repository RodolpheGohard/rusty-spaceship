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
	this.load.image('spaceship', 'assets/spaceship.png');
	this.load.image('wall', 'assets/wall.png');
	this.load.multiatlas('tim', 'assets/tim/tim.json', 'assets/tim');
}

function create() {
	this.add.image(WIDTH/2, HEIGHT/2, 'spaceship');

	const actualFrameNames = Object.keys(this.anims.textureManager.get('tim').frames).slice(1);

	/* Creatings walls and platforms on the plane */
	const platforms = this.physics.add.staticGroup();
	platforms.create(980, 500, 'wall').setScale(110,1).refreshBody();
	platforms.create(400, 360, 'wall').setScale(1, 40).refreshBody();
	platforms.setVisible(false);

	/* Anims for Tim */
	this.anims.create({ key: 'walk', frames: actualFrameNames.map(frameName => ({ key: 'tim', frame: frameName })).reverse(), frameRate: 7, repeat: -1 });
	this.anims.create({ key: 'stand', frames: [{ key: 'tim', frame: actualFrameNames[8] }], frameRate: 7, repeat: -1 });
	this.anims.create({ key: 'climb', frames: [{ key: 'tim', frame: actualFrameNames[8] }, { key: 'tim', frame: actualFrameNames[8] }], frameRate: 7, repeat: -1 });

	/* TIM */
	const tim = this.physics.add.sprite(WIDTH/2-500, HEIGHT/2-125, 'tim');
	tim.setX(WIDTH/2+100); //cheat
	tim.setScale(0.666); //.refreshBody();
	tim.enableBody();
	// tim.anims.play('walk');
	tim.anims.play('stand');


	/* Initializing interactives - objects in the space you can interact with */
	const interactives = this.physics.add.staticGroup();
	const chair = interactives.create(1400, HEIGHT/2-125, 'wall').setScale(8,18);
	chair.progress = 30;
	this.interactives = interactives;
	interactives.setVisible(false);

	/* Tooltip for interactives */
	const tooltipText = this.add.text(0, 0, 'Broken Chair\n Repair', { font: '25px Courier', fill: '#ffffff', backgroundColor: 'black' });
	tooltipText.setVisible(false);
	this.activateTooltip = function activateTooltip(interactive) {
		tooltipText.setVisible(true);
		tooltipText.setText(`Broken Chair\n Repair (${interactive.progress<100 ? Math.floor(interactive.progress)+'%' : 'complete'})`);
		tooltipText.setX(interactive.x);
		tooltipText.setY(interactive.y - 120)
	};
	this.hideTooltip = function hideTooltip() {
		tooltipText.setVisible(false);
	};

	/* Physics with TIM */
	this.physics.add.collider(tim, platforms);

	this.chair = chair;
	this.cursors = this.input.keyboard.createCursorKeys();
	this.player = tim;
}

function update() {
	const scene = this;

	const cursors = this.cursors;
	const tim = this.player;
	const interactives = this.interactives;

	this.hideTooltip();
	let activeInteractive;
	scene.physics.overlap(tim, interactives, (tim, interactive) => {
		activeInteractive = interactive;
		switch(interactive) {
			case this.chair:
				this.activateTooltip(interactive);
				break;
		}
	});

	let WALK_VELOCITY = 270;
	if (cursors.left.isDown)
	{
		tim.setVelocityX(-WALK_VELOCITY);
		tim.anims.play('walk', true);
		tim.setFlipX(true);
	}
	else if (cursors.right.isDown)
	{
		tim.setVelocityX(WALK_VELOCITY);
		tim.anims.play('walk', true);
		tim.setFlipX(false);
	}
	else
	{
		tim.setVelocityX(0);

		tim.anims.play('stand');
	}

	if (cursors.space.isDown) {
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