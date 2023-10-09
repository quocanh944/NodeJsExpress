import dotenv from 'dotenv';

dotenv.config();

const { SECRET_SESSION, PORT, DB_URI } = process.env

const config = {
    secret_session: SECRET_SESSION || "",
    port: PORT || 8080,
    db_uri: DB_URI
};

export default config;
