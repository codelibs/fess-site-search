FROM node:8.7-slim
LABEL maintainer "N2SM <support@n2sm.net>"

# Install latest npm
RUN apt-get update \
 && apt-get upgrade -y \
 && apt-get install -y \
    python3-pip \
 && apt-get clean

WORKDIR /app
ADD . /app

RUN pip3 install -r requirements.txt
RUN npm install

RUN for ver in "11.3" "11.4"; do \
      cd /app/fss/${ver}/; \
      npm install; \
      export OUTPUT_JS_FILENAME=fess-ss.min.js; \
      node_modules/.bin/webpack; \
      mkdir -p /app/app/static/fss/${ver}; \
      cp /app/instance/generates/fess-ss.min.js /app/app/static/fss/${ver}/; \
    done

EXPOSE 5000

ENV APP_WEBPACK_LIMIT 4

# '--preload' is necessary to share a semaphore variable among multiple workers
CMD ["gunicorn", "app:app", "-b", "0.0.0.0:5000", "-w", "4", "--threads", "12", "--preload", "--log-file", "-"]
