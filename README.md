# Redis, express, webpack starter kit


![Redis](https://www.shareicon.net/data/128x128/2015/08/21/88383_logo_512x512.png)
![NodeJs](https://cdn2.iconfinder.com/data/icons/nodejs-1/128/nodejs-128.png)
![Webpack](https://dealogic.gallerycdn.vsassets.io/extensions/dealogic/webpack-vsts-extension/1.0.0/1484953063653/Microsoft.VisualStudio.Services.Icons.Default)

A comprehensive and structured app, scalable for different web projects. It includes user authentication and data storage with Redis.<br>
A brief list of included features:

 * Session storage via [Redis](https://redis.io/)
 * Authentication with [Passport.js](http://passportjs.org/)
 * Server side file storage (in this case pdf files, but you can change it in any way you want)
 * jQuery and Foundation global integration with Webpack
 * Both development and production configurations
 * Assets optimization in production mode, with common code stored in a shared file to exploit browser cache
 * Client side hot reloading with webpack hot middleware
 * Server side hot reloading with chokidar watch

##### Details of how the asset optimization was meant 
Every page is provided with a shared js file that contains, as its name makes you imagine, code that is shared between different views. It includes modules that you require in different page scripts logic as weel as the code used from libraries (in this example jQuery and Foundation) but <b>only the used code, not the whole library</b> is included in the generated bundle. This file is meant to be changed few times, so most of the time it will be saved in the browser cache, taking advantage of a faster download. We include also a specific js file per every view, these files are the specific ones where you will work more often, but being divided for each page, they will be of very small size and therefore easy to download. In the same way, the scss source is compiled in a common css file shared between pages and a specific file for each view, of contained dimensions.



## Setup / usage / how to

### Setup:
* First step, in order to use Redis you need to have it installed. <br> You can install it from [the official download page](https://redis.io/download), or if you are a windows user from [the port for windows](https://github.com/MSOpenTech/redis/releases).
* Once you have installed Redis, launch it
* Then simply install the npm dipendeces of the application with `npm install` and you're ready to go

### Usage:
There are two main commands to run the application<br>
 * `npm run start:dev` to launch it in development mode, with server side and client side hot reloading.
 * `npm run start:prod` for the production mode, with assets optimization.

When you start the app in dev mode, you have to wait that webpack complete the bundles, then the server is launched and a new browser window with the app url is opened for you :) <br>
Commands for testing will be developed in the future.

### How to:

The client folder is specifically divided for each view.<br>
In every view folder you will find an index.js entry that will be the specific file bundled per view, and a styles.scss file that will work in them same way. The common code is, as you can guess, in the 'common' folder: here you will find a scss entry that will be directly compiled and loaded in every page as the first stylesheet source, as well as a font folder and other scss dependencies required from other files. Every piece of code that will be shared between pages would be inserted in this 'commons' folder and required where it will be necessary. It will be bundled in the shared.js asset automatically by webpack for you.

## Improve

* If you try to upload a certain file and nothing seem to happen, take a look to the browser console and the API response :), this project was originally thought to be a document uploader, so in the Document model there is a check to the file format. Only Pdf file are allowed, so that they can be view from the browser when requested from the homepage list. Feel free to change this bheaviour.
* When you upload a file, some information will be stored in redis coming from to the 'document upload form'. I.e. year, month, day... They are not shown anywhere but they are stored in the databse as a starting point for further developments.
