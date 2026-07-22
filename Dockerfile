FROM node:20-bookworm-slim

# ===========================
# Install dependencies
# ===========================
    RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    libreoffice \
    ghostscript \
    tesseract-ocr \
    poppler-utils \
    qpdf \
    && rm -rf /var/lib/apt/lists/*




# ===========================
# Install Ghostscript 10.07.1
# ===========================
WORKDIR /tmp

RUN wget https://github.com/ArtifexSoftware/ghostpdl-downloads/releases/download/gs10071/ghostpdl-10.07.1.tar.xz

RUN tar -xf ghostpdl-10.07.1.tar.xz

WORKDIR /tmp/ghostpdl-10.07.1

RUN ./configure && \
    make -j$(nproc) && \
    make install

# Verify Ghostscript installation
RUN gs --version
RUN gs -h

# ===========================
# Application
# ===========================
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
