let juegoPausado = false;
let animacionID;
let juegoTerminado = false;
const estadoJuegoEl = document.getElementById('estado-juego');


const juego = document.getElementById('juego');
const jugador = document.getElementById('jugador');
const puntajeEl = document.getElementById('puntaje');
const vidasEl = document.getElementById('vidas');
let balas = [];
let enemigos = [];
let puntaje = 0;
let vidas = 5;

document.addEventListener('keydown', (e) => {
  if (e.key === 'p' || e.key === 'P') {
    togglePausa();
    return;
  }

  if (juegoTerminado && e.key === ' ') {
    reiniciarJuego();
    return;
  }

  if (juegoPausado) return;

  const paso = 45;
  const jugador = document.querySelector('.jugador');
  const left = parseInt(window.getComputedStyle(jugador).left);
  const juegoWidth = juego.clientWidth;

  if (e.key === 'ArrowLeft' && left > jugador.offsetWidth - 10) {
    jugador.style.left = `${left - paso}px`;
  } else if (e.key === 'ArrowRight' && left < juegoWidth - jugador.offsetWidth - 10) {
    jugador.style.left = `${left + paso}px`;
  } else if (e.key === ' ') {
    disparar();
  }
});


function disparar() {
  const bala = document.createElement('div');
  bala.classList.add('bala');
  bala.style.left = `${jugador.offsetLeft + 0}px`;
  bala.style.top = `${jugador.offsetTop}px`;
  juego.appendChild(bala);
  balas.push(bala);
}
 
function crearEnemigosSegunPuntaje() {
  if (juegoPausado) return;

  const cantidad = 1 + Math.floor(puntaje / 3);

  for (let i = 0; i < cantidad; i++) {
    const enemigo = document.createElement('div');
    enemigo.classList.add('enemigo');
    enemigo.style.left = `${Math.random() * (juego.clientWidth - 40)}px`;
    enemigo.style.top = '0px';
    juego.appendChild(enemigo);
    enemigos.push(enemigo);
  }
}

let enemigoIntervaloID = setInterval(crearEnemigosSegunPuntaje, 2000);



function actualizar() {
  if (juegoTerminado) return;

  balas.forEach((bala, i) => {
    const top = parseInt(bala.style.top);
    if (top < 0) {
      bala.remove();
      balas.splice(i, 1);
    } else {
      bala.style.top = `${top - 10}px`;
    }
  });

  enemigos.forEach((enemigo, i) => {
    const top = parseInt(enemigo.style.top);
    if (top > window.innerHeight) {
      enemigo.remove();
      enemigos.splice(i, 1);
      vidas--;
      actualizarInfo();

      if (vidas <= 0) {
        juegoTerminado = true;
        limpiarJuego();
        mostrarEstado("Game Over");
        togglePausa();
        return;
      }
    } else {
      enemigo.style.top = `${top + 2}px`;
    }

    balas.forEach((bala, j) => {
      const br = bala.getBoundingClientRect();
      const er = enemigo.getBoundingClientRect();
      if (
        br.left < er.right &&
        br.right > er.left &&
        br.top < er.bottom &&
        br.bottom > er.top
      ) {
        bala.remove();
        enemigo.remove();
        balas.splice(j, 1);
        enemigos.splice(i, 1);
        puntaje++;
        actualizarInfo();
      }
    });
  });

  if (!juegoPausado) {
    animacionID = requestAnimationFrame(actualizar);
  }
}

 
function togglePausa() {
  if (juegoTerminado) return; // No se puede pausar si ya terminó

  juegoPausado = !juegoPausado;

  if (juegoPausado) {
    cancelAnimationFrame(animacionID);
    mostrarEstado("Pausa");
  } else {
    ocultarEstado();
    actualizar();
  }
}
//funciones para ver en el canva
function actualizarInfo() {
  puntajeEl.textContent = puntaje;
  vidasEl.textContent = vidas;
}

function mostrarEstado(texto) {
  estadoJuegoEl.textContent = texto;
  estadoJuegoEl.style.display = 'block';
}

function ocultarEstado() {
  estadoJuegoEl.style.display = 'none';
}

actualizar();

function limpiarJuego() {
  balas.forEach(bala => bala.remove());
  balas = [];

  enemigos.forEach(enemigo => enemigo.remove());
  enemigos = [];

  clearInterval(enemigoIntervaloID);
}
function reiniciarJuego() {
  limpiarJuego(); // Primero limpia y detiene todo

  enemigoIntervaloID = setInterval(crearEnemigosSegunPuntaje, 2000); // Luego inicia nuevamente

  juegoTerminado = false;
  juegoPausado = false;
  puntaje = 0;
  vidas = 5;

  actualizarInfo();
  ocultarEstado();
  actualizar(); // Reinicia animación
}
