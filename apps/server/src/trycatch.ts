/**
 * Helper funcional para manejo de errores con promesas en TypeScript/JavaScript.
 * Devuelve un resultado discriminado (success/failure) en vez de lanzar excepción.
 *
 * Ejemplo de uso:
 *   const { data, error } = await tryCatch(db.query(...))
 */

export type Success<T> = { data: T; error: null };
export type Failure<E> = { data: null; error: E };
export type Result<T, E = Error> = Success<T> | Failure<E>;

/**
 * Ejecuta una promesa y captura cualquier error, retornando un objeto tipo Result<T, E>.
 *
 * @param promise - Promesa a ejecutar (por ejemplo, consulta a DB)
 * @returns Un objeto con la forma { data, error }
 */
export async function tryCatch<T, E = Error>(
    promise: Promise<T>
): Promise<Result<T, E>> {
    try {
        const data = await promise;
        return { data, error: null };
    } catch (error) {
        return { data: null, error: error as E };
    }
}
