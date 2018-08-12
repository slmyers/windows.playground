import React  from 'react';
import logo from './logo.svg';
import { Router, Link } from "@reach/router"
import Component from "@reactions/component";
import TextSuggestion from "./TextSuggestion";
import OCR from "./OCR";
import WindowsCtx from "./Context"
import './App.css';

const Error = (ctx) => (
  <div>
    <h1>Oops</h1>
    <h3>looks like something went wrong!</h3>
    <strong>{`you ${ctx.isWindowsEnv ? "are" : "are not"} running in a PWA hosted windows environment.`}</strong>
    <a href={"https://developer.microsoft.com/en-us/windows/pwa"}>learn about Windows10 and PWA</a>
  </div>
);

class App extends React.Component {

  render() {
    return (
      <WindowsCtx.Consumer>
        {(ctx) => !ctx.isWindowsEnv ? <Error ctx={ctx}/> :(
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h1 className="App-title">Welcome to Windows Playground</h1>
              <nav>
                <Link to={"/ocr"}>OCR</Link>
                <Link to={"/text-suggestion"} >Text Suggestion</Link>
                <Link to={"/compat"}>Compat</Link>
              </nav>
            </header>
            <Router>
              <Component path={"/compat"} render={() => (
                <div>
                  <h1>This is a Windows 10 PWA demo</h1>
                  <div>It is required to run in a Windows 10 environment</div>
                  <strong>{`you ${ctx.isWindowsEnv ? "are" : "are not"} running in a windows environment.`}</strong>
                  <br/>
                  <a href={"https://developer.microsoft.com/en-us/windows/pwa"}>learn about Windows10 and PWA</a>
                </div>
              )}/>

              <Error path={"/error"} ctx={ctx}/>
              <OCR path={"/ocr" || "/"} {...ctx}/>
              <TextSuggestion path={"/text-suggestion"} />
            </Router>
          </div>
        )}
      </WindowsCtx.Consumer>

    );
  }
}

export default App;
