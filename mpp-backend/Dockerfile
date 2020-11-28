# pull official base image
FROM python:3.8.3
# set work directory
# RUN mkdir /mpp
# WORKDIR /mpp
# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# copy entrypoint.sh
# COPY ./entrypoint.sh .
# COPY ./entrypoint.sh .

# copy project
COPY . . 