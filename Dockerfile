# Use a minimal Node base image
FROM node:23-alpine

# Create app directory
WORKDIR /app

# Install only production dependencies
# Install curl to fetch the dotenvx binary
RUN npm update && npm install -y curl

# Download and install dotenvx
RUN curl -sfS https://dotenvx.sh/install.sh | sh

# Ensure /usr/local/bin is in the PATH
ENV PATH="/usr/local/bin:${PATH}"

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy the rest of the app
COPY . .

# Expose backend port
EXPOSE 5000

# Start the backend server
CMD ["dotenvx", "run",  "--env-file=.env.production", "--", "node", "server.js"]

