(() => {
  const cfg = window.DUNYATRIP_SUPABASE_CONFIG || {};
  const url = (cfg.url || "").replace(/\/$/, "");
  const key = cfg.anonKey || "";
  const host = document.getElementById("visaCatalog");
  const modal = document.getElementById("visaBookingModal");
  const form = document.getElementById("visaBookingForm");
  const feedback = document.getElementById("visaBookingFeedback");
  let selectedVisa = null;
  let currentBooking = null;

  const value = (p, k, fallback = "—") => String(p?.[k] ?? "").trim() || fallback;
  const money = p => p["Price (PKR)"] ? "PKR " + Number(p["Price (PKR)"]).toLocaleString("en-PK") : "Price on request";
  const el = (tag, cls, txt) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt !== undefined) n.textContent = txt;
    return n;
  };
  const headers = extra => ({ apikey: key, Authorization: "Bearer " + key, ...extra });

  function renderCard(record) {
    const p = record.payload || {};
    const card = el("article", "visa-product-card");
    const imageWrap = el("div", "visa-product-image");
    if (p["Image URL"]) {
      const img = el("img"); img.src = p["Image URL"];
      img.alt = value(p, "Country", "Visa destination") + " visa"; img.loading = "lazy";
      img.onerror = () => { img.remove(); imageWrap.append(el("div", "visa-image-fallback", "✈")); };
      imageWrap.append(img);
    } else imageWrap.append(el("div", "visa-image-fallback", "✈"));
    const body = el("div", "visa-product-body");
    body.append(el("div", "visa-country", value(p, "Country", "Destination")));
    body.append(el("h3", "visa-product-title", value(p, "Visa Name", "Visa") + " Visa"));
    const meta = el("div", "visa-product-meta");
    [["Entry", "Entry"], ["Duration", "Duration"], ["Category", "Category"], ["Processing", "Processing Time"]].forEach(([label, k]) => {
      const item = el("div", "visa-meta-item"); item.append(el("small", "", label), el("strong", "", value(p, k))); meta.append(item);
    });
    body.append(meta);
    const price = el("div", "visa-price-row");
    price.append(el("strong", "visa-price", money(p)));
    const book = el("button", "btn visa-book-button", "Book Now →"); book.type = "button";
    book.addEventListener("click", () => openBooking(record)); price.append(book); body.append(price);
    if (p["Visa Description"] || p["Required Documents"] || p["Terms & Conditions"]) {
      const details = el("details", "visa-extra"); details.append(el("summary", "", "Visa details & requirements"));
      [["Visa Description", "Visa Description"], ["Required Documents", "Required Documents"], ["Terms & Conditions", "Terms & Conditions"]].forEach(([label, k]) => {
        if (!p[k]) return; const section = el("div", "visa-extra-section");
        section.append(el("b", "", label), el("p", "", p[k])); details.append(section);
      }); body.append(details);
    }
    card.append(imageWrap, body); return card;
  }

  async function loadVisas() {
    if (!host) return;
    if (!url || !key) { host.replaceChildren(el("p", "visa-catalog-message", "Visa catalogue is temporarily unavailable. Please contact DunyaTrip.")); return; }
    host.replaceChildren(el("p", "visa-catalog-message", "Loading available visas…"));
    const params = new URLSearchParams({ select: "id,module_key,payload,status,created_at", module_key: "eq.administration/visa-management", status: "eq.Active", order: "created_at.desc" });
    try {
      const response = await fetch(url + "/rest/v1/admin_records?" + params, { headers: headers() });
      if (!response.ok) throw new Error("Could not load visa catalogue.");
      const rows = await response.json();
      const active = rows.filter(row => row.payload && String(row.payload["Status"] || row.status || "").trim().toLowerCase() === "active");
      host.replaceChildren();
      if (!active.length) { host.append(el("p", "visa-catalog-message", "No active visas are available right now.")); return; }
      active.forEach(row => host.append(renderCard(row)));
    } catch (error) {
      host.replaceChildren(el("p", "visa-catalog-message", "Visa listings could not be loaded. Please contact DunyaTrip on WhatsApp."));
      console.error("Visa catalogue:", error);
    }
  }

  function openBooking(record) {
    selectedVisa = record; currentBooking = null;
    const p = record.payload || {};
    document.getElementById("visaSelectedName").textContent = [value(p, "Country", ""), value(p, "Visa Name", "") + " Visa", value(p, "Entry", ""), value(p, "Duration", "")].filter(Boolean).join(" · ");
    document.getElementById("visaSelectedPrice").textContent = money(p);
    form.hidden = false;
    document.getElementById("visaPaymentPanel")?.remove();
    document.getElementById("visaApplicantCount").value = "1";
    feedback.textContent = "";
    modal.hidden = false; document.body.classList.add("visa-modal-open");
  }
  function closeBooking() {
    modal.hidden = true; document.body.classList.remove("visa-modal-open");
    selectedVisa = null; currentBooking = null;
  }

  async function showPaymentDetails(booking, visa) {
    form.hidden = true;
    const panel = el("section", "visa-payment-panel");
    panel.id = "visaPaymentPanel";
    panel.append(el("h3", "", "Booking submitted successfully"));
    panel.append(el("p", "", "Booking reference: " + booking.id));
    panel.append(el("p", "", "Please transfer the amount using one of the payment methods below."));
    const list = el("div", "visa-payment-methods");
    try {
      const params = new URLSearchParams({ select: "payload,status", module_key: "eq.payments/payment-methods", order: "created_at.desc" });
      const response = await fetch(url + "/rest/v1/admin_records?" + params, { headers: headers() });
      if (!response.ok) throw new Error("Payment methods are not available.");
      const rows = await response.json();
      const methods = rows.filter(row => row.payload && String(row.payload["Status"] || row.status || "Active").toLowerCase() === "active");
      methods.forEach(row => {
        const p = row.payload;
        const card = el("div", "visa-payment-method");
        [["Bank", "Bank Name"], ["Account Title", "Account Title"], ["Account Number", "Account Number"], ["IBAN", "IBAN"], ["Method", "Method"]].forEach(([label, key]) => {
          if (p[key]) { const line = el("p", ""); line.append(el("b", "", label + ": "), document.createTextNode(p[key])); card.append(line); }
        });
        if (p["Bank"] && !p["Bank Name"]) card.prepend(el("strong", "", p["Bank"]));
        list.append(card);
      });
      if (!methods.length) list.append(el("p", "", "Bank transfer details are not available yet. Please contact DunyaTrip on WhatsApp before making payment."));
    } catch {
      list.append(el("p", "", "Payment details could not be loaded. Please contact DunyaTrip on WhatsApp before making payment."));
    }
    panel.append(list);
    const amount = el("p", "visa-payment-amount", "Amount: " + money(visa.payload || {}));
    panel.append(amount);
    const paid = el("button", "btn visa-booking-submit", "I Have Paid");
    paid.type = "button";
    paid.addEventListener("click", async () => {
      paid.disabled = true; paid.textContent = "Submitting…";
      try {
        const response = await fetch(url + "/rest/v1/rpc/submit_public_visa_payment_claim", {
          method: "POST",
          headers: headers({ "Content-Type": "application/json" }),
          body: JSON.stringify({ p_booking_id: booking.id, p_payment_token: booking.payment_token })
        });
        if (!response.ok) throw new Error("Could not update payment status. Please contact DunyaTrip.");
        panel.replaceChildren(el("h3", "", "Thank you! Your payment update has been received."));
        panel.append(el("p", "", "DunyaTrip team will contact you within 10 minutes to confirm your booking."));
        const done = el("button", "btn visa-booking-submit", "Done"); done.type = "button"; done.addEventListener("click", closeBooking); panel.append(done);
      } catch (error) {
        paid.disabled = false; paid.textContent = "I Have Paid";
        feedback.textContent = error.message || "Please try again.";
      }
    });
    panel.append(paid);
    modal.querySelector(".visa-modal-card").append(panel);
  }

  document.getElementById("visaBookingClose")?.addEventListener("click", closeBooking);
  modal?.addEventListener("click", e => { if (e.target === modal) closeBooking(); });
  form?.addEventListener("submit", async e => {
    e.preventDefault();
    if (!selectedVisa || !form.reportValidity()) return;
    const p = selectedVisa.payload || {};
    const submit = document.getElementById("visaBookingSubmit");
    const phone = document.getElementById("visaCustomerPhone").value.trim();
    const customer = document.getElementById("visaCustomerName").value.trim();
    const email = document.getElementById("visaCustomerEmail").value.trim();
    const applicants = document.getElementById("visaApplicantCount").value;
    const details = [
      "Visa booking request",
      "Visa: " + value(p, "Country", "") + " — " + value(p, "Visa Name", "") + " (" + value(p, "Category", "") + ")",
      "Entry: " + value(p, "Entry", ""), "Duration: " + value(p, "Duration", ""),
      "Processing time: " + value(p, "Processing Time", ""), "Price: " + money(p),
      "Customer: " + customer, "WhatsApp: " + phone, "Email: " + (email || "Not provided"),
      "Applicants: " + applicants, "Required documents: " + value(p, "Required Documents", "To be confirmed"),
      "Document upload: Pending secure upload"
    ].join("\n");
    submit.disabled = true; submit.textContent = "Submitting…"; feedback.textContent = "Submitting your booking…";
    try {
      const response = await fetch(url + "/rest/v1/rpc/submit_public_visa_booking", {
        method: "POST",
        headers: headers({ "Content-Type": "application/json" }),
        body: JSON.stringify({ p_customer_name: customer, p_phone: phone, p_email: email || null, p_message: details })
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.id || !result?.payment_token) {
        throw new Error(result?.message || result?.details || "Could not submit your booking. Please try again.");
      }
      currentBooking = { id: result.id, payment_token: result.payment_token, message: details };
      await showPaymentDetails(currentBooking, selectedVisa);
    } catch (error) {
      feedback.textContent = error.message || "Something went wrong. Please try again.";
    } finally {
      submit.disabled = false; submit.textContent = "Continue to Payment →";
    }
  });

  loadVisas();
})();