import { React, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { images } from './../../Constants/index';
import { client } from './../../client';
import { div } from 'framer-motion/client';
import './Navbar.css';

const NavBar = ({ homeRef, workRef, aboutRef, testimonialsRef, contactRef }) => {
    const [wideNavbar, setWideNavbar] = useState(window.innerWidth);
    const [loadPage, setLoadPage] = useState(false);
    const [data, setData] = useState(null);
    const [menuListVisible, setMenuListVisible] = useState(false);
    const listRef = useRef(null);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    useEffect(() => {
        client.fetch(`*[_type == "social"]{name, svgIcon, color, url}`).then((data) => {
            setData(data);
            setLoadPage(true);
        }).catch((error) => {
            
        })
    }, [])

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        document.addEventListener('mousedown', handleClickOutsideList);
        document.addEventListener('touchstart', handleClickOutsideList);
        document.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchend', handleTouchEnd);

        return() => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('mousedown', handleClickOutsideList);
            document.removeEventListener('touchstart', handleClickOutsideList);
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchend', handleTouchEnd);
        }
    }, [])

    const handleResize = () => {
        setWideNavbar(window.innerWidth);
        if(window.innerWidth >= 900 && menuListVisible) {
            setMenuListVisible(false);
        }
    }

    const handleClickOutsideList = (event) => {
        if(listRef.current && !listRef.current.contains(event.target)) {
            setMenuListVisible(false);
        }
    }

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX
    }

    const handleTouchEnd = (e) => {
        touchEndX.current = e.changedTouches[0].clientX
        handleSwipeGesture();
    }

    const handleSwipeGesture = () => {
        const distance = touchEndX.current - touchStartX.current;
        if(distance > 30) {
            setMenuListVisible(false);
        }
    }

    const scrollToSection = (ref) => {
        ref.current.scrollIntoView({behavior: 'smooth'});
    }

    const menuVariants = {
        visible: {x: 0, boxShadow: "0 0 100vw 100vw rgba(0,0,0,0.5)"},
        hidden: {x: '100%', boxShadow: 'none'}
    }

    return(
        <motion.div className='navbar__container' initial={{ y: -64 }} animate={{ y: 0 }}>
            {loadPage ? (
                <div className='navbar'>
                    {wideNavbar >= 900 ? (
                        <div className='navbar__wide'>
                            <div className='navbar__logo'><img src={images.logo} alt='LOGO' /></div>
                            <div className='navbar__menu'>
                                <button onClick={() => scrollToSection(homeRef)}>HOME</button>
                                <button onClick={() => scrollToSection(workRef)}>MY WORK</button>
                                <button onClick={() => scrollToSection(aboutRef)}>ABOUT ME</button>
                                <button onClick={() => scrollToSection(testimonialsRef)}>TESTIMONIALS</button>
                                <button onClick={() => scrollToSection(contactRef)}>CONTACT</button>
                            </div>
                            <div className='navbar__social'>
                                {data.map((item, index) => (
                                    <a key={index} href={item.url} target="_blank">
                                        <div dangerouslySetInnerHTML={{__html: item.svgIcon}}></div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className='navbar__short'>
                            <div className='navbar__logo'><img src={images.logo} alt='LOGO' /></div>
                            <button onClick={() => setMenuListVisible(!menuListVisible)}>
                                <img src={images.bars} />
                            </button>
                            <motion.div ref={listRef} variants={menuVariants} initial={'hidden'} animate={menuListVisible ? 'visible' : 'hidden'} className='navbar__list'>
                                <button onClick={() => setMenuListVisible(!menuListVisible)}>
                                    <img src={images.bars} />
                                </button>
                                <div className='navbar__menu'>
                                    <button onClick={() => {scrollToSection(homeRef); setMenuListVisible(false)}}>HOME</button>
                                    <button onClick={() => {scrollToSection(workRef); setMenuListVisible(false)}}>MY WORK</button>
                                    <button onClick={() => {scrollToSection(aboutRef); setMenuListVisible(false)}}>ABOUT ME</button>
                                    <button onClick={() => {scrollToSection(testimonialsRef); setMenuListVisible(false)}}>TESTIMONIALS</button>
                                    <button onClick={() => {scrollToSection(contactRef); setMenuListVisible(false)}}>CONTACT</button>
                                </div>
                                <div className='navbar__social'>
                                    {data.map((item, index) => (
                                        <a key={index} href={item.url} target="_blank">
                                            <div dangerouslySetInnerHTML={{__html: item.svgIcon}}></div>
                                        </a>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>
            ) : (
                <div></div>
            )}    
        </motion.div>
    )
}

export default NavBar;