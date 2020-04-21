import {LEVEL_DATA} from "./leveldata.js";
import {LevelManager} from "./levelmanager.js";
import {WIDTH,HEIGHT} from "./constants.js";

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

	preload() {
		this.load.audio('ok', ['assets/ok.mp3'/*, 'assets/ok.ogg'*/]);
		this.load.audio('enterCosmos', ['assets/enter-cosmos.mp3'/*, 'assets/ok.ogg'*/]);
		this.load.image('spaceshipExterior', 'assets/spaceship-exterior.png');
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
		this.enterCosmosSound = this.sound.add('enterCosmos', {
			mute: false,
			volume: 1,
			rate: 1,
			detune: 0,
			seek: 0,
			loop: false,
			delay: 0
		});

		this.spaceship = this.add.sprite(WIDTH/2, HEIGHT/2, 'spaceshipExterior');

		this.subtitle = this.add.text(1000, 700, this.storylines[this.currentStoryLine], {font: '45px Courier', fill: 'white', backgroundColor: 'black'}).setOrigin(0.5);
		this.presEsc = this.add.text(1000, 800, 'esc to skip', {font: '30px Courier', fill: 'white', backgroundColor: 'black'}).setOrigin(0.5);

		this.levelName = this.add.text(1000, 980, `Level #${LevelManager.instance.currentLevel} - ${this.levelData.levelName}`, {font: '95px Courier', fill: 'white', backgroundColor: 'black'}).setOrigin(0.5);

		// this.cursors = this.input.keyboard.createCursorKeys();
		this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		this.escape = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
	}

	update(time, delta) {
		if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
			this.okSound.play();
			this.currentStoryLine ++;
		}

		if (Phaser.Input.Keyboard.JustDown(this.escape) || this.currentStoryLine >= this.storylines.length) {
			// this.scene.start('GameScene', this.levelData);
			// this.scene.start('HudScene');

			// this.scene.stop();
			this.enterCosmosSound.play();
			LevelManager.instance.playLevel();
		} else {
			this.subtitle.setText(this.storylines[this.currentStoryLine])
		}
	}

}