# Este documento explica cómo conectar tu copia local a Firebase y arrancarla. Complementa (no sustituye) los apartados "Cómo configurar Google Firebase" y "Cómo lanzar la web somosjandula" de este mismo repositorio.

## 1. Crea tu fichero .env

En la raíz del proyecto, en el fichero llamado exactamente .env (no .env.example, no .env.development) con este contenido, sustituye cada valor por el oficial:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```
Este fichero está en .gitignore a propósito: nunca lo subas al repositorio ni lo compartas en capturas de pantalla.

## 2. Arranca el proyecto
```
npm install
npm run dev
```
Abre la URL que te da Vite (normalmente http://localhost:5173).

## 3. Verifica que funciona
El botón "Conecta con Google" debe abrir la ventana de selección de cuenta sin errores.
Tras elegir cuenta, si tu .env apunta al proyecto de Firebase correcto, la llamada al microservicio de Reaktor (ver pocConstantsService.js) debe devolver datos reales en la consola del navegador (F12 → Console) — no un 403
