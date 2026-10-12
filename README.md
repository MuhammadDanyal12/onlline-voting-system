# Common Ground — HTML, CSS, and JavaScript demo

This is a browser-only learning project. It uses HTML for the page, CSS (including Bootstrap) for design, and JavaScript for the demo interactions. There is no Node.js, backend, or database.

## Files

```text
online voting system/
├── README.md          This beginner setup and learning guide
└── public/
    ├── index.html     Home page, candidate cards, results, demo admin, and forms
    ├── styles.css     Colors, typography, layout, animations, and mobile styling
    └── app.js         Sample candidates, search, demo sign-in, vote counts, and admin actions
```

## Run it in VS Code

1. Open the project folder in VS Code.
2. Open `public/index.html`.
3. Right-click the page and choose **Open with Live Server** if you have that VS Code extension. Or double-click `index.html` in File Explorer to open it in a browser.
4. The page loads Bootstrap and its sample portraits from the internet, so those assets need an internet connection.

There are no packages to install and no terminal command or database setup is needed.

## Try the demo

1. Search by candidate name or choose a party from the filter.
2. Scroll to **Demo admin** and press **Start demo**.
3. Press a Vote button. The sign-in/register popup accepts sample details only; it does not create or verify an account.
4. Choose a candidate. The result chart changes immediately.
5. Try the admin controls to add, edit, or remove sample candidates, or end the demo election.
6. Refresh the page. Candidate edits, the election status, the sign-in, and all vote counts reset.

## Make simple changes

- **Change page text or sections:** edit `public/index.html`. Search for the text in VS Code and replace it.
- **Change the main colors:** near the top of `public/styles.css`, change CSS variables such as `--forest` or `--lime`. For example, changing `--lime: #d3f36b;` changes the highlight color.
- **Change spacing or phone layout:** edit the component styles and the `@media` rules near the bottom of `public/styles.css`.
- **Change the example candidates:** search for `appState` near the top of `public/app.js`, then edit the sample `name`, `party`, `description`, and `photoUrl` values.
- **Change search, demo voting, or admin actions:** find functions such as `renderCandidates`, `castDemoVote`, and `saveDemoCandidate` in `public/app.js`.

Save your edit and refresh the browser. If the design looks unchanged, press **Ctrl+F5** for a hard refresh.

## Security limit — read this before using the vote buttons

This frontend-only project is **not secure authentication and not a real voting system**:

- The sign-in form only sets a temporary display identity. It accepts sample details without checking an account. The sample password is immediately cleared and is not saved or sent anywhere.
- The admin section is public; anyone who opens the page can use its controls.
- Demo votes and the “one vote” check exist only in JavaScript memory in the current page. Refreshing clears them. Browser tools can alter or bypass the code.
- There is no server to verify a voter's identity, enforce a trustworthy one-vote rule, or protect results.

Do not enter real passwords or personal information, and do not use this app for a real election. A secure system needs server-side authentication, database-backed vote validation and duplicate prevention, protected admin access, and independent security review. Real elections also need an appropriate secret-ballot design, identity/eligibility checks, audits, and applicable legal safeguards. Frontend-only code cannot provide those protections.
