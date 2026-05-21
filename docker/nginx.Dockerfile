FROM nginx:alpine
COPY ./deployment/nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./deployment/nginx/sites/ /etc/nginx/conf.d/
