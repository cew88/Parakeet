nounList = ["apple", "banana", "hamster"];
verbList = ["ate", "ran", "spoke"];
adjList = ["happy", "excited", "yellow"];
advList = ["quickly", "slowly", "hungrily"];
conjList = ["for", "and", "nor", "but", "yet", "so"];
subordList = ["after", "although", "as", "because", "before", "even though", "even if", "if", "once", "though", "unless", "until", "when", "whenever"];
prepList = ["about", "above", "according to", "across", "after", "against", "ahead of", "along", "amidst", "among", "amongst", "before", "behind", "below", "beneath", "beside", "besides", "between", "beyond", "by", "inside", "into", "except", "next to", "past", "towards", "to", "under", "underneath"];

function generateSentence(sentence_type){
  if (sentence_type == "simple"){
    simple_structures = [
      //Subject + Verb
      ("The " + nounList[Math.floor(Math.random() * nounList.length)] + " " + verbList[Math.floor(Math.random() * verbList.length)]),

      //Subject + Verb + Object
      ("The " + nounList[Math.floor(Math.random() * nounList.length)] + " " + verbList[Math.floor((Math.random() * verbList.length))] + " " + nounList[Math.floor(Math.random() * nounList.length)]),

      //Subject + Verb + Adverb
      ("The " + nounList[Math.floor(Math.random() * nounList.length)] + " " + verbList[Math.floor((Math.random() * verbList.length))] + " " + advList[Math.floor(Math.random() * advList.length)]),

      //Subject + Verb + Adj
      ("The " + nounList[Math.floor(Math.random() * nounList.length)] + " is " + adjList[Math.floor(Math.random() * adjList.length)]),

      //Subject + Verb + Noun
      ("The " + nounList[Math.floor(Math.random() * nounList.length)] + " is a " + nounList[Math.floor(Math.random() * nounList.length)]),

      //Adjective + Subject + Verb
      ("The " + adjList[Math.floor(Math.random() * adjList.length)] + " " + nounList[Math.floor(Math.random() * nounList.length)] + " " + verbList[Math.floor(Math.random() * verbList.length)]),

      //Adjective + Subject + Verb + Object
      ("The " + adjList[Math.floor(Math.random() * adjList.length)] + " " + nounList[Math.floor(Math.random() * nounList.length)] + " " + verbList[Math.floor((Math.random() * verbList.length))] + " a " + nounList[Math.floor(Math.random() * nounList.length)]),

      //Adjective + Subject + Verb + Adverb
      ("The " + adjList[Math.floor(Math.random() * adjList.length)] + " " + nounList[Math.floor(Math.random() * nounList.length)] + " " + verbList[Math.floor((Math.random() * verbList.length))] + " " + advList[Math.floor(Math.random() * advList.length)]),

      //Adjective + Subject + Verb + Adj
      ("The " + adjList[Math.floor(Math.random() * adjList.length)] + " " + nounList[Math.floor(Math.random() * nounList.length)] + " is " + adjList[Math.floor(Math.random() * adjList.length)]),

      //Adjective + Subject + Verb + Noun
      ("The " + adjList[Math.floor(Math.random() * adjList.length)] + " " + nounList[Math.floor(Math.random() * nounList.length)] + " is a " + nounList[Math.floor(Math.random() * nounList.length)])
    ];
    return simple_structures[Math.floor(Math.random()*simple_structures.length)];
  }

  else if (sentence_type == "compound"){
    //Subject + Verb, CONJUNCTION Subject + Verb
    return
    ("The " + nounList[Math.floor(Math.random() * nounList.length)] + " " + verbList[Math.floor(Math.random() * verbList.length)] + ", " + conjList[Math.floor(Math.random() * conjList.length)] + "the " + nounList[Math.floor(Math.random() * nounList.length)] + " " + verbList[Math.floor(Math.random() * verbList.length)]);

  }

  else if (sentence_type == "complex"){
    //Subject + Verb SUBORD Subject + Verb
    return ("The " + nounList[Math.floor(Math.random() * nounList.length)] + " " + verbList[Math.floor(Math.random() * verbList.length)] + " " + subordList[Math.floor(Math.random() * subordList.length)] + " the " + nounList[Math.floor(Math.random() * nounList.length)] + " " + verbList[Math.floor(Math.random() * verbList.length)]);
    
  }

  else if (sentence_type == "compound_complex"){
    compound_complex_structures= [

    //Subject + Verb CONJUNCTION Subject + Verb SUBORD Subject + Verb
    ("The " + nounList[Math.floor(Math.random() * nounList.length)] + " " + verbList[Math.floor(Math.random() * verbList.length)] + ", " + conjList[Math.floor(Math.random() * conjList.length)] + " the " + nounList[Math.floor(Math.random() * nounList.length)] + " " + verbList[Math.floor(Math.random() * verbList.length)] + " " + subordList[Math.floor(Math.random() * subordList.length)] + " the " + nounList[Math.floor(Math.random() * nounList.length)] + " " + verbList[Math.floor(Math.random() * verbList.length)]),

    //Subject + Verb SUBORD Subject + Verb CONJUNCTION Subject + Verb
    ("The " + nounList[Math.floor(Math.random() * nounList.length)] + " " + verbList[Math.floor(Math.random() * verbList.length)] + " " + subordList[Math.floor(Math.random() * subordList.length)] + " the " + nounList[Math.floor(Math.random() * nounList.length)] + " " + verbList[Math.floor(Math.random() * verbList.length)] + ", " + conjList[Math.floor(Math.random() * conjList.length)] + " the " + nounList[Math.floor(Math.random() * nounList.length)] + " " + verbList[Math.floor(Math.random() * verbList.length)])
    ]
    
    return compound_complex_structures[Math.floor(Math.random()*compound_complex_structures.length)];
    
  }

  else if (sentence_type == "preposition"){
    return ("The " + nounList[Math.floor(Math.random() * nounList.length)] + " " + verbList[Math.floor(Math.random() * verbList.length)] + " " + prepList[Math.floor(Math.random() * prepList.length)] + " the " + nounList[Math.floor(Math.random() * nounList.length)]);
  }
}

console.log(generateSentence("preposition"))