const API_BASE = "https://yu-gi-oh-synergy-matcher-backend.vercel.app";

// 1. Dropdown configurations (Monster cards only)
const TYPES = [
    "Effect Monster", "Normal Monster", "Fusion Monster", "Link Monster",
    "XYZ Monster", "Synchro Monster", "Synchro Tuner Monster", "Tuner Monster",
    "Flip Effect Monster", "Gemini Monster", "Ritual Effect Monster",
    "Pendulum Effect Monster", "Pendulum Effect Ritual Monster",
    "Pendulum Effect Fusion Monster", "Ritual Monster"
];
const ALL_RACES = [
    "Dragon", "Warrior", "Spellcaster", "Machine", "Fiend", "Plant", "Fish",
    "Aqua", "Sea Serpent", "Cyberse", "Fairy", "Rock", "Reptile", "Beast",
    "Winged Beast", "Zombie", "Insect", "Psychic", "Pyro", "Thunder",
    "Beast-Warrior", "Illusion", "Wyrm"
];
const ATTRIBUTES = ["LIGHT", "DARK", "FIRE", "WATER", "EARTH", "WIND", "NONE"];

// 2. Populate dropdown utility
const fillDropdown = (id, arr) => {
    const el = document.getElementById(id);
    if (el) {
        el.innerHTML = el.options[0].outerHTML; // Keep original placeholder
        arr.forEach(val => el.add(new Option(val, val)));
    }
};

const init = () => {
    fillDropdown('type', TYPES);
    fillDropdown('race', ALL_RACES);
    fillDropdown('attribute', ATTRIBUTES);
};

// Helper to convert inputs to clean numbers or default to -1
const safeParse = (val) => {
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? -1 : parsed;
};

// 3. Form Submission
document.getElementById('synergyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const resultEl = document.getElementById('result');
    resultEl.innerHTML = "<div class='loading'>Analyzing card statistics...</div>";

    // Access form elements directly by name/id
    const form = e.target;
    const payload = {
        type: form.type.value,
        race: form.race.value,
        atk: safeParse(form.atk.value),
        def: safeParse(form.def.value),
        level: safeParse(form.level.value),
        attribute: form.attribute.value
    };

    try {
        const res = await fetch(`${API_BASE}/api/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.status === 429) {
            resultEl.innerHTML = "<div class='error'>Slow down, duelist! You have reached the limit of 10 analyses per minute. Please wait a bit.</div>";
            return;
        }

        const json = await res.json();

        if (res.ok && json.top_predictions) {
            // Render top 3 predictions with confidence scores
            let html = `<div class='prediction-container'>`;
            html += `<div class='top-match'>
                        <span class='label'>Primary Match</span>
                        <div class='archetype-title'>${json.top_predictions[0].archetype}</div>
                        <div class='confidence'>${json.top_predictions[0].confidence}% Confidence</div>
                     </div>`;

            if (json.top_predictions.length > 1) {
                html += `<div class='sub-matches'>`;
                json.top_predictions.slice(1).forEach((pred, idx) => {
                    html += `<div class='sub-match-card'>
                                <span class='sub-rank'>#${idx + 2}</span>
                                <span class='sub-name'>${pred.archetype}</span>
                                <span class='sub-conf'>${pred.confidence}%</span>
                             </div>`;
                });
                html += `</div>`;
            }
            html += `</div>`;
            resultEl.innerHTML = html;
        } else if (res.ok && json.prediction) {
            resultEl.innerHTML = `<div class='success'>Predicted Archetype: ${json.prediction}</div>`;
        } else {
            resultEl.innerHTML = `<div class='error'>Error: ${json.detail || "Unable to classify."}</div>`;
        }
    } catch (err) {
        resultEl.innerHTML = "<div class='error'>Error: Server unreachable.</div>";
    }
});

init();