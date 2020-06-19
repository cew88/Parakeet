var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
var nextWord = document.getElementById("next-word");

var missed_words = 0;

var levelNum = parseInt(localStorage.getItem('level'));
var stageNum = parseInt(localStorage.getItem('stage'));
console.log('level', levelNum, 'stage', stageNum);

let outer = document.getElementById('outer'),
	width = outer.clientWidth,
	height = outer.clientHeight,
	vmin = Math.min(width, height);
	groundHeight = height/8,
	crateHeight = vmin/5;

fetch('levels.json').then(response => response.json()).then(json => {
	let stage = json[levelNum][stageNum];
	console.log(stage);
});


var allCrates = [];
var cratePattern = [0, 1, 2, 1, 2, 2, 1, 2, 3, 2, 1, 1, 2, 1, 2, 3, 2];
// var cratePattern = [0, 1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 1];
var currentCrate = 0;

var config = {
	type: Phaser.AUTO,
	scale: {
		_mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
		parent: 'outer',
		width: width,
		height: height
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: vmin/2 },
			debug: false
		}
	},
	backgroundColor: '#2d2d2d',
	parent: 'outer',
	dom: {
		createContainer: true
	},
	scene: {
		preload: preload,
		create: create,
		update: update,
	},
	// pixelArt: true
};

var game = new Phaser.Game(config);

function preload (){
	this.load.image('skyeFront', 'images/Skyefrontview.png');
	this.load.image('skyeSide', 'images/Skyesideview.png');
	this.load.image('coco', 'images/coco.png');
	this.load.image('beany', 'images/beany.png');
	this.load.image('poppy', 'images/poppy.png');
	this.load.image('enviro', 'images/GameBackground.png');
	this.load.image('ground', 'images/platform.png');
	this.load.image('crate', 'images/crate.png');

	Object.assign(this, {
		autoHop: autoHop
	});

}

function create (){
	// SETTING THE BACKGROUND
	this.add.image(0, 0, 'enviro').setOrigin(0, 0);

	// CREATING THE PHYSICS COMPONENTS
	this.platforms = this.physics.add.staticGroup();

	this.ground = this.physics.add.staticGroup();
	var ground = this.add.rectangle(0, height - groundHeight, width, groundHeight, 0x20a420).setOrigin(0, 0);
	this.ground.add(ground);

	this.finish = this.physics.add.sprite(width*2, height - groundHeight - vmin/5, 'coco')
	scaleByHeight(this.finish, vmin/5);
	this.finish.setOrigin(0,0);

	this.player = this.physics.add.sprite(vmin*0.25/5, height - groundHeight - vmin/5, 'beany')
	scaleByWidth(this.player, vmin/5);
	this.player.setOrigin(0, 0);
	this.player.setCollideWorldBounds(true);
  this.player.setBounce(0.2);

	// MAKING THE CRATES
	for (let i = 0; i < cratePattern.length; i++){
		makeCrates.bind(this)(1.75*i*vmin/5, cratePattern[i]);
	}

	
	// SETTING COLLIDERS
  this.finish.setCollideWorldBounds(true);
  this.physics.add.collider(this.finish, this.platforms);
	this.physics.add.collider(this.finish, this.ground);
	this.physics.add.collider(this.platforms, this.ground);
	this.physics.add.collider(this.player, this.ground);
	this.physics.add.collider(this.player, this.platforms);
  
  this.physics.add.collider(this.player, this.finish, function(){
     modal.style.display = "block";
     var star = document.createElement("img");
     star.setAttribute("src", "images/star.png");
		 star.setAttribute("width", "5%");
     if (missed_words == 0){
      document.getElementById("stars").appendChild(star);
      document.getElementById("stars").appendChild(star.cloneNode(true));
      document.getElementById("stars").appendChild(star.cloneNode(true));
     } else if (missed_words > 0 && missed_words < 5){
      document.getElementById("stars").appendChild(star);
      document.getElementById("stars").appendChild(star.cloneNode(true));
     } else if (missed_words >= 5 && missed_words < 10){
      document.getElementById("stars").appendChild(star);
     }

  }, null, this);
}

function update (){
	moveSkye.bind(this)();
}

function makeCrates(x, crates){
	for (let i = 1; i <= crates; i++){
		let c = this.platforms.create(x, height - groundHeight - crateHeight*i, 'crate').setOrigin(0, 0);
		scaleByHeight(c, crateHeight);
		c.refreshBody();
		allCrates.push(c);
		this.platforms.add(c);
	}
}

function autoHop(){
	if (cratePattern[currentCrate+1] > cratePattern[currentCrate]){
		this.player.setVelocityX(vmin/4.15);
		this.player.setVelocityY(-vmin/2);
	}
	else if (cratePattern[currentCrate+1] == cratePattern[currentCrate]){
		this.player.setVelocityX(vmin/4.25);
		this.player.setVelocityY(-vmin/2.68);	
	}
	else {
		this.player.setVelocityX(vmin/4.25);
		this.player.setVelocityY(-vmin/4.1);
	}
	currentCrate++;
}


function moveSkye(){
	var cursors = this.input.keyboard.createCursorKeys();

	if (this.player.x >= width/2){
		let dist = this.player.x - width/2;
		this.player.x = width/2;
		this.platforms.incX(-dist);
		for (let c of allCrates){
			c.refreshBody();
		}
	}

	if (cursors.right.isDown && this.player.body.touching.down){
		// autoHop.bind(this)();
		this.autoHop();
	}
	else if (this.player.body.touching.down){
		this.player.setVelocityX(0);
	}

	if (cursors.up.isDown && this.player.body.touching.down){
		this.player.setVelocityY(-height/2);
	}
}

function scaleByHeight(object, h){ object.setScale(h/object.height); }
function scaleByWidth(object, w){ object.setScale(w/object.height); }

span.onclick = function(){
  modal.style.display = "none";
}

window.onclick = function(event){
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

