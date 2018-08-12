import React from "react";
import _get from "lodash/get";

const Windows = {
  FutureAccess: _get(window.Windows, "Storage.AccessCache.StorageApplicationPermissions.futureAccessList", null),
  Globalization: _get(window.Windows, "Globalization", null),
  Ocr: _get(window.Windows, "Media.Ocr", null),
  ocrLanguages: _get(window.Windows, "Media.Ocr.OcrEngine.availableRecognizerLanguages", null),
  FilePicker: _get(window.Windows, "Storage.Pickers.FileOpenPicker", null),
  picturesLibrary: _get(window.Windows, "Storage.Pickers.PickerLocationId.picturesLibrary", null),
  BitmapDecoder: _get(window.Windows, "Graphics.Imaging.BitmapDecoder", null),
  FileAccessMode: _get(window.Windows, "Storage.FileAccessMode", null)
};
export default React.createContext({
  ...Windows,
  isWindowsEnv: Object.values(Windows).every(Boolean)
})