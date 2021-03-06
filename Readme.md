# Password Manager

___App for storage your passwords on your phone/tablet/computer___

## Why

If you have to remember 2 or 3 passwords - fine with you. But can you remember 32 or 56 passwords? If yes - you do not need the Password Manager.

## What

App has three pages: login, register, and dashboard (main logged in view). You can add/edit/delete/reveal password on the dashboard after login. All password data are stored, so when you reload pages, it is redirected back to the login page, and if you know Master Password - dashboard is loaded and all passwords are fetched. By default passwords are hidden with "*", but after click the password field it reveals the real password.

Passwords are stored in local storage inside your device. Nobody else can know them. Moreover, they are encrypted. It makes app device-oriented. The single way to reveal passwords is log in with correct Name and Master Password. Having forgotten the Master Password, there is no chance to get passwords list back again. It is unbeilivable to forget own name, meanwhile it is restorable.

As soon name is required for logging into the app, feel free to allow usage of the app for anybody else if you want. It means, that other person can create in the same app on the same device own independent password storage and cannot get your paswords untill you grant him or her your Name and Master Password.

## Install

First, clone this repository with HTTPS:
```
git clone https://github.com/potravniy/Password-Manager.git
```

or with SSH:
```
git clone git@github.com:potravniy/Password-Manager.git
```

Then, in new Password-Manager folder use 
```
npm install
```

After that, you can start application running
```
npm start
```

and finally use it with your modern browser on
```
http://localhost:3210
```

#### Note

If you'd like seeing size of application components, please uncomment row in webpack.config.js

```js
new BundleAnalyzerPlugin()
```

## Bulid

To buil production version use
```
npm run build
```
and all files for production will be ready to upload from ` /dist ` subfolder. 


## Live sample

[Password Manager](https://potravny.od.ua/pm/)

## Todo

- [x] Complete touch-icon set and manifest for mobile.
- [ ] Add Service Worker and http/2 implementation for offline usage.

## License

[MIT License](https://opensource.org/licenses/MIT)