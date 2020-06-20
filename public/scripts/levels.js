var container = document.getElementById('container');
var select = document.getElementById('level-select');
var currentLevel = localStorage.getItem('level');

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

	json = j;
	makeListings(currentLevel);
});

function makeListings(level){
	container.innerHTML = "";
	for (let i = 0; i < Object.keys(json[level]).length; i++){
		container.innerHTML += `
		<div class="level-listing" onclick="start(${i+1})">
		<span>${i+1}</span>
		</div>
		`;
	}
}

function changeLevel(){
	localStorage.setItem('level', select.value);
	makeListings(select.value);
}

function start(stageNum){
	localStorage.setItem('stage', stageNum);
	window.location.href = "/play.html";
}