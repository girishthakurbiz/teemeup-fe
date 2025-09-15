# Stage 1: Build the React application
FROM node:18-alpine AS ui-build
WORKDIR /usr/app/fe-service
COPY package*.json ./
RUN npm install -qy
COPY . .
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine
COPY --from=ui-build /usr/app/fe-service/build /usr/share/nginx/html
COPY --from=ui-build /usr/app/fe-service/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
