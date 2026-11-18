# Business Conversion Fulcrum
### Your Hyper-Niche Revenue Catalyst Partners · By Aristocrat Intelli-Tech

A complete **public client-facing static website** with 12 industry-specific pages, a buyer-complexity lab, engagement/pricing information, partner selection criteria, a non-invasive qualification flow and explicit privacy policies. No internal CRM, fabricated dashboard or unfinished API endpoint.

## Run locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. A file server is needed because asset URLs are root-relative. No package installation or environment variables are required.

## Deploy

- **Vercel:** Create a new project and deploy this folder as a static website. Set framework to `Other`/no framework, output directory to `.` and no build command. `vercel.json` contains security headers.
- **Netlify:** Deploy this folder. `netlify.toml` publishes the root and sets headers.
- **Hostinger/Apache:** Upload the folder contents to the assigned web root. `.htaccess` disables directory listing and applies response headers.
- **GitHub:** Import as a new independent repository. Do not overwrite any existing Aristocrat websites.

After the canonical public URL is assigned, run `python3 scripts/generate_sitemap.py https://YOUR-REAL-DOMAIN` and update `robots.txt` with `Sitemap: https://YOUR-REAL-DOMAIN/sitemap.xml` if appropriate. Test all routes after deployment.

## User experience

1. Home: "Survival of the Fittest" and the two core buyer problems.
2. Interactive Buyer Complexity Lab: educational variables and output.
3. 12 sector landing pages with distinct buying roles, signals and sales friction.
4. Six-stage partnership method and public fee guidance.
5. Confidentiality commitments and partnership criteria.
6. Qualification form: validates entries locally; creates a prefilled WhatsApp message for the visitor to review and send. No website-side data storage.
7. Call-to-enquire `tel:+919894595035` on every route.

## Testing

```bash
python3 tests/check_site.py
node --check app.js
```

To reproduce graphical interaction tests use Playwright and the installed Chromium executable; `tests/site_smoke.py` includes two viewport flows.

## Important scope boundaries

- The on-site questionnaire does **not** directly transmit submissions; the sender must confirm and send the WhatsApp message. There is no silent lead capture.
- Pricing is indicative. Validate service fees, tax treatment and payment terms before final public launch.
- Confidentiality copy reflects a policy intention: actual client information handling must match it, and contractual promises belong in signed documents.
- `assets/logo-mark.svg` is provisional; replace it with the approved original Aristocrat Intelli-Tech brand mark.
- No public client roster or results claim is included.
- No defence agency affiliation, military certification, guaranteed sales or classified clearance is claimed.

See `docs/BRAND-GUIDELINES.md` and `docs/AI-SDLC-RELEASE.md` for full details.