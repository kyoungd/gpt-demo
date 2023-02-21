import axios from 'axios';

async function GetNextMessageSafe(callObject, userInput, template=null) {
    try {
      const callBlock = { call: callObject, reply: userInput, template }
      const result = await axios.post(process.env.REACT_APP_CALLSTATE_URL, callBlock, {
          headers: {
            'Content-Type': 'application/json'
          }
      });
      if (result.status === 200) {
        callObject = result.data.data;
        const message = callObject.getters.LastMessage;
        const reply = callObject.getters.Reply;
        return {success: true, message, reply, callObject};
      }
      console.log(result && result.status_coode ? result.status_code : 'UNKNOWN ERROR');
      return {success: false, message:'', reply:'', callObject};
    }
    catch (err) {
      console.log(err);
      return {success:false, message:'', reply:'', callObject};
    }
  }

  export default GetNextMessageSafe;