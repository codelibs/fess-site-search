FROM node:18.16.0-slim
LABEL maintainer "N2SM <support@n2sm.net>"

# Install latest npm
RUN apt-get update \
 && apt-get upgrade -y \
 && apt-get install -y python3 \
 && apt-get install -y python3-pip \
 && apt-get clean

# Build fss
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
RUN npm run build
RUN mkdir -p /app/app/static/fss
RUN cp ./dist/fess-ss.js /app/app/static/fss/

# Build app
WORKDIR /app
ADD app /app/app
ADD tests /app/tests
ADD instance /app/instance
ADD requirements.txt /app

RUN pip3 install --break-system-packages -r requirements.txt

EXPOSE 5000

WORKDIR /app
ENV APP_WEBPACK_LIMIT 4

# '--preload' is necessary to share a semaphore variable among multiple workers
CMD ["gunicorn", "app:app", "-b", "0.0.0.0:5000", "-w", "4", "--threads", "12", "--preload", "--log-file", "-"]
