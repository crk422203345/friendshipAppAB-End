# Project Rules and Specifications

When working on the **friendshipApp** codebase, you must always adhere to the following core rules:

## 微信小程序包体积管控规则 (2MB Limits)

We have a strict 2MB main package limit. You must read and follow the full specification document at [DEVELOPMENT_SPEC.md](file:///f:/project/friendshipApp/DEVELOPMENT_SPEC.md).

### Core Summary of Rules:
1. **Directory Structure & Subpackages**:
   - The main package (`pages/`) ONLY contains Tabbar pages and the login page.
   - All other pages (chat details, publish, settings, user profiles, payments, etc.) MUST be placed inside the `subpackages/` directory.
   - Resources (images, localized components, JS utilities, SDKs) specific to a subpackage must reside inside that subpackage's directory. No cross-importing between subpackages is allowed.

2. **uView Pro Components**:
   - Component auto-import must use `easycom` in `pages.json`.
   - Never register components globally in `main.js`.
   - Keep global styles light. Component styles are compiled on demand.

3. **Static Assets**:
   - All images >10KB, background images, emojis, user photo galleries, and fonts must be hosted on cloud CDN. Do not commit them to the local git repo or compile them into the code package.
   - Use WebP format for small local icons.

4. **JavaScript & Third-Party SDKs**:
   - Heavyweight SDKs (like Tencent IM SDK) must be loaded dynamically inside the subpackages using dynamic imports: `await import('tencent-cloud-im-uniapp')`. Do not import them globally in `main.js`.
   - Always use named exports (`export function xxx`) for tree-shaking support.
   - Use Vue 3 Composition API `<script setup>` and make sure Options API is disabled via `__VUE_OPTIONS_API__: false` in Vite configuration to minimize core package size.
   - Clean up consoles/debuggers in production builds.

5. **Pages & Components**:
   - Keep global components under `components/` <=15KB. Put custom business components inside their respective subpackage.
   - Use virtual scrolling (`u-list`) for high-frequency social listing pages (matching cards, feed timeline) to optimize DOM rendering and performance.
