const AIRTABLE_TOKEN =
  "patE9xRJscf48yuZX.86c38f4e0b3f60eb43e8714fdab7e65d81d3998c1870e31309f1411f00a0186e";

const BASE_ID = "appUf1kSCjF1dTulm";
const TABLE_NAME = "Table 1";

/* ===============================
   GET RECORD ID FROM URL
================================ */
const params = new URLSearchParams(window.location.search);
const recordId = params.get("id");

if (!recordId) {
  console.error("No record ID in URL");
}

/* ===============================
   FETCH SINGLE RECORD
================================ */
async function fetchStudioById(id) {
  const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(
    TABLE_NAME
  )}/${id}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_TOKEN}`,
    },
  });

  if (!res.ok) {
    console.error("Airtable error:", await res.text());
    return null;
  }

  return await res.json();
}

/* ===============================
   RENDER DETAIL VIEW
================================ */
function renderDetail(record) {
  const f = record.fields;

  // Title + Description
  document.getElementById("detail-title").textContent =
    f.Studios || "Untitled Studio";

  document.getElementById("detail-description").textContent =
    f.Description || "";

  // Image
  document.getElementById("detail-image").src =
    f.image?.[0]?.url || "fallback.jpg";

  // Meta info
  const meta = [];

  if (f.Type) meta.push(`🏷 ${f.Type}`);
  if (f.Intensity) meta.push(`🔥 ${f.Intensity}`);
  if (f.Style) meta.push(`🎯 ${f.Style}`);
  if (f.time) meta.push(`⏱ ${f.time}`);
  if (f["Phone Number"]) meta.push(`📞 ${f["Phone Number"]}`);
  if (f.promo) meta.push(`🎟 ${f.promo}`);

  document.getElementById("detail-info").innerHTML = meta
    .map((item) => `<span>${item}</span>`)
    .join("");

  // Website button
  const websiteBtn = document.getElementById("detail-website");
  if (f.Website) {
    websiteBtn.href = f.Website;
  } else {
    websiteBtn.style.display = "none";
  }
}

/* ===============================
   INIT
================================ */
(async () => {
  if (!recordId) return;

  const record = await fetchStudioById(recordId);
  if (record) renderDetail(record);
})();
