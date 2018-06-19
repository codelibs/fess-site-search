FROM node:8.7-slim
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

# Build 11.3
RUN mkdir -p /app/fss/11.3
ADD fss/11.3/package.json /app/fss/11.3
ADD fss/11.3/webpack.config.js /app/fss/11.3

WORKDIR /app/fss/11.3
RUN npm install;

ADD fss/11.3/src /app/fss/11.3/src
RUN export OUTPUT_JS_FILENAME=fess-ss.min.js; \
    node_modules/.bin/webpack; \
    mkdir -p /app/app/static/fss/11.3; \
    cp /app/instance/generates/fess-ss.min.js /app/instance/generates/fess-ss-11.3.min.js; \
    cp /app/instance/generates/fess-ss.min.js /app/app/static/fss/11.3/;


# Build 11.4
RUN mkdir -p /app/fss/11.4
ADD fss/11.4/package.json /app/fss/11.4
ADD fss/11.4/webpack.config.js /app/fss/11.4

WORKDIR /app/fss/11.4
RUN npm install;

ADD fss/11.4/src /app/fss/11.4/src
RUN export OUTPUT_JS_FILENAME=fess-ss.min.js; \
    node_modules/.bin/webpack; \
    mkdir -p /app/app/static/fss/11.4; \
    cp /app/instance/generates/fess-ss.min.js /app/instance/generates/fess-ss-11.4.min.js; \
    cp /app/instance/generates/fess-ss.min.js /app/app/static/fss/11.4/;


EXPOSE 5000

WORKDIR /app
ENV APP_WEBPACK_LIMIT 4

# '--preload' is necessary to share a semaphore variable among multiple workers
CMD ["gunicorn", "app:app", "-b", "0.0.0.0:5000", "-w", "4", "--threads", "12", "--preload", "--log-file", "-"]
