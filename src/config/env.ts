import dotenv from 'dotenv';
import AppError from '../utils/appError';

if(process.env.NODE_ENV === 'production'){
    dotenv.config({ path: '.env.production' });
} else {
    dotenv.config({ path: '.env.local' });
}

export const getEnv = (key:string) => {
    const value = process.env[key];
    if(!value){
        throw new AppError(`Environment variable ${key} is not defined`, 500);
    }
    return value;
} 