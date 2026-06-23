const menu = [
  { nombre: 'Bruschetta Clásica', descripcion: 'Pan tostado con tomate y albahaca fresca', precio: 4500, categoria: 'Entrada' },
  { nombre: 'Tabla de Quesos', descripcion: 'Selección de quesos importados con mermelada', precio: 7800, categoria: 'Entrada' },
  { nombre: 'Lomo al Vino Tinto', descripcion: 'Lomo de res en reducción de vino tinto', precio: 15500, categoria: 'Plato Fuerte' },
  { nombre: 'Pasta Carbonara', descripcion: 'Pasta con tocino, huevo y queso parmesano', precio: 10200, categoria: 'Plato Fuerte' },
  { nombre: 'Salmón a la Plancha', descripcion: 'Filete de salmón con vegetales al vapor', precio: 13800, categoria: 'Plato Fuerte' },
  { nombre: 'Tiramisú', descripcion: 'Postre italiano con café y mascarpone', precio: 5200, categoria: 'Postre' },
  { nombre: 'Cheesecake de Maracuyá', descripcion: 'Cheesecake cremoso con coulis de maracuyá', precio: 4800, categoria: 'Postre' },
];

const reservas = [];
//
// ─── Devuelve la fecha de HOY en "YYYY-MM-DD" (hora local) ───
function fechaHoyLocal() {
  const h = new Date();
  const anio = h.getFullYear();
  const mes = String(h.getMonth() + 1).padStart(2, '0');
  const dia = String(h.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

// ─── Escribe (o borra) el mensaje de error de un campo ───
function mostrarError(idSpan, mensaje) {
  document.getElementById(idSpan).textContent = mensaje;
}
function formatearPrecio(precio) {
  return '₡' + precio.toLocaleString('es-CR');
}

function renderMenu(lista = menu) {
  const contenedor = document.getElementById('contenedor-menu');
  contenedor.innerHTML = '';

  lista.forEach(plato => {
    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6 col-lg-4';

    const card = document.createElement('div');
    card.className = 'card-plato';

    const titulo = document.createElement('h3');
    titulo.textContent = plato.nombre;

    const desc = document.createElement('p');
    desc.className = 'descripcion';
    desc.textContent = plato.descripcion;

    const precio = document.createElement('span');
    precio.className = 'precio';
    precio.textContent = formatearPrecio(plato.precio);

    const etiqueta = document.createElement('span');
    etiqueta.className = 'etiqueta-categoria';
    etiqueta.textContent = plato.categoria;

    card.append(titulo, desc, precio, etiqueta);
    col.appendChild(card);
    contenedor.appendChild(col);
  });
}


function filtrarCategoria(categoria) {
  if (categoria === 'Todos') {
    renderMenu(menu);
  } else {
    const filtrados = menu.filter(plato => plato.categoria === categoria);
    renderMenu(filtrados);
  }
}

function validarFormulario() {
  let valido = true;
  const nombre = document.getElementById('nombre').value.trim();
  const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  if (nombre === '') {
    mostrarError('error-nombre', 'El nombre es obligatorio.');
    valido = false;
  } else if (nombre.length < 5) {
    mostrarError('error-nombre', 'Mínimo 5 caracteres.');
    valido = false;
  } else if (!regexNombre.test(nombre)) {
    mostrarError('error-nombre', 'Solo letras y espacios.');
    valido = false;
  } else {
    mostrarError('error-nombre', ''); // válido → buzón vacío
  }

  const correo = document.getElementById('correo').value.trim();
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (correo === '') {
    mostrarError('error-correo', 'El correo es obligatorio.');
    valido = false;
  } else if (!regexCorreo.test(correo)) {
    mostrarError('error-correo', 'Formato de correo inválido.');
    valido = false;
  } else {
    mostrarError('error-correo', '');
  }

  const fecha = document.getElementById('fecha').value; // "YYYY-MM-DD"
  if (fecha === '') {
    mostrarError('error-fecha', 'La fecha es obligatoria.');
    valido = false;
  } else if (fecha < fechaHoyLocal()) {
    mostrarError('error-fecha', 'La fecha no puede ser pasada.');
    valido = false;
  } else {
    mostrarError('error-fecha', '');
  }

  const personasTexto = document.getElementById('personas').value;
  const personas = Number(personasTexto); // el value siempre es string → lo convertimos
  if (personasTexto === '') {
    mostrarError('error-personas', 'Indicá el número de personas.');
    valido = false;
  } else if (personas < 1 || personas > 20) {
    mostrarError('error-personas', 'Debe ser entre 1 y 20.');
    valido = false;
  } else {
    mostrarError('error-personas', '');
  }

  return valido;
}
function actualizarBotonEnvio() {
  document.getElementById('btn-enviar').disabled = !validarFormulario();
}

function agregarReserva() {
  // Leemos los valores actuales del formulario y armamos un objeto
  const reserva = {
    nombre: document.getElementById('nombre').value.trim(), 
    correo: document.getElementById('correo').value.trim(),
    fecha: document.getElementById('fecha').value,
    hora: document.getElementById('hora').value,
    personas: Number(document.getElementById('personas').value),
    comentarios: document.getElementById('comentarios').value.trim()
  };
  reservas.push(reserva); // lo guardamos en el array (para el resumen)

  // Creamos la fila <tr> con la clase obligatoria
  const fila = document.createElement('tr');
  fila.className = 'fila-reserva';
  if (reserva.personas >= 6) {
    fila.classList.add('reserva-grande'); // resaltado para grupos de 6+
  }

  // Una celda <td> por cada dato. El array + forEach evita repetir 5 veces.
  // (comentarios NO se muestra en la tabla, por eso no está acá)
  [reserva.nombre, reserva.correo, reserva.fecha, reserva.hora, reserva.personas]
    .forEach(dato => {
      const celda = document.createElement('td');
      celda.textContent = dato;
      fila.appendChild(celda);
    });

  document.getElementById('cuerpo-tabla').appendChild(fila);
}

function actualizarResumen() {
  const resumen = document.getElementById('resumen');

  // Caso vacío (no debería pasar tras agregar, pero es buena práctica cubrirlo)
  if (reservas.length === 0) {
    resumen.innerHTML = '<p>Aún no hay reservas registradas.</p>';
    return;
  }
  const totalReservas = reservas.length;

  // reduce() recorre el array acumulando un resultado.
  // Acá sumamos las personas de todas las reservas (arranca en 0).
  const totalPersonas = reservas.reduce((suma, r) => suma + r.personas, 0);
  // reduce() también sirve para "quedarse con el mayor": comparamos de a dos
  // y vamos arrastrando el que tenga más personas.
  const mayor = reservas.reduce((max, r) => r.personas > max.personas ? r : max);

  resumen.innerHTML = `
    <h3>Resumen de reservas</h3>
    <p>Total de reservas: <strong>${totalReservas}</strong></p>
    <p>Total de personas esperadas: <strong>${totalPersonas}</strong></p>
    <p>Reserva más grande: <strong>${mayor.nombre}</strong> (${mayor.personas} personas)</p>
  `;
}

document.addEventListener('DOMContentLoaded', function () {
  renderMenu();

  const botones = document.querySelectorAll('.btn-filtro');
  botones.forEach(boton => {
    boton.addEventListener('click', function () {
      botones.forEach(b => b.classList.remove('activo'));
      this.classList.add('activo');

      filtrarCategoria(this.dataset.categoria);
    });
  });
  const form = document.getElementById('form-reserva');

  // Ponemos la fecha mínima en HOY (bloquea fechas pasadas en el calendario).
  // Es una ayuda visual; la validación REAL sigue en JS por si la editan a mano.
  document.getElementById('fecha').min = fechaHoyLocal();

  // Cada vez que cambie cualquier campo → revalidar y actualizar el botón
  form.addEventListener('input', actualizarBotonEnvio);

  // Al enviar
  form.addEventListener('submit', function (e) {
    e.preventDefault(); // sin recarga de página
    if (validarFormulario()) {
      agregarReserva();
      actualizarResumen();
      form.reset();
      document.getElementById('btn-enviar').disabled = true;
    }
  });

});



document.getElementById('form-reserva').addEventListener('submit', function (e) {
  e.preventDefault(); // Evitar recarga de página

});
