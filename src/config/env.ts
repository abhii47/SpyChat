import dotenv from 'dotenv';

if(process.env.NODE_ENV === 'production'){
    dotenv.config({ path: '.env.production' });
} else {
    dotenv.config({ path: '.env.local' });
}

export const getEnv = (key:string) => {
    const value = process.env[key];
    if(!value){
        throw new Error(`Environment variable ${key} is not defined`);
    }
    return value;
} 