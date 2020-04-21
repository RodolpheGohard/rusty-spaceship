import {HEIGHT, WIDTH} from "./constants.js";
import {LevelManager} from "./levelmanager.js";

export default class WinScene extends Phaser.Scene {

	// storylines = [
	// 	"Hey, I've got a job for you -",
	// 	"The company needs the spaceship to \ngo to Planet CAPRICUS ALPHA II.",
	// 	"We need someone to take care of\n the maintenance there",
	// 	"Now I'm not gonna lie, \nthis spaceship have had better days",
	// 	"But times are hard you now,\nbudgets are tight.",
	// 	"we can't really afford to buy a shiny new aeronef",
	// 	"So lets go OK ?",
	// 	"Oh, and by the way,\n   the pay is not so good",
	// 	"And we might need you to do unpaid overtime",
	// 	"But you need a job right ?",
	// 	"Don't worry, it should be a lot of fun.",
	// 	"Fine, next"
	// ];
	// currentStoryLine = 0;

	constructor() {
		super({key: 'WinScene'});
	}

	preload() {
		console.log('preloading winScene');
		this.load.image('spaceshipExterior', 'assets/spaceship-exterior.png');
		this.load.image('engine', 'assets/engine.png');
		this.load.image('wall', 'assets/wall.png');
		this.load.image('road', 'assets/road.png');

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

		music.play();

		this.time.addEvent({ delay: 8000, callback: () => {
			// this.subtitle.setVisible(true);
			// this.subtitle.setX(this.spaceship.x);
			// this.subtitle.setY(this.spaceship.y); // for some reason this doesn't work

			this.subtitle = this.add.text(this.spaceship.x, this.spaceship.y, 'Good Enough !', {
				font: '45px Courier',
				fill: 'Yellow',
				backgroundColor: 'black'
			}).setOrigin(0.5);
		}, loop: false});

		this.time.addEvent({
			delay: 11000,
			callback: () => {
				this.scene.stop();
				LevelManager.instance.nextLevel();
			}, loop: false}
		);



		const platforms = this.physics.add.staticGroup();
		this.ground = platforms.create(WIDTH / 2, 1000, 'wall').setScale(5000, 15).refreshBody();
		platforms.setVisible(false);
		this.road = this.add.tileSprite(0, 1100, 50000, 1000, 'road');

		this.spaceship = this.physics.add.sprite(-200, 0, 'spaceshipExterior').setScale(.3); //.refreshBody();
		this.spaceship.setBounce(.5);
		// this.spaceship.setFriction(500); // doesn't work when skating ?
		this.spaceship.setVelocityX(4500);
		this.spaceship.setRotation(Math.PI / 15);


		this.cameras.main.pan(4000, 1200, 0);
		const derp = .03;
		this.cameras.main.startFollow(this.spaceship, false, derp, derp, -200);


		this.physics.add.collider(this.spaceship, platforms)


		// Particles
		const gfx = this.add.graphics({
			x: 0,
			y: 0,
			fillStyle: {
				color: 0xFF8800,
				alpha: 1
			}
		});
		// gfx.beginFill(0xffff00);
		gfx.fillRect(0, 0, 8, 8);
		gfx.visible = true;
		const texture = gfx.generateTexture('sparkle', 8, 8);


		// Sparkles when plane rubs the floor
		const particles = this.add.particles('sparkle');
		this.particlesEmitter = particles.createEmitter({
			// frame: 'blue',
			x: 4000,
			y: 1000,
			lifespan: 700,
			speed: {min: 200, max: 600},
			rotate: {
				onEmit: function () {
					return Math.random() * 360;
				}
			},
			angle: {
				onEmit: function () {
					return -(90 + Math.random() * 90);
				}
			},
			scale: {start: 1, end: 0},
			quantity: 1,
			// blendMode: 'NORMAL'
			blendMode: 'ADD'
		});

	}

	update(time, delta) {
		this.spaceship.setVelocityX(this.spaceship.body.velocity.x * .995);

		this.particlesEmitter.setPosition(this.spaceship.body.x+170, 850);
		const quantityFromAltitude = Math.max(-500 + this.spaceship.body.y, 0);
		const quantityFromSpeed = Math.max(-2 + this.spaceship.body.velocity.x/200, 0);
		this.particlesEmitter.setQuantity( quantityFromSpeed*quantityFromAltitude/50 );

	}

}