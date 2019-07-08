FROM node:8.15-slim
LABEL maintainer "N2SM <support@n2sm.net>"

# Install latest npm
RUN apt-get update \
 && apt-get upgrade -y \
 && apt-get install -y \
    python3-pip \
 && apt-get clean

WORKDIR /app
ADD app /app/app
ADD tests /app/tests
ADD instance /app/instance
ADD requirements.txt /app

RUN pip3 install -r requirements.txt
RUN npm install

# Build 11.4
RUN mkdir -p /app/fss/
ADD fss/package.json /app/fss/
ADD fss/webpack.config.js /app/fss/

WORKDIR /app/fss
RUN npm install;

ADD fss/src /app/fss/src
RUN export OUTPUT_JS_FILENAME=fess-ss.min.js; \
    node_modules/.bin/webpack; \
    mkdir -p /app/app/static/fss; \
    cp /app/instance/generates/fess-ss.min.js /app/app/static/fss/;


EXPOSE 5000

WORKDIR /app
ENV APP_WEBPACK_LIMIT 4

# '--preload' is necessary to share a semaphore variable among multiple workers
CMD ["gunicorn", "app:app", "-b", "0.0.0.0:5000", "-w", "4", "--threads", "12", "--preload", "--log-file", "-"]
