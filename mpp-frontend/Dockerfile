FROM node:alpine as react_build
WORKDIR /mpp-frontend

#copy the react app to the container
COPY . /mpp-frontend/

# prepare the contiainer for building react
# RUN yarn install
# RUN yarn build

#prepare nginx
FROM nginx:1.19.0

COPY --from=react_build /mpp-frontend/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
# COPY nginx/certs /etc/nginx/certs

#fire up nginx
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
