import Swal from 'sweetalert2';

export const actualizarAvance = () => {
    // Seleccionar las tareas por hacer
    const tareas = document.querySelectorAll('li.tarea');

    if ( tareas.length) {
        // Seleccionar las tareas completadas
        const tareasCompletadas = document.querySelectorAll('i.completo');

        // Calcular el avance
        const avance = Math.round((tareasCompletadas.length / tareas.length) * 100);

        // Mostrar el avance
        const porcentaje = document.querySelector('#porcentaje');
        porcentaje.style.width = avance+'%';

        if (avance === 100) {
            Swal.fire(
                'Completaste el proyecto',
                'Felicidades, has completado tus tareas',
                'success'
            );
        }
    }
};