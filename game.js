import * as motorSoundPackage from "./lib/motor-sound.js"

import {HEIGHT, WIDTH} from "./constants.js";
import HudScene from "./hudscene.js";
import TitleScene from "./titleScene.js";
import WinScene from "./winScene.js";
import {LevelManager} from "./levelmanager.js";


const config = {
	type: Phaser.AUTO,
	width: WIDTH,
	height: HEIGHT,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {y: 1000},
			debug: false
		},
	},
	scale: {
		// mode: Phaser.Scale.FIT,
		// autoCenter: Phaser.Scale.CENTER_BOTH,
		parent: 'thegame',
		// width: 640,
		// height: 960
	},
	scene: [TitleScene, /*IntroScene, MainGameScene,*/ HudScene, WinScene] // Others scene dynamically loaded by LevelManager
	// scene: {
	// 	preload: preload,
	// 	create: create,
	// 	update: update
	// }
};

const game = new Phaser.Game(config);

LevelManager.instance = new LevelManager(game);
