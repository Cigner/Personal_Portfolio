import { React, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { images } from './../../Constants/index';
import { client, urlFor } from './../../client';
import { Carousel } from 'react-responsive-carousel';
import './About.css';
import { div } from 'framer-motion/client';
import { useCountUp } from 'use-count-up';
import { CircularProgress } from '@mui/joy';

const About = ({selectedPanel, onSelectAboutOption, contactRef}) => {
    const [loadPage, setLoadPage] = useState(false);
    const [data, setData] = useState(null);
    const [sortedExperience, setSortedExperience] = useState(null);
    const [isSkillsLoading, setIsSkillsLoading] = useState(false);
    const carouselRef = useRef(null);

    useEffect(() => {
        const query = `
            {
                "page": *[_type == "pagecontent"]{about, aboutimage},
                "social": *[_type == "social"],
                "experience": *[_type == "experience"] | order(_updatedAt desc),
                "skills": *[_type == "skills"] | order(percentage desc),
            }
        `;

        client.fetch(query).then((data) => {
            setData(data);
            setSortedExperience(sortAndGroupData(data.experience));
            setLoadPage(true);
        }).catch((error) => {
            
        })
    }, [])

    useEffect(() => {
        if(carouselRef.current) {
            carouselRef.current.moveTo(selectedPanel);
        }
    }, [selectedPanel])

    const sortAndGroupData = (data) => {
        const sortedData = data.sort((a, b) => {
          if (a.isOngoing) return -1;
          if (b.isOngoing) return 1;
          
          return new Date(b.endDate) - new Date(a.endDate);
        });
      
        const groupedByYear = {};
      
        sortedData.forEach((item) => {
          if (item.isOngoing) {
            if (!groupedByYear['isOngoing']) {
              groupedByYear['isOngoing'] = [];
            }
            groupedByYear['isOngoing'].push(item);
          } else {
            const year = new Date(item.endDate).getFullYear();
            if (!groupedByYear[year]) {
              groupedByYear[year] = [];
            }
            groupedByYear[year].push(item);
          }
        });
      
        const groupedArray = [];
      
        if (groupedByYear['isOngoing']) {
          groupedArray.push(groupedByYear['isOngoing']);
        }
      
        const years = Object.keys(groupedByYear)
          .filter((key) => key !== 'isOngoing')
          .sort((a, b) => b - a);
      
        years.forEach((year) => {
          groupedArray.push(groupedByYear[year]);
        });
      
        return groupedArray;
      };

    const scrollToSection = (ref) => {
        ref.current.scrollIntoView({behavior: 'smooth'});
    }

    return(
        <div>
            {loadPage ? (
                <div className={`about__wrapper ${selectedPanel == 0 ? 'first' : selectedPanel == 1 ? 'second' : 'third'}`}>
                    <div className='about'>
                        <div className='about__bar'>
                            <h1>WHO AM <span>I</span>?</h1>
                            <div className='about__nav'>
                                <button className={`about__nav-button ${selectedPanel == 0 ? 'active' : ''}`} onClick={() => { carouselRef.current.moveTo(0); onSelectAboutOption(0); setTimeout(() => {setIsSkillsLoading(false)}, 1000)}}>ABOUT ME</button>
                                <button className={`about__nav-button ${selectedPanel == 1 ? 'active' : ''}`} onClick={() => { carouselRef.current.moveTo(1); onSelectAboutOption(1); setTimeout(() => {setIsSkillsLoading(false)}, 1000)}}>MY EXPERIENCE</button>
                                <button className={`about__nav-button ${selectedPanel == 2 ? 'active' : ''}`} onClick={() => { carouselRef.current.moveTo(2); onSelectAboutOption(2); setTimeout(() => {setIsSkillsLoading(true)}, 1000)}}>MY SKILLS</button>
                            </div>
                        </div>
                        <Carousel ref={carouselRef} showArrows={false} showStatus={false} showIndicators={false} showThumbs={false} dynamicHeight={true}>
                            <div className='about__about-me-section'>
                                <div className='about__image-container'>
                                    <div className='about__image'>
                                        <img src={urlFor(data.page[0].aboutimage).url()} />
                                    </div>
                                    <div className='about__contact-small-container'>
                                        <button onClick={() => scrollToSection(contactRef)}>CONTACT ME</button>
                                        <div className='about__social-small'>
                                            {data.social.map((item, index) => (
                                                <a key={index} href={item.url} target="_blank" style={{backgroundColor: `${item.color.hex}`}}>
                                                    <div dangerouslySetInnerHTML={{__html: item.svgIcon}}></div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className='about__text-section'>
                                    <p>{data.page[0].about}</p>
                                    <div className='about__contact-big-container'>
                                        <button onClick={() => scrollToSection(contactRef)}>CONTACT ME</button>
                                        <div className='about__social-big'>
                                            {data.social.map((item, index) => (
                                                <a key={index} href={item.url} target="_blank" style={{backgroundColor: `${item.color.hex}`}}>
                                                    <div dangerouslySetInnerHTML={{__html: item.svgIcon}}></div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='about__experience-section'>
                                {sortedExperience.map((year, index) => (
                                    <div key={index}>
                                    {year.map((experience, idx) => (
                                        <div key={idx} className='about__experience'>
                                            <div className='about__experience-timeline'>{index == 0 && idx == 0 ? 'Current' : idx == 0 ? experience.endDate.slice(0, 4) : ''}</div>
                                            <div className='about__experience-item-container'>
                                                <div tabIndex={idx} className='about__experience-item big'>
                                                    <div className='about__experience-left'><img src={urlFor(experience.image).url()} /></div>
                                                    <div className='about__experience-middle'>
                                                        <div className='about__experience-header'>
                                                            <h3>{experience.title}</h3>
                                                            <span>{experience.shortDescription}</span>
                                                        </div>
                                                        <p>{experience.longDescription}</p>
                                                    </div>
                                                    <div className='about__experience-right'>
                                                        <span>{`${experience.startDate.slice(0, 4)} - ${experience.isOngoing ? 'now' : experience.endDate.slice(0, 4)}`}</span>
                                                        <div><img src={images.arrowDown}/></div>
                                                    </div>
                                                </div>   
                                                <div tabIndex={idx} className='about__experience-item small'>
                                                    <div className='about__experience-top'>
                                                        <img src={urlFor(experience.image).url()} />
                                                        <h3>{experience.title}</h3>
                                                        <span>{`${experience.startDate.slice(0, 4)} - ${experience.isOngoing ? 'now' : experience.endDate.slice(0, 4)}`}</span>
                                                    </div>
                                                    <div className='about__experience-middle-small'>
                                                        <span>{experience.shortDescription}</span>
                                                        <p>{experience.longDescription}</p>
                                                    </div>
                                                    <div className='about__experience-bottom'>
                                                        <div><img src={images.arrowDown}/></div>
                                                    </div>
                                                </div>   
                                            </div>
                                        </div>
                                    ))}</div>
                                ))}
                            </div>
                            <div className='about__skills-section'>
                                {data.skills.map((skill, index) => (
                                    <div key={index} tabIndex={index} className='about__skill-element'>
                                        <ProgressWithCountUp endValue={skill.percentage} isCounting={isSkillsLoading} img={skill.image} desc={skill.description} />
                                    </div>
                                ))}
                            </div>
                        </Carousel>
                    </div>
                </div>
            ) : (
                <div></div>
            )}    
        </div>
    )
}




const ProgressWithCountUp = ({ endValue, isCounting, img, desc }) => {
    const { value, reset } = useCountUp({
      isCounting,
      duration: 1.5,
      start: 0,
      end: endValue,
      
    });
  
    return (
        <CircularProgress 
            sx={{
                "--CircularProgress-size": "120px",
                "--CircularProgress-trackThickness": "16px",
                "--CircularProgress-progressThickness": "16px"
            }} 
            determinate 
            value={value}>
          <img src={urlFor(img).url()} />
          {desc ? (<p>{desc}</p>):(<div></div>)}
        </CircularProgress>
    );
  };

export { About, ProgressWithCountUp };