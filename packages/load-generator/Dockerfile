FROM node:20
WORKDIR /app

# Install dependencies
COPY packages/load-generator/package*.json ./
# Copy built types
COPY packages/types/dist/ ./types/
RUN npm install

# Copy application source
COPY packages/load-generator/. ./

CMD ["npm", "run", "dev"]
