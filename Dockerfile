# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# copy package files & install deps
COPY package*.json ./
RUN npm ci --silent

# copy source & build
COPY . .
RUN npm run build

# Production stage: nginx
FROM nginx:stable-alpine

# remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# copy custom nginx conf that binds to port 8080
COPY nginx.conf /etc/nginx/conf.d/nginx.conf

# copy built site
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the port Cloud Run probes (no effect in runtime, but useful)
EXPOSE 8080

# run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
