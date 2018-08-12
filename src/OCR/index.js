import React, { Component } from "react";
import { buildWordBoxes } from "./utils"
import { withStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"

// todo: USE https://www.marvinj.org/en/index.html to make images black and white etc for better OCR results
@withStyles({
  "root": {
    width: "80%",
    margin: "5vh auto 0 auto"
  },

  "settings": {
    display: "flex",
    width: '75%',
    justifyContent: "space-around"
  },

  "extractedText": {
    textAlign: "left",
  },
})
export default class OCR extends Component {

  state = {
    languages: this.props.ocrLanguages,
    userLanguageToggle: false,
    selectedLanguage: "en-US",
    FileToken: null,
    previewSrc: null,
    restrictWidth: true,
    wordbox: [],
    text: null
  };

  onLoad = () => {
    const { FilePicker, picturesLibrary } = this.props;
    const picker = new FilePicker();
    picker.suggestedStartLocation = picturesLibrary;
    picker.fileTypeFilter.append(".jpg");
    picker.fileTypeFilter.append(".jpeg");
    picker.fileTypeFilter.append(".png");
    picker.pickSingleFileAsync().done( file => file && this.loadImage(file));
  };

  // Load an image from a file and display for preview before extracting text.
  loadImage(file) {
    const { FutureAccess } = this.props;

    // Request persisted access permissions to the file the user selected.
    // This allows the app to directly load the file in the future without relying on a
    // broker such as the file picker.
    this.setState({
      FileToken: FutureAccess.add(file),
      previewSrc: window.URL.createObjectURL(file, { oneTimeOnly: true })
    });
    file.properties.getImagePropertiesAsync().then( ({height, width}) => console.log(`Loaded image from file: ${file.displayName} (${width}, ${height})`));
  }

  extractHandler = async () => {
    const { Ocr } = this.props;

    let ocrEngine = Ocr.OcrEngine.tryCreateFromUserProfileLanguages();

    if (!ocrEngine) {
      console.log("Selected language is not available.");
      return;
    }
    const { BitmapDecoder, FileAccessMode, FutureAccess } = this.props;
    const file = await FutureAccess.getFileAsync(this.state.FileToken);
    const stream = await file.openAsync(FileAccessMode.read);
    const decoder = await BitmapDecoder.createAsync(stream);
    if (decoder.pixelWidth > Ocr.OcrEngine.maxImageDimension || decoder.pixelHeight > Ocr.OcrEngine.maxImageDimension) {
      throw new Error(
        ` Bitmap dimensions ({${decoder.pixelWidth}x  ${decoder.pixelHeight}y}) are too big for OCR.\n
              Max image dimension is ${Ocr.OcrEngine.maxImageDimension}.`
      );
    }
    const bitmap = await decoder.getSoftwareBitmapAsync();
    const result = await ocrEngine.recognizeAsync(bitmap);
    const ocrText = buildWordBoxes(result, bitmap);
    this.setState({text: result.lines, wordbox: ocrText}, () => console.dir(this.state));
  };

  renderExtractedText = (ocrText=this.state.text, classes=this.props) => (
    <pre className={classes.extractedText} style={{textAlign: "left"}}>
      {ocrText && Object.values(ocrText).map( ({text}) =>  String(text.trim())+"\n") }
    </pre>
  );

  render() {
    const { Globalization, classes: { root, settings } }= this.props;
    return (
      <div className={root}>
        <Typography gutterBottom={true} variant={"title"}>Description: extracting text from an image file.</Typography>
        <div className={settings}>
          <select disabled={true} value={this.state.selectedLanguage} onChange={evt => this.setState({selectedLanguage: new Globalization.Language(evt.target.value)})}>
            <option value={null}>NULL</option>
            {this.state.languages.map( ({displayName, languageTag}) => <option key={languageTag} value={languageTag}>{displayName}</option> )}
          </select>
          <Button variant="outlined" disabled={true}> Load Sample Image</Button>
          <Button variant="outlined" onClick={this.onLoad}>Load custom image</Button>
          <Button variant="outlined" onClick={this.extractHandler} disabled={!this.state.FileToken}>Extract</Button>
        </div>

        <div style={{position: "relative", maxWidth: 600}}>
          {  this.state.previewSrc ? <img id={"imagePreview"} className={"imagePreview"} src={this.state.previewSrc} alt={""}/> : <h1> NO IMAGE SELECTED</h1>}
          <div id="textOverlay" className="textOverlay">
            {this.state.wordbox.map( thing  => <span className={"result"} style={Object.assign({}, thing.style)}>{/*JSON.stringify(thing)*/}</span> )}
          </div>
        </div>
        <h3>selected language: {this.state.languages.length > 0 ? this.state.languages[0].languageTag : "no language selected"}</h3>
        {this.renderExtractedText()}
      </div>
    )
  }
}