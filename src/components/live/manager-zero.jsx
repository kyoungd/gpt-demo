import RecordRTC, { StereoAudioRecorder } from 'recordrtc';

// required dom elements
import GetNextMessageSafe from './nextMessage';
import Speak from './speak';
import Speech from './speech';
import LocalState from './states';

// set initial state of application variables
let isRecording = false;
let socket;
let recorder;
let callObject;
let states;

let IsTalking = false;
let doItOnce = true;
let isCommunicatingWithServer = false;
let audioElement = null;

function talkSpeaker(text) {
    IsTalking = false;
    Speak(text, () => {
        console.log('.......done speaking');
        IsTalking = true;
    });
  }

  function talkNeural(audioElement, text) {
    IsTalking = false;
    Speech(audioElement, () => {
        console.log('.......done speaking');
        IsTalking = true;
    }, text);
  }

function Talk(text) {
    if (audioElement === null)
        talkSpeaker(text);
    else
        talkNeural(audioElement, text);
}

function setCurrentStates(data, assignState) {
    const name = data.hasOwnProperty('name') ? data.name : null;
    const phone = data.hasOwnProperty('phone') ? data.phone : null;
    const message = data.hasOwnProperty('message') ? data.message : null;
    const appointment = data.hasOwnProperty('appointment') ? data.appointment : null;
    assignState("name", name);
    assignState("phone", phone);
    assignState("message", message);
    assignState("appointment", appointment);
}

async function initializeOnce(doIt) {
    if (doIt) {
        states = new LocalState();
        const result = await GetNextMessageSafe(callObject, '', 'demo_e46ee1013e6a');
        if (result.success) {
            callObject = result.callObject;
            Talk(result.message);
            console.log('init message: ', result.message);
            return true;
        }
    }
    return false;
}

function initializeThisState() {
    callObject = null;
    states = null;
    IsTalking = false;
    doItOnce = true;
    isCommunicatingWithServer = false;
}
// singleton

const sample_rate = 16000;

// runs real-time transcription and handles global variables
async function LiveTranascription (assignState, clearState, audioElem = null) {
    audioElement = audioElem;
    if (isRecording) {
        if (socket) {
            socket.send(JSON.stringify({terminate_session: true}));
            socket.close();
            socket = null;
        }

        if (recorder) {
            recorder.pauseRecording();
            recorder = null;
        }
    } else {
        clearState();
        initializeThisState();
        doItOnce = doItOnce ? await initializeOnce(true) : false;
        const response = await fetch(process.env.REACT_APP_TOKEN_URL); // get temp session token from server.js (backend)
        const data = await response.json();

        if (data.error) {
            alert(data.error)
        }

        const {token} = data;
        
        // establish wss with AssemblyAI (AAI) at {sample_rate} sample rate
        socket = await new WebSocket(`wss://api.assemblyai.com/v2/realtime/ws?sample_rate=${sample_rate}&token=${token}`);

        // handle incoming messages to display transcription to the DOM
        let texts = {};
        let filterMesssage = ''
        socket.onmessage = (message) => {
            if (IsTalking) {
                let msg = '';
                const res = JSON.parse(message.data);
                texts[res.audio_start] = res.text;
                const keys = Object.keys(texts);
                keys.sort((a, b) => a - b);
                for (const key of keys) {
                    if (texts[key]) {
                        msg += ` ${
                            texts[key]
                        }`;
                    }
                }
                const msgIntent = msg.replace(filterMesssage, '');
                assignState("transcription", msgIntent);
                states.SetText(msgIntent);
                if (!isCommunicatingWithServer && states.IsItTimeToRespond) {
                    isCommunicatingWithServer = true;
                    void async function () {
                      const reply = callObject.filler;
                      await Talk(reply);
                      const result = await GetNextMessageSafe(callObject, states.Message);
                      if (result.success) {
                        callObject = result.callObject;
                        setCurrentStates(result.callObject.data, assignState)
                        await Talk(result.message);
                        if (callObject.id === 0) {
                            if (socket) {
                                socket.send(JSON.stringify({terminate_session: true}));
                                socket.close();
                                socket = null;
                            }
                            console.log('call ended.');
                            isRecording = false;
                            return;
                        }
                      }
                      else
                        console.log('Error getting call state.');
                      states.Reset();
                      filterMesssage = msg
                      isCommunicatingWithServer = false;
                    }().catch(err => {
                        states.Reset();
                        isCommunicatingWithServer = false;
                        filterMesssage = msg
                        console.log(err)
                    });
                }    
            }
        };

        socket.onerror = (event) => {
            console.error(event);
            socket.close();
        };
        socket.onclose = event => {
            console.log(event);
            socket = null;
        };
        socket.onopen = () => { // once socket is open, begin recording
            navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
                recorder = new RecordRTC(stream, {
                    type: 'audio',
                    mimeType: 'audio/webm;codecs=pcm', // endpoint requires 16bit PCM audio
                    recorderType: StereoAudioRecorder,
                    timeSlice: 250, // set 250 ms intervals of data that sends to AAI
                    desiredSampRate: sample_rate,
                    numberOfAudioChannels: 1, // real-time requires only one channel
                    bufferSize: 4096,
                    audioBitsPerSecond: 128000,
                    ondataavailable: (blob) => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            const base64data = reader.result;

                            // audio data must be sent as a base64 encoded string
                            if (socket) {
                                socket.send(JSON.stringify({
                                    audio_data: base64data.split('base64,')[1]
                                }));
                            }
                        };
                        reader.readAsDataURL(blob);
                    }
                });

                recorder.startRecording();
            }).catch((err) => console.error(err));
        };
    } isRecording = ! isRecording;
};

export default LiveTranascription;
