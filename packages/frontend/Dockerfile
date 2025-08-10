# Use official Node.js LTS image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json from local context
COPY package.json ./

# Install dependencies
RUN npm install

# Copy all files from local context
COPY . .

# Build Next.js app
RUN npm run build

# Expose frontend port
EXPOSE 3000

# Start Next.js app
CMD ["npm", "start"]
