// Configuration: Connection settings and constants
const API_BASE = "https://yu-gi-oh-synergy-matcher.vercel.app";
const SPELL_TRAP_PROPERTIES = ['Continuous', 'Equip', 'Field', 'Quick-Play', 'Normal', 'Ritual', 'Counter'];
const resDiv = document.getElementById('result');

// State management
let meta = {};

/**
 * Updates the result display area with status messages or final predictions.
 * Applies CSS classes for visual feedback (success/error).
 */
const setStatus = (msg, type = 'default') => {
    resDiv.innerText = msg;
    resDiv.className = type;
};

/**
 * Utility: Populates a <select> element with options dynamically.
 */
const updateDropdown = (id, options, defaultLabel) => {
    const el = document.getElementById(id);
    el.innerHTML = `<option value="">Select ${defaultLabel}</option>`;
    options.forEach(opt => el.add(new Option(opt, opt)));
};

/**
 * Logic: Filters race and attribute options based on whether the selected
 * type is a Monster or a Spell/Trap.
 */
const updateDependentDropdowns = (selectedType) => {
    const isMonster = meta.monster_types.includes(selectedType);

    // Filter races: Monsters get standard races, Spells/Traps get Property types
    const races = meta.races.filter(r => isMonster ? !SPELL_TRAP_PROPERTIES.includes(r) : SPELL_TRAP_PROPERTIES.includes(r));
    const attrs = isMonster ? meta.attributes : ['NONE'];

    updateDropdown('race', races, 'Race');
    updateDropdown('attribute', attrs, 'Attribute');

    // UX: Auto-select if only one valid option exists
    if (races.length === 1) document.getElementById('race').value = races[0];
    if (attrs.length === 1) document.getElementById('attribute').value = attrs[0];
};

/**
 * Initialization: Fetches metadata from the API on page load to populate types.
 */
async function init() {
    try {
        const res = await fetch(`${API_BASE}/api/metadata`);
        meta = await res.json();
        updateDropdown('type', meta.types, 'Type');
    } catch (err) {
        setStatus("CRITICAL_FAILURE: Could not load metadata.", "error");
        console.error(err);
    }
}

// Event Listeners

// Trigger dependent dropdown update whenever the Card Type selection changes
document.getElementById('type').addEventListener('change', (e) => updateDependentDropdowns(e.target.value));

// Handle form submission: Collect data, send to API, and display results
document.getElementById('synergyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    setStatus("> Initializing analysis...");

    // Gather all form inputs into an object
    const formData = Object.fromEntries(new FormData(e.target));

    // Convert numeric fields to integers for the backend
    formData.atk = parseInt(formData.atk);
    formData.def = parseInt(formData.def);
    formData.level = parseInt(formData.level);

    try {
        const res = await fetch(`${API_BASE}/api/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const json = await res.json();

        // Display result based on success or error returned from backend
        if (json.prediction) {
            setStatus(`> RESULT: ${json.prediction}`, "success");
        } else {
            setStatus(`> ERROR: ${json.error}`, "error");
        }
    } catch (err) {
        setStatus("> SYSTEM_ERROR: Server unreachable.", "error");
    }
});

// Run initialization
init();