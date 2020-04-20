import {spaceshipStats} from "./maingamescene.js";

const numberFormat = new Intl.NumberFormat('en-Us', { style: 'decimal', maximumFractionDigits: 0, useGrouping: true })
const oxygenNumberFormat = new Intl.NumberFormat('en-Us', { style: 'decimal', maximumFractionDigits: 1, useGrouping: true })

export default class HudScene extends Phaser.Scene {

	constructor() {
		super({key: 'HudScene', active: false});

		this.score = 0;
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

		this.hud = this.add.text(0, 0, '-', {font: '25px Courier', fill: 'white', backgroundColor: 'black'});

		this.lowO2Warning = this.add.text(250, 75, '⚠ Low Oxygen', {
			font: '25px Courier',
			fill: 'yellow',
			backgroundColor: 'black'
		});
		this.lowFuelWarning = this.add.text(250, 25, '⚠ Low Fuel, watch for broken engines and leaking tanks', { // TODO: warn when leak ?
			font: '25px Courier',
			fill: 'yellow',
			backgroundColor: 'black'
		});
		this.engineWarning = this.add.text(250, 100, '⚠ Failing Engine, slowed course, fuel spilled, risk of worsening', {
			font: '25px Courier',
			fill: 'yellow',
			backgroundColor: 'black'
		});

		this.lowO2Warning.setVisible(false);
		this.lowFuelWarning.setVisible(false);
		this.engineWarning.setVisible(false);
	}

	update(time, delta) {
		this.updateGoals();

		this.hud.setText(
`SCORE: ${numberFormat.format(spaceshipStats.score.total)}
FUEL: ${numberFormat.format(spaceshipStats.fuel)}
WATER: ${numberFormat.format(spaceshipStats.water)}
O2: ${oxygenNumberFormat.format(spaceshipStats.o2)}
PILOT: ${spaceshipStats.pilotHealth}
DISTANCE: ${numberFormat.format(spaceshipStats.distanceLeft)}`
		);
	}

	updateGoals() {
		if (spaceshipStats.o2 < 15) {
			this.lowO2Warning.setVisible(true);
		} else {
			this.lowO2Warning.setVisible(false);
		}


		if (spaceshipStats.o2 < 10) {
			// TODO faint pilot
		}

		const FUEL_ALERT_THRESHOLD = 500;
		if (spaceshipStats.fuel < FUEL_ALERT_THRESHOLD) {
			this.lowFuelWarning.setVisible(true);
		} else {
			this.lowFuelWarning.setVisible(false);

		}
		if (spaceshipStats.fuel <= 0) {
			// TODO: out of fuel
		}
		if (spaceshipStats.fuelOnFloor > 100) {
			// TODO: raise fuel spill warning
		}
		if (spaceshipStats.interactivesStatus && (
			spaceshipStats.interactivesStatus.topEngine < 100 ||
			spaceshipStats.interactivesStatus.middleEngine < 100 ||
			spaceshipStats.interactivesStatus.bottomEngine < 100
		)) {
			this.engineWarning.setVisible(true);
		} else {
			this.engineWarning.setVisible(false);
		}
	}
}
