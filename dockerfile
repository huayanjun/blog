# Use the official Nginx base image
FROM nginx:latest

# Copy your Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy your static files to the Nginx HTML directory
COPY public/ /usr/share/nginx/html

# Expose the default Nginx port
EXPOSE 80

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
