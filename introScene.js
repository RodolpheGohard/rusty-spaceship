import {LEVEL_DATA} from "./leveldata.js";
import {LevelManager} from "./levelmanager.js";

export default class IntroScene extends Phaser.Scene {

	storylines = null;
	currentStoryLine = 0;

	init(levelData) {
		this.levelData = levelData;
		this.storylines = levelData.storylines;
	}

	constructor(key = 'IntroScene') {
		super({key: key});
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
			// this.scene.start('GameScene', this.levelData);
			// this.scene.start('HudScene');

			// this.scene.stop();
			LevelManager.instance.playLevel();
		} else {
			this.subtitle.setText(this.storylines[this.currentStoryLine])
		}
	}

}