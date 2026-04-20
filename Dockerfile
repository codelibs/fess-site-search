FROM node:12-slim
LABEL maintainer "N2SM <support@n2sm.net>"

# Install Python, pip, and build dependencies
# Note: Debian stretch (used by node:12-slim) is EOL. We use archive.debian.org
# with Check-Valid-Until disabled, but signature verification remains enabled where possible.
# This is a compromise between security and functionality for legacy dependencies (node-sass 4.x).
# Build dependencies (python, make, g++) are required for node-sass compilation.
# Using Python 2 for node-gyp compatibility with node-sass 4.x
RUN sed -i 's|deb.debian.org|archive.debian.org|g' /etc/apt/sources.list && \
    sed -i '/stretch-updates/d' /etc/apt/sources.list && \
    sed -i 's|security.debian.org|archive.debian.org|g' /etc/apt/sources.list && \
    echo 'Acquire::Check-Valid-Until "false";' > /etc/apt/apt.conf.d/99no-check-valid-until && \
    apt-get update && \
    apt-get install -y \
        python \
        python3-pip \
        make \
        g++ \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ADD app /app/app
ADD tests /app/tests
ADD instance /app/instance
ADD requirements.txt /app

RUN pip3 install -r requirements.txt

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
