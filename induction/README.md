# Aristoverse induction
Isolated visitor gateway, under the aristo-multiverse GitHub repository's induction/ subdirectory. The existing Aristo-Multiverse website is not modified.

The /induction path is exposed on the dedicated Vercel project's domain. Routing aristoverse.org/induction from a different host still requires a rewrite/proxy rule at the current aristoverse.org hosting provider; do not move the apex domain blindly.

## Operations
Set EVENT_DATE (YYYY-MM-DD), EVENT_TIME (HH:MM IST), EVENT_DURATION_MINUTES, EVENT_STATUS (tentative/confirmed/rescheduled/digital/cancelled), EVENT_VENUE (unconfirmed/sathyabama/annau), EVENT_REVISION, VENUE_APPROVED (true only after campus permission). Strong PASS_SIGNING_SECRET (minimum 32 random characters) and PUBLIC_APP_URL (the live HTTPS origin) are also required for production pass issuance.

Set or change these variables and redeploy. All pass issue times are computed using Asia/Kolkata calendar dates. Date, time, venue, revision or status changes invalidate earlier signed tokens. PDF printout is mandatory; mobile screenshots never suffice. Security verifies through the QR and independently checks official photo ID, institutional card and host authorisation.

Live event status comes from /api/event and is polled every 60 seconds. Automated WhatsApp notifications are not enabled; recipients may contact the team manually. No identity document images or numbers are collected. Tokens are AES-256-GCM encrypted and bound to the event configuration. Operational hardening before large-scale issuance: rate limiting, separate log retention policy, accessibility test and agreed host-approved gate roster.
