<div align="center">

# Instagram Sales Agent — Frontend Dashboard

Track your Instagram posts, trigger scraping jobs for engaged users, and view leads in a clean, dark UI. Built with React 19 + Vite.

</div>

## ✨ Features

- Lists your Instagram posts (fetched from the backend)
- One-click “Scrape Leads” action per post
- Live “Scraped Leads” table with profile links and quick DM shortcuts
- Responsive, dark-themed dashboard layout

## 🧱 Tech Stack

- React 19, React DOM
- Vite 7
- ESLint 9

## 📁 Project Structure

```
instagram-dashboard/
├─ public/
├─ src/
│  ├─ App.jsx          # Main dashboard UI
│  ├─ Leads.jsx        # Leads table component (duplicate of inline version in App.jsx)
│  ├─ main.jsx         # App bootstrap
│  ├─ App.css, index.css
│  └─ assets/
├─ index.html
├─ vite.config.js
├─ package.json
└─ README.md
```

Note: `Leads` also exists inline inside `App.jsx`. Consider keeping only one source of truth to avoid drift.

## 🚀 Getting Started

Prerequisites:
- Node.js 18+ (recommended)

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

By default, Vite starts on http://localhost:5173. You’ll see the Instagram Sales Agent Dashboard.

## 🧪 Scripts

- `npm run dev` — Start the Vite dev server
- `npm run build` — Build for production
- `npm run preview` — Preview the production build

Preview uses `--host 0.0.0.0` and respects `PORT` if provided (helpful for Render or similar hosts).

## 🔌 Backend API

The frontend talks to this backend base URL:

```
https://instagram-sales-agent.onrender.com
```

Endpoints used:

- `GET /api/posts`
	- Returns an array of posts: `{ id: string|number, post_url: string }[]`
- `POST /api/scrape`
	- Body: `{ post_url: string }`
	- Trigger a scrape job for the given post. Returns `{ message: string }`
- `GET /api/leads`
	- Returns an array of leads: `{ id?: string|number, username: string, profile_url: string }[]`

These are called in `src/App.jsx` and `src/Leads.jsx`.

## ⚙️ Configuration

- API base URL is currently hard-coded in `src/App.jsx` as:
	```js
	const API_BASE_URL = 'https://instagram-sales-agent.onrender.com';
	```
	If you plan to deploy multiple environments, consider moving this to an environment variable or a config file.

- Vite preview is configured in `vite.config.js`:
	```js
	export default defineConfig({
		plugins: [react()],
		preview: {
			host: true,
			port: Number(process.env.PORT) || 3000,
			allowedHosts: ['instagram-sales-agent-frontend.onrender.com']
		}
	})
	```
	Update `allowedHosts` to match your deployment domain if needed.

## 🛠️ Development Notes

- UI Styling: Styles are embedded inside `App.jsx` for a sleek dark theme. You can move them into `App.css` for maintainability.
- Leads Component: There are two implementations (inline in `App.jsx` and in `src/Leads.jsx`). Choose one and remove the other to avoid confusion.
- Error States: The app prints errors to the console and shows a brief message on fetch failures.

## 🌐 Deployment

Typical static hosting flow:

```bash
npm run build
npm run preview # optional local smoke test
```

Deploy the `dist/` folder to your static host. For platforms like Render (static site) or Netlify:
- Ensure your backend is reachable from the deployed domain
- If previewing on a platform-provided port, `npm run preview` respects `$PORT`
- Adjust `vite.config.js` `allowedHosts` if the platform requires it

## ❓ Troubleshooting

- Posts don’t load
	- Verify backend `/api/posts` responds and has CORS enabled
	- Check browser console for network errors
- “Scrape Leads” returns an error
	- Confirm `POST /api/scrape` is reachable and accepts `{ post_url }`
- Leads table is empty
	- Ensure `/api/leads` returns data and server scraping finished
	- Click “Refresh Leads” to fetch latest
- DM link opens but not to a user
	- Current implementation opens Instagram Direct. Enhancing it to open a specific user/thread requires additional backend/user context.

## 📜 License

This project is provided as-is by the repository owner. Add your preferred license if you intend to distribute.

---

Made with ❤️ using React + Vite.
