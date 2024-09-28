import { React, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { images } from './../../Constants/index';
import { client, urlFor } from './../../client';
import Carousel from 'react-multi-carousel';
import "react-multi-carousel/lib/styles.css";
import './Testimonials.css';

const Testimonials = () => {
    const [loadPage, setLoadPage] = useState(false);
    const [data, setData] = useState(null);
    

    useEffect(() => {
        const query = `
            {
                "testimonials": *[_type == "references"] | order(_updatedAt desc),
            }
        `;

        client.fetch(query).then((data) => {
            setData(data.testimonials);
            setLoadPage(true);
        }).catch((error) => {
            
        })
    }, [])

    const responsive = {
        desktop: {
            breakpoint: {max: 10000, min: 1024},
            items: 1,
        },
        mobile: {
            breakpoint: {max: 1024, min: 1},
            items: 1,
        },
    }

    return(
        <div className='testimonials_main'>
            {loadPage ? (
                <div className='testimonials__container'>
                    <h1>MY <span>REFERENCES</span></h1>
                    <Carousel responsive={responsive} infinite={true}>
                        {data.map((item, index) => (
                            <div tabIndex={index} key={index} className='testimonials__item-container'>
                                <div className='testimonials__item'>
                                    <div className='testimonials__top'>
                                        <img style={{width: '100px'}} src={urlFor(item.image).url()} />
                                        <div className='testimonials__header'>
                                            <h4>{item.name}</h4>
                                            <span>{item.company}</span>
                                        </div>
                                    </div>
                                    <div className='testimonials__bottom'>
                                        <img src={images.quoteLeft} />
                                        <p>{item.description}</p>
                                        <img src={images.quoteRight} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Carousel>
                </div>
            ) : (
                <div></div>
            )}    
        </div>
    )
}

export default Testimonials;