import {WIDTH, HEIGHT} from "./constants.js";


export default class TutorialScene extends Phaser.Scene {

	storylines = [
		'Welcome aboard Rusty Spaceship !',
		"Now you're in, you can freely navigate",
		"The goal is to arrive safe and sound",
		"There's no problem as long as \nwe don't run out of fuel",
		"We should have enough - \nwell unless the tank starting leaking again",
		"Or if anything breaks badly.",
		"Well, it shouldn't happen since \nyou're here right?",
		"Check all those old-dated equipment",
		"Make repairs when needed with SPACEBAR",
		"When equipment is broken, shit happens. \nDon't wait too long to repair it.",
		"That's it, good luck"
	];
	currentStoryLine = 0;

	constructor() {
		super({key: 'TutorialScene', active: false});

		this.score = 0;
	}

	preload() {
		this.load.audio('ok', ['assets/ok.mp3'/*, 'assets/ok.ogg'*/]);
	}

	create() {
		this.okSound = this.sound.add('ok', {
			mute: false,
			volume: 1,
			rate: 1,
			detune: 0,
			seek: 0,
			loop: false,
			delay: 0
		});

		const graphics = this.add.graphics({
			x: 0,
			y: 0,
			fillStyle: {
				color: 0x000055,
				alpha: 1
			}
		});

		graphics.fillRect(0, 800, 1920, 400);


		this.background = this.add.graphics({});
		this.tutorial = this.add.text(WIDTH / 2, 935, '', {
			font: '65px Courier',
			fontWeight: 'bold',
			fill: 'white',
			backgroundColor: '#000044'
		}).setOrigin(0.5);

		this.escToSkip = this.add.text(WIDTH - 10, HEIGHT - 10, 'ESC. to skip tutorial', {
			font: '35px Courier',
			fill: 'white',
			// fontStyle: 'italic',
			// backgroundColor: '#000044'
		}).setOrigin(1, 1);


		this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		this.escape = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
	}

	update(time, delta) {
		this.tutorial.setText(this.storylines[this.currentStoryLine])

		if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
			this.okSound.play();
			this.currentStoryLine++;
		}

		if (this.currentStoryLine >= this.storylines.length || Phaser.Input.Keyboard.JustDown(this.escape)) {
			this.background.destroy(true);
			this.tutorial.destroy(true);
			this.scene.stop();
		}
	}

}
