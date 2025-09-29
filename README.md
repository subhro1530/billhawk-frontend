# BillHawk Frontend (Next.js)

Modern dark, glassmorphic dashboard for the BillHawk backend.

## Features Implemented

- Auth (email/password + Google OAuth redirect to backend)
- Token handling with automatic 401 + 404 toast & event logging
- Dashboard overview (bills/reminders summary)
- Bills CRUD + manual reminder creation
- Auto reminders (handled server-side) visible after refresh
- Reminders list & deletion
- Profile management (reminder offset, notifications, display name)
- Plan upgrade stub (calls /premium/subscribe)
- Admin panel: list users, upgrade/downgrade plan, promote/demote role, disable, delete
- Global glassmorphic theming, animations & custom toasts
- 404 broadcast via window event: `billhawk:api404`

## Newly Added (Professional Expansion)

- Profile dropdown with quick navigation & logout
- Full premium toggle (subscribe/unsubscribe)
- Categories: create & assign to bills
- Recurring bills management
- Bill history + settle action
- Search bills (server-side) & CSV/JSON export job flow
- API Keys management (create / revoke)
- Data export async job + download
- Notifications center (unread filter, mark all)
- Analytics overview + monthly trend (stub charts)
- Activity feed (recent user actions)
- Upcoming reminders shortcut
- Contacts page & improved branding (logo.png, icon.png)
- Enhanced navigation with unread badge & compact UI

Place assets (logo & favicon) in public/:
public/logo.png
public/icon.png

## Tech Stack

- Next.js (Pages router)
- React / Hooks
- Axios (API layer)
- js-cookie (JWT persistence)
- react-hot-toast (feedback)
- CSS (custom glass/dark theme)

## Environment

Create `.env.local` (optional):

```
NEXT_PUBLIC_API_URL=https://billhawk-backend.onrender.com
```

If omitted, it defaults to the hosted backend.

## Google OAuth (Updated Flow)

Backend should:

1. Complete Google exchange.
2. Set the session cookie (token) in the response (httpOnly recommended).
3. Redirect (302) to:

```
https://<frontend-domain>/auth/oauth-complete
```

The /auth/oauth-complete page:

- Never shows the raw JSON response.
- Detects the cookie (or legacy `#token=` fragment), loads /user/me, then redirects to /dashboard.
  Legacy fragment `#token=<JWT>` still works; it is converted to a cookie then cleaned from the URL.

(Older direct JSON responses will no longer appear to the user; they are replaced by the progress UI & redirect.)

## Scripts

```
npm install
npm run dev
npm run build
npm start
```

## Project Structure

```
components/   Reusable UI blocks & modals
pages/        Next.js pages (auth, dashboard, admin)
styles/       Global & module CSS
utils/        API + Auth logic
```

## Route Coverage

All backend endpoints have UI or trigger points:

- /auth/register /auth/login /auth/logout (forms & logout)
- /auth/admin-login (Admin login page)
- /auth/google (anchor link) /auth/google/fetch (Google page)
- /user/me (auth bootstrap + profile)
- PUT /user/me (profile save)
- /bills (list/create) /bills/:id (detail, edit, delete)
- /bills/import/sms & /bills/import/email (Import page)
- /reminders (list) /reminders create & delete
- /reminders/:id (implicitly accessible via future expansion; detail shown via list fetch)
- /premium/subscribe (plan upgrade stub) /premium/status (reflected via user.plan)
- /admin/users (admin list) /admin/users/:id (admin user detail page)
- /admin/users/:id/bills & /admin/users/:id/reminders (admin user detail fetch)
- /health (Health page)

## Future Enhancements

- Payment gateway integration
- Rich analytics (charts for monthly totals)
- Push / email notification preferences UI expansion
- Offline caching & PWA manifest

## Security Notes

- JWT stored in cookie (js-cookie). Consider httpOnly server cookies for production.
- On 401 responses token is cleared & user redirected.
- Revoked tokens respected by backend.

## Quick API cURL One-Liners (Production Backend)

Backend base: https://billhawk-backend.onrender.com

(Replace TOKEN, BILL_ID, JOB_ID, NOTIF_ID, ADMIN_TOKEN etc.)

```bash
# ---------- Auth & User ----------
curl -s -X POST https://billhawk-backend.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"u1@test.com","password":"pass123"}'

curl -s -X POST https://billhawk-backend.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"u1@test.com","password":"pass123"}'

curl -s -H "Authorization: Bearer TOKEN" \
  https://billhawk-backend.onrender.com/api/v1/user/me

curl -s -X PUT https://billhawk-backend.onrender.com/api/v1/user/me \
  -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" \
  -d '{"displayName":"Demo User"}'

# ---------- Bills ----------
curl -s -X POST https://billhawk-backend.onrender.com/api/v1/bills \
  -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Electric","amount":45.7,"dueDate":"2025-12-10T12:00:00Z"}'

curl -s -H "Authorization: Bearer TOKEN" \
  https://billhawk-backend.onrender.com/api/v1/bills

curl -s -H "Authorization: Bearer TOKEN" \
  https://billhawk-backend.onrender.com/api/v1/bills/BILL_ID

curl -s -X PUT https://billhawk-backend.onrender.com/api/v1/bills/BILL_ID \
  -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Electric Updated"}'

curl -s -X POST https://billhawk-backend.onrender.com/api/v1/bills/recurring \
  -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Rent","amount":1000,"interval":"monthly","nextOccurrence":"2025-11-01T10:00:00Z"}'

curl -s -X POST https://billhawk-backend.onrender.com/api/v1/bills/BILL_ID/settle \
  -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" \
  -d '{"note":"Paid online"}'

curl -s -H "Authorization: Bearer TOKEN" \
  https://billhawk-backend.onrender.com/api/v1/bills/BILL_ID/history

curl -s -H "Authorization: Bearer TOKEN" \
  "https://billhawk-backend.onrender.com/api/v1/bills/search?q=rent"

curl -s -H "Authorization: Bearer TOKEN" -o bills.csv \
  "https://billhawk-backend.onrender.com/api/v1/bills/export?format=csv"

# ---------- Categories ----------
curl -s -X POST https://billhawk-backend.onrender.com/api/v1/categories \
  -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Utilities","color":"#33aaff"}'

curl -s -H "Authorization: Bearer TOKEN" \
  https://billhawk-backend.onrender.com/api/v1/categories

# ---------- Reminders ----------
curl -s -X POST https://billhawk-backend.onrender.com/api/v1/reminders \
  -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" \
  -d '{"billId":"BILL_ID","remindAt":"2025-12-08T09:00:00Z"}'

curl -s -H "Authorization: Bearer TOKEN" \
  "https://billhawk-backend.onrender.com/api/v1/reminders/upcoming?days=60"

curl -s -X POST https://billhawk-backend.onrender.com/api/v1/reminders/templates \
  -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"2Day","offsetDays":2}'

# ---------- Notifications ----------
curl -s -H "Authorization: Bearer TOKEN" \
  https://billhawk-backend.onrender.com/api/v1/notifications

curl -s -X POST https://billhawk-backend.onrender.com/api/v1/notifications/NOTIF_ID/read \
  -H "Authorization: Bearer TOKEN"

# ---------- Analytics ----------
curl -s -H "Authorization: Bearer TOKEN" \
  https://billhawk-backend.onrender.com/api/v1/analytics/overview

curl -s -H "Authorization: Bearer TOKEN" \
  https://billhawk-backend.onrender.com/api/v1/analytics/cashflow

# ---------- API Keys ----------
curl -s -X POST https://billhawk-backend.onrender.com/api/v1/user/api-keys \
  -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" \
  -d '{"label":"cli"}'

curl -s -H "Authorization: Bearer TOKEN" \
  https://billhawk-backend.onrender.com/api/v1/user/api-keys

# ---------- Export ----------
curl -s -X POST https://billhawk-backend.onrender.com/api/v1/user/export \
  -H "Authorization: Bearer TOKEN"

curl -s -H "Authorization: Bearer TOKEN" \
  https://billhawk-backend.onrender.com/api/v1/user/export/JOB_ID/status

# ---------- Premium ----------
curl -s -X POST https://billhawk-backend.onrender.com/api/v1/premium/subscribe \
  -H "Authorization: Bearer TOKEN"

curl -s -X POST https://billhawk-backend.onrender.com/api/v1/premium/unsubscribe \
  -H "Authorization: Bearer TOKEN"

# ---------- Admin ----------
curl -s -X POST https://billhawk-backend.onrender.com/api/v1/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"code":"admin123"}'

curl -s -H "Authorization: Bearer ADMIN_TOKEN" \
  "https://billhawk-backend.onrender.com/api/v1/admin/users?limit=10"
```

(If additional endpoints or variants are required, note them and they can be appended here.)

## License

Internal MVP – add a license if distributing.

Happy hacking!
Happy hacking!
