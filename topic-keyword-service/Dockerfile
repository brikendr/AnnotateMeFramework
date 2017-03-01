# USE lawinsider/stanford-ner-docker as the base image 
FROM node:latest

MAINTAINER "brikend.rama@gmail.com"

# Add everything in the current directory to the image in the folder named "app"
COPY . /app

# Change working directory to app so that we can run the project 
WORKDIR /app

# Install all the necessary dependencies
RUN cd /app; \
    npm install --development; \
    npm install -g nodemon

# Exposee express app port 
EXPOSE 8125

# Start the service 
CMD ["npm","start"]