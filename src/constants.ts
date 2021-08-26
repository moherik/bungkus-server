export const PORT: number = 3000;

export const DB_HOST: string = process.env.DB_HOST || "localhost";
export const DB_PORT: number = Number(process.env.DB_PORT) || 5432;
export const DB_USERNAME: string = process.env.DB_USERNAME || "postgres";
export const DB_PASSWORD: string = process.env.DB_PASSWORD || "postgres";
export const DB_DATABASE: string = process.env.DB_DATABASE || "new-bungkus";
