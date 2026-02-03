import Typist from 'react-typist-component';
import EmailIcon from '@mui/icons-material/Email';
import "../styles/Intro.css";
import FadeSection from './FadeSection';

export default function Intro() {
    return (
        <div id="intro" className="flex flex-col gap-2.5 justify-center items-center h-screen scroll-mt-40">
            <div className="flex flex-col gap-1 p-2.5 text-center w-auto h-auto text-sm">
                 <Typist typingDelay={90} cursor={<span className='cursor text-(--secondary-color) text-2xl md:text-4xl font-bold'>|</span>} >
                    <p className="text-2xl md:text-4xl font-extrabold text-white">
                        Halo,
                        <span className="text-(--primary-color)"> Kevin </span>  
                        here.
                    </p>
                </Typist>
                <div className="animate-pulse">
                    <h2 className="text-lg md:text-3xl font-bold text-(--text-color-gray-4)">
                        I Code, I Create, I Reapet.
                    </h2>
                </div> 
            </div>
            
            <FadeSection>
                <div className="max-w-150 max-md:text-sm text-center text-(--text-color-gray-4)">
                    I’m a <span className="text-white"> software developer </span> from Jakarta, Indonesia. I enjoy solving problems, 
                    learning new things, and building stuff I’m curious about. Most days, I’m 
                    exploring ideas, writing code, or just creating something for fun.
                </div>
            </FadeSection>
            
            <FadeSection>
                <a href="mailto:kpratama1201@gmail.com">

                    <div className="flex flex-row gap-1 hover:text-(--primary-color) md:gap-2.5 p-2 md:p-4 m-2.5 md:m-5 border border-solid hover:border-(--primary-color) w-auto h-auto justify-center items-center rounded-sm md:rounded-md hover:bg-(--bg-color-black-3)">
                        <EmailIcon />
                        <p className="text-sm md:text-lg "> Say hi! </p>
                    </div>
                </a>
            </FadeSection>
        </div>
    )
}