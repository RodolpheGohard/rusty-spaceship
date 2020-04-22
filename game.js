import * as motorSoundPackage from "./lib/motor-sound.js"

import {HEIGHT, WIDTH} from "./constants.js";
import HudScene from "./hudscene.js";
import TitleScene from "./titleScene.js";
import WinScene from "./winScene.js";
import {LevelManager} from "./levelmanager.js";
import LoseScene from "./loseScene.js";
import TutorialScene from "./tutorialscene.js";
import MusicScene from "./musicscene.js";


const config = {
	type: Phaser.AUTO,
	width: WIDTH,
	height: HEIGHT,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {y: 200},
			debug: false
		},
	},
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		parent: 'thegame',
		// width: 640,
		// height: 960
	},
	scene: [TitleScene, MusicScene, /*IntroScene, MainGameScene,*/ HudScene, TutorialScene, WinScene, LoseScene] // Others scene dynamically loaded by LevelManager
};

const game = new Phaser.Game(config);

LevelManager.instance = new LevelManager(game);
