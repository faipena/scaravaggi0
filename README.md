# Scaravaggi0.top

Monorepo contenente tutto il codice dello Scaravaggi0. Ad oggi, il progetto è
suddiviso nei seguenti componenti:

- **[app](./app)**: applicazione web Deno Fresh e Preact.
- **[bot](./bot)**: bot per Telegram e Twitch scritto 100% from scratch in
  typescript.
- **[caddy](./caddy)**: configurazione per il web-server.
- **[examples](./examples)**: file di configurazione di esempio per il
  deployment.

Il progetto utilizza [Docker Compose](./docker-compose.yaml) per il deploy. Lo
sviluppo è aperto a chiunque, se vuoi aggiungere o modificare qualcosa apri una
PR!

![](./images/preview.png)

---

## Installazione

0. Installare [Docker](https://docs.docker.com/engine/install/)
1. Clonare questa repository, assicurandosi di avere
   [git-lfs](https://git-lfs.com/) installato.
2. Copiare i file di esempio dalla cartella [examples](examples/) alla root
   folder di questa repository
3. Modificare i file copiati nel punto precendente seguendo le istruzioni
   contenute all'interno.
4. Rinominare i file di configurazione rimuovendo `example` dal nome, alla fine
   del processo un dovreste avere I seguenti file:

```
godzillaz-tv/
|-- app/
|-- bot/
|-- caddy/
|-- examples/
|-- docker-compose.yaml
|-- .env.app
|-- .env.bot
|-- .env.caddy
|-- .env.db
`-- README.md
```

5. Buildare il progetto con `docker compose build`
6. Avviare il progetto con `docker compose up`

![](./images/docker-compose.png)

> [!WARNING]\
> Per stoppare il progetto eseguire `docker compose down`
>
> Semplicemente chiudere il processo non fermerà il progetto

Una volta avviato, il progetto sarà disponibile all'indirizzo
[https://localhost](https://localhost/).

---

## Contribuire

Se desideri contribuire al progetto, segui questi passaggi:

1. Fork della repository, assicurandoti di avere [git-lfs](https://git-lfs.com/)
   installato.
2. Crea un branch per la tua feature (`git checkout -b nuova-feature`).
3. Fai commit delle tue modifiche (`git commit -m 'Aggiunta nuova feature'`).
4. Push del branch (`git push origin nuova-feature`).
5. Apri una Pull Request.

---

## Licenza

Il progetto è rilasciato sotto licenza [MIT](./LICENSE).
