import Typist from 'react-typist-component';
import EmailIcon from '@mui/icons-material/Email';
import "../styles/Intro.css";

export default function Intro() {
    return (
        <div id="intro" className="flex flex-col gap-2.5 justify-center items-center h-screen">
            <div className="flex flex-col gap-1 p-2.5 text-center w-auto h-auto">
                 <Typist typingDelay={120} cursor={<span className='cursor text-(--secondary-color) text-5xl font-bold'>|</span>} >
                    <h1 className="text-4xl font-bold text-white">
                        Halo,
                        <span className="text-(--primary-color)"> Kevin </span>  
                        here.
                    </h1>
                </Typist>
                <h2 className="text-3xl font-bold text-(--text-color-gray-4)">
                    I Code, I Create, I Reapet.
                </h2>
            </div>
            <div className="max-w-150 text-center text-(--text-color-gray-4)">
                I’m a <span className="text-white"> software developer </span> from Jakarta, Indonesia. I enjoy solving problems, 
                learning new things, and building stuff I’m curious about. Most days, I’m 
                exploring ideas, writing code, or just creating something for fun.
            </div>
            
            <a href="mailto:kpratama1201@gmail.com">
                <div className="flex flex-row gap-2.5 p-4 m-5 border border-solid border-(--primary-color) w-auto h-auto justify-center items-center rounded-md hover:bg-(--primary-color-hover)">
                    <EmailIcon style={{ fontSize: 30, color: 'var(--primary-color)' }}></EmailIcon>
                    <p className="text-lg text-(--secondary-color)"> Say hi! </p>
                </div>
            </a> 
        </div>
    )
}