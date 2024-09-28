import { React, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { images } from './../../Constants/index';
import { client, urlFor } from './../../client';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import './Projects.css';

const Projects = () => {
    const [loadPage, setLoadPage] = useState(false);
    const [data, setData] = useState(null);
    const [categories, setCategories] = useState(null);
    const [filteredData, setFilteredData] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [links, setLinks] = useState(null);

    useEffect(() => {
        const query = `
            {
                "categories": *[_type == "categoriesprojects"],
                "social" : *[_type == "socialprojects"],
                "projects": *[_type == "projects"]{..., categoriesprojects->, socialprojects->} | order(_updatedAt desc),
            }
        `;

        client.fetch(query).then((data) => {
            setData(data.projects);
            setCategories(data.categories)
            setFilteredData(data.projects);
            setLinks(data.social);
            setLoadPage(true);
        }).catch((error) => {
            
        })
    }, [])

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        if (categoryId !== 'ALL') {
          const filtered = data.filter((data) => data.Category._ref === categoryId);
          setFilteredData(filtered);
        } else {
          setFilteredData(data);
        }
    };

    return(
        <div style={{display:'flex', justifyContent:'center'}}>
            {loadPage ? (
                <div className='projects__wrapper'>
                <div className='projects'>
                    <h1>MY <span>WORK</span> & <span>PROJECTS</span></h1>
                    <div className='projects__container'>
                        <div className='projects__categories'>
                            <button className={`projects__category-item ${'ALL' === selectedCategory ? "active" : ""}`} onClick={() => handleCategoryChange('ALL')}><span>ALL</span>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg">
                                    <rect width="14" height="14" rx="2" fill="#F6F6FB"/>
                                    <rect x="18" width="14" height="14" rx="2" fill="#F6F6FB"/>
                                    <rect x="18" y="18" width="14" height="14" rx="2" fill="#F6F6FB"/>
                                    <rect y="18" width="14" height="14" rx="2" fill="#F6F6FB"/>
                                </svg></div>
                            </button>
                            {categories.map((category, index) => (
                                <button className={`projects__category-item ${category._id === selectedCategory ? "active" : ""}`} onClick={() => handleCategoryChange(category._id)} key={index}><span>{category.name}</span><div dangerouslySetInnerHTML={{__html: category.svgIcon}} /></button>
                            ))}
                        </div>
                        <div className='projects__elements'>
                            {filteredData.map((item, index) => (
                                <div tabIndex={index} className='projects__element' key={index}>
                                    <div className='projects__element-left'>
                                        <div className='projects__element-top-line'>
                                            <h2>{item.Name}</h2>
                                            <div dangerouslySetInnerHTML={{__html: categories.filter((category) => category._id === item.Category._ref)[0].svgIcon}} />
                                        </div>
                                        <p className='projects__element-desc'>{item.Description}</p>
                                        <div className='projects__element-links'>
                                            {item.Links.map((link, index) => (
                                                <div key={index} style={{backgroundColor: `${links.filter((lnk) => lnk._id === link.LinkRef._ref)[0].color.hex}`}}>
                                                    <a href={link.Link} target='_blank'>
                                                        <div dangerouslySetInnerHTML={{__html: links.filter((lnk) => lnk._id === link.LinkRef._ref)[0].svgIcon}} />
                                                        <span>{links.filter((lnk) => lnk._id === link.LinkRef._ref)[0].name}</span>
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className='projects__element-image'>
                                        <Carousel swipeable={false} showThumbs={false} showIndicators={false} showStatus={false} infiniteLoop={true}>
                                            {item.Images.map((img, index) => (
                                                <div key={index}><img src={urlFor(img).url()} /></div>
                                            ))}
                                        </Carousel>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div></div>
            ) : (
                <div></div>
            )}    
        </div>
    )
}

export default Projects;