export async function obtenerConstantes(tokenJwtGoogle, proyecto, clave) {
    // Construimos las cabeceras. 'proyecto' y 'clave' son opcionales.
    const headers = {
        //Un objeto normal de JavaScript con las cabeceras HTTP que va a llevar la petición
        'Authorization': `Bearer ${tokenJwtGoogle}`
    };
    if (proyecto) {
        headers['proyecto'] = proyecto;
    }
    if (clave) {
        headers['clave'] = clave;
    }
    //La función nativa del navegador para hacer peticiones HTTP. method: 'GET' porque solo estamos pidiendo datos, no enviando ninguno.
    const response = await fetch('https://proadmin.iesjandula.es/admin/constants',
                                {
                                    method: 'GET',
                                    headers: headers
                                });
    if (!response.ok) {
        //Fetch NO lanza un error automáticamente si el servidor responde con un código 4xx/5xx
        const errorMessage = await response.text();
        //Mensaje en caso de error
        throw new Error(errorMessage || 'Error al obtener las constantes');
    }
    //convierte el cuerpo de la respuesta (texto) en un objeto JavaScript.
    return await response.json();
}
