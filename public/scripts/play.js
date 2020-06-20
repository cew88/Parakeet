var end_modal = document.getElementById("score_modal");
var end_modal_close = document.getElementsByClassName("close")[0];

var intro_modal = document.getElementById("intro_modal");
var intro_modal_close = document.getElementsByClassName("close")[1];

var storm_modal = document.getElementById("storm_modal");
var storm_modal = document.getElementsByClassName("close")[2];

var reunited_modal = document.getElementById("reunited_modal");

var nextWord = document.getElementById("next-word");
var said = document.getElementById("said");
var sentence_to_read = document.getElementById("sentence_to_read");
var scene;
var stage;
var cratePattern = [0];
var allCrates = [];
var currentCrate = 0;
var finished = false;


window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

if ('SpeechRecognition' in window) {
  console.log("Supported");
} else {
  console.log("Not Supported");
}

var levelNum = localStorage.getItem('level');
var stageNum = localStorage.getItem('stage');
console.log('level', levelNum, 'stage', stageNum);

var outer = document.getElementById('outer'),
	width = outer.clientWidth,
	height = outer.clientHeight,
	vmin = Math.min(width, height);
	groundHeight = height/8,
	crateHeight = vmin/5;

var wordPronounciations = {
	'sky': ['skye'],
	'pho': ['faux'],
	'0': ['zero'],
	'1': ['one'],
	'2': ['two', 'to', 'too'],
	'3': ['three'],
	'4': ['four', 'for', 'fore'],
	'5': ['five'],
	'6': ['six'],
	'7': ['seven'],
	'8': ['eight', 'ate'],
	'9': ['nine']
};


document.getElementById("repeat_pronunciation").onclick = pronounce_word;

var total_words = 0;
var sentence_length = sentence_to_read.innerHTML.length;

var test;

var currentWord = 0;
fetch('levels.json').then(response => response.json()).then(json => {
	stage = json[levelNum][stageNum].split('-');
  sentence_to_read.innerHTML = 	json[levelNum][stageNum].split('-').join(' ');

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
		if (finished){
			console.log("you've already finished");
			return;
		}
		let interimTranscript = '';
		let focus = removePunctuation(stage[currentWord].toLowerCase());

		for (let i = event.resultIndex, len = event.results.length; i < len; i++) {
			let transcript = event.results[i][0].transcript.trim().toLowerCase();
			if (event.results[i].isFinal){
				if (transcript == focus || (transcript in wordPronounciations && wordPronounciations[transcript].indexOf(focus) >= 0)){
					currentWord++;
					scene.autoHop();
					if (currentWord == stage.length){
						console.log('finished');
            display_modal();
						return;
					}
					focus = stage[currentWord].toLowerCase();
					nextWord.innerHTML = stage[currentWord] || "";
				}
			}
			else{
				interimTranscript = transcript;
				if (transcript == focus || (transcript in wordPronounciations && wordPronounciations[transcript] == focus)){
					currentWord++;
					scene.autoHop();
					if (currentWord == stage.length){
						console.log('finished');
						display_modal();
						return;
					}
					focus = stage[currentWord].toLowerCase();
					nextWord.innerHTML = stage[currentWord] || "";
				}
        else{
          total_words++;
        }
			}
		}

		said.innerHTML = '<i style="color:#ddd;">' + interimTranscript + '</>';
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
		this.load.image('enviro', 'images/background.png');
		this.load.image('ground', 'images/platform.png');
		this.load.image('crate', 'images/crate.png');
    this.load.image('finish_flag', 'images/finishflag.png');
		this.load.image('duck', 'images/duck.png');

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
		var ground = this.add.rectangle(0, height - groundHeight, width, groundHeight, 0xffffff).setOrigin(0, 0);
		this.ground.add(ground);

		this.finish = this.add.image(width*2, height - groundHeight - vmin/5, 'finish_flag')
		scaleByHeight(this.finish, vmin/5);
		this.finish.setOrigin(0,0);

		this.player = this.physics.add.sprite(vmin*0.1/5, height - groundHeight - vmin/3, 'duck')
		scaleByWidth(this.player, vmin/6);
		this.player.setOrigin(0, 0);
		this.player.setCollideWorldBounds(false);
		this.player.onWorldBounds = false;
		this.player.setBounce(0.2);
		this.player.flipX = true;

		// MAKING THE CRATES
		for (let i = 0; i < cratePattern.length - 1; i++){
			makeCrates.bind(this)(1.75*i*vmin/5, cratePattern[i]);
		}
		this.finish.x = 1.75*(cratePattern.length-1)*vmin/5;
		this.finish.y = height - groundHeight - vmin/5;

		this.platforms.add(this.finish);
		
		// SETTING COLLIDERS
		// this.finish.setCollideWorldBounds(true);
		// this.physics.add.collider(this.finish, this.platforms);
		// this.physics.add.collider(this.finish, this.ground);
		this.physics.add.collider(this.platforms, this.ground);
		this.physics.add.collider(this.player, this.ground);
		this.physics.add.collider(this.player, this.platforms);
		this.physics.add.collider(this.finish, this.player);
		

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
		if (currentCrate == cratePattern.length-1){
			if (cratePattern[currentCrate] == 1){
				this.player.setVelocityX(vmin/4.25);
				this.player.setVelocityY(-vmin/9);
			}
			else if (cratePattern[currentCrate] == 2){
				this.player.setVelocityX(vmin/4.25);
				this.player.setVelocityY(-vmin/7);	
			}
			else {
				this.player.setVelocityX(vmin/4.25);
				this.player.setVelocityY(-vmin/8);
			}

		}
		else {
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
			currentWord++;
			nextWord.innerHTML = stage[currentWord] || "";
			if (currentWord == stage.length) display_modal();
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
}

function pronounce_word(){  
  word = nextWord.innerHTML;
  let xhr_definition = new XMLHttpRequest();
  xhr_definition.open("GET", "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" + word + "?key=848dceed-1774-43e0-90cd-050cec693213");

  xhr_definition.send();

  
  xhr_definition.onload = () => {
    dict_json = (JSON.parse(xhr_definition.response));

    try{
      var pronunciation_audio = (dict_json[0].hwi.prs[0].sound.audio);
      var word_txt = document.createTextNode(dict_json[0].meta.id + ": ");
      var def_txt = document.createTextNode(dict_json[0].shortdef[0]);
      
      var audio = new Audio("https://media.merriam-webster.com/audio/prons/en/us/mp3/" + String(pronunciation_audio)[0] + "/" + pronunciation_audio + ".mp3");
      audio.type = "audio/mp3";
      audio.play();
    }
    catch(TypeError){
      console.log("No pronunciation found");
    }
  }
};

function display_modal(){
	finished = true;
	end_modal.style.display = "block";
	var star = document.createElement("img");
	star.setAttribute("src", "images/star.png");
	star.setAttribute("width", "5%");
  star.style.display = 'inline-block';

	if (total_words/sentence_length <= 3){
		document.getElementById("stars").appendChild(star);
		document.getElementById("stars").appendChild(star.cloneNode(true));
		document.getElementById("stars").appendChild(star.cloneNode(true));
	} else if (total_words/sentence_length > 3 && total_words/sentence_length <= 5){
		document.getElementById("stars").appendChild(star);
		document.getElementById("stars").appendChild(star.cloneNode(true));
	} else if (total_words/sentence_length > 5 && total_words/sentence_length <= 7){
		document.getElementById("stars").appendChild(star);
	}
	else {
		var retry_message = document.createTextNode("Try again!");
		var redo_img = document.createElement("img");
		redo_img.setAttribute("src", "images/redo.png");
		redo_img.setAttribute("width", "5%");
    redo_img.setAttribute("href", "levels.html");
		document.getElementById("stars").appendChild(retry_message);
    document.getElementById("stars").innerHTML += "<br><br>";
    document.getElementById("stars").appendChild(redo_img);
	}
}

if (levelNum == "Beginner" && stageNum == 1) {
  intro_modal.style.display = "block";
}

if (levelNum == "Intermediate" && stageNum == 12){
  storm_modal.style.display = "block";
}

end_modal_close.onclick = function(){
  end_modal.style.display = "none";
}

intro_modal_close.onclick = function(){
  intro_modal.style.display = "none";
}

storm_modal_close.onclick = function(){
  storm_modal.style.display = "none";
}


window.onclick = function(event){
  end_modal.style.display = "none";
  intro_modal.style.display = "none";
}

function removePunctuation(str){
	let punctuation = `.,'"!`;
	for (let i = 0; i < punctuation.length; i++){
		str = str.split(punctuation.charAt(i)).join("");
	}
	return str;
}