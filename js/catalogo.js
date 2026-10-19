/* ============================================================================
 * Catalogo de la landing (CSA-286)
 * ============================================================================
 * Una sola fuente para la seccion Proyectos y para el formulario.
 *
 * SEGMENTOS: el orden es el de las pestanas.
 *   proyecto -> valor EXACTO de PI2_Proyecto__c (picklist restringido de Lead).
 *   segmento -> valor EXACTO de SPG_Segmento__c (restringido) que leen las reglas
 *               de asignacion; '' = sin segmento, el prospecto cae con el dueno
 *               por defecto pero NO se pierde.
 *
 * PRODUCTOS:
 *   interes     -> valor EXACTO de PI2_Producto_de_interes__c (restringido).
 *   subproducto -> valor de SubProducto__c (abierto) que leen las reglas.
 *   Contenido tomado de la ficha tecnica PDF de cada producto
 *   (ProyectoSalesforce/Proyectos/<segmento>/<producto>/*.pdf).
 *
 * Valores agregados en PROD el 2026-10-16 (CSA-286, deploy 0AfRp000001tVDtKAM,
 * solo RT Prospectos_Mex): PI2_Proyecto__c Prefabricados y Vialidades y Energía;
 * PI2_Producto_de_interes__c Varilla Grado 42, Malla Triple Nudo y Malla Nudo Fijo;
 * Unidad_De_Venta__c Kg. Antes de agregar un producto o proyecto aqui, el valor
 * debe existir en PROD: si no, Web-to-Lead descarta el prospecto sin avisar.
 * subproducto y segmento deben ser IGUALES (texto exacto) a los valores de los criterios
 * de las reglas SPG (Rule_Criterion__c de SubProducto__c y SPG_Segmento__c); si no, ninguna
 * regla aplica y el prospecto se queda con Admin Ext. SubProducto__c es abierto y acepta
 * cualquier valor, por eso el error no se nota al enviar (corregido 2026-10-19).
 * "Vialidades y Energía" usa el segmento 'Vialidades': las reglas de Vialidades y de Energía
 * son identicas y van al mismo ejecutivo.
 * ========================================================================== */
var CATALOGO = {
  segmentos: [
    { id: 'edificacion',  nombre: 'Edificación',          proyecto: 'Edificación vertical', segmento: 'Edificación',
      productos: ['fibras', 'rejas', 'malla-ingenieria', 'varilla-habilitada'] },
    { id: 'parques',      nombre: 'Parques Industriales', proyecto: 'Parque industrial',    segmento: 'Parques Industriales',
      productos: ['fibras', 'rejas', 'malla-ingenieria', 'varilla-habilitada'] },
    { id: 'prefabricados', nombre: 'Prefabricados',       proyecto: 'Prefabricados',        segmento: 'Prefabricados',
      productos: ['alambre-presfuerzo', 'toron-presfuerzo', 'malla-ingenieria', 'varilla-g42', 'varilla-6000'] },
    { id: 'infraestructura', nombre: 'Infraestructura',   proyecto: 'Infraestructura',      segmento: 'Infraestructura',
      productos: ['armadura', 'malla-ciclonica', 'malla-ingenieria', 'malla-nudo-fijo', 'malla-triple-nudo', 'rejas', 'varilla-6000', 'varilla-g42', 'varilla-habilitada'] },
    { id: 'erosion',      nombre: 'Control de Erosión',   proyecto: 'Control de erosión',   segmento: 'Control de Erosión',
      productos: ['gavion'] },
    { id: 'vialidades',   nombre: 'Vialidades y Energía', proyecto: 'Vialidades y Energía', segmento: 'Vialidades',
      productos: ['fibras', 'malla-ingenieria', 'redondo-carretero', 'varilla-habilitada'] },
    { id: 'mineria',      nombre: 'Minería',              proyecto: 'Minería',              segmento: 'Minería',
      productos: ['fibras', 'malla-ingenieria', 'malla-minera', 'varilla-habilitada'] }
  ],

  productos: {
    'fibras': {
      nombre: 'Fibras DEACERO®', interes: 'Fibras Deacero', subproducto: 'Fibras DEACERO',
      descripcion: 'Filamentos de acero de alta resistencia con ganchos en sus extremos, fabricados con alambre de bajo carbono estirado en frío, con acabado pulido y brillante. Se utilizan como acero de refuerzo en estructuras de concreto.',
      caracteristicas: ['Acero bajo carbono con acabado pulido y brillante.', 'Recta con ganchos en los extremos (hook end).'],
      usos: ['Pisos industriales y pavimentos.', 'Concreto lanzado (shotcrete).', 'En minas, taludes y edificaciones.', 'Elementos prefabricados.'],
      ventajas: ['Disminuye el riesgo de fisuración.', 'Alarga la vida útil de la obra.', 'Asegura un refuerzo homogéneo y tridimensional en la matriz.', 'Mayor resistencia a la flexión y tracción cortante.', 'Mayor resistencia al impacto y a la fatiga.', 'Sustituye armados tradicionales, como mallas electrosoldadas.', 'Presentan menor deformación.']
    },
    'rejas': {
      nombre: 'Rejas DEACERO®', interes: 'Reja DEACERO', subproducto: 'Rejas Deacero',
      descripcion: 'Desarrolladas con una tecnología que combina estética, funcionalidad y resistencia para entregar productos de calidad que brindan seguridad y confianza, con el mejor sistema de rejas disponible en México para un entorno sustentable.',
      caracteristicas: ['Sistema compuesto por paneles, postes, abrazaderas, grapas y accesorios especiales.', 'Colores en inventario: verde, blanco, negro, café y gris.', 'Colores bajo pedido: amarillo, rojo y azul.'],
      usos: [], ventajas: [],
      galeria: [
        { img: 'reja-clasica', nombre: 'Reja DEACERO® Clásica' },
        { img: 'reja-contemporanea', nombre: 'Reja DEACERO® Contemporánea' },
        { img: 'reja-florencia', nombre: 'Reja DEACERO® Florencia' },
        { img: 'reja-forte', nombre: 'Reja DEACERO® Forte' },
        { img: 'reja-milan', nombre: 'Reja DEACERO® Milán' },
        { img: 'reja-versa', nombre: 'Reja DEACERO® Versa' }
      ]
    },
    'malla-ingenieria': {
      nombre: 'Malla de Ingeniería', interes: 'Malla Ingenieria', subproducto: 'Malla de Ingeniería',
      descripcion: 'Armado prefabricado electrosoldado con varillas corrugadas laminadas en frío grado 50 y 60.',
      caracteristicas: ['Intersecciones soldadas por resistencia eléctrica (electrosoldado).', 'Presentación en hojas que se diseñan y fabrican de acuerdo con cada proyecto: diámetro y separación de alambres, largo y ancho de la hoja.'],
      usos: ['Refuerzo de concreto: pisos, calles, losas, cimentaciones, muros prefabricados, etc.', 'Canales pluviales.', 'Túneles.', 'Minería.', 'Tuberías de concreto.'],
      ventajas: ['Ahorro en costos de material y mano de obra.', 'Sin desperdicio: las hojas se fabrican de acuerdo con las dimensiones de cada proyecto.', 'Acelera hasta 4 veces el proceso constructivo por la rapidez de colocación (traslape).']
    },
    'varilla-habilitada': {
      nombre: 'Varilla Habilitada', interes: 'Varilla Habilitada', subproducto: 'Varilla Habilitada',
      descripcion: 'Varilla corrugada habilitada mediante proceso industrializado para refuerzo de concreto.',
      caracteristicas: ['Varilla corrugada laminada en caliente de Grado 42 bajo la norma NMX-B-506-2019 Canacero, equivalente a Grado 60 ASTM A615-2022.', 'Cortada a la medida.', 'Suministrada en tramos rectos o doblada, con dobleces según ACI 318-19.', 'Cumple los requisitos de ganchos estándar, sísmicos y suplementarios del Reglamento ACI 318-19 y de las Normas Técnicas Complementarias de la CDMX 2017.'],
      usos: ['Refuerzo de concreto para zapatas, pilotes, pilas, pisos, columnas, trabes, losas, muros, castillos y cerramientos.', 'Prefabricados, túneles, pavimentos, puentes y canales.'],
      ventajas: ['Elimina todos los trabajos de corte y habilitado en obra.', 'Reducción de tiempo y costos de colocación en obra.', 'Uniformidad en las dimensiones de todas las piezas de un elemento.', 'Reducción de desperdicios de material en obra.', 'Mayor trazabilidad de materia prima.']
    },
    'alambre-presfuerzo': {
      nombre: 'Alambre de Presfuerzo', interes: 'Alambre Presfuerzo', subproducto: 'Alambre Presfuerzo',
      descripcion: 'Alambre de acero de alto carbono sometido a un proceso térmico relevado de esfuerzos y baja relajación, con las propiedades adecuadas para la fabricación de viguetas.',
      caracteristicas: ['Diámetro del rollo de 2 m aproximadamente.', 'Acabado liso o grafilado.', 'Resistencia a la tensión de 166 kg/mm².', 'Norma de fabricación: ASTM A-881, ASTM A421 y NMX B-293.'],
      usos: ['Fabricación de viguetas pretensadas.', 'Fabricación de placas alveolares.', 'Fabricación de prelosas.', 'Poste ganadero y durmientes.'],
      ventajas: ['Elimina el uso de cimbras de contacto.', 'Se pueden cubrir claros más grandes.', 'Reduce el volumen de concreto en obra.']
    },
    'toron-presfuerzo': {
      nombre: 'Torón de Presfuerzo', interes: 'Torón de presfuerzo', subproducto: 'Torón de Presfuerzo',
      descripcion: 'Fabricado con alambres de acero entorchados entre sí, permite construir estructuras con dimensiones superiores a las hechas con acero de refuerzo tradicional.',
      caracteristicas: ['Trenzado de 6 alambres sobre un alambre central.', 'Post-formación que asegura la unión entre alambres.', 'Sometido a tratamiento térmico.', 'Presentación desnudo o plastificado, en bobinas de aproximadamente 2,500 kg.'],
      usos: ['Pretensado de elementos de concreto de gran peralte.', 'Anclajes en taludes.', 'Postensado de pisos.', 'Losas.', 'Elementos de concreto como columnas.'],
      ventajas: ['Mayor eficiencia en el uso del acero.', 'Estructuras más esbeltas y ligeras.', 'Ahorro en construcción y mantenimiento de juntas en pisos.']
    },
    'varilla-g42': {
      nombre: 'Varilla Grado 42', interes: 'Varilla Grado 42', subproducto: 'Varilla Grado 42',
      descripcion: 'Varilla corrugada DA-42 para refuerzo de concreto.',
      caracteristicas: ['Varilla corrugada laminada en caliente de Grado 42.', 'Corruga en forma de "W".', 'Medidas de 3/8" a 1 1/2".', 'Norma de fabricación: NMX-B-506-CANACERO-2019 (ASTM A615/A615M-18).'],
      usos: ['Refuerzo de zapatas, pilotes, pilas, pisos, columnas, trabes, losas, muros, castillos y cerramientos.'],
      ventajas: ['Cuenta con Declaración Ambiental de Producto (EPD).', 'Versatilidad para ajustes en obra.', 'Disponibilidad de producto inmediata.']
    },
    'varilla-6000': {
      nombre: 'Varilla 6000', interes: 'Varilla 6000', subproducto: 'Varilla 6000',
      descripcion: 'Varilla corrugada DA 6000 para refuerzo de concreto.',
      caracteristicas: ['Varilla laminada y corrugada en frío para refuerzo de concreto.', 'Corrugado espina de pescado.', 'Acabado pulido.', 'Norma de fabricación: NMX-B-072-CANACERO-2017.'],
      usos: ['Anillos o estribos.', 'Dalas y castillos.', 'Losas sólidas y aligeradas.'],
      ventajas: ['Alto esfuerzo de fluencia de 6,000 kg/cm² (Grado 60).', 'Disminución de costos en presupuesto.', 'Alta ductilidad.']
    },
    'armadura': {
      nombre: 'Armadura', interes: 'Armadura', subproducto: 'Armadura',
      descripcion: 'Estructura triangular formada por 3 varillas corrugadas unidas al soldar un estribo de alambre liso en forma de zigzag cada 20 cm.',
      caracteristicas: ['Varillas Grado 60 y Grado 50, abertura de 8 cm y separación cada 20 cm.', 'En cumplimiento de las normas NMX-B-253, NMX-B-72 y NMX-B-455.'],
      usos: ['Fabricación de viguetas de concreto para el sistema de vigueta y bovedilla en la construcción de losas.'],
      ventajas: ['Ahorro de hasta 85% en la cimbra total de losas.', 'Ahorro en mano de obra para habilitado de acero de refuerzo.', 'Ahorro en tiempo de ejecución de la losa.']
    },
    'malla-triple-nudo': {
      nombre: 'Malla Triple Nudo', interes: 'Malla Triple Nudo', subproducto: 'Malla Triple Nudo',
      descripcion: 'Malla hecha con alambres galvanizados de mayor resistencia y durabilidad que cualquier otro cerco perimetral, con entorches en nudo triple y tensión independiente en cada alambre horizontal.',
      caracteristicas: ['Alambres de alta resistencia a la tensión.', 'Cuadros uniformes.', 'Curva de tensión que absorbe los impactos.', 'Recubrimiento galvanizado (100 h en cámara salina).'],
      usos: ['Bodegas.', 'Parques industriales.', 'Aeropuertos.', 'Instalaciones mayores a 100 m.'],
      ventajas: ['En instalaciones mayores a 50 m optimiza costos de material frente a la ciclónica.', 'No se deforma.', 'Difícil de cortar.', 'Más resistente y segura.']
    },
    'malla-nudo-fijo': {
      nombre: 'Malla Nudo Fijo', interes: 'Malla Nudo Fijo', subproducto: 'Malla Nudo Fijo',
      descripcion: 'Malla con nudo independiente que no se corre e impide que se abran los alambres, y cuadros rectangulares que dan estructura al cerco. Más resistente a impactos de objetos grandes. Versión urbana de 2.0 m de altura.',
      caracteristicas: ['Alambres bajo carbono (BC) con recubrimiento clase I.', 'Alambres alta resistencia (AR) con recubrimiento clase comercial.'],
      usos: ['Perímetros de áreas urbanas e industriales.', 'Perímetros de áreas rurales, huertos e invernaderos.', 'Escuelas y cercos interiores.'],
      ventajas: ['Ahorro en accesorios: permite 4.5 m entre postes en bajo carbono y 8.25 m en alta resistencia, frente a la malla ciclónica.', 'Delimitación casi imperceptible al instalarse.', 'Previene heridas en la piel al no tener filos en los extremos del nudo.', 'Bajo costo de mantenimiento por ruptura y oxidación.']
    },
    'malla-ciclonica': {
      nombre: 'Malla Ciclónica', interes: 'Malla Ciclonica', subproducto: 'Malla Ciclonica',
      descripcion: 'Malla metálica galvanizada fabricada con alambre de acero de clase comercial, tejida helicoidalmente formando rombos.',
      caracteristicas: ['Tejido simétrico y continuo que garantiza aberturas reales.', 'Galvanizado por inmersión que garantiza un recubrimiento uniforme.', 'Norma de fabricación: ASTM A-392-11, A-641-14 y NMX-B-013-CANACERO-2016.'],
      usos: ['Residencial, parques y áreas de juego.', 'Escuelas y universidades.', 'Delimitación industrial.', 'Terrenos.'],
      ventajas: ['Calibres y aberturas precisas.', 'Rollo fácil de maniobrar.', 'Fabricada con alambres de primera calidad.']
    },
    'gavion': {
      nombre: 'Gavión', interes: 'Gaviones', subproducto: 'Gavión Galvanizado',
      descripcion: 'Cajas de malla metálica de triple torsión con escuadría de 8x10 cm, fabricadas con alambre de acero bajo carbono calibre 12 y galvanizadas con recubrimiento XTREME®. Dan estabilidad al terreno y normalmente se rellenan de piedras.',
      caracteristicas: ['Alambres triple torsión.', 'Acero bajo carbono 1006 - 1008.', 'Galvanizado XTREME®.', 'Diferentes medidas de caja.'],
      usos: ['Muros de contención.', 'Muros de contención anclados.', 'Muros alcancía.', 'Canalizaciones.', 'Presas filtrantes.', 'Protecciones costeras.'],
      ventajas: ['Adaptable a diversos suelos y climas.', 'Preservación de áreas dañadas por la erosión.', 'Estabilidad estructural y flexible monolítica.']
    },
    'redondo-carretero': {
      nombre: 'Redondo Carretero', interes: 'Redondo Carretero', subproducto: 'Redondo Carretero',
      descripcion: 'Barra de acero redonda y lisa que se fabrica en distintos diámetros para múltiples usos en la construcción y la industria.',
      caracteristicas: ['Barras de acero redondo liso y acabado pulido, laminado en caliente de Grado 42.', 'Diámetros de 1", 1 1/4" y 1 1/2".', 'Disponible en habilitado y comercial.'],
      usos: ['Pasajuntas de losas de pavimentos de concreto hidráulico.', 'Fabricación de canastillas-pasajuntas.'],
      ventajas: ['Uniformidad en las propiedades del acero.', 'Cumplimiento de las normas mexicanas y especificaciones SCT.', 'Corte preciso de los extremos, sin rebaba, que permite el movimiento longitudinal de la barra.']
    },
    'malla-minera': {
      nombre: 'Malla Minera', interes: 'Malla Minera', subproducto: 'Malla Minera',
      descripcion: 'Armado prefabricado con alambres lisos o corrugados laminados en frío, Grado 50.',
      caracteristicas: ['Alambres unidos entre sí mediante electrosoldadura por fusión.', 'Sin puntas en todo el perímetro.', 'Presentación en hojas, acabado negro o galvanizado.', 'Alambres lisos o corrugados, separaciones de 4" x 4".'],
      usos: ['Sistemas de fortificación para obras de minería subterránea, para proteger a los trabajadores al contener caídos de roca.'],
      ventajas: ['La resistencia de la soldadura al esfuerzo cortante supera los requisitos de las normas NMX-B-290 y ASTM A-1064 para uso minero.']
    }
  }
};
