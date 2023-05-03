FROM node:20-alpine3.16

WORKDIR /app

ENV MODE=production
ENV PORT=3000
ENV HTTPS_PORT=3443
ENV SSL_CERT_PATH=/sslcert/origin-cert.pem
ENV SSL_KEY_PATH=/sslcert/origin-cert-key.pem
ENV PROJECT_DB_PATH=/data/project.db
ENV CORE_ROOT=/data/cores/

COPY package.json .
COPY package-lock.json .
COPY dist/ ./dist
COPY src/ ./src

RUN npm install

EXPOSE 3000
EXPOSE 3443

CMD ["npm", "run", "start"]