var container = document.getElementById('container');
var select = document.getElementById('level-select');
var currentLevel = localStorage.getItem('level');

var boxes = [[25, 25], [25, 75], [50, 75], [50, 25], [75, 25]];
var boxSize = 10;
var borderWid = 10;
// var sideLen = boxSize*canvas.clientWidth/100;
fetch('levels.json').then(response => response.json()).then(json => {
	let stages = json[currentLevel];
	let keys = Object.keys(stages);

	for (let i = 0; i < keys.length; i++){
		makeListing(i+1);
	}
});

function makeListing(num){
	let html = `
	<div class="level-listing" onclick="start(${num})">
	${num}
	</div>
	`;
	container.innerHTML += html;
}

// for (let i = 0; i < boxes.length; i++){
// 	let el = `
// 		<a class="level-icon" onclick="start(${i+1})" style="left:calc(${boxes[i][0]}% - ${boxSize/2}vmin); top:calc(${boxes[i][1]}% - ${boxSize/2}vmin); width:${boxSize}vmin; height:${boxSize}vmin">${i+1}</a>
// 	`;
// 	let line = document.createElement('div');
// 	line.classList.add('line');
// 	// line.style.border = `${borderWid}px solid black`;
// 	if (i < boxes.length - 1){
// 		let bottom = 100-Math.max(boxes[i+1][1], boxes[i][1]), 
// 				top = Math.min(boxes[i+1][1], boxes[i][1])
// 		line.style.top = top + "%";
// 		line.style.bottom = bottom + "%";
// 		if (boxes[i][0] < boxes[i+1][0]){
// 			line.style.left = `calc(${boxes[i][0]}% + ${boxSize/2}vmin + 2px)`;
// 			line.style.right = `calc(${100-boxes[i+1][0]}% + ${boxSize/2}vmin - 2px)`;
// 			line.style.top = `calc(${top}% - ${borderWid/2}px)`;
// 			line.style.bottom = `calc(${bottom}% - ${borderWid/2}px)`;
// 		}
// 		if (boxes[i][1] != boxes[i+1][1]){
// 			line.style.left = `calc(${boxes[i][0]}% - ${borderWid/2}px)`;
// 			line.style.right = `calc(${100-boxes[i+1][0]}% - ${borderWid/2}px)`;
// 			line.style.top = `calc(${top}% + ${boxSize/2}vmin + 2px)`;
// 			line.style.bottom = `calc(${bottom}% + ${boxSize/2}vmin - 2px)`;
// 		}
// 		container.appendChild(line);
// 	}
// 	container.innerHTML += el;
// }

function changeLevel(){
	let conversion = ["Beginner", "Intermediate", "Advanced"];
	localStorage.setItem('level', conversion.indexOf(select.value) + 1);
}

function start(stageNum){
	localStorage.setItem('stage', stageNum);
	window.location.href = "/play.html";
}