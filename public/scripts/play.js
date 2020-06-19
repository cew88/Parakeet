var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
var nextWord = document.getElementById("next-word");
var said = document.getElementById("said");
var scene;
var missed_words = 0;
var cratePattern = [0];
var allCrates = [];
var currentCrate = 0;

window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

if ('SpeechRecognition' in window) {
  console.log("Supported");
} else {
  console.log("Not Supported");
}

var levelNum = parseInt(localStorage.getItem('level'));
var stageNum = parseInt(localStorage.getItem('stage'));
console.log('level', levelNum, 'stage', stageNum);

let outer = document.getElementById('outer'),
	width = outer.clientWidth,
	height = outer.clientHeight,
	vmin = Math.min(width, height);
	groundHeight = height/8,
	crateHeight = vmin/5;


var currentWord = 0;
fetch('levels.json').then(response => response.json()).then(json => {
	let stage = json[levelNum][stageNum].split(' ');
	nextWord.innerHTML = stage[currentWord];
	makeCratePatern(stage);
	console.log('pattern', cratePattern);

	startGame();

	console.log(stage);

	let finalTranscript = '';
	let recognition = new window.SpeechRecognition();

	recognition.interimResults = true;
	recognition.maxAlternatives = 10;
	recognition.continuous = true;

	recognition.onresult = (event) => {
		let interimTranscript = '';

		for (let i = event.resultIndex, len = event.results.length; i < len; i++) {
			let transcript = event.results[i][0].transcript.trim().toLowerCase();
			if (event.results[i].isFinal){
				if (transcript == stage[currentWord].toLowerCase() || transcript == 'sky' && stage[currentWord].toLowerCase() == 'skye'){
					currentWord++;
					scene.autoHop();
					if (currentWord == stage.length) window.location.href = "/levels.html";
					nextWord.innerHTML = stage[currentWord];
				}
			}
			else{
				if (transcript == stage[currentWord].toLowerCase() || transcript == 'sky' && stage[currentWord].toLowerCase() == 'skye'){
					currentWord++;
					scene.autoHop();
					if (currentWord == stage.length) window.location.href = "/levels.html";
					nextWord.innerHTML = stage[currentWord];
				}
			}
		}
		
		said.innerHTML = finalTranscript + '<i style="color:#ddd;">' + interimTranscript + '</>';
	}

	recognition.start();
});

function makeCratePatern(arr){
	for (let i = 0; i < arr.length; i++){
		if (i == 0){
			cratePattern.push(1);
			continue;
		}
		if (cratePattern[i] == 1) cratePattern.push(randInt(1, 2));
		else if (cratePattern[i] == 2) cratePattern.push(randInt(1, 3));
		else if (cratePattern[i] == 3) cratePattern.push(randInt(2, 3));
	}
}

function randInt(min, max){
	let dif = max-min;
	return min + Math.floor(Math.random()*(dif+1));
}

function startGame(){
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
		this.load.image('bird', 'images/bird.png');
		this.load.image('enviro', 'images/GameBackground.png');
		this.load.image('ground', 'images/platform.png');
		this.load.image('crate', 'images/crate.png');

		scene = this;

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
		var ground = this.add.rectangle(0, height - groundHeight, width, groundHeight, 0x32b4e6).setOrigin(0, 0);
		this.ground.add(ground);

		this.finish = this.physics.add.sprite(width*2, height - groundHeight - vmin/5, 'coco')
		scaleByHeight(this.finish, vmin/5);
		this.finish.setOrigin(0,0);

		this.player = this.physics.add.sprite(vmin*0.25/5, height - groundHeight - vmin/3, 'poppy')
		scaleByWidth(this.player, vmin/6);
		this.player.setOrigin(0, 0);
		this.player.setCollideWorldBounds(false);
		this.player.onWorldBounds = false;
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
	function scaleByWidth(object, w){ object.setScale(w/object.width); }

	span.onclick = function(){
		modal.style.display = "none";
	}

	window.onclick = function(event){
		if (event.target == modal) {
			modal.style.display = "none";
		}
	}
}