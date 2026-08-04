# Project Rules

This repository is a shared uni-app Vue 3 template for the A, B, and C mobile apps.

1. Keep the template product-neutral. Do not add client-specific pages, credentials, API hosts, payment settings, or SDK keys to it.
2. Put reusable request, session, storage, upload, runtime, and permission capabilities in `core/`, `services/`, and `config/`.
3. A/B/C each ship as a separate Android/iOS application. Their package names, signing files, icons, push settings, payment configuration, and store metadata belong in their own app repositories.
4. Use Vue 3 `<script setup>` for application pages. Keep uView Pro components on easycom auto-import; never globally register its component catalog.
5. Use the least-privilege rule for native permissions. Add a permission only when a real feature requires it, then verify the denied-permission path on a device.
6. Keep heavy SDKs out of `main.js`; load them inside the feature that owns them.
7. Mini-program support is optional compatibility work. Its package and subpackage constraints must not dictate the App-first template architecture.
