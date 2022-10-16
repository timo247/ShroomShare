import dotenv from "dotenv";

dotenv.config();

export const config = {
    port: normalizePort(process.env.PORT || "3000"),
    apiName: 'api'
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}