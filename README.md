# real_time_chat_app

[Front End](https://real-time-chat-app-sc.vercel.app)
Deployed server on Render.com (could have used Harperdb's [custom functions](https://harperdb.io/docs/custom-functions/) but since server was created with socket.io, cannot use Harperdb's own API)
Database hosted on HarperDB, minimal postgreSQL code to create table.

## Overview of project

Create a full-stack app with real time chat functionality. The main purpose of this is to learn how to get real time updates for the users.

Tech Stack:

- React
- Socket.io
- JavaScript
- CSS
- Node.js
- Express
- Axios
- Deployed front end, vercel
- Deployed API, Render
- Database, HarperDb

## Things I have learned

Learnt:

- [Socket.IO](https://socket.io/) library (built on top of WebSocket protocol) that enables low-latency, bidirectional and event-based communication between a client and a server. Learnt how to implement on client and server side
- use CSS modules, allows use of same className in different files
- learnt about toLocaleString options to format date to UK format
- used cookies to save loggedIn user and room for data persistence. Also found some interesting security concerns for localStorage vs cookies, read [here](https://stackoverflow.com/questions/3220660/local-storage-vs-cookies)
- [localStorage vs cookie vs session storage](https://stackoverflow.com/questions/3220660/local-storage-vs-cookies)

To do:

- authentication
- validation?
- emoji
- voice call
- security?
- does it scale?
