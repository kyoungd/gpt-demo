import axios from 'axios';

async function GetNextMessageSafe(gblObject, userInput=null, template=null) {
  let callObject;
  try {
    if (gblObject === null) {
      callObject = { data: {
        template: template || 'demo_e46ee1013e6a',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }};
      console.log('callObject: ', JSON.stringify(callObject, null, 4));
    }
    else {
      callObject = {
        data: gblObject,
        message: userInput
      };
    }

    console.log('callling backend...');

    const url = process.env.REACT_APP_CALLSTATE_URL
    const result = await axios.post(url, callObject, {
        headers: {
          'Content-Type': 'application/json'
        }
    });
    console.log('returned from the backend...');
    if (result.status === 200) {
      callObject = result.data;
      const message = callObject.message;
      const reply = callObject.filler;
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