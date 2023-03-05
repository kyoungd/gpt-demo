import axios from 'axios';

async function Speech(audioElement, callback, text) {
    try {
        const sound = audioElement.current;
        sound.addEventListener('ended', function() {
            callback();
            // Audio has ended when this function is executed.
        },false);
        // const callBlock = { text };
        // const response = await axios.post(process.env.REACT_APP_GOOGLE_NEURAL_SPEECH_URL, callBlock, {
        //     headers: {
        //       'Content-Type': 'application/json'
        //     }
        // });
        // const blob = new Blob([response.data], { type: 'audio/mpeg' });

        const api_url = process.env.REACT_APP_GOOGLE_NEURAL_SPEECH_URL;
        const queryParam = new URLSearchParams({ text });
        const response = await fetch(api_url + '?' + queryParam);
        const blob = await response.blob();

        // const blob = response.blob();
        const audioUrl = URL.createObjectURL(blob);
        sound.src = audioUrl;
        sound.play();    
    }
    catch (err) {
        console.log(err);
        return null;
    }  
}

export default Speech;
