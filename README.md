# BhamaTech website

Static site — no build step required. Three files: `index.html`, `style.css`, `script.js`.

## Deploy to Vercel (fastest — no Git needed)

1. Go to https://vercel.com/new
2. Scroll to **"Deploy without Git"** (or drag files onto the dashboard — this is the "Vercel Drop" option you already saw in your project overview).
3. Drag in `index.html`, `style.css`, and `script.js` together.
4. Click **Deploy**. You'll get a live URL in under a minute.

## Deploy via Git (better long-term — enables auto-deploy on every change)

1. Create a new GitHub repo and push these 3 files to it.
2. In Vercel: **Add New → Project → Import** your repo.
3. Framework preset: choose **"Other"** (it's plain HTML, no framework).
4. Deploy. Every future `git push` auto-redeploys.

## Before you go live — 2 things to update

1. **Connect the contact form** — it captures Name, Email, Company, and Message, and needs one setup step to actually deliver those submissions to your inbox:
   - Go to https://web3forms.com
   - Enter the email address where you want form submissions delivered (no account/signup required).
   - You'll instantly get an **Access Key** by email.
   - Open `index.html`, find this line near the contact form:
     `<input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY">`
     and replace `YOUR_WEB3FORMS_ACCESS_KEY` with the key you received.
   - That's it — submissions arrive in your inbox with sender's name, email, company, and message. Free tier covers up to 250 submissions/month.
   - (Your email address itself never appears in the site's code — only the access key does.)
2. **Calendly link** — already confirmed correct, wired into the Hero and Contact sections.

## Notes

- Single page, anchor-linked nav (Services / Industries / About / Contact) per your brief.
- No Insights/blog section yet — easy to add as a new `<section>` later once you have case studies.
- Fonts (Space Grotesk, Inter, IBM Plex Mono) load from Google Fonts CDN — no local font files needed.
- Fully responsive, respects reduced-motion preference, visible keyboard focus states on the form.

## Recent updates (this revision)

- Calendly CTA text corrected to "30-min call" throughout (matches your actual link)
- "See what I do" → "See what we do"
- Added light/dark theme toggle (top-right of nav) — remembers the visitor's choice, defaults to their system preference on first visit
- Added a logo mark: three connected nodes forming an upward triangle — top node solid (leadership/decision), two open (team/systems), lines representing integration and workflow. Subtly reflects Advisory + Leadership + Automation.

## Logo assets (`/assets`)

- `favicon.svg` — icon only, used as the site favicon, also fine for social profile pictures
- `logo-light-bg.svg` — icon + wordmark, for use on white/light backgrounds (LinkedIn banner, email signature, documents)
- `logo-dark-bg.svg` — icon + wordmark, for use on dark backgrounds

These are vector (SVG), so they scale to any size without quality loss. If you ever need PNG versions (e.g. for tools that don't accept SVG), open the file in a browser, right-click → "Save image as," or ask me to export them.
