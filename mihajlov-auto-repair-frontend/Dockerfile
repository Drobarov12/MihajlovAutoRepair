# Step 1: Use an official Node.js image as the build environment
FROM node:18 AS build

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (or yarn.lock) to install dependencies
COPY package*.json ./

# Step 4: Install the dependencies
RUN npm install

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Build the React app for production
RUN npm run build

# Step 7: Use a smaller Nginx image to serve the React app
FROM nginx:alpine

# Step 8: Copy the built React app from the build stage to the Nginx server directory
COPY --from=build /app/build /usr/share/nginx/html

# Step 9: Expose port 80 to access the app
EXPOSE 3000

# Step 10: Start Nginx server to serve the React app
CMD ["nginx", "-g", "daemon off;"]
