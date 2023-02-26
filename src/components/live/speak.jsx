const MAX_UTTERANCE_LENGTH = 200; // Set maximum utterance length as desired

const synth = window.speechSynthesis;
let voices = [];

function setVoices(msg, ix) {
  if (voices.length <= 0) {
    voices = synth.getVoices().sort(function (a, b) {
      const aname = a.name.toUpperCase();
      const bname = b.name.toUpperCase();
    
      if (aname < bname) {
        return -1;
      } else if (aname === bname) {
        return 0;
      } else {
        return +1;
      }
    });
  }
  
  msg.voice = voices[11];
  msg.pitch = 1.1;
  msg.rate = 0.95;
}

function Speak(text, callback) {
    const chunks = chunkText(text, MAX_UTTERANCE_LENGTH);
    speakChunks(chunks, callback);
  // if (text.length <= MAX_UTTERANCE_LENGTH) {
  //   const utterance = new SpeechSynthesisUtterance(text);
  //   utterance.onend = callback;
  //   window.speechSynthesis.cancel();
  //   window.speechSynthesis.speak(utterance);
  // } else {
  //   const chunks = chunkText(text, MAX_UTTERANCE_LENGTH);
  //   speakChunks(chunks, callback);
  // }
}

function speakChunks(chunks, callback) {
  if (chunks.length === 0) {
    callback();
    return;
  }

  const chunk = chunks.shift();
  const utterance = new SpeechSynthesisUtterance(chunk);
  utterance.onend = () => speakChunks(chunks, callback);
  synth.cancel();
  setVoices(utterance, 9);
  synth.speak(utterance);
}

function chunkText(text) {
    const regex = /[.?!]/;
    const chunks = [];
    let startIndex = 0;
    let endIndex = 0;
    while (endIndex < text.length) {
      endIndex = text.substring(startIndex).search(regex);
      if (endIndex === -1) {
        endIndex = text.length;
      } else {
        endIndex += startIndex;
      }
      chunks.push(text.substring(startIndex, endIndex + 1));
      startIndex = endIndex + 1;
    }
    return chunks;
  }
  
export default Speak;
