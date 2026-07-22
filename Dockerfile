FROM node:20-bookworm-slim

# ============================================
# Install system packages
# ============================================
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    xz-utils \
    build-essential \
    ca-certificates \
    libreoffice \
    qpdf \
    poppler-utils \
    tesseract-ocr \
    && update-ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# ============================================
# Install Ghostscript 10.07.1
# ============================================
WORKDIR /tmp

RUN wget https://github.com/ArtifexSoftware/ghostpdl-downloads/releases/download/gs10071/ghostpdl-10.07.1.tar.xz

RUN tar -xf ghostpdl-10.07.1.tar.xz

WORKDIR /tmp/ghostpdl-10.07.1

RUN ./configure && \
    make -j$(nproc) && \
    make install

# Verify installation
RUN /usr/local/bin/gs --version

# ============================================
# Cleanup build files
# ============================================
WORKDIR /

RUN rm -rf /tmp/ghostpdl-10.07.1 \
           /tmp/ghostpdl-10.07.1.tar.xz

# ============================================
# Application
# ============================================
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
