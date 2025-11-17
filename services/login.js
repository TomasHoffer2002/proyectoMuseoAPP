import AsyncStorage from '@react-native-async-storage/async-storage'; // Para almacenar el token
import { API_BASE_URL } from '../config'; 

// HAY QUE INSTALAR ESTE PAQUETE ANTES, ejecutar en la terminal
// npx expo install @react-native-async-storage/async-storage

const API_LOGIN_ENDPOINT = '/apiLogin/login.php'; 

export async function iniciarSesion(usuario, password) {
  try {
    const url = API_BASE_URL + API_LOGIN_ENDPOINT;
    
    // 1. Petición POST a la API PHP
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Envía el usuario y la contraseña plana en formato JSON
      body: JSON.stringify({ usuario, password }), 
    });

    const data = await response.json();

    // 2. Manejo de errores de la API (ej. credenciales incorrectas)
    if (!response.ok || data.error) {
      // Lanza un error si la respuesta HTTP no es 200 o si la API devuelve un error
      const errorMessage = data.message || data.error || 'Credenciales inválidas.';
      throw new Error(errorMessage);
    }
    
    // 3. Procesar respuesta exitosa
    const token = data.token;
    //guardar nombre de usuario
    const userName = data.usuario.usuario;

    if (token && userName) {
      // 4. Almacenamiento del Token (Diferencia clave con React Web)
      // En React Native se usa AsyncStorage para almacenamiento persistente.
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userName', userName);
      console.log('Token almacenado exitosamente.',userName);
      return data; // Devuelve los datos del usuario/token
    } else {
      throw new Error('Inicio de sesión exitoso, pero no se recibió el token.');
    }

  } catch (error) {
    console.error('Error al iniciar sesión:', error.message);
    // Vuelve a lanzar el error para que la UI lo maneje
    throw error; 
  }
}
/**
 * Verifica si el usuario está autenticado comprobando el token en AsyncStorage.
 * @returns Una promesa que resuelve a true si hay token, false si no.
 */
export async function checkAuthStatus() {
    try {
        const token = await AsyncStorage.getItem('userToken');
        // Devuelve true si el token existe y no es una cadena vacía, de lo contrario false.
        return !!token; 
    } catch (e) {
        console.error('Error al leer el token de autenticación:', e);
        return false;
    }
}

/**
 * Cierra la sesión eliminando el token de AsyncStorage.
 * @returns Una promesa vacía.
 */
export async function cerrarSesion() {
    try {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userName');
        console.log('Sesión cerrada exitosamente.');
    } catch (e) {
        console.error('Error al cerrar sesión:', e);
    }
}