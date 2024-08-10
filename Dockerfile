# Use the official Nginx image as a base
FROM nginx:alpine

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build directory to the Nginx html directory
COPY build /usr/share/nginx/html

# Expose port 3000 instead of the default port 80
EXPOSE 3000

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
