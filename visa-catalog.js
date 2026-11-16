(() => {
  const cfg = window.DUNYATRIP_SUPABASE_CONFIG || {};
  const url = (cfg.url || "").replace(/\/$/, "");
  const key = cfg.anonKey || "";
  const host = document.getElementById("visaCatalog");
  const modal = document.getElementById("visaBookingModal");
  const form = document.getElementById("visaBookingForm");
  const feedback = document.getElementById("visaBookingFeedback");
  let selectedVisa = null;

  const value = (p, k, fallback = "—") => String(p?.[k] ?? "").trim() || fallback;
  const money = p => p["Price (PKR)"] ? "PKR " + Number(p["Price (PKR)"]).toLocaleString("en-PK") : "Price on request";
  const el = (tag, cls, txt) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt !== undefined) n.textContent = txt;
    return n;
  };

  function renderCard(record) {
    const p = record.payload || {};
    const card = el("article", "visa-product-card");
    const imageWrap = el("div", "visa-product-image");
    if (p["Image URL"]) {
      const img = el("img");
      img.src = p["Image URL"];
      img.alt = value(p, "Country", "Visa destination") + " visa";
      img.loading = "lazy";
      img.onerror = () => { img.remove(); imageWrap.append(el("div", "visa-image-fallback", "✈")); };
      imageWrap.append(img);
    } else imageWrap.append(el("div", "visa-image-fallback", "✈"));
    const body = el("div", "visa-product-body");
    body.append(el("div", "visa-country", value(p, "Country", "Destination")));
    body.append(el("h3", "visa-product-title", value(p, "Visa Name", "Visa") + " Visa"));
    const meta = el("div", "visa-product-meta");
    [["Entry", "Entry"], ["Duration", "Duration"], ["Category", "Category"], ["Processing", "Processing Time"]].forEach(([label, key]) => {
      const item = el("div", "visa-meta-item");
      item.append(el("small", "", label), el("strong", "", value(p, key)));
      meta.append(item);
    });
    body.append(meta);
    const price = el("div", "visa-price-row");
    price.append(el("strong", "visa-price", money(p)));
    const book = el("button", "btn visa-book-button", "Book Now →");
    book.type = "button";
    book.addEventListener("click", () => openBooking(record));
    price.append(book);
    body.append(price);
    if (p["Visa Description"] || p["Required Documents"] || p["Terms & Conditions"]) {
      const details = el("details", "visa-extra");
      details.append(el("summary", "", "Visa details & requirements"));
      [["Visa Description", "Visa Description"], ["Required Documents", "Required Documents"], ["Terms & Conditions", "Terms & Conditions"]].forEach(([label, key]) => {
        if (!p[key]) return;
        const section = el("div", "visa-extra-section");
        section.append(el("b", "", label), el("p", "", p[key]));
        details.append(section);
      });
      body.append(details);
    }
    card.append(imageWrap, body);
    return card;
  }

  async function loadVisas() {
    if (!host) return;
    if (!url || !key) {
      host.replaceChildren(el("p", "visa-catalog-message", "Visa catalogue is temporarily unavailable. Please contact DunyaTrip for assistance."));
      return;
    }
    host.replaceChildren(el("p", "visa-catalog-message", "Loading available visas…"));
    const params = new URLSearchParams({
      select: "id,module_key,payload,status,created_at",
      module_key: "eq.administration/visa-management",
      status: "eq.Active",
      order: "created_at.desc"
    });
    try {
      const response = await fetch(url + "/rest/v1/admin_records?" + params, {
        headers: { apikey: key, Authorization: "Bearer " + key }
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || err.details || "Could not load the visa catalogue.");
      }
      const rows = await response.json();
      host.replaceChildren();
      if (!rows.length) {
        host.append(el("p", "visa-catalog-message", "No visas are available right now. Please check back soon or contact our team."));
        return;
      }
      rows.filter(row => row.payload && (row.payload["Status"] || row.status) === "Active").forEach(row => host.append(renderCard(row)));
    } catch (error) {
      host.replaceChildren(el("p", "visa-catalog-message", "Visa listings could not be loaded. Please contact DunyaTrip on WhatsApp for current options."));
      console.error("Visa catalogue:", error);
    }
  }

  function openBooking(record) {
    selectedVisa = record;
    const p = record.payload || {};
    document.getElementById("visaSelectedName").textContent =
      [value(p, "Country", ""), value(p, "Visa Name", "") + " Visa", value(p, "Entry", ""), value(p, "Duration", "")].filter(Boolean).join(" · ");
    document.getElementById("visaSelectedPrice").textContent = money(p);
    document.getElementById("visaApplicantCount").value = "1";
    renderApplicants();
    feedback.textContent = "";
    modal.hidden = false;
    document.body.classList.add("visa-modal-open");
  }

  function closeBooking() {
    modal.hidden = true;
    document.body.classList.remove("visa-modal-open");
    selectedVisa = null;
  }

  function renderApplicants() {
    const count = Number(document.getElementById("visaApplicantCount").value || 1);
    const wrap = document.getElementById("visaApplicants");
    wrap.replaceChildren();
    for (let i = 1; i <= count; i++) {
      const group = el("fieldset", "visa-pax");
      group.append(el("legend", "", "Passenger " + i));
      const grid = el("div", "visa-pax-grid");
      [["Full name as per passport", "text", "Full name"], ["Passport number", "text", "Passport number"], ["Date of birth", "date", "Date of birth"], ["Nationality", "text", "Nationality"]].forEach(([label, type, placeholder]) => {
        const field = el("label", "visa-pax-field");
        field.append(el("span", "", label));
        const input = el("input");
        input.type = type;
        input.placeholder = placeholder;
        input.required = true;
        input.name = "pax_" + i + "_" + label.toLowerCase().replaceAll(" ", "_");
        field.append(input);
        grid.append(field);
      });
      group.append(grid);
      wrap.append(group);
    }
  }

  document.getElementById("visaApplicantCount")?.addEventListener("change", renderApplicants);
  document.getElementById("visaBookingClose")?.addEventListener("click", closeBooking);
  modal?.addEventListener("click", e => { if (e.target === modal) closeBooking(); });
  form?.addEventListener("submit", async e => {
    e.preventDefault();
    if (!selectedVisa || !form.reportValidity()) return;
    const p = selectedVisa.payload || {};
    const submit = document.getElementById("visaBookingSubmit");
    const pax = [...document.querySelectorAll("#visaApplicants fieldset")].map((group, i) => {
      const data = {};
      group.querySelectorAll("input").forEach(input => data[input.previousSibling?.textContent || input.name] = input.value.trim());
      return "Passenger " + (i + 1) + ": " + Object.values(data).join(" | ");
    });
    const phone = document.getElementById("visaCustomerPhone").value.trim();
    const customer = document.getElementById("visaCustomerName").value.trim();
    const email = document.getElementById("visaCustomerEmail").value.trim();
    const details = [
      "Visa booking request",
      "Visa: " + value(p, "Country", "") + " — " + value(p, "Visa Name", "") + " (" + value(p, "Category", "") + ")",
      "Entry: " + value(p, "Entry", ""),
      "Duration: " + value(p, "Duration", ""),
      "Processing time: " + value(p, "Processing Time", ""),
      "Price: " + money(p),
      "Customer: " + customer,
      "WhatsApp: " + phone,
      "Email: " + (email || "Not provided"),
      "Applicants: " + pax.length,
      ...pax,
      "Required documents: " + value(p, "Required Documents", "To be confirmed")
    ].join("\n");
    const wa = window.open("about:blank", "_blank");
    submit.disabled = true;
    submit.textContent = "Submitting…";
    feedback.textContent = "Your visa booking request is being submitted…";
    try {
      const response = await fetch(url + "/rest/v1/enquiries", {
        method: "POST",
        headers: { apikey: key, Authorization: "Bearer " + key, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ customer_name: customer, phone, service_type: "Visa", message: details })
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || err.details || "Could not submit your booking request.");
      }
      const whatsappUrl = "https://wa.me/923071201353?text=" + encodeURIComponent("DunyaTrip Visa Booking Request\n\n" + details + "\n\nPlease contact this customer.");
      if (wa) wa.location.href = whatsappUrl;
      else window.location.href = whatsappUrl;
      feedback.textContent = "Your request has been received. Our team will contact you shortly.";
      form.reset();
      closeBooking();
      alert("Visa booking request submitted successfully. DunyaTrip team will contact you.");
    } catch (error) {
      if (wa) wa.close();
      feedback.textContent = error.message || "Something went wrong. Please try again.";
    } finally {
      submit.disabled = false;
      submit.textContent = "Submit Booking Request →";
    }
  });

  loadVisas();
})();