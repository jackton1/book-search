# Use the official Node.js runtime as a base image
FROM node:20-alpine as builder

# Set the working directory in the container
WORKDIR /usr/src/app

# Copying package.json and yarn.lock to the working directory
COPY package.json yarn.lock /usr/src/app/

# Installing project dependencies
RUN yarn install

# Copying the application source code
COPY . /usr/src/app

# Building the application
RUN yarn build

# Exposing the port the app runs on
EXPOSE 3000

# Running the application using the Node.js executable
CMD ["yarn", "start"]
