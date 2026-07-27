# 🏆 AFF Cup 2026 Interactive Wallchart

A complete, production-ready, fully interactive wallchart for the **2026 ASEAN Hyundai Cup (AFF Cup 2026)** — built as a static, dependency-free dashboard that runs entirely in the browser. No backend, no build step: just open it and go.

Inspired by the professional dashboard feel of tools like `wallchart.io`, this project turns the group stage and knockout bracket of the AFF Cup 2026 into a live, self-calculating scoreboard.

---

## ✨ Features

- **Real-time standings** — Enter a scoreline and Group A / Group B tables instantly recompute Played, Won, Drawn, Lost, GF, GA, GD, and Points.
- **Automatic tie-breaker sorting** — Tables sort live using the AFF hierarchy: **Points → Goal Difference → Goals For**.
- **Automatic bracket seeding** — The Group A / Group B winners and runners-up automatically populate the Semifinal slots the moment the group tables resolve.
- **Two-legged knockout calculator** — Every knockout tie (Semifinal 1, Semifinal 2, Final) has separate Leg 1 / Leg 2 score inputs with a live aggregate score.
- **Conditional Extra Time** — If the aggregate is level after Leg 2, an Extra Time input block appears automatically.
- **Conditional Penalty Shootout** — If Extra Time doesn't break the deadlock, a penalty shootout score box appears to decide the winner.
- **Persistent state** — All scores are saved to `localStorage` automatically, so refreshing the browser never loses your data.
- **One-click reset** — The "Reset All Scores" button wipes all inputs, `localStorage`, and restores the original 2026 fixture list and results.
- **Fully responsive** — Built with CSS Grid and Flexbox for a clean experience on desktop, tablet, and mobile.

---

## 📁 Project Structure

```
aff-2026-interactive-wallchart/
├── .gitignore
├── package.json
├── README.md
├── index.html      # Structural markup — header, standings grid, knockout bracket
├── style.css        # Deep Navy / Accent Blue / Grass Green dashboard theme
└── app.js           # Tournament data, standings engine, knockout calculator, localStorage
```

---

## 🚀 Getting Started (Local Development)

This project has **zero build dependencies** — it's plain HTML, CSS, and ES5 JavaScript. You can open `index.html` directly in a browser, or run a lightweight local server with live reload:

```bash
# Clone the repository
git clone https://github.com/Bahlil/aff-2026-interactive-wallchart.git
cd aff-2026-interactive-wallchart

# Optional: install browser-sync for local dev with live reload
npm install
npm start
```

`npm start` launches `browser-sync`, serving the site and automatically reloading whenever `index.html`, `style.css`, or `app.js` changes.

---

## 🌐 Deployment to GitHub Pages

1. Push this repository to GitHub (public repository recommended for free Pages hosting).
2. In your repository, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Set the branch to `main` (or `master`) and the folder to `/ (root)`.
5. Click **Save**. GitHub will publish your site at:

   ```
   https://<your-username>.github.io/aff-2026-interactive-wallchart/
   ```

6. Wait 1–2 minutes for the first deployment, then visit the URL above. Any future push to the branch will automatically redeploy the site.

No environment variables, no server, no database — the entire app is static and safe to host on GitHub Pages as-is.

---

## 🏟️ Tournament Format

- **Group A:** Indonesia, Vietnam, Singapore, Cambodia, Timor-Leste
- **Group B:** Thailand, Malaysia, Philippines, Myanmar, Laos
- Single round-robin group stage (4 matches per team).
- Group winner and runner-up from each group advance to the Semifinals.
- Semifinals and Final are played over **two legs** (home and away aggregate), with Extra Time and Penalty Shootout rules applied only if needed.

## 🛠️ Tech Stack

- HTML5 (semantic markup)
- CSS3 (Grid + Flexbox, no framework)
- Vanilla ES5 JavaScript (no build tools, no external JS dependencies)
- `localStorage` for persistence

## 📄 License

Released under the [MIT License](https://opensource.org/licenses/MIT). Free to use, modify, and distribute.
