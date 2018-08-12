export const buildWordBoxes = (result, bitmap) => {
  const ocrText = [];
  for (let l = 0; l < result.lines.length; l++) {
    const line = result.lines[l];
    for (let w = 0; w < line.words.length; w++) {
      const word = line.words[w];

      // Define "div" tag to overlay recognized word.
      const wordbox = {style: {}};

      wordbox.className = "result";
      wordbox.style.width = 100 * word.boundingRect.width / bitmap.pixelWidth + "%";
      wordbox.style.height = 100 * word.boundingRect.height / bitmap.pixelHeight + "%";
      wordbox.style.top = 100 * word.boundingRect.y / bitmap.pixelHeight + "%";
      wordbox.style.left = 100 * word.boundingRect.x / bitmap.pixelWidth + "%";

      if (result.textAngle) {
        // Rotate word for detected text angle.
        wordbox.style.transform = "rotate(" + result.textAngle + "deg)";

        // Calculate image/rotation center relative to word bounding box.
        const centerX = -100 * (word.boundingRect.x - bitmap.pixelWidth / 2) / word.boundingRect.width;
        const centerY = -100 * (word.boundingRect.y - bitmap.pixelHeight / 2) / word.boundingRect.height;
        wordbox.style.transformOrigin = "" + centerX + "% " + centerY + "%";
      }
      // Put the filled word box in the results div.
      ocrText.push(wordbox);
    }
  }
  return ocrText
};
