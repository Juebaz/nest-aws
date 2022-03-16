# Use a lighter version of Node as a parent image
FROM node:14-alpine
# Set the working directory to /api
WORKDIR /src
# copy package.json into the container at /api
COPY package*.json /src/
# install dependencies
RUN npm install
# Copy the current directory contents into the container at /api
COPY . /src/
# Make port 80 available to the world outside this container
EXPOSE 8080
# Run the app when the container launches
CMD ["npm", "start"]