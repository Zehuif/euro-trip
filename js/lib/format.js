// Formato de números y distancias.

export const eur = v => '€' + Math.round(v).toLocaleString('es-CL');

export const fmtD = km => km < 1 ? `${Math.round(km * 100) * 10} m` : `${km.toFixed(km < 10 ? 1 : 0).replace('.', ',')} km`;

export const plural = (n, one, many) => n + (n === 1 ? one : many);
