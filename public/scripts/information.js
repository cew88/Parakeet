missed_words = ["apple", "pear", "banana", "hamster"];

var word_defs = document.getElementById("word_defs");
var button_ids = [];

for (word of missed_words) {
  let xhr_definition = new XMLHttpRequest();
  xhr_definition.open("GET", "https://www.dictionaryapi.com/api/v3/references/sd2/json/" + word + "?key=fc0a8b68-03bb-41dd-adb9-890b0d4986ec");
  xhr_definition.send();

  
  xhr_definition.onload = () => {
    dict_json = (JSON.parse(xhr_definition.response));

    var pronunciation_audio = (dict_json[0].hwi.prs[0].sound.audio);
    var word_txt = document.createTextNode(dict_json[0].meta.id + ": ");
    var def_txt = document.createTextNode(dict_json[0].shortdef[0]);
    
    var audio_btn = document.createElement("p");
    audio_btn.className = "button";
    audio_btn.append(document.createTextNode("Play Pronunciation"));
    audio_btn.addEventListener("click", function(){
        var audio = new Audio("https://media.merriam-webster.com/audio/prons/en/us/mp3/" + String(pronunciation_audio)[0] + "/" + pronunciation_audio + ".mp3");
        audio.type = "audio/mp3";
        audio.play();
    });
    
    button_ids.push(audio_btn.id);
  
    word_defs.appendChild(document.createElement("br")); 
    word_defs.appendChild(word_txt);
    word_defs.appendChild(document.createElement("br"));
    word_defs.appendChild(def_txt);
    word_defs.appendChild(document.createElement("br"));
    word_defs.appendChild(audio_btn);
    word_defs.appendChild(document.createElement("br"));

  }
  
}
