import {HEIGHT, WIDTH} from "./constants.js";
import {LevelManager} from "./levelmanager.js";

export default class LoseScene extends Phaser.Scene {

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

	init(cause) {
		this.cause = cause;
	}

	constructor() {
		super({key: 'LoseScene'});
	}

	preload() {
	}

	create() {
		this.title = this.add.text(1000, 400, 'Spaceship didn\'t made it', {
			font: '125px Courier',
			fill: 'white',
			backgroundColor: 'black'
		}).setOrigin(0.5);
		this.cause = this.add.text(1000, 500, 'Cause:' + this.cause, {
			font: '125px Courier',
			fill: 'white',
			backgroundColor: 'black'
		}).setOrigin(0.5);
		this.subtitle = this.add.text(1000, 600, 'Press Space to retry', {
			font: '85px Courier',
			fill: 'white',
			backgroundColor: 'black'
		}).setOrigin(0.5);


		this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
	}

	update(time, delta) {
		if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
			// this.scene.start('IntroScene', LEVEL_DATA[0]);
			this.scene.stop();
			LevelManager.instance.playLevel();
		}
	}

}
