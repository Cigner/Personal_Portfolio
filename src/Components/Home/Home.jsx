import { React, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { images } from './../../Constants/index';
import { client, urlFor } from './../../client';
import './Home.css';

const Home = ({onSelectAboutOption, aboutRef, projectsRef, testimonialsRef}) => {
    const [loadPage, setLoadPage] = useState(false);
    const [data, setData] = useState(null);
    

    useEffect(() => {
        const query = `
            {
                "page": *[_type == "pagecontent"]{headtext1, headtext2, headtext3, headimage, years},
                "project": *[_type == "projects"]{Name, Description, Images[0]} | order(_updatedAt desc)[1],
                "experience": *[_type == "experience"] | order(_updatedAt desc)[0],
                "references": *[_type == "references"] | order(_updatedAt desc)[0],
            }
        `;

        client.fetch(query).then((data) => {
            setData(data);
            setLoadPage(true);
            
        }).catch((error) => {
            
        })
    }, [])

    const displayDate = () => {
        const isOngoing = data.experience.isOngoing;
        if(isOngoing) {
            return(
                `${data.experience.startDate.length[4]} - now`
            )
        } else {
            let startDate = data.experience.startDate.slice(0, 4);
            let endDate = data.experience.endDate.slice(0, 4);
            
            if(startDate == endDate || startDate === endDate) {
                return(
                    `${startDate}`
                )
            } else {
                return(
                    `${startDate} - ${endDate}`
                )
            }
        }
    }

    const scrollToSection = (ref) => {
        ref.current.scrollIntoView({behavior: 'smooth'});
    }

    return(
        <div>
            {loadPage ? (
                <div>
                    <div className='home'>
                        <div className='home__left'>
                            <motion.div initial={{x: '-100vw'}} animate={{x: 0}} transition={{delay: 0.25, duration: 0.75}} className='home__name-container'>
                                <img src={images.nameStroke} className='home__name front'/>
                                <img src={images.nameFill} className='home__name back'/>
                            </motion.div>
                            <motion.div initial={{x: '-100vw'}} animate={{x: 0}} transition={{delay: 0.4, duration: 0.75}} className='home__text-container'>
                                <span>{data.page[0].headtext1}</span>
                                <span>{data.page[0].headtext2}</span>
                                <span>{data.page[0].headtext3}</span>
                            </motion.div>
                            <motion.button initial={{x: '-100vw'}} animate={{x: 0}} transition={{delay: 0.55, duration: 0.75}} className='home__more-button' onClick={() =>{onSelectAboutOption(0); scrollToSection(aboutRef)}}>MORE ABOUT ME</motion.button>
                        </div>
                        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.5, duration: 0.75}} className='home__head-image'><img src={urlFor(data.page[0].headimage).url()} /></motion.div>
                        <div className='home__right'>
                            <motion.div initial={{x: 300, opacity: 0}} animate={{x: 0, opacity: 1}} transition={{delay: 1.75, duration: 0.75}} className='home__cube first' onClick={() => {projectsRef.current.scrollIntoView({behavior: 'smooth'});}}>
                                <div className='home__cube-textbox'>
                                    <h1>{data.project.Name}</h1>
                                    <span>{data.project.Description}</span>
                                </div>
                                <div className='home__cube-image'><img src={urlFor(data.project.Images).url()} /></div>
                            </motion.div>
                            <motion.div initial={{x: 300, opacity: 0}} animate={{x: 0, opacity: 1}} transition={{delay: 1.9, duration: 0.75}} className='home__cube second' onClick={() => {onSelectAboutOption(1); aboutRef.current.scrollIntoView({behavior: 'smooth'});}}>
                                <div className='home__cube-textbox'>
                                    <h1>{data.experience.title}</h1>
                                    <span>{data.experience.shortDescription}</span>
                                    <h2>{displayDate()}</h2>
                                </div>
                                <div className='home__cube-image'><img src={urlFor(data.experience.image).url()} /></div>
                            </motion.div>
                            <motion.div initial={{x: 300, opacity: 0}} animate={{x: 0, opacity: 1}} transition={{delay: 2.05, duration: 0.75}} className='home__cube third' onClick={() => scrollToSection(testimonialsRef)}>
                                <div className='home__cube-textbox'>
                                    <div className='home__cube-quote'>
                                        <img src={images.quoteLeft}/>
                                        <span>{data.references.description}</span>
                                        <img src={images.quoteRight}/>
                                    </div>
                                    <h2>{data.references.name}</h2>
                                </div>
                                <div className='home__cube-image'><img src={urlFor(data.references.image).url()} /></div>
                            </motion.div>
                        </div>
                    </div>
                    <div className='home__bar'>
                        <span>UI / UX DESIGN</span><b>%</b>
                        <span>WEB DEVELOPMENT</span>
                        <b>%</b><p>{new Date().getFullYear() - data.page[0].years} YEARS OF EXPERIENCE</p><b>%</b>
                        <span>GAME DEVELOPMENT</span><b>%</b>
                        <span>GAME DESIGN</span>
                    </div>
                </div>
            ) : (
                <div></div>
            )}    
        </div>
    )
}

export default Home;