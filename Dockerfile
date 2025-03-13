# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all files
COPY . .

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]
