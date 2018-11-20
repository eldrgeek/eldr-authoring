/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// prints "hi" in the browser's dev tools console


  let el, stackedit, openStackEdit;
  let consolidated;
 


  console.log("script")
  window.onload = () => {
    console.log("LOAD")
    el = document.querySelector('textarea');
    consolidated = el.value;
    // console.log(el.value);
    let stackedit = new window.Stackedit();
     openStackEdit = () =>{
        console.log("PPE")

      // Open the iframe

      stackedit.openFile({
        name: 'Filename', // with an optional filename
        content: {
          text: el.value // and the Markdown content.
        }
      });
      
   }
  // Listen to StackEdit events and apply the changes to the textarea.
  stackedit.on('fileChange', (file) => {
    el.value = file.content.text;
  });
  }
console.log('the script');
let a=new AudioContext() // browsers limit the number of concurrent audio contexts, so you better re-use'em
let error = "no error"
let beep = (vol, freq, duration) => {
  let v=a.createOscillator()
  let u=a.createGain()
  v.connect(u)
  v.frequency.value=freq
  v.type="square"
  u.connect(a.destination)
  u.gain.value=vol*0.01
  v.start(a.currentTime)
  v.stop(a.currentTime+duration*0.001)
} 

// beep(10, 520, 200)

const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
const synth = window.speechSynthesis;

let status = document.querySelector('#status')

const setStatus = (text) => {
  status.textContent = text;
}
setStatus("ready");

let dictationRunning = false;
const startDictation = () => {
  console.log("start dictation");
  dictationRunning = true;
  dictate()
}
const stopDictation = () => {
  console.log("stop dictation");
  dictationRunning = false;
  recognition.stop()
}



const icon = document.querySelector('i.fa.fa-microphone')
icon.addEventListener('click', () => {
  // sound.play();\
  console.log("listeningf")
  dictate();
});

var grammar = '#JSGF V1.0; grammar colors; public <color> = aqua | azure | beige | bisque | black | blue | brown | chocolate | coral | crimson | cyan | fuchsia | ghostwhite | gold | goldenrod | gray | green | indigo | ivory | khaki | lavender | lime | linen | magenta | maroon | moccasin | navy | olive | orange | orchid | peru | pink | plum | purple | red | salmon | sienna | silver | snow | tan | teal | thistle | tomato | turquoise | violet | white | yellow ;'
let SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
const recognition = new SpeechRecognition();
recognition.grammars = speechRecognitionList;

const dictate = () => {
  console.log("dictation started");
  let aggregate = ""
  recognition.lang = 'en-US';
  recognition.interimResults = true;
  recognition.continuous = false;
  recognition.maxAlternatives = 3;  
  // recognition.grammars = speechRecognitionList;
  recognition.start();

  setStatus("listening");

  recognition.onerror = (e) => {
    setStatus("error " + e.error)
    error = e;
  }
  recognition.onend = () => {
    console.log("end")
    setStatus("end " + error.error)
    if(dictationRunning){
      startDictation()
    }
  }
  let nextToScan = 0
  recognition.onresult = (event) => {
    // console.log(event)
    let incremental = ""
    let provisional = ""
    let last = event.results.length;
    let newSegment = ""
    for(let i = nextToScan; i < last; i++) {
      newSegment = event.results[i][0].transcript;
      incremental += newSegment;

      if(!event.results[i].isFinal) {
        provisional += newSegment;
        // recognition.stop()
        // speak(newSegment);
      } else {
        provisional = "";
        console.log(newSegment)
        beep(10, 520, 200)
        consolidated += newSegment;
        nextToScan = i + 1;
      }
    }
    el.value = consolidated + provisional;
  }
}
let events = ["audiostart","soundstart","speechstart","speechend","soundend","audioend","nomatch", "error", "start","end"];
events.map((name)=> recognition["on"+ name] = () => console.log("recognition " + name ))


