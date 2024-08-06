# Use the official Nginx image as a base
FROM nginx:alpine

# Copy the build directory to the Nginx html directory
COPY build /usr/share/nginx/html

# Expose port 3000 instead of the default port 80
EXPOSE 3000

# Update the Nginx configuration to listen on port 3000
RUN sed -i 's/listen       80;/listen 3000;/g' /etc/nginx/conf.d/default.conf

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
