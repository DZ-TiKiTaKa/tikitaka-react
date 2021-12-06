/* eslint-disable */ 
import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function chat(){
    const [data, setData] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await axios.get('https://localhost:9988/chat');
                setData(response.data.data);
            
            } catch(err){
                console.log(err);
            }
        }
        fetchData();
    }, []);

    return (
        <div>
            <h1>data: {data}</h1>
        </div>
    );
};