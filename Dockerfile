# ==========================================
# Stage 1: Build Static Assets
# ==========================================
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package metadata
COPY package*.json ./

# Install dependencies cleanly
RUN npm ci

# Copy source code
COPY . .

# Build static bundle
RUN npm run build

# ==========================================
# Stage 2: Production Web Server (Nginx Alpine)
# ==========================================
FROM nginx:alpine AS production

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
