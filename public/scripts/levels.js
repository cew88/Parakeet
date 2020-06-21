var container = document.getElementById('container');
var select = document.getElementById('level-select');
var currentLevel = localStorage.getItem('level') || "Beginner";

var boxes = [[25, 25], [25, 75], [50, 75], [50, 25], [75, 25]];
var boxSize = 10;
var borderWid = 10;
var json;
// var sideLen = boxSize*canvas.clientWidth/100;
fetch('levels.json').then(response => response.json()).then(j => {
	// options
	select.innerHTML = "";
	for (let k of Object.keys(j)){
		select.innerHTML += `<option>${k}</option>`
	}

	select.value = currentLevel;

	json = j;
	makeListings(currentLevel);
});

function makeListings(level){
	container.innerHTML = "";
	for (let i = 0; i < Object.keys(json[level]).length; i++){
		let classlist = "level-listing " + currentLevel;
		if (localStorage.getItem(level + (i+1))) classlist += " completed";
		container.innerHTML += `
		<div class="${classlist}" onclick="start(${i+1})">
		<span>${i+1}</span>
		</div>
		`;
	}
}

function changeLevel(){
	localStorage.setItem('level', select.value);
	currentLevel = select.value;
	makeListings(select.value);
}

function start(stageNum){
	localStorage.setItem('stage', stageNum);
	window.location.href = "/play.html";
}