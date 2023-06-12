FROM node:12-slim
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
ADD fss/jsconfig.json /app/fss/
ADD fss/babel.config.js /app/fss/
ADD fss/.eslintrc.json /app/fss/
ADD fss/vue.config.js /app/fss/

WORKDIR /app/fss
RUN npm install;

ADD fss/src /app/fss/src
ADD fss/public /app/fss/public
RUN export OUTPUT_JS_FILENAME=fess-ss.min.js; \
    npm run build; \
    mkdir -p /app/app/static/fss; \
    cp ./dist/fess-ss.js /app/app/static/fss/;

EXPOSE 5000

WORKDIR /app
ENV APP_WEBPACK_LIMIT 4

# '--preload' is necessary to share a semaphore variable among multiple workers
CMD ["gunicorn", "app:app", "-b", "0.0.0.0:5000", "-w", "4", "--threads", "12", "--preload", "--log-file", "-"]
