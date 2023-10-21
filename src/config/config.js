import dotenv from 'dotenv';

dotenv.config();


const { SECRET_SESSION, PORT, DB_URI, SECRET_KEY, HOST } = process.env

const config = {
    secret_session: SECRET_SESSION || "",
    secret_key: SECRET_KEY || "",
    port: PORT || 8080,
    db_uri: DB_URI,
    host: HOST
};

export default config;
