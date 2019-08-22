var game = new Phaser.Game(800, 1337, Phaser.CANVAS, 'template',
	{
		preload: preload,
		create: create,
		update: update
	}
);

var backplate;

function preload()
{
	game.load.image('backplate', 'assets/backplate.png');
}

function create()
{
	// Use a tilesprite to be able to feign menues by scrolling it.
	backplate = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'backplate');
}

function update()
{}