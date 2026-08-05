# Yu-Gi-Oh! Synergy Matcher Frontend

**Live Demo:** https://yu-gi-oh-synergy-matcher-frontend.vercel.app/

**Backend Repository:** https://github.com/lundkvistbenjamin/yu-gi-oh-synergy-matcher-backend

Yu-Gi-Oh! Synergy Matcher Client is a lightweight frontend for a machine learning-powered archetype prediction engine. Users can enter the characteristics of a Yu-Gi-Oh! monster card and receive the three most likely archetypes predicted by a Random Forest model served through a FastAPI backend.

## Core Features

### Interactive Prediction Interface

The application provides a simple form for entering monster card statistics, including type, race, attribute, attack, defense, and level. Submitted data is validated and transformed into a structured request for the prediction API.

### Live Machine Learning Predictions

Card statistics are sent to the backend inference service, which returns the three highest-confidence archetype predictions along with confidence scores. Results are displayed immediately without requiring a page reload.

### Responsive User Experience

The interface provides loading states, validation feedback, and user-friendly error messages for network failures or API rate limits, ensuring a smooth experience during prediction requests.

### Lightweight Frontend

Built entirely with Vanilla JavaScript, HTML, and CSS, the client remains fast, dependency-free, and easy to deploy as a static application.

## Tech Stack

### Frontend

- HTML5
- CSS3
- Vanilla JavaScript (ES6)

### Backend Integration

- FastAPI Prediction API
- Fetch API
- JSON REST endpoints

### Deployment

- Vercel

## Project Structure

```text
.
├── app.js              # Frontend application logic
├── style.css           # Application styling
├── index.html          # Main application page
├── README.md
├── LICENSE
└── .gitignore
```

## Application Workflow

The client follows a simple request pipeline:

1. **Input Collection** – Gather the card's type, race, attribute, attack, defense, and level.
2. **Validation** – Sanitize numerical values and construct the prediction payload.
3. **Prediction Request** – Send the payload to the FastAPI backend.
4. **Result Display** – Render the top three predicted archetypes with confidence percentages.

## Performance & Reliability

The application performs all machine learning inference on the backend, keeping the frontend lightweight and responsive. Asynchronous API requests, loading indicators, and graceful error handling provide a smooth user experience even when the prediction service is unavailable or rate-limited.

## Security

The client communicates with the prediction API over HTTPS and never stores user input locally. All model inference and validation occur on the backend, while the frontend simply collects input and displays prediction results.

## License

This project is licensed under the MIT License. See the **LICENSE** file for more information.
