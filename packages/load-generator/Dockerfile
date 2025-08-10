FROM node:20
# Set working directory
WORKDIR /app

# Copy package metadata and install dependencies
COPY packages/load-generator/package*.json ./
RUN npm install

COPY packages/load-generator/ ./

# Expose service port
EXPOSE 3001

# Run in development mode
CMD ["npm", "run", "dev"]
