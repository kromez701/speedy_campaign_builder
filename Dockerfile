# Stage 1: Build the application
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the entire project into the container
COPY . .

# Install dependencies
RUN npm install --legacy-peer-deps

# Set environment variables during build
ARG REACT_APP_BACKEND_API_URL
ARG REACT_APP_FACEBOOK_ADS_API_URL
ENV REACT_APP_BACKEND_API_URL=$REACT_APP_BACKEND_API_URL
ENV REACT_APP_FACEBOOK_ADS_API_URL=$REACT_APP_FACEBOOK_ADS_API_URL

# Build the application
RUN npm run build
# Use the official Nginx image as a base
FROM nginx:alpine

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build directory from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 3000 instead of the default port 80
EXPOSE 3000

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
