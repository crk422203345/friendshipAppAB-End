# Multi-App Template

This is the shared uni-app Vue 3 foundation for the A, B, and C mobile apps.

## Build profiles

```bash
npm run dev:app:a
npm run dev:app:b
npm run dev:app:c
npm run dev:h5

npm run build:app:a
npm run build:app:b
npm run build:app:c
```

Profiles are declared in `config/app-profiles.js`. They select client defaults only; each client app must still maintain its own native signing, package identifiers, icons, SDK credentials, and store metadata.

## Shared layers

- `core/`: HTTP, session, and storage.
- `services/`: uploads, runtime information, and permission boundaries.
- `config/`: neutral template, A, B, and C profiles.

Read `DEVELOPMENT_SPEC.md` before adding a new shared capability or creating a client app.
