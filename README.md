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
(id `deacero-lead-form`) that posts directly to Salesforce Web-to-Lead, en el
**My Domain del org** (`https://<my-domain>/servlet/servlet.WebToLead`; los hosts
genéricos ya no funcionan — ver la nota del 2026-09-10). This is a
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

### ✅ Verified end-to-end (2026-07-28, against vscodeOrg)

A real test submission was posted to Salesforce and confirmed by querying the
resulting records directly:

- Lead created with all standard + custom fields correct.
- `State`/`Country` (plain text) correctly resolved by the existing Flow
  `PI2_Lead_SetAddress` into the real lookups: `PI2_State__c` → "NUEVO LEON",
  `PI2_Country__c` → "México".
- `CampaignMember` created automatically, linked to "Sistemas Constructivos -
  Landing Generica", `Status = "Responded"`.

### ⚠️ 2026-09-10 — los endpoints genéricos dejaron de funcionar

La integración se rompió sola entre el 1 y el 10 de septiembre de 2026, sin que
nadie tocara el archivo: **Salesforce retiró los endpoints genéricos de
Web-to-Lead.** El último Lead que entró por `test.salesforce.com` fue el
2026-09-01.

Diagnóstico, con el mismo POST enviado a los dos hosts el 2026-09-10:

| Endpoint | Respuesta |
|---|---|
| `https://test.salesforce.com/servlet/servlet.WebToLead?...&orgId=<oid>` | ❌ `Reason: Your Lead could not be processed. Lead Capture Page: Not available.` |
| `https://deacero-2018--preprod2.sandbox.my.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8` | ✅ `Your request has been queued.` — Lead creado |

**El mensaje `Lead Capture Page: Not available` es engañoso.** Suena a que falta
generar el formulario en Setup (y así lo decía este README), pero no es eso:
generarlo de nuevo no cambió nada. El error significa que **ese host ya no
resuelve la página de captura del org**. La solución es postear al My Domain.

Cómo obtener el host correcto de cualquier ambiente:

```
sf org display --target-org <alias>     # usar el valor de instanceUrl
```

Si algún día vuelve a fallar en silencio, el camino de diagnóstico es el mismo:
mandar el POST con `debug=1` y `debugEmail=` y leer el `Reason:` que regresa.

---

Two real gotchas were found and fixed along the way:

1. ~~**Sandboxes must POST to `https://test.salesforce.com/...`**~~ — **OBSOLETO,
   ver la nota de 2026-09-10 más abajo.** Ningún host genérico de Salesforce
   funciona ya; hay que postear al My Domain del org. Lo que sigue siendo cierto
   es la parte importante: **usar el host equivocado no da error, simplemente
   nunca crea el Lead.**
2. **Accented values (like `país=México`) must reach Salesforce as real UTF-8
   bytes** or the address-resolution Flow silently fails to match *both*
   State and Country (not just the corrupted field) — our page's
   `<meta charset="utf-8">` guarantees this for real browser submissions;
   this only bit us during manual `curl` testing with a misconfigured shell
   locale.

Also: `Enable Web-to-Lead` alone (the org-wide checkbox) is not sufficient —
Salesforce also needs at least one Web-to-Lead form actually generated once
via Setup ("Lead Capture Page: Not available" is the error if none exists
yet, sent back via `debug=1`/`debugEmail=...` hidden fields — the official
way to diagnose a silent Web-to-Lead failure).

### Per-environment values currently baked into `index.html`

These are all **vscodeOrg (dev sandbox)** values — replace before promoting
to UAT/PROD:

| Hidden field | Current value | Meaning |
|---|---|---|
| form `action` | `https://deacero-2018--preprod2.sandbox.my.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8` | **My Domain del org**, no un host genérico. Por ambiente: PROD es `https://deacero-2018.my.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8`. Sácalo con `sf org display --target-org <alias>` (campo `instanceUrl`) |
| `oid` | `00Dcb00000EycJY` | vscodeOrg's real Web-to-Lead Organization Id (15-char) |
| `Campaign_ID` | `701cb000012Q8oRAAS` | Campaign "Sistemas Constructivos - Landing Generica", created in vscodeOrg |
| `member_status` | `Responded` | Valid CampaignMemberStatus on that Campaign |
| `00NRp000000ewDQ` | → `PI2_Tipo_de_formulario__c` | |
| `00NRp000000ewDR` | → `PI2_Producto_de_interes__c` | |
| `00NRp000000ewDS` | → `PI2_Proyecto__c` | |
| `00NRp000000ewDP` | → `PI2_Cuentanos_tu_Proyecto__c` | |

To move to UAT/PROD: generate a Web-to-Lead form once in that org's Setup
(Setup > Web-to-Lead > Create Web-to-Lead Form, selecting the same fields —
see the ticket #25 notes in `tracker_solicitudes.csv` for the exact list) to
get that org's own `action=` URL and `00N` ids (they differ per org),
create/confirm the target Campaign there, and set the real `oid`. Then repeat
the same kind of test (optionally with `debug=1`/`debugEmail=` hidden fields)
before trusting it with real traffic.

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
