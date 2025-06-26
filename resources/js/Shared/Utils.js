// src/utils.js
import { parseISO, format } from "date-fns";

/**-------------------------------------------------------------------------------
 * Convierte una fecha en formato ISO a un formato personalizado usando date-fns.
 * por defecto, todas las fechas se pasan desde el backend en formato ISO --------
 *
 * @param {string} dateString - Fecha en formato ISO (ej. "2025-07-14T00:00:00.000000Z")
 * @param {string} mask - Máscara de formato (ej. "dd-MM-yyyy")
 * @returns {string} Fecha formateada o cadena vacía si es inválida
 * -------------------------------------------------------------------------------
 */
export function toDateFormat(dateString, mask) {
    //console.log("Fecha en formato ISO");
    //console.log(dateString);
    if (dateString == null || dateString.trim().length == 0) {
        return "";
    }

    try {
        const parsedDate = parseISO(dateString);
        return format(parsedDate, mask);
    } catch (error) {
        return "";
    }
}
