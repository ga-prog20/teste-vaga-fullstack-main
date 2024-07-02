FROM node:18

WORKDIR /server
COPY package.json .
RUN npm install
COPY . .
CMD npm run build && node "node_modules/jest/bin/jest.js" "/server/app/services/db.test.ts" -c "/server/jest.config.js" -t "should create collections if they do not exist" && npm start