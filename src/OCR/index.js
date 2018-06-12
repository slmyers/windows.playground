/* eslint no-undef: 0 */
/* eslint no-unused-vars: 0 */

import React, { Component } from "react";
import _get from "lodash/get";

const FutureAccess = _get(Windows, "Storage.AccessCache.StorageApplicationPermissions.futureAccessList", null);
const Globalization = _get(Windows, "Globalization", null);
const Ocr = _get(Windows, "Media.Ocr", null);
const FilePicker = _get(Windows, "Storage.Pickers.FileOpenPicker", null);


let FileToken = "";

export default class OCR extends Component {

    state = {
        languages: Ocr ? Ocr.OcrEngine.availableRecognizerLanguages : [],
        userLanguageToggle: false,
        selectedLanguage: "en-US",
        FileToken: null,
        previewSrc: null,
        restrictWidth: true,
        wordbox: [],
        text: []
    };

    onLoad = () => {
        const picker = new Windows.Storage.Pickers.FileOpenPicker();
        picker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.picturesLibrary;
        picker.fileTypeFilter.append(".jpg");
        picker.fileTypeFilter.append(".jpeg");
        picker.fileTypeFilter.append(".png");
        picker.pickSingleFileAsync().done( file => file && this.loadImage(file));
    };

    // Load an image from a file and display for preview before extracting text.
     loadImage(file) {
        // Request persisted access permissions to the file the user selected.
        // This allows the app to directly load the file in the future without relying on a
        // broker such as the file picker.
        this.setState({
            FileToken: FutureAccess.add(file),
            previewSrc: window.URL.createObjectURL(file, { oneTimeOnly: true })
        }, () => FileToken = FutureAccess.add(file));
         file.properties.getImagePropertiesAsync().then( ({height, width}) => console.log(`Loaded image from file: ${file.displayName} (${width}, ${height})`));
    }

    // Invoked when the user clicks on the Extract button.
    extractHandler = () => {
        let ocrEngine = Ocr.OcrEngine.tryCreateFromUserProfileLanguages();

        if (!ocrEngine) {
            console.log("Selected language is not available.");
            return;
        }

        let bitmap;
        FutureAccess.getFileAsync(this.state.FileToken)
            .then((file) => file.openAsync(Windows.Storage.FileAccessMode.read))
            .then( (stream) => {
            const bitmapDecoder = Windows.Graphics.Imaging.BitmapDecoder;
            return bitmapDecoder.createAsync(stream);
            })
            .then( (decoder) => {
            // Check if OcrEngine supports image resolution.
            if (decoder.pixelWidth > Ocr.OcrEngine.maxImageDimension ||
                decoder.pixelHeight > Ocr.OcrEngine.maxImageDimension) {

                throw "Bitmap dimensions ({" + decoder.pixelWidth + "x" + decoder.pixelHeight + ") are too big for OCR.\n" +
                "Max image dimension is " + Ocr.OcrEngine.maxImageDimension + "."
            }

            return decoder.getSoftwareBitmapAsync();
        }).then( (bmp) => {
            bitmap = bmp;
            return ocrEngine.recognizeAsync(bitmap);
        }).then( (result) => {
            const ocrText = [];
            if (result.lines != null) {
                console.log("!!!!!!");
                for (let l = 0; l < result.lines.length; l++) {
                    const line = result.lines[l];
                    for (let w = 0; w < line.words.length; w++) {
                        const word = line.words[w];

                        // Define "div" tag to overlay recognized word.
                        const wordbox = { style: { } };

                        wordbox.className = "result";
                        wordbox.style.width = 100 * word.boundingRect.width / bitmap.pixelWidth + "%";
                        wordbox.style.height = 100 * word.boundingRect.height / bitmap.pixelHeight + "%";
                        wordbox.style.top = 100 * word.boundingRect.y / bitmap.pixelHeight + "%";
                        wordbox.style.left = 100 * word.boundingRect.x / bitmap.pixelWidth + "%";

                        if (result.textAngle) {
                            // Rotate word for detected text angle.
                            wordbox.style.transform = "rotate(" + result.textAngle + "deg)";

                            // Calculate image/rotation center relative to word bounding box.
                            var centerX = -100 * (word.boundingRect.x - bitmap.pixelWidth / 2) / word.boundingRect.width;
                            var centerY = -100 * (word.boundingRect.y - bitmap.pixelHeight / 2) / word.boundingRect.height;
                            wordbox.style.transformOrigin = "" + centerX + "% " + centerY + "%";
                        }
                        // Put the filled word box in the results div.
                        ocrText.push(wordbox);
                    }
                }
            }
            console.dir(result);
            this.setState({text: result.lines, wordbox: ocrText}, () => console.dir(this.state));

            WinJS.log && WinJS.log(

                "Image is OCRed for " + ocrEngine.recognizerLanguage.displayName + " language.",
                "sample",
                "status");

        }).then(null, function (e) {
            WinJS.log && WinJS.log(e.message, "sample", "error");
        });
        const x = 2;
    };

    render() {
        return (
            <div id="scenarioView">
                <div>
                    <h2 id="sampleHeader">Description: extracting text from an image file.</h2>
                </div>
                <div id="scenarioContent">
                    <select disabled={true} value={this.state.selectedLanguage} onChange={evt => this.setState({selectedLanguage: new Globalization.Language(evt.target.value)}, () => console.dir(this.state))}>
                        <option value={null}>NULL</option>
                        {this.state.languages.map( ({displayName, languageTag}) => <option key={languageTag} value={languageTag}>{displayName}</option> )}
                    </select>

                    <button id={"buttonSample"} > Load Sample Image</button>
                    <button id={"buttonLoad"} onClick={this.onLoad}>Load custom image</button>
                    <button id={"buttonExtract"} onClick={this.extractHandler}>Extract</button>
                    <div id={"imageText"} style={{maxWidth: 600}}>
                        <ul> {this.state.text.map(({text}) => <li>{text}</li>) } </ul>
                    </div>
                </div>
                <h3>selected language: {this.state.languages.length > 0 ? this.state.languages[0].languageTag : "no language selected"}</h3>
                <div style={{position: "relative", maxWidth: 600}}>
                    {  this.state.previewSrc ? <img id={"imagePreview"} className={"imagePreview"} src={this.state.previewSrc} /> : <h1> NO IMAGE SELECTED</h1>}
                    <div id="textOverlay" className="textOverlay">
                        {this.state.wordbox.map( thing  => <span className={"result"} style={Object.assign({}, thing.style)}>{/*JSON.stringify(thing)*/}</span> )}
                    </div>
                </div>


            </div>
        )
    }
}