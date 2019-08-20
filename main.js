////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// // USEFUL COMMANDS USED IN MANY GAMES
// timerBarAnimation.pause();
// timerBarAnimation.resume();
// game.time.events.add(Phaser.Timer.SECOND * 2, function(){(userDied());}, this);
// game.physics.arcade.overlap(spriteOne, spriteTwo, functionToCall, null, this);
// game.physics.enable(sprite, Phaser.Physics.ARCADE);

// // CALL THIS FUNCTION WHEN PLAYING A SOUND
// playSound(soundToPlay);

// // USEFUL FOR SWIPING GAMES
// var startSwipePoint;
// var endSwipePoint;
// var minimumSwipeLength = 500;

// // TO CALL EMITTER
// emitter.x = object.x;
// emitter.y = object.y;
// emitter.start(true, 1000, null, 30);
// game.world.bringToTop(emitter);

// // TWEEN COMMANDS
// var tweenName = game.add.tween(object).to({x: somePosition}, time, Phaser.Easing.Linear.none, true);
// tweenName.onComplete.add(callFunction);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var game = new Phaser.Game(750, 1334, Phaser.CANVAS, 'template',
	{
		preload: preload,
		create: create,
		// render: render, // Comment/Uncomment to use the render function.
		update: update
	}
);

// ------------------ NEEDED / ------------------
var gameCoinsData = [{scoreMin: 0, scoreMax: 0, multiplier: 0, divider: 0, module: 0}]; // Used for calculating the game coin data.
var DEBUG = true; // Immediately restarts the game upon calling userDied(), to help the development process.
// ------------------ / NEEDED ------------------

// Use this if your game requires a timer bar.
var timerBarAnimation;

function preload()
{
	applyGameSettings(
						SCOREBAR_SETTINGS.LIVES, // NORMAL = Default, MOVES_LEFT = Scorebar with moves left (ie, dots, jelly), LIVES = Scorebar with lives.
						TIMERBAR_SETTINGS.RED_ANIM, // NO_ANIM = Default, RED_ANIM = Scorebar w/ time-left animation, GREEN_ANIM = Green timer bar for games without penalty for time running out.
					);

	// All games require a background and the device document.
	game.load.image('background', 'assets/background.png');

	// If you aren't using lives, remove these.
	game.load.image('unfilledHeart', 'assets/unfilledHeart.png');
	game.load.image('filledHeart', 'assets/filledHeart.png');
	
	// Required when finished game is uploaded to the backend.
	// device = document.getElementById('device').value;
	
	// Required for Arcade Physics games. Switch 'ARCADE' to 'BOX2D' if you need features such as (C)ontinuous (C)ollision (D)etection.
	game.physics.startSystem(Phaser.Physics.ARCADE);
}

function create()
{
	// Load the background first to not have an empty canvas at first.
	background = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'background');

	// Global function that initiates the coins circle, etc.
	createGlobals();

	// Used for the apps loading bar, with percentage as parameter.
	notifyApp(100);

	// Keep this last in create(), as it starts the game automatically when developing.
	if (DEBUG)
	{
		turnSoundOn();
		startGame();
	}
}

function render()
{
	/*
	 *  This function is useful to visualize colliders and other information.
	 */
	if (!gameStarted) { return; }

	// game.debug.box2dWorld(); // Useful information about bodies (BOX2D).
	// game.debug.bodyInfo(yourSprite); // Useful information about bodies (ARCADE).
	// game.debug.body(yourSprite); // Used for visualizing colliders on bodies.
}

function update()
{
	// Uncomment if your game uses fps-based calculations (e.g velocities, gravity, emitters).
	// if (shouldCalculateFps) { calculateFPS(); }

	if (!gameStarted) { return; }

	calculateFPS();
}

// Call this function to start a timer bar animation.
function makeTweenTimerAnimation(_duration) {
	timerBarAnimation = game.add.tween(timerBar).to({ x: game.world.width/2 - (game.world.width/5) - game.world.width/2 - (game.world.width/5) }, Phaser.Timer.SECOND * _duration).start();
	timerBarAnimation.onComplete.add(userDied, this);
}

// Call this function to restart the timer bar animation.
function resetTimerBar() {
	if (!gameStarted) { return; }

	timerBar.destroy();
	makeTweenTimer();

	// Don't forget to change the parameter (duration) to match your game.
	makeTweenTimerAnimation(1);
}

function startGame()
{
	// Global function for resetting/starting the game upon death.
	resetStartGame();

	// -------------- Add code below this point --------------

	// -------------- Add code above this point --------------

	// Global function that starts the game, taking fps lag in to account.
	beginGame();
}

function userDied()
{
	if (!gameStarted) { return; }
	
	// Global function that stops the game and gametimer.
	endGame();

	// ------------- Destroy any sprites, timers, tweens, etc, you have created here to stop duplication. -------------

	// ----------------------------------------------------------------------------------------------------------------
	
	// Calls the app to send over relevant info regarding the player round.
	callApp();

	// Immediately restarts the game if in debug mode.
	if (DEBUG) { startGame(); }
}