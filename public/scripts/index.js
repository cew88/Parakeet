var level = parseInt(localStorage.getItem('level'));
var stage = parseInt(localStorage.getItem('stage'));

if (!level){
	level = 1;
	localStorage.setItem('level', 'Beginner');
}

if (stage == null){
	stage = 1;
	localStorage.setItem('stage', '1');
}

function resetGame(){
	localStorage.removeItem('level');
}