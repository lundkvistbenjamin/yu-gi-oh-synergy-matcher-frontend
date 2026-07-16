const API_BASE = "http://127.0.0.1:8000";

// 1. Dropdown configurations
const TYPES = ["Effect Monster", "Normal Monster", "Spell Card", "Trap Card", "Fusion Monster", "Link Monster", "XYZ Monster", "Synchro Monster", "Synchro Tuner Monster", "Tuner Monster", "Flip Effect Monster", "Gemini Monster", "Ritual Effect Monster", "Pendulum Effect Monster", "Pendulum Effect Ritual Monster", "Pendulum Effect Fusion Monster", "Ritual Monster"];
const ALL_RACES = ["Dragon", "Warrior", "Spellcaster", "Machine", "Fiend", "Plant", "Fish", "Aqua", "Sea Serpent", "Cyberse", "Fairy", "Rock", "Reptile", "Beast", "Winged Beast", "Zombie", "Insect", "Psychic", "Pyro", "Thunder", "Beast-Warrior", "Illusion", "Wyrm", "Continuous", "Equip", "NONE"];
const ATTRIBUTES = ["LIGHT", "DARK", "FIRE", "WATER", "EARTH", "WIND", "NONE"];

const SPELL_RACES = ["Continuous", "Equip", "NONE", "Field", "Quick-Play", "Ritual"];
const TRAP_RACES = ["Continuous", "NONE", "Counter"];

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

// 3. UI Rules Engine
document.getElementById('type').addEventListener('change', (e) => {
    const isMonster = !["Spell Card", "Trap Card"].includes(e.target.value);
    const attrEl = document.getElementById('attribute');
    const statInputs = document.querySelectorAll('#atk, #def, #level');

    // Toggle monster-only fields cleanly
    attrEl.disabled = !isMonster;
    attrEl.value = isMonster ? (attrEl.value === 'NONE' ? '' : attrEl.value) : 'NONE';

    statInputs.forEach(input => {
        input.disabled = !isMonster;
        input.required = isMonster;
        if (!isMonster) input.value = "";
    });

    // Update race lists based on card type
    if (e.target.value === "Spell Card") {
        fillDropdown('race', SPELL_RACES);
    } else if (e.target.value === "Trap Card") {
        fillDropdown('race', TRAP_RACES);
    } else {
        fillDropdown('race', ALL_RACES.filter(r => !["Continuous", "Equip"].includes(r)));
    }
});

// Helper to convert inputs to clean numbers or default to -1
const safeParse = (val) => {
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? -1 : parsed;
};

// 4. Form Submission
document.getElementById('synergyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const resultEl = document.getElementById('result');
    resultEl.innerText = "Analyzing...";

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
            resultEl.innerText = "Slow down, duelist! You have reached the limit of 10 analyses per minute. Please wait a bit.";
            return;
        }

        const json = await res.json();
        resultEl.innerText = res.ok ? json.prediction : `Error: ${json.detail || "Unable to classify."}`;
    } catch (err) {
        resultEl.innerText = "Error: Server unreachable.";
    }
});

init();