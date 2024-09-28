import { React, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { images } from './../../Constants/index';
import { client, urlFor } from './../../client';
import './Collaborations.css';

const Collaborations = () => {
    const [loadPage, setLoadPage] = useState(false);
    const [data, setData] = useState(null);
    

    useEffect(() => {
        const query = `
            {
                "collaborations": *[_type == "collaborations"],
            }
        `;

        client.fetch(query).then((data) => {
            setData(data.collaborations);
            setLoadPage(true);
            
        }).catch((error) => {
            
        })
    }, [])

    return(
        <div>
            {loadPage ? (
                <div className='collabs__container'>
                    {data.map((item, index) => (
                        <img className='collab' src={urlFor(item.image).url()} />
                    ))}
                </div>
            ) : (
                <div></div>
            )}    
        </div>
    )
}

export default Collaborations;