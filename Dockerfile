FROM node:20-alpine3.16

WORKDIR /app

ENV MODE=production
ENV PORT=3000
ENV HTTPS_PORT=3443
ENV SSL_CERT_PATH=./sslcert/origin-cert.pem
ENV SSL_KEY_PATH=./sslcert/origin-cert-key.pem

COPY package.json .
COPY package-lock.json .
COPY dist/ ./dist
COPY src/ ./src
COPY ../sslcert/origin-cert.pem ./sslcert/origin-cert.pem
COPY ../sslcert/origin-cert-key.pem ./sslcert/origin-cert-key.pem

RUN npm install

EXPOSE 3000
EXPOSE 3443

CMD ["npm", "run", "start"]