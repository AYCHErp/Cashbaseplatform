Interfaces on the 121-platform
==============================

- [PA-App](./PA-App/)  
  (Native-)app used by *People Affected* to interact with the 121-platform.  

  Primary target(s): Mobile/Smartphone (Android/Web)

- [AW-App](./AW-App/)  
  (Native-)app used by *AidWorkers* to validate/verify PA and issue credentials.

  Primary target(s): Mobile/Smartphone (Android)

- [HO-Portal](./HO-Portal/)  
  Web-app used by the *Humanitarian Organization* to manage their programs, aid-workers, communication, etc.  

  Primary target(s): Laptop/desktop

## Documentation
Every interface or app has their own set of features described in test-scenarios.

See the [/features/](../features/)-directory in this repository.


## Development

### Environment Requirements
The tools to run or build all interfaces:

- [Git](https://git-scm.com/)

- (Optional) [NVM - Node Version Manager](http://nvm.sh/)  
  To install the required version of Node.js and to prevent conflicts between projects or components using other versions of Node.js.  
  After installing NVM run:

      nvm install && nvm install-latest-npm

- (When not using NVM) [Node.js](https://nodejs.org/) **v10+ LTS**  
  With NPM **v6.9+**


### Native environments

#### Android
When testing/debugging on Android and using the '`livereload`' functionality, it is required to add the following security exception in the app's `config.xml`, by adding the `<edit-config>`-block into the `<platform>`-block:

```xml
<platform name="android">
  <edit-config file="app/src/main/AndroidManifest.xml" mode="merge" target="/manifest/application">
    <application android:usesCleartextTraffic="true" />
  </edit-config>
  <!-- ... -->
</platform>
```


### Specific requirements
Every interface or app has their own requirements defined in their README file.

### Backend / API
Every interface or app will refer to the specific services or APIs they require.

See the [/services/](../services/)-directory in this repository.


### Dependencies in use
All interfaces use a common set of dependencies/frameworks/libraries.

- [Ionic v4](https://ionicframework.com/docs/v4/)  
  This UI-kit or library gives us a foundation to quickly build interfaces cross-platform and cross-device-type(mobile/desktop).  
  We use the (default) framework of Angular with(in) Ionic.
  - Available components: <https://ionicframework.com/docs/v4/components>
  - CSS Utilities: <https://ionicframework.com/docs/v4/layout/css-utilities>
  - Icons: <https://ionicons.com/v4/>

- [Angular v7](https://v7.angular.io/docs)  
  This front-end framework gives us a structure to create components that can be connected, combined, share data and can be delivered as a web-app.
  - API Documentation: <https://v7.angular.io/api>
  - Used by Angular, RxJS: <https://rxjs-dev.firebaseapp.com/api>

- [`ngx-translate`](http://www.ngx-translate.com/)  
  An Angular-service to handle internationalization(i18n) or translations.
  - API Documentation: <https://github.com/ngx-translate/core#api>
  

### Continuous Integration (CI)
Every interface has their own Azure Pipeline set up to run tests and generate 'builds'.  
See their status on the [main README](../README.md#status).

The appropriate tests will run automatically when relevant files are changed in a PR.

To explicitly trigger a *native* build of the code (for Android), make sure to name your PR branch with the prefix `native` or `android`.


## Deployment

### Building for production
To generate a 'production ready' build of an interface, some environment-variables need to be set.
The convention by [`dotenv`](https://www.npmjs.com/package/dotenv) is used.

Possible variables are available in `.env.example` files for each interface. Make a local copy to set them:

    cp .env.example .env

When creating a production build, they are automatically used and inserted into the build.


### Building native apps
To create 'native' versions of some of the interfaces, the following steps are required:  
Run these commands from every app's own 'root'-folder.  
(`<platform>` is `ios` or `android` or `browser`)  
(`<type>` as `--prod` or `--debug`)  

- Confirm all requirements are met for the platform of choice:

      npm run ionic -- cordova requirements <platform>

- Generate assets for the platform of choice:

      npm run ionic -- cordova resources <platform>

- Create a build:

      npm run ionic -- cordova build <platform> <type>


### Sign a production build

- Install `zipalign`
  For Ubuntu:

      sudo apt install zipalign

- Get the unsigned `apk` from the Artifacts of the Azure-pipeline or by building it locally by:

      npm run build:native -- --prod -- --release

- Get the `my-release-key.keystore` from someone who has access to it and put it in the same folder as the `apk`

- Sign the APK

      jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore app-release-unsigned.apk alias_name

- Optimize the APK

      zipalign -v 4 app-release-unsigned.apk  <insert-app-name>.apk

- Submit the app to the Google Play Store.  
  See: <https://ionicframework.com/docs/publishing/play-store#submitting-an-app-to-the-google-play-store>
