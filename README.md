# Smart Locker — Demo

[English](README.md) | [Português (Brasil)](README.pt-BR.md)

An interactive HTML prototype with three experiences:

- **Buyer app:** simulated connection, catalog, shopping cart, simulated payment, and pickup.
- **Management platform:** dashboard, four stores with one locker each, products with cost, customer price, profit and margin, restocking and sales filtered by store and locker, users, and settings.
- **Restocking app:** simulated visits, replenishment by compartment, and a summary.

Open `index.html` in your browser, or run `python3 -m http.server 8000` from this directory and visit `http://localhost:8000`.

Everything runs locally without dependencies. Bluetooth, payments, sales, and operational data are simulated. Prices edited in the management platform appear in the buyer app during the same session. The restocking app simulates a visit to Locker 02; the management platform shows all four lockers. Session data resets when you reload the page.
