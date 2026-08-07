# Joblifyr modernization baseline

## What was found

The original repository is a legacy PHP prototype. It contains a public marketing page and a registration endpoint that writes to a `users` table. Its login handler is absent and the visible Google, LinkedIn, and X buttons are not implemented. There are no Laravel files, migrations, role tables, OAuth configuration, job/application models, or admin routes to migrate safely.

Legacy files are intentionally retained while their behaviour is audited and replaced. They must not be removed until the Laravel application has equivalent routes and tested data migrations.

## Frontend

The redesigned React/Vite frontend lives in `resources/js`. It is responsive and uses a small component-based landing page (navigation, category cards, job cards, testimonial and CTA). Vercel deploys the production `dist/` bundle. The legacy PHP pages remain intact for audit and are not part of the Vercel static deployment.

```powershell
npm install
npm run dev
```

For a production bundle:

```powershell
npm run build
```

## Laravel migration path

Composer/Laravel are not present in this environment. Install Composer, scaffold Laravel into a separate temporary directory, then migrate its generated framework files here only after backing up the existing project. Keep a single `users` table and add a durable `auth_provider`/provider identity table so OAuth cannot claim an email/password account merely by matching email.

Before retiring legacy PHP, add and test Laravel replacements for registration, credential login, role middleware, OAuth callback collision handling, jobs, applications, saved jobs, follows, messages, notifications, reviews, and feeds.
