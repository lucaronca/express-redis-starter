# Redis, express, webpack starter kit


![Redis](https://www.shareicon.net/data/128x128/2015/08/21/88383_logo_512x512.png)
![NodeJs](https://cdn2.iconfinder.com/data/icons/nodejs-1/128/nodejs-128.png)
![Webpack](https://dealogic.gallerycdn.vsassets.io/extensions/dealogic/webpack-vsts-extension/1.0.0/1484953063653/Microsoft.VisualStudio.Services.Icons.Default)

A comprehensive and structured app, scalable for different projects. It includes user authentication and data storage with Redis.<br>
A brief list of included features:

 * Session storage via [Redis](https://redis.io/)
 * Authentication with [Passport.js](http://passportjs.org/)
 * Server side file storage (in this case pdf files, but you can change it in any way you want)
 * Including jQuery and Foundation
 * Both development and production configurations
 * Assets optimization in production mode, with common code stored in a shared file so take advantage of your browser's cache
* Client side hot reloading with webpack hot middleware
* Server side hot reloading with chockidar watch

##### Details of how the asset optimization was meant 
Every page is provided with a shared js file that contains all the code that is shared between pages, it includes as well the code used from from libraries (in this example jQuery and Foundation) but <b>only the used code, not the whole library</b>. This file is meant to be changed few times so most of the time it will be saved in the browser cache. We include also a specific js file per every view. In the same way, the scss source is compiled in a common css file shared between pages and a specific file of contained dimensions for each view.



## Setup / usage / how to

### Setup:
* First step, in order to use Redis you need to have it installed. <br> You can install it from [the official donwload page](https://redis.io/download), or if you are a windows user from [the port for windows](https://github.com/MSOpenTech/redis/releases).
* Once you have installed Redis, launch it
* Then simply install the npm dipendeces of the application with `npm install` and you're ready to go

### Usage:
There are two main commands to run the application<br>
 * `npm run start:dev` to launch it in development mode, with server side and client side hot reloading.
 * `npm run start:prod` for the production mode, with assets optimization.

When you start the app in dev mode, you have to wiat that webpack complete the bundles, then the server is lanched and a new browser window with the app url is opened for you :) <br>
Commands will be developed in the future for testing.

### How to:

The client folder is specifically divided for each view.<br>
In every view folder you will find an index.js entry that will be the specific file bundled per view, and a styles.scss file that will work in them same way. The common code is in the 'common' folder: in this folder you will find an scss entry that will be directly compiled and loaded in every page as the first stylesheet, a font folder and other scss dependencies required from other files. Every piece of code that will be shared between pages would be inserted in this 'commons' folder and required where it will be necessary. It well be bundled in the shared.js asset from webpack.
