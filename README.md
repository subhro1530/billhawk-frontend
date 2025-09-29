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

## Google OAuth

Backend handles Google OAuth at:

```
/api/v1/auth/google
```

Frontend uses a simple anchor link directing the user there. After successful auth you receive JSON (if hitting callback directly) or adapt flow by wiring a redirect page if needed.

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

## License

Internal MVP – add a license if distributing.

Happy hacking!
