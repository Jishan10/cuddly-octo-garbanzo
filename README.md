# Waveify — Spotify-style Music Player

A self-contained front-end music player inspired by modern streaming apps.

## Run it
1. Put your MP3 files in `songs/`.
2. Open `index.html` in a browser, or serve the folder with a local server:
   - Python: `python -m http.server 8000`
   - Then visit `http://localhost:8000`
3. Edit the `songs` array in `script.js` so each `src` points to your MP3 filename.

## Notes
- The included tracks are demo entries; no copyrighted audio is bundled.
- For a public site, use music you own or have permission/license to distribute.
- This is a front-end player. Accounts, cloud storage, playlists, uploads, and a real database would require a backend.
