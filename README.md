# ZephyrMessenger

A full-stack messenger application built using [Socket.IO](https://socket.io/) and [React Router 6](https://reactrouter.com/en/main).

The application allows users to:

- Chat with users in realtime.
- Send text messages or images.
- Block disagreeable contacts.
- Upload a display picture to represent you.
- And much more!

All images are stored using [Cloudinary](https://cloudinary.com/)'s SDK.

## Demo

The demo can be accessed at https://zephy-messenger.onrender.com.

You can log into the application using the following credentials:

**Email**: jackson@domain.com  
**Password**: demopassword123

## Scripts

Run the server in development mode:

    cd server
    npm run dev

Build the server for production:

    cd server
    npm run build

Run the server in production mode:

    cd server
    npm start

Run the client in development mode:

    cd client
    npm run dev

Build the client for production:

    cd client
    npm run build

Preview the client build:

    cd client
    npm run preview
