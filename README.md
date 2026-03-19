### Prerequisites

Node version 22.18.0 and npm version 10 or later is required to run native typescript.

### Setup

1. "**npm install**" - Install the backend packages (root directory) and the frontend packages (frontend folder).
2. "**npm run build**" - Builds the react app. This will be served by the server later.

### Running

"**npm start**" - Run the server. It will serve the built react app on port number "8080" by default.

**NOTE**: If the port number doesn't work or is unavailable, run it with "**PORT=freeportnumber npm start**" with a free port number, for example: "**PORT=2600 npm start**".

### On the database

I used sqlite3 to store the data specified in the schema.sql and data.sql files into "db.sqlite3". I checked in the sqlite3 database to version control for ease of use.

If you want to reset it to the default state for testing, I left in the data.sql and schema.sql files checked in under the data/ folder and you can run "**npm run init-db**" to delete the old database if it exists, run those sql squeries and create a new db.
