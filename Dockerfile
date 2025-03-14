# Use official Node.js image
 FROM node:23-slim

# Set working directory
WORKDIR /pwd

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all files
COPY . .

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]
