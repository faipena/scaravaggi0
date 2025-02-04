FROM denoland/deno:2.1.9

VOLUME [ "/data" ]
WORKDIR /app
COPY . /app

RUN install -d -m 770 -o root -g deno /location_data

USER deno:deno

CMD ["deno", "task", "prod"]