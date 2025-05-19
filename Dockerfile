FROM node:22

WORKDIR /app


COPY package*.json ./
RUN npm install --quiet --no-optional --no-fund --loglevel=error
COPY . .

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:"]