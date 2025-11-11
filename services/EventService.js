// services/EventService.js
import axios from 'axios';
import * as Notifications from 'expo-notifications';
import { API_BASE_URL } from '../config';

export const EventService = {
  // Obtener eventos nuevos desde un ID específico
  getNewEvents: async (desdeId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/apiLogin/eventos.php?desde_id=${desdeId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al obtener eventos nuevos:', error);
      return {
        success: false,
        data: []
      };
    }
  },

  // Mostrar notificación de evento
  showEventNotification: async (evento) => {
    const fechaFormateada = new Date(evento.fecha).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Nuevo Evento: ${evento.nombre}`,
        body: `${evento.descripcion} - ${fechaFormateada} a las ${evento.horaInicio}`,
      },
      trigger: null,
    });
  }
};