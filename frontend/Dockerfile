# Dockerfile for Next.js Frontend - Atlas Catalog
# Multi-stage build for optimized production image

# Stage 1: Dependencies
FROM node:22-alpine AS deps

# Install libc6-compat for better compatibility
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install ALL dependencies (including dev) for building
RUN npm ci && \
    npm cache clean --force

# Stage 2: Builder
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all source files
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the Next.js application
# The standalone output will be in .next/standalone
RUN npm run build

# Stage 3: Runner (Production)
FROM node:22-alpine AS runner

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy public assets (if any)
COPY --from=builder /app/public ./public

# Copy the standalone server files
# Next.js automatically creates a standalone folder with everything needed
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Copy static files for serving
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose the port Next.js runs on
EXPOSE 3000

# Set host and port
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the standalone Next.js server
CMD ["node", "server.js"]

