import * as motorSoundPackage from "./lib/motor-sound.js"
import MainGameScene from "./maingamescene.js";
import {HEIGHT, WIDTH} from "./constants.js";
import HudScene from "./hudscene.js";


const config = {
	type: Phaser.AUTO,
	width: WIDTH,
	height: HEIGHT,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {y: 1000},
			debug: true
		},
	},
	scale: {
		// mode: Phaser.Scale.FIT,
		// autoCenter: Phaser.Scale.CENTER_BOTH,
		parent: 'thegame',
		// width: 640,
		// height: 960
	},
	scene: [MainGameScene, HudScene]
	// scene: {
	// 	preload: preload,
	// 	create: create,
	// 	update: update
	// }
};

const game = new Phaser.Game(config);
