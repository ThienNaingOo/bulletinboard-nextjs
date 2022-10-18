import React from 'react';

export const API_URI = 
    typeof process.env.NEXTAUTH_URL === "string" ? process.env.NEXTAUTH_URL : "http://localhost:3000/";

