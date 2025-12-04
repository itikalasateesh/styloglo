# Stage 1: Build the Node.js application
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci --silent

COPY . .

RUN npm run build

# Stage 2: Serve the application with NGINX
FROM nginx:stable-alpine

# Remove the default NGINX configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom NGINX configuration
COPY nginx.conf /etc/nginx/conf.d/nginx.conf

# Copy the built application from the 'build' stage to the NGINX web root
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for NGINX
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
