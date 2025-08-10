FROM node:20
WORKDIR /app
# Copy service files
COPY packages/hypervisor/. .
RUN npm install
CMD ["npm", "run", "dev:consumer"]
