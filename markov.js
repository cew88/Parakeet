class Word {
	constructor(word, partOfSpeech){
		this.word = word;
		this.partOfSpeech = partOfSpeech;
		this.total = 0;
		this.connections = {};
	}
	addConnection(word){
		total++;
		if (word in this.connections){
			this.connections[word]++;
		}
		else{
			this.connections[word] = 1;
		}
	}
}
// I took a little break I'll finish this now

class Markov {
	constructor(){
		this.words = {};
	}
	add(lastWord, word, partOfSpeech){
		let newWord = new Word(word, partOfSpeech);
		if (lastWord){
			this.words[lastWord].addConnection(word);
		}
		this.words[word] = newWord;
	}
	filterWords(words, partOfSpeech){
		let newWords = {};
		let total = 0;
		for (let key in Object.keys(partOfSpeech)){
			if (this.words[key].partOfSpeech == partOfSpeech){
				total += words[key];
				newWords[key] = words[key];
			}
		}

		return [newWords, total];
	}
	generate(word, partOfSpeech){
		let total;
		let connections;
		if (partOfSpeech){
			let results = this.filterWords(w.connections, partOfSpeech);
			connections = results[0];
			total = results[1];
		}
		else{
			let w = this.words[word];
			total = w.total;
			connections = w.connections;
		}
		
		let randNum = Math.floor(Math.random()*total),
				sum = 0,
				keys = Object.keys(connections);

		for (let i of Object.keys(connections)){
			if (sum + connections[i] >= randNum) return this.words[i];
			sum += connections[i];
		}
		return this.words[this.words.length - 1];
	}
}

var markov = new Markov();

let text = "";
let partsOfSpeech = "";

let sentences = text.split(".");
let posSentences = partsOfSpeech.split(".");
for (let i = 0; i < sentences.length; i++){
	let p = sentences[i];
	let pos = posSentences[i];
	let lastWord = "";
	for (let i = 0; i < p.length; i++){
		markov.add(lastWord, p[i].replace(/[^A-Za-z0-9]/g, ''), pos[i]);
	}
}