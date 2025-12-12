const AIRTABLE_TOKEN =
  "patE9xRJscf48yuZX.86c38f4e0b3f60eb43e8714fdab7e65d81d3998c1870e31309f1411f00a0186e";

const BASE_ID = "appUf1kSCjF1dTulm";
const TABLE_NAME = "Table 1";

let ALL_STUDIOS = [];

/* ===============================
   FETCH ALL RECORDS
================================ */
async function fetchStudios() {
  let records = [];
  let offset = null;

  do {
    const url = new URL(
      `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`
    );
    url.searchParams.set("view", "Grid view");
    if (offset) url.searchParams.set("offset", offset);

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
    });

    if (!res.ok) {
      console.error(await res.text());
      return [];
    }

    const data = await res.json();
    records = records.concat(data.records);
    offset = data.offset;
  } while (offset);

  return records;
}

/* ===============================
   RENDER CARDS (WITH FADE-IN)
================================ */
function renderStudios(records) {
  const container = document.getElementById("cards-container");
  const count = document.getElementById("results-count");

  container.innerHTML = "";
  count.textContent = `${records.length} studios found`;

  records.forEach((rec, index) => {
    const f = rec.fields;

    const card = document.createElement("div");
    card.className = "col fade-card";
    card.style.cursor = "pointer";

    card.innerHTML = `
      <div class="card h-100">
        <img
          src="${f.image?.[0]?.url ?? "fallback.jpg"}"
          class="card-img-top"
          alt="${f.Studios ?? "Studio"}"
        />

        <div class="card-body">
          <h5 class="card-title">${f.Studios ?? "Untitled Studio"}</h5>

          ${f.Description ? `<p class="card-text">${f.Description}</p>` : ""}

          <div class="card-meta">
            ${f.Type ? `<span class="badge">${f.Type}</span>` : ""}
            ${f.Intensity ? `<span class="badge">${f.Intensity}</span>` : ""}
            ${f.Style ? `<span class="badge">${f.Style}</span>` : ""}
            ${f.time ? `<span class="badge">${f.time}</span>` : ""}
          </div>
        </div>

        ${
          f.promo
            ? `<div class="card-footer"><small>${f.promo}</small></div>`
            : ""
        }
      </div>
    `;

    card.onclick = () => {
      window.location.href = `detail.html?id=${rec.id}`;
    };

    container.appendChild(card);

    // Fade in (staggered)
    setTimeout(() => {
      card.classList.add("is-visible");
    }, index * 60);
  });
}

/* ===============================
   FILTER LOGIC
================================ */
function applyFilters() {
  const type = document.getElementById("filter-type").value;
  const promo = document.getElementById("filter-promo").value.toLowerCase();
  const intensity =
    document.getElementById("filter-intensity")?.value.toLowerCase() ?? "all";
  const search = document.getElementById("filter-search").value.toLowerCase();

  const filtered = ALL_STUDIOS.filter((rec) => {
    const f = rec.fields;

    const matchesType =
      type === "all" || f.Type?.toLowerCase() === type.toLowerCase();

    const matchesPromo =
      promo === "all" || f.promo?.toLowerCase().includes(promo);

    const matchesIntensity =
      intensity === "all" || f.Intensity?.toLowerCase() === intensity;

    const matchesSearch =
      f.Studios?.toLowerCase().includes(search) ||
      f.Description?.toLowerCase().includes(search);

    return matchesType && matchesPromo && matchesIntensity && matchesSearch;
  });

  renderStudios(filtered);
}

/* ===============================
   INIT
================================ */
(async () => {
  ALL_STUDIOS = await fetchStudios();
  renderStudios(ALL_STUDIOS);

  document
    .getElementById("filter-type")
    ?.addEventListener("change", applyFilters);

  document
    .getElementById("filter-promo")
    ?.addEventListener("change", applyFilters);

  document
    .getElementById("filter-intensity")
    ?.addEventListener("change", applyFilters);

  document
    .getElementById("filter-search")
    ?.addEventListener("input", applyFilters);
})();
