import { React, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { images } from './../../Constants/index';
import { client, urlFor } from './../../client';
import './Contact.css';
import emailjs from 'emailjs-com';

const Contact = () => {
    const [loadPage, setLoadPage] = useState(false);
    const [data, setData] = useState(null);
    const [emailInput, setEmailInput] = useState('');
    const [topicInput, setTopicInput] = useState('');
    const [messageInput, setMessageInput] = useState('');
    const [success, setSuccess] = useState(false);
    const [missing, setMissing] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const query = `
            {
                "page": *[_type == "pagecontent"]{contact},
                "social": *[_type == "social"],
            }
        `;

        client.fetch(query).then((data) => {
            setData(data);
            setLoadPage(true);
            
        }).catch((error) => {
            
        })
    }, [])

    const handlesend = () => {
        let params = {
            topic: topicInput,
            email: emailInput,
            message: messageInput
        }

        if(topicInput.length > 1 && emailInput.length > 5 && messageInput.length > 10) {
            emailjs.send(
                'service_9dns5jc',
                'template_a6ktors',
                params,
                '4tkrW0mIiQsyuIYGr',
            )
            .then((result) => {
                setEmailInput('');
                setTopicInput('');
                setMessageInput('');

                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                }, 2500)
            },
            (error) => {
                setError(true);
                setTimeout(() => {
                    setError(false);
                }, 2500)
            });
        } else {
            setMissing(true);
            setTimeout(() => {
                setMissing(false);
            }, 2500)
        }
    }

    return(
        <div style={{display: 'flex', justifyContent: 'center'}}>
            {loadPage ? (
                <div className='contact__container'>
                    <h1><span>CONTACT</span> ME</h1>
                    <div className='contact'>
                        <div className='contact__info'>
                            <div className='contact__top-info'>
                                <a href={`tel:${data.page[0].contact.phone}`}><img src={images.phone} /><span>{data.page[0].contact.phone}</span></a>
                                <a href={`mailto:${data.page[0].contact.email}`}><img src={images.email} /><span>{data.page[0].contact.email}</span></a>
                            </div>
                            <div className='contact__social-top'>
                                {data.social.map((item, index) => (
                                    <a key={index} href={item.url} target="_blank" style={{backgroundColor: `${item.color.hex}`}}>
                                        <div dangerouslySetInnerHTML={{__html: item.svgIcon}}></div>
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className='contact__form'>
                            <div className='contact__form-email'>
                                <img src={images.at} />
                                <input type='email' value={emailInput} onChange={(e) => setEmailInput(e.target.value)} placeholder='Your e-mail address' />
                            </div>
                            <input type='text' value={topicInput} onChange={(e) => setTopicInput(e.target.value)} placeholder='Topic' />
                            <textarea value={messageInput} onChange={(e) => setMessageInput(e.target.value)} placeholder='Your message' />
                            <button onClick={handlesend}>SEND</button>
                        </div>
                        <div className='contact__social-bottom'>
                            {data.social.map((item, index) => (
                                <a key={index} href={item.url} target="_blank" style={{backgroundColor: `${item.color.hex}`}}>
                                    <div dangerouslySetInnerHTML={{__html: item.svgIcon}}></div>
                                </a>
                            ))}
                        </div>
                    </div>
                    {success ? (<div className='contact__alert green'>E-Mail sent successfully!</div>):(<div></div>)}
                    {error ? (<div className='contact__alert red'>Something went wrong.</div>):(<div></div>)}
                    {missing ? (<div className='contact__alert yellow'>All fields are required.</div>):(<div></div>)}
                </div>
            ) : (
                <div></div>
            )}    
        </div>
    )
}

export default Contact;