# Musikkbibliotek

Musikkbibliotek er et lite webbasert system som administrerer og viser min personlige platesamling. Systemet består av en REST API-backend som håndterer data i en MariaDB-database, og en React-frontend med en kortbasert scrolling-visning. Albumene kan vises med cover, artist, utgivelsesår, Spotify QR-kode og Spotify Code for skanning direkte i appen. Formålet er å ha et pent sted å vise frem samlingen min, med mulighet for å legge til, redigere og slette album via et innebygd admin-panel som krever innlogging.


## Teknisk beskrivelse

* Backend: Node.js (Express)

    * Viktige biblioteker: `express`, `mariadb`, `jsonwebtoken`

* Database: `MariaDB`

    * Databasenavn: `musikkbib`

    * Tabeller: 
    
        `album` (kolonner: `album_id, tittel, artist_id, utgielsesaar, bilde_url, spotify_url, spotify_code_bilde`), `artist`

        `game_sessions` (kolonner: `artist_id, navn`)



* Frontend: React (Vite)

    * Viktige biblioteker: `react`, `qrcode.react`

* Autentisering: JWT-basert admin-innlogging — alle kan se samlingen, kun admin kan legge til, redigere og slette


* Teknologier & versjoner (anbefalt)

    * Node.js: 18+

    * MariaDB: 10.x eller nyere

    * NPM-pakker backend: `express`, `mariadb`, `jsonwebtoken`

    * NPM-pakker frontend: `react`, `react-dom`, `qrcode.react`, `vite`

* Hardware: Kan kjøres lokalt på en vanlig utviklermaskin (macOS/Linux/Windows). Krever kun nok disk/minne til å kjøre Node, MariaDB og Vite dev-server.



## Oppsett og installasjon 🚀

Følgende beskriver steg for oppsett på en lokal maskin.

1. Klon repo og gå til prosjektmappen:
    ```
    git clone <https://github.com/albertine321/musikkbibliotek>
    cd musikkbib
    ```

2. Installer backend-avhengigheter:

    ```
    cd backend
    npm install
    ```

3. Installer frontend-avhengigheter:

    ```
    cd ../frontend 
    npm install
    ```

4. Start MariaDB og sørg for at du kan logge inn:
    
   ```
    mariadb -u databasebruker -p -h localhost
    ```

5. Opprett databasen og tabellene (kjør kun én gang):
   
   ```
    CREATE DATABASE musikkbib;
    USE musikkbib;

    CREATE TABLE artist (
    artist_id INT AUTO_INCREMENT PRIMARY KEY,
    navn VARCHAR(255) NOT NULL
    );

    CREATE TABLE album (
    album_id INT AUTO_INCREMENT PRIMARY KEY,
    tittel VARCHAR(255) NOT NULL,
    artist_id INT NOT NULL,
    utgivelsesaar INT,
    bilde_url TEXT,
    spotify_url VARCHAR(500),
    spotify_code_bilde VARCHAR(500),
    FOREIGN KEY (artist_id) REFERENCES artist(artist_id)
    );
    ```

6. Endre brukernavn, passord og admin-innlogging i `backend/app.js`: 

    ```
    const ADMIN_BRUKERNAVN = 'admin';
    const ADMIN_PASSORD = 'mittpassord';
    const JWT_SECRET = 'hemmelig-nokkel-bytt-meg-ut';
    ```
    Åpne http://localhost:3002/ i nettleseren.


## Endepunkter (API) 📡

`GET /` — velkomstmelding

`GET /musikk` — returnerer alle album med artistnavn (JOIN mellom `album` og `artist`)

`POST /musikk` — legg til nytt album (krever innlogging)

`PATCH /musikk/:id` — oppdater et eksisterende album (krever innlogging)

`DELETE /musikk/:id` — slett et album (krever innlogging)

`POST /login` — logg inn som admin, returnerer JWT-token

Eksempel på POST/PATCH-body:

```
{
  "tittel": "Abbey Road",
  "artist_navn": "The Beatles",
  "utgivelsesaar": 1969,
  "bilde_url": "https://...",
  "spotify_url": "https://open.spotify.com/album/...",
  "spotify_code_bilde": "https://scannables.scdn.co/..."
}
```

Eksempel på innlogging (`POST /login`):

```
{
  "brukernavn": "admin",
  "passord": "mittpassord"
}
```

Returnerer

```
{
  "token": "eyJhbGci..."
}
```

Token sendes som Authorization: Bearer <token> header på alle skriveoperasjoner.


## Sikkerhet & kjente forbedringer ⚠️

* Hardkodede DB-legitimasjoner finnes i dbconnector.js — bytt til miljøvariabler og .env i stedet.
* Admin-brukernavn, passord og JWT-hemmelighet er hardkodet i app.js — disse bør også flyttes til .env før siden settes i produksjon.
* Base64-bilder lagres direkte i databasen som TEXT — ved stor trafikk bør disse heller lagres i filsystemet eller en skytjeneste som S3, med kun URL i databasen.
* Ingen HTTPS — JWT-token sendes i klartekst over HTTP lokalt. Ved publisering bør siden kjøres bak en HTTPS-proxy (f.eks. Nginx + Let's Encrypt).
* Graceful shutdown: kall `conn.release()` og lukk poolen ved SIGINT/SIGTERM for å la prosessen avslutte pent.
* Token-utløp er satt til 7 dager — vurder kortere levetid og legg til refresh-token-støtte hvis siden skal brukes mer aktivt.

## Lisens & bidrag

Legg gjerne til en `LICENSE` (f.eks. MIT) og en `CONTRIBUTING.md` hvis du vil ha bidrag fra andre. Siden musikkbiblioteket er et personlig prosjekt med admin-innlogging er det ikke nødvendig, men kan være greit hvis du ønsker å dele koden eller videreutvikle den sammen med andre.

***

Skrevet med hjelp av Claude Sonnet 4.6 i mars 2026.
