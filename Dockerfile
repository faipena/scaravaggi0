FROM denoland/deno:2.1.7
# FIX DENO CONTAINER
RUN install -d -m 700 -o deno -g deno /home/deno
VOLUME /deno-dir/location_data
ENV DENO_IP=0.0.0.0
EXPOSE 8000
COPY --chown=deno:deno . /app
WORKDIR /app
USER deno:deno
RUN deno task build && deno cache main.ts
CMD ["deno", "-A", "main.ts"]