# USE node v4 as the base image.
FROM node:latest 

MAINTAINER "brikend.rama@gmail.com"

# Add everything in the current directory to our image, in the 'app' folder.
COPY . /app 

#Install dependencies 
RUN cd /app; \
    npm install --development; \
    npm install -g nodemon

#Expose our server port
EXPOSE 8123

#Change workdir to app
WORKDIR /app

#Start service
CMD ["npm", "start"]
