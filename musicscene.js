
/**
 *
 * This scene just plays music. It's always active so we don't need to manage play/stop on per-actual-scene basis
 *
 **/
export default class MusicScene extends Phaser.Scene {
	constructor() {
		super({key: 'MusicScene', active: true});
	}

	preload() {
		this.load.audio('rusty-spaceship', ['assets/JohnDuff - Rusty Spaceship (original).mp3'/*, 'assets/audio/bodenstaendig_2000_in_rock_4bit.ogg'*/]);
	}

	create() {
		this.music = this.sound.add('rusty-spaceship', {
			mute: false,
			volume: 1,
			rate: 1,
			detune: 0,
			seek: 0,
			loop: true,
			delay: 30
		});

	}

	play() {
		this.music.play();
	}

	stop() {
		this.music.stop();
	}
}