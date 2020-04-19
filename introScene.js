export default class IntroScene extends Phaser.Scene {

	storylines = [
		"Hey, I've got a job for you -",
		"The company needs the spaceship to \ngo to Planet CAPRICUS ALPHA II.",
		"We need someone to take care of\n the maintenance there",
		"Now I'm not gonna lie, \nthis spaceship have had better days",
		"But times are hard you now,\nbudgets are tight.",
		"we can't really afford to buy a shiny new aeronef",
		"So lets go OK ?",
		"Oh, and by the way,\n   the pay is not so good",
		"And we might need you to do unpaid overtime",
		"But you need a job right ?",
		"Don't worry, it should be a lot of fun.",
		"Fine, next"
	];
	currentStoryLine = 0;

	constructor() {
		super({key: 'IntroScene'});
	}

	create() {
		this.subtitle = this.add.text(1000, 700, this.storylines[this.currentStoryLine], {font: '45px Courier', fill: 'white', backgroundColor: 'black'}).setOrigin(0.5);
		this.presEsc = this.add.text(1000, 800, 'esc to skip', {font: '30px Courier', fill: 'white', backgroundColor: 'black'}).setOrigin(0.5);

		// this.cursors = this.input.keyboard.createCursorKeys();
		this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		this.escape = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
	}

	update(time, delta) {
		if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
			this.currentStoryLine ++;
		}

		if (Phaser.Input.Keyboard.JustDown(this.escape) || this.currentStoryLine >= this.storylines.length) {
			this.scene.start('GameScene');
			this.scene.start('HudScene');

			this.scene.stop();
		} else {
			this.subtitle.setText(this.storylines[this.currentStoryLine])
		}

		// if (this.cursors.space.isDown) {
		// 	// timState = "WORK";
		// 	// check interactive
		//
		// 	this.scene.start('GameScene');
		// 	this.scene.start('HudScene');
		//
		// 	this.scene.stop();
		//
		// }
	}

}