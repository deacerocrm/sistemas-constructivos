# Sistemas Constructivos — Static Landing Page

This is a standalone, static (no build step) HTML/CSS/JS replica of Deacero's
"Sistemas Constructivos" marketing landing page, originally hosted on
HubSpot CMS at `https://landing.deacero.com/sistemas-constructivos`.

All images, the HubSpot theme CSS/JS, and the custom web fonts (Rubik,
UntitledSans) have been downloaded and localized into this project, so the
page no longer depends on HubSpot's CMS or asset hosting. Third-party CDN
libraries (Font Awesome, Slick Carousel, Magnific Popup, AOS) are still
loaded from cdnjs.cloudflare.com.

There is no build step. To view the page, either open `index.html` directly
in a browser, or serve the folder with any static file server (recommended,
since some browsers restrict local file:// access for certain features).

## Folder structure

- `index.html` — the page itself
- `css/` — localized theme CSS (`template_main.min.css`, `template_child.min.css`,
  `module_Tabs.min.css`, `module_Accordion.min.css`, `module_follow_me_lp.min.css`)
  and `css/fonts/` (Rubik and UntitledSans font files)
- `js/` — localized theme JS (`template_main.min.js`, `template_child.min.js`)
- `images/` — all photos, icons, logos, and background images used on the page

## Contact form — required setup before it will work

The original HubSpot embedded form was replaced with a plain HTML `<form>`
(id `deacero-lead-form`) that posts directly to Salesforce Web-to-Lead
(`https://webto.salesforce.com/servlet/servlet.WebToLead`). Before this form
can actually create Leads in Salesforce, you must:

1. **Enable Web-to-Lead** in Salesforce, if not already enabled
   (Setup > Web-to-Lead).

2. **Add the following custom fields** to the org's Web-to-Lead field list
   (Setup > Web-to-Lead > Edit > add fields), then generate the HTML and
   copy the real `00N_xxxxxxxxxxx` field names Salesforce assigns:
   - `PI2_State__c`
   - `PI2_Producto_de_interes__c`
   - `PI2_Proyecto__c`
   - `PI2_Cuentanos_tu_Proyecto__c`
   - `PI2_Tipo_de_formulario__c`
   - `PI2_Country__c`

3. **Replace every `00N_...` placeholder in `index.html`.** Search for
   `00N_` in the file to find all 4 spots that need the real generated field
   IDs:
   - `name="00N_TIPO_FORMULARIO"` → PI2_Tipo_de_formulario__c
   - `name="00N_COUNTRY"` → PI2_Country__c
   - `name="00N_ESTADO"` → PI2_State__c
   - `name="00N_CATEGORIA"` → PI2_Producto_de_interes__c
   - `name="00N_PROYECTO"` → PI2_Proyecto__c
   - `name="00N_CUENTANOS"` → PI2_Cuentanos_tu_Proyecto__c

   (Note: there are 6 fields listed above but only 4 distinct `00N_` inputs
   need replacing in the sense of "placeholder groups" — in practice just
   replace all 6 `name="00N_..."` attributes with the real field IDs
   Salesforce generates.)

4. **Replace the placeholder `oid` value** (`00Dxxxxxxxxxxxxxxx`) with the
   org's real Web-to-Lead Organization Id.

## Flagged risk: lookup fields via Web-to-Lead

`PI2_State__c` and `PI2_Country__c` are **lookup fields** that reference a
custom object (`CSPicklistData__c`) from an installed package. Salesforce's
plain Web-to-Lead POST is **not guaranteed** to populate lookup fields
correctly — this is a known limitation of the Web-to-Lead mechanism, which
was designed mainly for plain text/picklist fields.

**Test a real form submission** and check whether the resulting Lead's
Estado/Country fields actually saved. If they don't:

- The fix is a small backend (e.g. a Salesforce Apex REST endpoint, or a
  cloud function/Lambda) that receives the form POST and performs an
  **authenticated Lead insert via the Salesforce API** instead of relying on
  the public Web-to-Lead endpoint. An authenticated API call can set lookup
  field values reliably (by passing the referenced record's Id), whereas
  Web-to-Lead cannot guarantee this.

## Intentional omissions (product decisions)

- **"Giro de la empresa"**, **"Unidad de negocio principal"**, and
  **"Unidad de negocio"** fields from the original HubSpot form were
  intentionally left out — no corresponding Salesforce field was identified,
  or it was a deliberate product decision to drop them.
- **UTM tracking fields** (utm_source, utm_medium, utm_campaign, utm_content,
  utm_term) were intentionally not added as hidden inputs.
- The **"Aviso de privacidad" checkbox** is a client-side-only submission
  gate (its `required` attribute blocks submission until checked) — it is
  **not** sent to Salesforce; there is no corresponding Salesforce field.

## Known gap: Lead.Company

`Company` is a **required field on Lead** in Salesforce, but this form does
not collect a company name from the visitor. A hidden input sends a
placeholder value (`"Sin especificar"`) for every submission so the Lead
insert doesn't fail. Consider adding a real "Empresa" text input to the form
and wiring it to the `company` field if company name should actually be
captured going forward.
