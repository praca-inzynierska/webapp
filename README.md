# webapp

Część webowa aplikacji

## setup

Utwórz plik `.env` w głównym katalogu, który zawiera
```
HTTPS=true 
SSL_CRT_FILE=/path/to/cert.pem 
SSL_KEY_FILE=/path/to/key.pem
HOST=<hostname>
PORT=<port-number>
```
Wykonaj
```
npm install
npm run build
```
i serwuj katalog `build` używając dowolnego serwera
