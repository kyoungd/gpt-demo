import { useState } from "react";
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
    console.log('assignState: ', fname, value);
    setState((prevState) => ({ ...prevState, [fname]: value }));
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const clearState = () => setState({ ...initialState });

  return (
    <div>
      <div id="contact">
        <div className="container">
          <div className="col-md-8">
            <div className="row">
              <div className="section-title">
                <h2>Get In Touch</h2>
                <p>
                  Click on the <strong>TALK TO OUR AI</strong> button to get in touch with us.
                  The forms will be filled out by our AI and sent to us.
                </p>
              </div>
              <form name="sentMessage">
                <div className="form-group">
                  <input
                    type="text"
                    id="transcript"
                    name="transcript"
                    className="form-control"
                    placeholder="live transcript"
                    value={transcription}
                    onChange={handleChange}
                  />
                  <p className="help-block text-danger"></p>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
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
                    <div className="form-group">
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
                <div className="form-group">
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
                    setIsLive(!isLive);
                    LiveTranascription(assignState, clearState);
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
