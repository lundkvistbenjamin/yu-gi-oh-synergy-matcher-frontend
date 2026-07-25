# Yu-Gi-Oh! Synergy Matcher Client

A lightweight frontend client engineered to validate, format, and dispatch card metadata payloads to an inference engine for archetype compatibility prediction.

## Overview

The client architecture manages user input parsing and classification workflows by:
* Dynamically populating taxonomy parameters based on Yu-Gi-Oh! card mechanics
* Enforcing form field state shifts dependent on card class selections
* Sanitizing numeric inputs prior to payload assembly
* Transmitting structured JSON requests to a hosted prediction service

## Live Demo

Access the active deployment here: [Yu-Gi-Oh! Synergy Matcher Client](https://yu-gi-oh-synergy-matcher-frontend.vercel.app/)

## Features

### UI State and Rules Engine
* Contextual dropdown filtering that modifies available card sub-types based on parent categories
* Automatic disabling and resetting of monster-specific parameters when non-monster cards are selected
* Fallback input sanitization routines that convert missing or invalid numeric metrics to standardized sentinels

### Network and Error Management
* Asynchronous request processing via native Fetch API implementations
* Client-side handling for HTTP 429 rate-limiting responses to prevent service spamming
* Fallback UI messages to handle remote host disconnects or backend runtime exceptions

### Visual Interface
* Responsive control panel styled with custom CSS variables using Dracula-inspired color tokens
* Monospaced layout design optimized for concise data input workflows

## System Architecture

The client operates within a decoupled web interaction flow:

1. **Parameter Selection (DOM Input Engine):** Collects raw card type, sub-type, numerical stats, and elemental attributes through guarded selection elements.
2. **Validation and Transformation (JavaScript Layer):** Filters out invalid attributes, parses missing numeric inputs to default states, and structures a JSON payload.
3. **Inference Request (Vercel Host API):** Transmits serialized requests via HTTP POST to the remote backend service for archetype classification.

## Technical Details

### State Management Strategy
The client uses native DOM event listeners to handle dynamic input state updates. When a user toggles the card category between Monster and Spell/Trap inputs, the interface toggles input accessibility flags and alters sub-category selection arrays in real time without necessitating full DOM rebuilds.

### Dependencies and Tech Stack
* **Markup Language:** HTML5
* **Styling Framework:** CSS3 (Custom Properties / Dracula Theme Palette)
* **Scripting Engine:** JavaScript (ES6+ Vanilla API Engine)
* **Frontend Hosting:** Vercel Static Deployment
* **Backend Target Endpoint:** Hosted on Vercel (`yu-gi-oh-synergy-matcher-backend.vercel.app`)

## Output Interpretation

* **Analyzing Status:** Signals an active HTTP request in flight to the prediction endpoint.
* **Archetype Match Result:** Displays the predicted deck archetype returned by the model upon a successful response.
* **Rate Limit Exception:** Notifies the user when input submission frequency exceeds the set quota of 10 requests per minute.
* **Server Unreachable:** Indicates transport failures or missing network connectivity.

## Limitations

* Depends directly on the availability and schema specs of the external Vercel prediction endpoint.
* Input validation is tied to fixed array definitions maintained directly inside client-side source code.
* Does not persist session state or previous search historical logs locally.

## Security Note

API interactions run across public CORS-enabled HTTPS endpoints. Inputs are processed on the client side without local caching, and non-numerical inputs are sanitized before being serialized for network transmission.

## License

MIT License - see [LICENSE](LICENSE) file for details.