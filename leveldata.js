export const LEVEL_DATA = [

	// LEVEL 1
	{
		levelName: 'Your First Ride',
		spaceshipStats: {
			fuel: 3000,
			fuelOnFloor: 0,
			water: 1000,
			waterOnFloor: 0,
			pilotHealth: 100,
			pilotDeviation: 0,
			distanceLeft: 140000,
			o2: 22
		},
		failureProbabilities: {
			fuelTank: 1 / 120,
			chair: 1 / 40,
			o2Recycler: 0,
			powerGenerator: 0,
			engineTop: 1 / 60,
			spaceTimeFolder: 0
		},
		storylines: [
			"Hey, I've got a job for you -",
			"The company needs the spaceship to \ngo to Planet CAPRICUS ALPHA II.",
			"We need someone to take care of\n the maintenance there",
			"Now I'm not gonna lie, \nthis spaceship have had better days",
			"But times are hard you now,\nbudgets are tight.",
			"we can't really afford to buy a shiny new aeronef",
			"So lets go OK ?",
			"Oh, and by the way,\n   the pay is not so good",
			"And we might need you to do unpaid overtime",
			"But you need a job right ?",
			"Don't worry, it should be a lot of fun.",
			"Fine, next"
		]
	},

	// LEVEL 2
	{
		levelName: 'Watch Your Oxygen Levels',
		spaceshipStats: {
			fuel: 3000,
			fuelOnFloor: 0,
			water: 2000,
			waterOnFloor: 0,
			pilotHealth: 100,
			pilotDeviation: 0,
			distanceLeft: 140000,
			o2: 20
		},
		failureProbabilities: {
			fuelTank: 1 / 120,
			chair: 1 / 40,
			o2Recycler: 0,
			powerGenerator: 0,
			topEngine: 1 / 60,
			middleEngine: 1 / 60,
			spaceTimeFolder: 0
		},
		storylines: [
			"Great Job - You did Well",
			"Sorry, no time to rest, we need to get on the road right now",
			"Now we can load up the goods inside the ship",
			"And then transport those to PEGASI NERI.",
			"Hm, by the way it looks like the middle engine",
			"is not doing well, please keep an eye on it."
		]
	},

	// LEVEL 3
	{
		levelName: 'Space on fire',
		spaceshipStats: {
			fuel: 3000,
			fuelOnFloor: 0,
			water: 2000,
			waterOnFloor: 0,
			pilotHealth: 100,
			pilotDeviation: 0,
			distanceLeft: 40000,
			o2: 20
		},
		failureProbabilities: {
			fuelTank: 1 / 12,
			chair: 1 / 10,
			o2Recycler: 1/15,
			powerGenerator: 0,
			topEngine: 1 / 20,
			middleEngine: 1 / 20,
			bottomEngine: 1 / 20,
			spaceTimeFolder: 1/600
		},
		storylines: [
			"Awesome, we made it !",
			"I know you could make it!",
			"Ok, as you probably guess,\n there's more to do",
			"saddle up baby, we ride out again",
			"Ah, I forgot, we have to travel through\n some asteroids fields",
			"Nothing much to worry about, trust me, I'll manage"
		]
	},

	// LEVEL 4
	{
		levelName: 'To Infinity',
		spaceshipStats: {
			fuel: 30000,
			fuelOnFloor: 0,
			water: 20000,
			waterOnFloor: 0,
			pilotHealth: 200,
			pilotDeviation: 0,
			distanceLeft: 350100200,
			o2: 20
		},
		failureProbabilities: {
			fuelTank: 1 / 32,
			chair: 1 / 40,
			o2Recycler: 1/45,
			powerGenerator: 1/40,
			topEngine: 1 / 60,
			middleEngine: 1 / 50,
			bottomEngine: 1 / 40,
			spaceTimeFolder: 1/300
		},
		storylines: [
			"Haha I can't believe we're still alive!",
			"You're very good at this job are you ?",
			"....",
			"So, uh. What's next?",
			"Should we continue ..?",
			"To infinity, and see what happens ?",
			"(spoiler: nothing special will)",
		]
	}



];
