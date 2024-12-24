# Bandwidth Monitor Backend

Backend of Bandwidth Monitor System

## Environment

- Windows 11
- Node v22.12.0
- Npm 10.9.0

## Tech stacks

- Express
- Typescript

## Steps to run program

1. Install node modules

   ```shell
   npm install
   ```

2. Create .env file

   ```env
   PORT="Port to host project"
   HOST="Host address"

   DB_HOST="Database host address"
   DB_PORT="Database port"
   DB_USER="Database username"
   DB_PASSWORD="Database password"
   DB_NAME="Database name"

   JWT_SECRET="Access Token Secret Value"
   JWT_REFRESH_SECRET="Refresh Token Secret Value"
   ```

3. Run project
   ```shell
   npm run dev
   ```
   This will host the project on http://127.0.0.1:5000.
