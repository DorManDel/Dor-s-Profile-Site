# MyPortfolio — publishing site settings from your phone

The site is static; Developer Mode does not authenticate visitors.

1. Open the deployed website in your phone's browser and edit the settings you want.
2. In Developer Tools, use **Copy GitHub config** to copy the generated JavaScript config.
3. Sign into GitHub in your mobile browser (or open the linked file using GitHub Mobile if editing is supported) and edit `published-config.js` **on branch `develop`**. Paste the exact config, preview the diff and commit.
4. If GitHub Pages is configured to deploy from `develop` /(root), wait for the deployment status to succeed, then reload the site. A local browser preference may override published settings; clear local overrides or test in a private session to verify.

Keep all GitHub credentials outside the website. Do not paste tokens in configuration. Imported audio/images are not included in simple text settings export; they need to be committed as repository assets separately. This process is **not** direct one-click GitHub publishing.

For the full HTML site on Windows, use the versioned local publishing script in the WP2 ZIP. Preserve your local `published-config.js` edits to avoid overwriting phone changes.
