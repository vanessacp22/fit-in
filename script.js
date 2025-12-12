const AIRTABLE_TOKEN =
  "patE9xRJscf48yuZX.86c38f4e0b3f60eb43e8714fdab7e65d81d3998c1870e31309f1411f00a0186e";
const BASE_ID = "appUf1kSCjF1dTulm";
const TABLE_NAME = "Table 1";

async function fetchStudios() {
  const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(
    TABLE_NAME
  )}?pageSize=6&view=Grid%20view`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_TOKEN}`,
    },
  });

  if (!res.ok) {
    console.error("Airtable error:", await res.text());
    return [];
  }

  const { records } = await res.json();
  return records;
}

function renderStudios(records) {
  const container = document.getElementById("cards-container");
  container.innerHTML = "";

  records.forEach((rec) => {
    const f = rec.fields;

    const title = f.Studios ?? "Untitled Studio";
    const desc = f.Description ?? "";
    const promo = f.promo ?? "";
    const img = f.image?.[0]?.url ?? "fallback.jpg";

    const card = document.createElement("div");
    card.className = "col";

    card.innerHTML = `
      <div class="card h-100">
        <img src="${img}" class="card-img-top" alt="${title}" />
        <div class="card-body">
          <h5 class="card-title">${title}</h5>
          ${desc ? `<p class="card-text">${desc}</p>` : ""}
        </div>
        <div class="card-footer">
          <small>${promo}</small>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

// Load once, no scroll
fetchStudios().then(renderStudios);
