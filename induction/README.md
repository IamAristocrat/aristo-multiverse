# Aristoverse induction
Isolated visitor gateway, under the aristo-multiverse GitHub repository's induction/ subdirectory. The existing Aristo-Multiverse website is not modified.

The /induction path is exposed on the dedicated Vercel project's domain. Routing aristoverse.org/induction from a different host still requires a rewrite/proxy rule at the current aristoverse.org hosting provider; do not move the apex domain blindly.

## Operations
Set EVENT_DATE (YYYY-MM-DD), EVENT_TIME (HH:MM IST), EVENT_DURATION_MINUTES, EVENT_STATUS (tentative/confirmed/rescheduled/digital/cancelled), EVENT_VENUE (unconfirmed/annau; Anna University is the only configured physical campus), EVENT_REVISION, VENUE_APPROVED (true only after campus permission). Strong PASS_SIGNING_SECRET (minimum 32 random characters) and PUBLIC_APP_URL (the live HTTPS origin) are also required for production pass issuance.

Set or change these variables and redeploy. All pass issue times are computed using Asia/Kolkata calendar dates. Date, time, venue, revision or status changes invalidate earlier signed tokens. Visitors enter their name as shown on their photo ID, select one ID type (government or college) and choose a visit purpose (Interview, Induction or Internship). The chosen ID type and purpose are stored in the signed pass token and printed on the PDF. The website does not collect ID numbers, ID photographs or document uploads. A printed pass is required; phone screenshots are not accepted. At the gate, visitors show one original valid government or college photo ID matching the pass name. The campus host and security team decide on entry; a valid QR code never overrides campus approval.

Live event status comes from /api/event and is polled every 60 seconds. Automated WhatsApp notifications are not enabled; recipients may contact the team manually. No identity document images or numbers are collected. Tokens are AES-256-GCM encrypted and bound to the event configuration. Operational hardening before large-scale issuance: rate limiting, separate log retention policy, accessibility test and agreed host-approved gate roster.


## 2 December 2026 Director Meet / Stage 1 public webpage
The main /induction page now contains the Stage 1 20-working-day hybrid guide and 2 December 2026 Director Meet. It is no longer the 25 November event's live entry-pass form. Director Meet time, place, participation format, and campus gate permission are **not confirmed in the source**; they must not be inferred from the earlier Anna University induction. The page directs visitors to confirm meeting arrangements on WhatsApp. The earlier 25 November pass must **not** be presented as valid for the 2 December meet.

The five-answer comprehension self-check runs entirely in client-side JS. It neither records answers nor constitutes a legally binding agreement or acceptance of terms. The daily update textareas and clipboard action are also client-only and do not store submitted work. The Kanban board is an example; it is not integrated with Jira or a task backend.

Stage 1 compensation, schedule, data handling, work scope and any job terms require separate, explicit agreement. This informational page does not amend existing terms. The review weights are **illustrative only** and have no automated effect on recruitment or pay.

The legacy /api/event, /api/pass and /verify endpoints are retained for existing archival compatibility. Their dates and permissions still reference the November 25 induction through EVENT_DATE and related configuration. **Never update EVENT_DATE to 2026-12-02 or reuse VENUE_APPROVED=true for the new Director Meet** until the new visit's venue/security approval and issue rules have been obtained explicitly, validated and configured. New gate passes would require a fresh authorised event configuration and appropriate event revision.


## 2 December 2026 Recruitment Interviews (current landing page)
The public /induction page now leads with **Aristoverse DeepTech Recruitment Interviews** for:
1. Experienced job seekers
2. Freshers
3. Student internship seekers

The recruitment plan displayed is Round 1 HR interviews (2 December 2026), Round 2 technical interviews, and Round 3 leadership team interviews. Later rounds must be separately arranged and are not guaranteed to occur on the same day.

Organizer-supplied meeting location: Tamil Nadu Technology (iTNT) Hub, Anna University Campus, Kotturpuram (Guindy area), Chennai 600025. The iTNT Hub website lists the Sir C V Raman Science Block, 3rd Floor address. No **2 December time, facility booking confirmation or separate campus/security entry approval** has been recorded. The website asks visitors to confirm interview time and gate instructions before travelling. The old 25 November entry pass is **not valid** on 2 December. Do not update EVENT_DATE or reuse the old campus approval flag as a substitute for fresh event approval.

The first-time applicant messaging does not publicize the Director's identity or personal social profiles and uses support@aristoverse.org as the official contact. Existing Stage 1 working guide, self-check and local-only work update remain lower on the page for those invited to continue, and are not requirements for Round 1. Never introduce automatic offers, stipend guarantees or personal model-purchase requirements without explicit approved terms.
