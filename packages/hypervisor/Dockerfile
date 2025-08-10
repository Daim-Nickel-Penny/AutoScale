FROM node:20
WORKDIR /app
# Copy service files
COPY packages/hypervisor/. .
# Copy built types to /app/types
COPY packages/types/dist/ ./types/
RUN npm install
CMD ["npm", "run", "dev:consumer"]
