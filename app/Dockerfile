FROM denoland/deno:2.1.9
# FIX DENO CONTAINER
RUN install -d -m 700 -o deno -g deno /home/deno
VOLUME /deno-dir/location_data
ENV DENO_IP=0.0.0.0
EXPOSE 8000
USER deno:deno
WORKDIR /app
COPY --chown=deno:deno deno.json /app/deno.json
RUN deno install
COPY --chown=deno:deno . /app
RUN deno task build && deno cache main.ts
CMD ["deno", "task", "prod"]