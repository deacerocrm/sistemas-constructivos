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

## Contact form — how it's wired to Salesforce

The original HubSpot embedded form was replaced with a plain HTML `<form>`
(id `deacero-lead-form`) that posts directly to Salesforce Web-to-Lead
(`https://webto.salesforce.com/servlet/servlet.WebToLead`). This is a
declarative, no-code integration — no custom Apex/Flow was needed on the
Salesforce side; everything below is either a native Web-to-Lead feature or
already-existing automation in the org (ticket #25 in
`ProyectoSalesforce/MiProyecto/tracker_solicitudes.csv`, resolved OOTB).

**Estado/País** are sent as plain text in the *standard* Web-to-Lead fields
`state` and `country` (values must match `CSPicklistData__c.Name` exactly —
State values are uppercase/unaccented, e.g. `NUEVO LEON`; Country is
`México` with the accent). These are **not** lookup fields on the wire — the
existing Flow `PI2_Lead_SetAddress` (already active in the org) resolves
them into the real `PI2_State__c`/`PI2_Country__c` lookups automatically on
insert, the same way every other Salesforce web form in this org already
works.

**Campaign linkage** uses Web-to-Lead's two reserved hidden fields —
`Campaign_ID` and `member_status` — which natively create the Lead **and**
its `CampaignMember` record in one submission. Both fields are required
together; `Campaign_ID` alone does *not* create the association.

The other custom fields (`PI2_Tipo_de_formulario__c`, `PI2_Producto_de_interes__c`,
`PI2_Proyecto__c`, `PI2_Cuentanos_tu_Proyecto__c`) are sent via the standard
Web-to-Lead custom-field mechanism, `name="00Nxxxxxxxxxxxxxxx"` (the field's
own Salesforce Id, fetched via Tooling API — no need to run the Setup >
Web-to-Lead HTML generator by hand).

### Per-environment values currently baked into `index.html`

These are all **vscodeOrg (dev sandbox)** values — replace before promoting
to UAT/PROD:

| Hidden field | Current value | Meaning |
|---|---|---|
| `oid` | `00Dxxxxxxxxxxxxxxx` (placeholder, **not set yet**) | Org Id — get from Setup > Web-to-Lead in the target org |
| `Campaign_ID` | `701cb000012Q8oRAAS` | Campaign "Sistemas Constructivos - Landing Generica", created in vscodeOrg |
| `member_status` | `Responded` | Valid CampaignMemberStatus on that Campaign |
| `00NRp000000ewDQMAY` | → `PI2_Tipo_de_formulario__c` | |
| `00NRp000000ewDRMAY` | → `PI2_Producto_de_interes__c` | |
| `00NRp000000ewDSMAY` | → `PI2_Proyecto__c` | |
| `00NRp000000ewDPMAY` | → `PI2_Cuentanos_tu_Proyecto__c` | |

To move to UAT/PROD: re-run the same Tooling API query per environment
(`SELECT Id, DeveloperName FROM CustomField WHERE TableEnumOrId='Lead' AND
DeveloperName IN (...)`, Tooling API) to get that org's own `00N` ids (they
differ per org), create/confirm the target Campaign there, and set the real
`oid`.

## Campaign variants

Each marketing campaign that needs its own version of this landing page
should be a **sibling folder** reusing the same `css/`, `js/`, and `images/`
(don't duplicate megabytes of assets per variant):

1. Copy `index.html` into a new folder, e.g. `campana-expo-construccion/index.html`.
2. Adjust hero copy/creative for that campaign as needed.
3. In Salesforce, create (or reuse) the Campaign for that initiative, and
   note its Id + a valid `CampaignMemberStatus` label.
4. In the variant's `index.html`, update `Campaign_ID` and `member_status`
   to that Campaign. Everything else (form fields, styling, `oid`) stays the
   same.
5. Relative asset paths (`css/...`, `js/...`, `images/...`) keep working
   as-is since the variant folder sits next to the shared asset folders.

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
