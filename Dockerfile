# Use a Node.js image to build the React app
FROM node:latest as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
ENV GENERATE_SOURCEMAP=false
ENV NODE_OPTIONS=--openssl-legacy-provider

# Accept ENV_FILE as a build argument
ARG ENV_FILE
ENV ENV_FILE=${ENV_FILE}

# Copy individual files to avoid path issues
COPY .npmrc .
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the specified .env file
COPY ${ENV_FILE} .env

# Copy the rest of the application code
COPY . ./

# Build the React application
RUN npm run build

# Production environment - use Nginx to serve the built app
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]