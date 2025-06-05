# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the Angular application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/dist/citizenos-fe/browser ./dist/citizenos-fe/browser
COPY --from=builder /app/index.js ./
COPY --from=builder /app/config ./config

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose ports
EXPOSE 3000
EXPOSE 3001

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV PORT_SSL=3001

# Start the application
CMD ["node", "index.js"]
