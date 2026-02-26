import React, { useEffect, useState } from "react";
// Asegúrate de importar Bootstrap en tu index.js o App.js principal
// import 'bootstrap/dist/css/bootstrap.min.css';

// App.js
import { Contador, EntradaTarea, ListaTareas, Titulo } from "./index.js";

// PROBLEMAS DE CONSOLA SOLUCIONADOS

/**
 * Componente Principal: Home
 * Autor: Ignacio Pinto
 * Descripción: Componente contenedor que maneja la lógica y el estado.
 */

const Home = () => {
    // Estado para almacenar la lista de tareas
    const [tareas, setTareas] = useState([]);
    // Estado para el input controlado
    const [inputValue, setInputValue] = useState("");

    const USERNAME = 'ignaciopinto'; // usuario en la API
    const API_BASE_URL = "https://playground.4geeks.com/todo";

    // Use Effect inicial para cargar tareas desde la API al montar el componente
    useEffect(() => {
        obtenerTareas();
    }, []);

    // ------- METODOS FETCH (comunicacion con la API) -------

    // Funcion GET: traer la lista de tareas desde la API
    const obtenerTareas = async () => {
        try {
            // El 'await' detiene la ejecución de esta función hasta que la API responda
            const resp = await fetch(`${API_BASE_URL}/users/${USERNAME}`);
            
            if (resp.status === 404) {
                // Si da 404, el usuario no existe. Esperamos a que se cree.
                await crearUsuario();
            } else if (resp.ok) {
                // Esperamos a que la respuesta se convierta en JSON
                const data = await resp.json();
                if (data) {
                    setTareas(data.todos);
                }
            }
        } catch (error) {
            // Si el internet se cae o el servidor falla 
            console.error("Error al obtener tareas:", error);
        }
    };

    // Función POST (Usuario): Crear un usuario nuevo
    const crearUsuario = async () => {
        try {
            const resp = await fetch(`${API_BASE_URL}/users/${USERNAME}`, {
                method: "POST"
            });
            
            if (resp.ok) {
                // Una vez creado con éxito, volvemos a pedir sus tareas
                await obtenerTareas();
            }
        } catch (error) {
            console.error("Error al crear usuario:", error);
        }
    };

    // 2. Función POST (Tarea): Agregar una tarea nueva
    const agregarTarea = async () => {
        if (inputValue.trim() === "") return;

        const nuevaTarea = {
            label: inputValue,
            is_done: false
        };

        try {
            const resp = await fetch(`${API_BASE_URL}/todos/${USERNAME}`, {
                method: "POST",
                body: JSON.stringify(nuevaTarea),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (resp.ok) {
                // Sincronizamos con el servidor y limpiamos el input
                await obtenerTareas();
                setInputValue(""); 
            }
        } catch (error) {
            console.error("Error al agregar tarea:", error);
        }
    };

    // Función para eliminar una tarea (filtrando por ID)
    /*const eliminarTarea = (id) => {
        const tareasFiltradas = tareas.filter((t) => t.id !== id);
        setTareas(tareasFiltradas);
    };//*/

    // 3. Función DELETE (Tarea): Eliminar una tarea individual
    const eliminarTarea = async (id) => {
        try {
            const resp = await fetch(`${API_BASE_URL}/todos/${id}`, {
                method: "DELETE"
            });

            if (resp.ok) {
                // Actualizamos el frontend pidiendo la lista de nuevo
                await obtenerTareas();
            }
        } catch (error) {
            console.error("Error al eliminar tarea:", error);
        }
    };

    // 4. Limpiar todas las tareas ("Clear all tasks")
    const limpiarTodasLasTareas = async () => {
        try {
            const resp = await fetch(`${API_BASE_URL}/users/${USERNAME}`, {
                method: "DELETE"
            });

            if (resp.ok) {
                setTareas([]); // Limpiamos visualmente de inmediato
                await crearUsuario(); // Recreamos el usuario limpio en el backend
                alert('Todas las tareas fueron eliminadas del servidor');
            }
        } catch (error) {
            console.error("Error al limpiar tareas:", error);
        }
    };



    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 col-md-8 col-lg-6 mx-auto mt-5">
                    
                    {/* Componente Título */}
                    <Titulo />

                    <div>
                        {tareas.length > 0 && (
                            <div className="text-center"> 
                                <h2 className="py-4">
                                    Tienes {tareas.length} {tareas.length === 1 ? "tarea pendiente" : "tareas pendientes"}
                                </h2>

                                <button 
                                    type="button" 
                                    className="btn btn-danger btn-lg mb-3" 
                                    onClick={limpiarTodasLasTareas}
                                >
                                    Eliminar Todo
                                </button>
                            </div>
                        )}    
                    </div>

                    <div className="todo-wrapper shadow-lg">
                        
                        {/* Componente Input */}
                        <EntradaTarea 
                            nuevaTarea={inputValue}
                            setNuevaTarea={setInputValue}
                            agregarTarea={agregarTarea}
                        />

                        {/* Componente Lista */}
                        <ListaTareas 
                            lista={tareas} 
                            eliminarTarea={eliminarTarea} 
                        />

                        {/* Componente Footer/Contador */}
                        <Contador cantidad={tareas.length} />
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;