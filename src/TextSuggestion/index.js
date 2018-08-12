import React from 'react';
import Form from '../Form';

export default class TextSuggestion extends React.Component {

  state = {
    languageTag: ""
  };

  onChange = event => this.setState({ [event.target.name]: event.target.value });

  render() {
    return (
      <div id="scenarioView">
        <div>
          <h2 id="sampleHeader">Description:</h2>
          <div id="scenarioDescription">
            Demonstrates the usage of Text Conversion API.
          </div>
        </div>
        <div id="scenarioContent">
          <br/>
            <div>
              <div>
                <Form>
                  <label>Select a language tag: </label>
                  <input type="text" id="languageTag" name="languageTag" value={this.state.languageTag} className="win-textbox" onChange={this.onChange} />
                  <input type="checkbox" name={"checkbox"} />
                </Form>
              </div>

              <div>
                <button id="createGeneratorButton" className="win-button">Create Generator</button>
              </div>
            </div>

            <br/>

              <div id="generatorOperationArea" hidden={false} style={{ /*visibility:hidden */}}>
                <div>
                  <div>
                    <label>Choose a method: </label>
                  </div>

                  <div>
                    <select
                      id="generationMethodSelector"
                      name="generationMethodSelector"
                      size="2"
                      className="win-dropdown">
                        <option value={"GetCandidatesAsync"} className="win-dropdown">GetCandidatesAsync</option>
                        <option value={"GetCandidatesAsync(WithMaxCandidate)"} className="win-dropdown">GetCandidatesAsync(WithMaxCandidate)</option>
                    </select>
                  </div>
                </div>

                <br />

                  <div>
                    <div>
                      <label>Parameters: </label>
                    </div>

                    <div>
                      <label>Input: </label>
                      <input type="text" id="InputStringBox" name="inputStringBox" value="" className="win-textbox" />
                    </div>

                    <div id="maxCandidatesArea" style={{display: "none" }}>
                      <label>maxCandidates: </label>
                      <input type="number" min="1" id="maxCandidatesBox" name="maxCandidatesBox" value="" className="win-textbox" />
                    </div>

                    <br />

                      <div>
                        <button id="executeButton" className="win-button">Execute</button>
                      </div>

                      <br/>

                        <div>
                          <label>Result: </label>
                        </div>

                        <div>
                          {/*<ul id="resultList" />*/}
                        </div>
                  </div>
              </div>
        </div>
      </div>
    );
  }
}