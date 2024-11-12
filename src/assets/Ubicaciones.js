export const ubicaciones = [
  { value: "almacen", label: "Almacén" },
  { value: "comedor", label: "Comedor" },
  { value: "cocineta", label: "Cocineta" },
  { value: "enfermeria", label: "Enfermería" },
  { value: "instalaciones", label: "Instalaciones" },
  { value: "oficinas", label: "Oficinas" },
  { value: "produccion", label: "Producción" },
  { value: "recepcion", label: "Recepción" },
  { value: "sanitario", label: "Sanitario" },
  { value: "taller-mantenimiento", label: "Taller de Mantenimiento" },
];

export const tipoActivo = [
  { value: "edificios", label: "Edificios" },
  { value: "equipo-computo", label: "Equipo de Computo" },
  { value: "equipo-medico", label: "Equipo Médico" },
  { value: "equipo-oficina", label: "Equipo de Oficina" },
  { value: "herramientas", label: "Herramientas" },
  { value: "instalaciones", label: "Instalaciones" },
  { value: "maquinaria-industrial", label: "Maquinaria y Equipo Industrial" },
  { value: "mobiliario", label: "Mobiliario" },
  { value: "obras-infraestructura", label: "Obras de Infraestructura" },
  { value: "transporte", label: "Transporte" },
];

export const produccion = [
  { value: "aduana", label: "Aduana" },
  { value: "envasado", label: "Envasado" },
  { value: "envasado-barras", label: "Envasado Barras" },
  { value: "Formado de barras", label: "Formado Barras" },
  { value: "hornos", label: "Hornos" },
  { value: "mezclado", label: "Mezclado" },
  { value: "lavado", label: "Lavado" },
];

export const almacen = [
  { value: "materia-prima", label: "Materia Prima" },
  { value: "producto-terminado", label: "Producto Terminado" },
  { value: "laboratorio", label: "Laboratorio" },
];

export const baños = [
  { value: "oficinas", label: "Oficinas" },
  { value: "produccion", label: "Producción" },
];

export const oficinas = [
  { value: "administracion", label: "Administración" },
  { value: "operaciones", label: "Operaciones" },
  { value: "comercial", label: "Comercial" },
];

//Mapeo de variables para mostrar en frontend
export const tipoMap = {
  edificios: "Edificios",
  "equipo-computo": "Equipo de Cómputo",
  "equipo-medico": "Equipo Médico",
  "equipo-oficina": "Equipo de Oficina",
  herramientas: "Herramientas",
  instalaciones: "Instalaciones",
  "maquinaria-industrial": "Maquinaria y Equipo Industrial",
  mobiliario: "Mobiliario",
  "obras-infraestructura": "Obras de Infraestructura",
  transporte: "Transporte",
};

export const ubicacionesMap = {
  almacen: "Almacén",
  comedor: "Comedor",
  cocineta: "Cocineta",
  "cuarto-hidro": "Cuarto Hidroneumático",
  enfermeria: "Enfermería",
  instalaciones: "Instalaciones",
  oficinas: "Oficinas",
  produccion: "Producción",
  recepcion: "Recepción",
  sanitario: "Sanitario",
  "taller-mantenimiento": "Taller de Mantenimiento",
};

export const produccionMap = {
  aduana: "Aduana",
  envasado: "Envasado",
  "envasado-barras": "Envasado Barras",
  "formado de barras": "Formado Barras",
  hornos: "Hornos",
  mezclado: "Mezclado",
  lavado: "Lavado",
};

export const almacenMap = {
  "materia-prima": "Materia Prima",
  "producto-terminado": "Producto Terminado",
  laboratorio: "Laboratorio",
};

export const sanitariosMap = {
  oficinas: "Oficinas",
  produccion: "Producción",
};

export const oficinasMap = {
  administracion: "Administración",
  operaciones: "Operaciones",
  comercial: "Comercial",
};
