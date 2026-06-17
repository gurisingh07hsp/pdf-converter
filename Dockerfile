FROM node:20-bookworm-slim

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libreoffice \
    ghostscript \
    tesseract-ocr \
    poppler-utils \
    qpdf \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build Next.js application
RUN npm run build

# Expose ports
EXPOSE 3000 5001

# Install pm2 to manage both processes
RUN npm install -g pm2

# Start both servers with pm2
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
