document.addEventListener('DOMContentLoaded', () => {
  // Variables para almacenar datos
  const temas = [];
  const preguntas = [];

  // Gestión de Temas
  const agregarTemaButton = document.querySelector('.form-container:nth-of-type(1) button[type="submit"]');
  agregarTemaButton.onclick = (e) => {
      e.preventDefault();
      const nombreTema = document.getElementById('nombre-tema').value.trim();
      const descripcionTema = document.getElementById('descripcion-tema').value.trim();
      if (nombreTema && descripcionTema) {
          temas.push({ nombre: nombreTema, descripcion: descripcionTema });
          actualizarListaTemas();
          document.getElementById('nombre-tema').value = '';
          document.getElementById('descripcion-tema').value = '';
      }
  };

  // Gestión de Preguntas
  const agregarPreguntaButton = document.querySelector('.form-container:nth-of-type(2) button[type="submit"]');
  agregarPreguntaButton.onclick = (e) => {
      e.preventDefault();
      const temaPregunta = document.getElementById('tema-pregunta').value.trim();
      const nivelPregunta = document.getElementById('nivel-pregunta').value.trim();
      const textoPregunta = document.getElementById('texto-pregunta').value.trim();
      const respuestaCorrecta = document.getElementById('respuesta-correcta').value.trim();
      const respuestasIncorrectas = document.getElementById('respuestas-incorrectas').value.split(',').map(respuesta => respuesta.trim());

      if (temaPregunta && nivelPregunta && textoPregunta && respuestaCorrecta && respuestasIncorrectas.length) {
          preguntas.push({
              tema: temaPregunta,
              nivel: parseInt(nivelPregunta, 10),
              texto: textoPregunta,
              correcta: respuestaCorrecta,
              incorrectas: respuestasIncorrectas
          });
          actualizarListaPreguntas();
          limpiarFormularioPreguntas();
      }
  };

  function actualizarListaTemas() {
      const temasLista = document.querySelector('.data-container ul');
      temasLista.innerHTML = '';
      temas.forEach(tema => {
          const li = document.createElement('li');
          li.textContent = `${tema.nombre}: ${tema.descripcion}`;
          temasLista.appendChild(li);
      });

      document.querySelector('.data-container p').textContent = `Lista de temas (total de temas: ${temas.length})`;

      // Actualizar el select de temas en la sección de jugar
      const selectTema = document.getElementById('tema');
      selectTema.innerHTML = '<option value="">Seleccione un tema</option>';
      temas.forEach(tema => {
          const option = document.createElement('option');
          option.value = tema.nombre;
          option.textContent = tema.nombre;
          selectTema.appendChild(option);
      });

      actualizarDatosTemas();
  }

  function actualizarListaPreguntas() {
      const tabla = document.querySelector('.tabla table tbody');
      tabla.innerHTML = ''; // Limpiar el cuerpo de la tabla antes de actualizarlo
      preguntas.forEach(pregunta => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
              <td>${pregunta.tema}</td>
              <td>${pregunta.nivel}</td>
              <td>${pregunta.texto}</td>
              <td>${pregunta.correcta}</td>
              <td>${pregunta.incorrectas.join(', ')}</td>
          `;
          tabla.appendChild(tr);
      });

      document.querySelector('.data-container:nth-of-type(2) p').textContent = `Total de preguntas registradas: ${preguntas.length} preguntas`;

      actualizarDatosTemas();
  }

  function limpiarFormularioPreguntas() {
      document.getElementById('tema-pregunta').value = '';
      document.getElementById('nivel-pregunta').value = '';
      document.getElementById('texto-pregunta').value = '';
      document.getElementById('respuesta-correcta').value = '';
      document.getElementById('respuestas-incorrectas').value = '';
  }

  function actualizarDatosTemas() {
      const temasSinPreguntas = temas.filter(tema => 
          !preguntas.some(pregunta => pregunta.tema === tema.nombre)
      );

      const temasSinPreguntasLista = document.querySelector('.data-container ul:nth-of-type(2)');
      temasSinPreguntasLista.innerHTML = '';
      temasSinPreguntas.forEach(tema => {
          const li = document.createElement('li');
          li.textContent = tema.nombre;
          temasSinPreguntasLista.appendChild(li);
      });

      const totalPreguntas = preguntas.length;
      const totalTemas = temas.length;
      const promedioPreguntas = totalTemas > 0 ? (totalPreguntas / totalTemas).toFixed(2) : 0;

      document.querySelector('.data-container p:nth-of-type(2)').textContent = `Promedio de preguntas por tema (cantidad total de preguntas/cantidad total de temas): ${promedioPreguntas}`;
  }

  // Lógica de Juego
  const iniciarJuegoButton = document.getElementById('iniciar-juego');
  iniciarJuegoButton.addEventListener('click', (e) => {
      e.preventDefault();
      const tema = document.getElementById('tema').value;
      const nivel = parseInt(document.getElementById('nivel').value, 10);
      if (tema && nivel) {
          comenzarJuego(tema, nivel);
      }
  });

  function comenzarJuego(tema, nivel) {
      const preguntasFiltradas = preguntas.filter(pregunta => pregunta.tema === tema && pregunta.nivel === nivel);
      if (preguntasFiltradas.length > 0) {
          let puntaje = 0;
          let preguntaActual = 0;
          mostrarPregunta(preguntasFiltradas, preguntaActual, puntaje);
      } else {
          alert('No hay preguntas disponibles para este tema y nivel.');
      }
  }

  function mostrarPregunta(preguntas, index, puntaje) {
      if (index < preguntas.length) {
          const pregunta = preguntas[index];
          document.getElementById('pregunta').textContent = pregunta.texto;
          const botonesRespuestas = document.querySelectorAll('.respuesta');
          const respuestas = [...pregunta.incorrectas, pregunta.correcta].sort(() => Math.random() - 0.5);
          botonesRespuestas.forEach((button, i) => {
              button.textContent = respuestas[i];
              button.onclick = () => {
                  if (respuestas[i] === pregunta.correcta) {
                      puntaje += 10;
                  } else {
                      puntaje -= 1;
                  }
                  document.getElementById('puntaje').textContent = puntaje;
                  mostrarPregunta(preguntas, index + 1, puntaje);
              };
          });
      } else {
          alert(`Juego terminado! Puntaje final: ${puntaje}`);
      }
  }
});
