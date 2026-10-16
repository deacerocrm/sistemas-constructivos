/* ============================================================================
 * Seccion Proyectos + formulario (CSA-286)
 * ============================================================================
 * Pinta pestanas, menu y ficha a partir de CATALOGO (catalogo.js), filtra la
 * Categoria del formulario segun el Proyecto elegido y llena los espejos ocultos
 * del ruteo SPG (segmento y subproducto). Sin dependencias externas.
 * ========================================================================== */
(function () {
  var segmentos = CATALOGO.segmentos;
  var productos = CATALOGO.productos;

  var tabs      = document.getElementById('tabs-segmentos');
  var menu      = document.getElementById('menu-productos');
  var ficha     = document.getElementById('producto');
  var form      = document.getElementById('deacero-lead-form');
  var proyecto  = document.getElementById('proyecto');
  var categoria = document.getElementById('categoria');
  var segHidden = document.getElementById('spg_segmento_hidden');
  var subHidden = document.getElementById('spg_subproducto_hidden');

  var actual = { segmento: segmentos[0].id, producto: segmentos[0].productos[0] };

  function porId(id) {
    for (var i = 0; i < segmentos.length; i++) {
      if (segmentos[i].id === id) { return segmentos[i]; }
    }
    return null;
  }

  function porProyecto(valor) {
    for (var i = 0; i < segmentos.length; i++) {
      if (segmentos[i].proyecto === valor) { return segmentos[i]; }
    }
    return null;
  }

  function el(tag, clase, texto) {
    var n = document.createElement(tag);
    if (clase) { n.className = clase; }
    if (texto) { n.textContent = texto; }
    return n;
  }

  /* ---------------------------------------------------------------- Seccion */

  function pintarTabs() {
    segmentos.forEach(function (s) {
      var b = el('button', 'tab', s.nombre);
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.id = 'tab-' + s.id;
      b.setAttribute('aria-controls', 'producto');
      b.addEventListener('click', function () {
        seleccionar(s.id, s.productos[0]);
      });
      tabs.appendChild(b);
    });
  }

  /* Reinicia una animacion CSS aunque la clase ya estuviera puesta. */
  function animar(nodo, clase) {
    nodo.classList.remove(clase);
    void nodo.offsetWidth;
    nodo.classList.add(clase);
  }

  function pintarMenu(seg) {
    menu.innerHTML = '';
    seg.productos.forEach(function (key, i) {
      var b = el('button', 'producto-link', productos[key].nombre.replace('®', ''));
      b.style.animationDelay = (i * 45) + 'ms';
      b.type = 'button';
      b.setAttribute('aria-pressed', key === actual.producto ? 'true' : 'false');
      b.addEventListener('click', function () {
        seleccionar(seg.id, key);
      });
      menu.appendChild(b);
    });
  }

  function lista(titulo, items) {
    var frag = document.createDocumentFragment();
    if (!items || !items.length) { return frag; }
    frag.appendChild(el('h4', null, titulo));
    var ul = el('ul');
    items.forEach(function (t) { ul.appendChild(el('li', null, t)); });
    frag.appendChild(ul);
    return frag;
  }

  function galeria(p) {
    var cont = el('div', 'galeria');
    var fig = el('figure');
    var img = el('img');
    img.width = 900; img.height = 900;
    var cap = el('figcaption');
    fig.appendChild(img);
    fig.appendChild(cap);
    var i = 0;
    function mostrar(n) {
      i = (n + p.galeria.length) % p.galeria.length;
      animar(img, 'img-entrando');
      img.src = 'images/productos/' + p.galeria[i].img + '.jpg';
      img.alt = p.galeria[i].nombre;
      cap.textContent = p.galeria[i].nombre + ' (' + (i + 1) + ' de ' + p.galeria.length + ')';
    }
    var prev = el('button', 'galeria-btn galeria-prev', '‹');
    prev.type = 'button';
    prev.setAttribute('aria-label', 'Modelo anterior');
    prev.addEventListener('click', function () { mostrar(i - 1); });
    var next = el('button', 'galeria-btn galeria-next', '›');
    next.type = 'button';
    next.setAttribute('aria-label', 'Modelo siguiente');
    next.addEventListener('click', function () { mostrar(i + 1); });
    cont.appendChild(fig);
    cont.appendChild(prev);
    cont.appendChild(next);
    mostrar(0);
    return cont;
  }

  function pintarFicha(seg, key) {
    var p = productos[key];
    ficha.innerHTML = '';
    var texto = el('div', 'producto-texto');
    texto.appendChild(el('h3', null, p.nombre));
    texto.appendChild(el('p', 'producto-desc', p.descripcion));
    texto.appendChild(lista('Características', p.caracteristicas));
    texto.appendChild(lista('Usos', p.usos));
    texto.appendChild(lista('Ventajas', p.ventajas));
    var cta = el('button', 'btn-cotizar', 'Cotizar este producto');
    cta.type = 'button';
    cta.addEventListener('click', function () { cotizar(seg, key); });
    texto.appendChild(cta);

    var media = el('div', 'producto-media');
    if (p.galeria) {
      media.appendChild(galeria(p));
    } else {
      var img = el('img');
      img.src = 'images/productos/' + key + '.jpg';
      img.alt = p.nombre;
      img.width = 900; img.height = 900;
      img.loading = 'lazy';
      media.appendChild(img);
    }
    ficha.appendChild(texto);
    ficha.appendChild(media);
    ficha.setAttribute('aria-labelledby', 'tab-' + seg.id);
    animar(ficha, 'entrando');
  }

  function seleccionar(segId, key) {
    var seg = porId(segId);
    if (!seg) { return; }
    if (segId !== actual.segmento) { animar(menu, 'menu-entrando'); }
    actual.segmento = segId;
    actual.producto = key;
    Array.prototype.forEach.call(tabs.children, function (b) {
      var activo = b.id === 'tab-' + segId;
      b.setAttribute('aria-selected', activo ? 'true' : 'false');
      b.classList.toggle('activo', activo);
    });
    pintarMenu(seg);
    pintarFicha(seg, key);
  }

  /* -------------------------------------------------------------- Formulario */

  function pintarProyectos() {
    segmentos.forEach(function (s) {
      var o = el('option', null, s.nombre);
      o.value = s.proyecto;
      proyecto.appendChild(o);
    });
  }

  function pintarCategorias() {
    var seg = porProyecto(proyecto.value);
    var previa = categoria.value;
    categoria.innerHTML = '';
    if (!seg) {
      categoria.appendChild(new Option('Primero elige el proyecto', ''));
      categoria.disabled = true;
      return;
    }
    categoria.appendChild(new Option('Selecciona una opción', ''));
    seg.productos.forEach(function (key) {
      var p = productos[key];
      categoria.appendChild(new Option(p.nombre, p.interes));
    });
    categoria.disabled = false;
    animar(categoria, 'campo-resaltado');
    // Conserva el producto si existe en el nuevo segmento.
    categoria.value = previa;
    if (categoria.value !== previa) { categoria.value = ''; }
  }

  function productoPorInteres(valor) {
    for (var k in productos) {
      if (Object.prototype.hasOwnProperty.call(productos, k) && productos[k].interes === valor) {
        return productos[k];
      }
    }
    return null;
  }

  /* Espejos del ruteo SPG: las reglas leen SPG_Segmento__c y SubProducto__c. */
  function sincronizar() {
    var seg = porProyecto(proyecto.value);
    var p = productoPorInteres(categoria.value);
    segHidden.value = seg ? seg.segmento : '';
    subHidden.value = p ? p.subproducto : '';
  }

  function cotizar(seg, key) {
    proyecto.value = seg.proyecto;
    pintarCategorias();
    categoria.value = productos[key].interes;
    sincronizar();
    // Destella los dos campos que se llenaron solos para que el visitante lo note.
    animar(proyecto, 'campo-autollenado');
    animar(categoria, 'campo-autollenado');
    document.getElementById('contacto').scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(function () { document.getElementById('firstname').focus({ preventScroll: true }); }, 450);
  }

  if (!tabs || !menu || !ficha || !form || !proyecto || !categoria || !segHidden || !subHidden) {
    return;
  }

  pintarTabs();
  pintarProyectos();
  seleccionar(actual.segmento, actual.producto);

  proyecto.addEventListener('change', function () { pintarCategorias(); sincronizar(); });
  categoria.addEventListener('change', sincronizar);
  // Tambien al enviar, por si el navegador restauro valores sin disparar change.
  form.addEventListener('submit', sincronizar);
  pintarCategorias();
  sincronizar();
})();
