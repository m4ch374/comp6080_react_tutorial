# Frontend Development Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose Vite dev server port (default is 5173)
EXPOSE 5173

# Run the dev server
CMD ["npm", "run", "dev", "--", "--host"]

