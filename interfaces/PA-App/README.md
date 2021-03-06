PA-App
======

The front-end of the application *People Affected* use to interact with the 121-platform.

## Getting Started
- Install [environment requirements](../README.md)
- Install dependencies (from this folder):

      npm install

- Start in development-mode:

      npm start

- or: Run on an Android-device:

      npm run dev:on-device

For more options, see the documentation of the [Ionic/Cordova CLI](https://ionicframework.com/docs/cli/commands/cordova-run).


## Configuration
Some specific information need to be configured before use:

- Set the API-endpoint(s) in the [`environment.ts`](./src/environments/environment.ts)-file.


## Dependencies in use
Next to the 'generic' dependencies/libraries/components [used by all interfaces](../README.md#Dependencies-in-use), the PA-app also uses:

- [`angularx-qrcode`](https://github.com/cordobo/angularx-qrcode)
  A component to render QR-codes with custom data.
  - Documentation: <https://github.com/cordobo/angularx-qrcode#basic-usage>

- [Howler](https://howlerjs.com/)
  A component to play, (pre-)load and handle audio-files.
  - Documentation: <https://github.com/goldfire/howler.js#documentation>


## Assets

### Audio files
The PA-App uses audio-files to make the [interface-text](./src/assets/i18n/en.json) accessible in spoken form.

Audio-file creation/processing:
- Add the audio-file(s) to `./src/assets/i18n/<locale>/` where:
  - `locale` is an [IETF BCP47](https://tools.ietf.org/html/bcp47) language-string; like `en` or `fr-BE`, etc.

- Set the audio files' filenames to: `<translation.string.key>.mp3` where:
  - `translation.string.key` is the path used in the text-translation file, see [`en.json`](./src/assets/i18n/en.json)  

- Convert the audio files to the specified format by running the script:  
  `npm run generate-assets-audio -- <locale>`  
   Or provide the locale/language-code at the prompt.


## Deployment / Building
To deploy a native build of this app, see the generic instructions in [/interfaces/README](../README.md#Deployment).

After that, run: (with `<type>` as `--prod` or `--debug`)

    npm run build:native -- <type>

