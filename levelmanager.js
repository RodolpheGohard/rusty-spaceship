import IntroScene from "./introScene.js";
import {LEVEL_DATA} from "./leveldata.js";
import MainGameScene from "./maingamescene.js";

export class LevelManager {
	currentLevel = 0;
	game;
	scene;

	constructor(game) {
		this.game = game;
		this.scene = game.scene;
	}

	playIntro() {
		console.log('playintro');
		const key = 'IntroScene'+this.currentLevel;
		const levelScene = new IntroScene(key);

		this.scene.add(key, levelScene, true, LEVEL_DATA[this.currentLevel]);
	}

	playLevel() {
		const key = 'MainGameScene'+this.currentLevel;
		const levelScene = new MainGameScene(key);

		this.scene.add(key, levelScene, true, LEVEL_DATA[this.currentLevel]);
		this.scene.start('HudScene');
		this.scene.getScene('HudScene').scene.bringToTop();
		this.scene.stop('IntroScene'+this.currentLevel);
		this.scene.remove('IntroScene'+this.currentLevel);
	}

	winLevel() {
		this.scene.start('WinScene');
		this.scene.stop('MainGameScene'+this.currentLevel);
		this.scene.remove('MainGameScene'+this.currentLevel);
		this.scene.stop('HudScene');
	}

	nextLevel() {
		console.log('nextLevel');
		this.currentLevel++;
		this.playIntro();
	}

	loseLevel(cause) {
		this.scene.start('LoseScene', cause);
		this.scene.stop('MainGameScene'+this.currentLevel);
		this.scene.remove('MainGameScene'+this.currentLevel);
		this.scene.stop('HudScene');
	}
}

// const levelManager = new LevelManager(game);
