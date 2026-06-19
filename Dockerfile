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
EXPOSE 3000

CMD ["npm", "start"]
