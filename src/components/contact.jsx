import { useState, useRef } from "react";
import React from "react";
import LiveTranascription  from "./live/manager";

const initialState = {
  transcription: "",
  name: "",
  phone: "",
  message: ""
};

export const Contact = (props) => {
  const [{ name, phone, message, transcription }, setState] = useState(initialState);
  const [isLive, setIsLive] = useState(false);

  const assignState = (fname, value) => {
    setState((prevState) => ({ ...prevState, [fname]: value }));
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const clearState = () => setState({ ...initialState });

  const audioElement = useRef();
  // convert string to boolean
  const isUseAudioElement = process.env.REACT_APP_IS_USE_AUDIO_ELMEMENT === 'true';
  return (
    <div>
      <div id="contact">
        <div className="container">
          <div className="col-md-8">
            <div className="row">
              <div className="section-title">
                <h2>Get In Touch - use microphone</h2>
                <p>
                  Click on the <strong>TALK TO OUR AI</strong> button to get in touch with us.
                  The forms will be filled out by our AI and sent to us.
                </p>
                <audio id="audio-element" type="audio/mpeg" ref={audioElement} muted={false} ></audio>
              </div>
              <form name="sentMessage">
                <div className="form-group">
                  <textarea
                      name="transcript"
                      id="transcript"
                      className="form-control"
                      rows="3"
                      placeholder="Live Transcript"
                      value={transcription}
                      onChange={handleChange}
                  ></textarea>
                  <p className="help-block text-danger"></p>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group" hidden={ (name.length < 2) || name.toLocaleLowerCase().indexOf('did not say') >= 0 }>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        placeholder="Name"
                        value={name}
                        required
                        onChange={handleChange}
                      />
                      <p className="help-block text-danger"></p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group" hidden={ (phone.length < 2) || phone.toLocaleLowerCase().indexOf('did not say') >= 0 }>
                      <input
                        type="phone"
                        id="phone"
                        name="phone"
                        className="form-control"
                        placeholder="Phone Number"
                        value={phone}
                        required
                        onChange={handleChange}
                      />
                      <p className="help-block text-danger"></p>
                    </div>
                  </div>
                </div>
                <div className="form-group" hidden={ (message.length < 2 || message.toLocaleLowerCase().indexOf('did not say') >= 0 ) }>
                  <textarea
                    name="message"
                    id="message"
                    className="form-control"
                    rows="6"
                    placeholder="Message"
                    value={message}
                    required
                    onChange={handleChange}
                  ></textarea>
                  <p className="help-block text-danger"></p>
                </div>
                <div id="success"></div>
                <button 
                  type="submit" 
                  className={isLive ? 'btn btn-custom btn-lg btn-on' : 'btn btn-custom btn-lg'} 
                  onClick={() => {
                    if (isUseAudioElement) audioElement.current.play();
                    setIsLive(!isLive);
                    LiveTranascription(assignState, clearState, isUseAudioElement ? audioElement : null);
                  }}
                >
                  Talk to our AI
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
