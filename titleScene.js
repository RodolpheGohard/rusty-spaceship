import {LEVEL_DATA} from "./leveldata.js";
import {LevelManager} from "./levelmanager.js";

export default class TitleScene extends Phaser.Scene {

	constructor() {
		super({key: 'TitleScene', active: true});
	}

	create() {
		//  Grab a reference to the Game Scene
		// let ourGame = this.scene.get('GameScene');
		//
		// //  Listen for events from it
		// ourGame.events.on('addScore', function () {
		//
		// 	this.score += 10;
		//
		// 	info.setText('Score: ' + this.score);
		//
		// }, this);

		this.title = this.add.text(1000, 400, 'Rusty Spaceship', {font: '125px Courier', fill: 'white', backgroundColor: 'black'}).setOrigin(0.5);
		this.subtitle = this.add.text(1000, 500, 'Press Space to start', {font: '85px Courier', fill: 'white', backgroundColor: 'black'}).setOrigin(0.5);

		this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		this.cursors = this.input.keyboard.createCursorKeys();
	}

	update(time, delta) {
		if (this.cursors.shift.isDown && this.cursors.space.isDown) {
			// Cheeeat !
			this.scene.start('WinScene');
			this.scene.stop();
		} else if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
			this.scene.get('MusicScene').play();
			this.scene.stop();
			LevelManager.instance.playIntro();
		}
	}

}
