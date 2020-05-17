FROM lambci/lambda:build-nodejs12.x
RUN npm config set strict-ssl=false
RUN npm add -g serverless
COPY . .
RUN rm -rf node_modules
RUN npm install --arch=x64 --platform=linux sharp
RUN npm install
