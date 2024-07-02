Next.js
AntD
ProComponents
MongoDB
Mongoose(ORM)
Socket.IO
Docker
Date-fns
Lodash

Timeline
- Forked repo
- Created basic web/app w/. react js and nextjs
- Added AntD Framework
- Created side navigation
- Created UI for "Dashboard"
- Componentized side navigation and main layout
- Created UI for "All Dosiers"
- Created UI for "Auditor of All Dosiers"
- Released 0.1.0

- Moved web app files for new folder "web"
- Changed "name" in web/package.json
- Added "server" folder
- Changed paths of ".gitignore"
- Added "docker-compose.yml" of project
- Added "Dockerfile" of web/server app
- Added model, controller and route for "logs"
- Added test cases for "logs"
- Released 0.1.5

- Updated .env
- Added redux
- Added date-fns
- Added "logs" in web@app
- Updated README.md
- Released 0.1.6

- Added model, controller and route for "dossiers"
- Added test cases for "dossiers"
- Added model, controller and route for "forms"
- Added test cases for "forms"
- Created UI for "forms"
- Improvements for component "last three, dossiers"
- Improvements for component "logs"
- Released 0.2.5

- Added multer
- Added file uploader for "form" with "dossier" in web@app
- Added csv-parse
- Added flatbuffers
- Added socket.io
- Added model, controller and route for "imports"
- Added test cases for "imports"
- Added "stats" and "graphs" for import "form docs" in web@app
- Added custom toast for messages from API
- Added refresh button for "dashboard" and "dossier view" in web@app
- Added new log for "dossier" in web@app.
- Released 0.3.5

- Removed bull
- Removed "lodash" from "dossier" in server@app
- Removed redis from "docker-compose.yml
- Updated README.md
- Removed "counter" from web@app
- Refactored structure of "forms" in server@app
- Added auto update "dashboard" component after add new dossier
- Refactored for fetch all dossiers in "dashboard" component
- Released 0.4.0

Import
Upload CSV
Process CSV with Node Streams
Separe in records<array>
Prepare queue

- Prepare buffer
- Write buffer
  Execute queue
- Process queue
- Track progress in WebSocket
  Convert buffer to bin file with same original csv file name
  Remove original csv file

Improvements(possible)

- Table filter for each field in form(${slug})
- Lazy loading in historic of events(dashboard).
- Thrash bin for dossiers and records.
- Re-validated records with errors using "forms".
- INTL (English(US), Portuguese(BR)).
- Kubernetes
- Improve updater of queue in API.
