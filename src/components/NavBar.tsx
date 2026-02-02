import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import { useState, useEffect,  type RefObject } from 'react';

export default function NavBar(props: { ancestorRef: RefObject<HTMLDivElement | null>}) {
    const [shrink, setShrink] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                setShrink(!entry.isIntersecting);
            });
        });
        if (props.ancestorRef.current) observer.observe(props.ancestorRef.current);

        return () => observer.disconnect();
    }, [props.ancestorRef]);
    
    return (
        <>
            <div className={`invisible md:visible fixed z-10 left-1/2 -translate-x-1/2 bg-[#0A0E0F] transition-[width,transform,padding,margin,border-radius] duration-300 ease-in-out ${shrink ? 'w-1/2 px-8 rounded-4xl border border-(--primary-color) ' : 'w-full px-25 rounded-none border border-transparent'}`}>
                {shrink ? (
                    <div className="flex flex-row justify-between items-center py-3">
                        <ul className='navbar-links flex flex-row gap-2.5 w-auto h-auto items-end'>
                            <li><a className='hover:text-gray-400 text-white' href='#about-me'>About</a></li>
                            <li><a className='hover:text-gray-400 text-white' href='#projects'>Projects</a></li>
                            <li><a className='hover:text-gray-400 text-white' href='mailto:kpratama1201@gmail.com'>Contact</a></li>
                        </ul>
                        
                        <ul className="flex flex-row items-end gap-2.5 px-2.5 ">
                            <li><a className="hover:text-gray-400 text-white" href="mailto:kpratama1201@gmail.com"><EmailIcon style={{ fontSize: 18 }}></EmailIcon></a></li>
                            <li><a className="hover:text-gray-400 text-white" href="https://github.com/kevinma21/"><GitHubIcon style={{ fontSize: 18 }}></GitHubIcon></a></li>
                            <li><a className="hover:text-gray-400 text-white" href="https://www.linkedin.com/in/kevin-pratama-9454b0250/"><LinkedInIcon style={{ fontSize: 18 }}></LinkedInIcon></a></li>
                        </ul>
                    </div>
                ) : (
                    <div className="flex flex-row justify-between items-center">
                        <div className="navbar-container flex flex-row gap-5 p-2.5 w-auto">
                            <h3 className='font-bold'>
                                <a>
                                    <span className='text-(--primary-color) underline text-3xl'>K</span>evin Pratama
                                </a>
                            </h3>

                            <ul className='navbar-links flex flex-row gap-2.5 w-auto h-auto items-end'>
                                <li><a className='hover:text-gray-400 text-white' href='#about-me'>About</a></li>
                                <li><a className='hover:text-gray-400 text-white' href='#projects'>Projects</a></li>
                                <li><a className='hover:text-gray-400 text-white' href='mailto:kpratama1201@gmail.com'>Contact</a></li>
                            </ul>
                        </div>

                        <ul className="flex flex-row items-end gap-2.5 p-2.5 pt-5">
                            <li><a className="hover:text-gray-400 text-white" href="mailto:kpratama1201@gmail.com"><EmailIcon style={{ fontSize: 18 }}></EmailIcon></a></li>
                            <li><a className="hover:text-gray-400 text-white" href="https://github.com/kevinma21/"><GitHubIcon style={{ fontSize: 18 }}></GitHubIcon></a></li>
                            <li><a className="hover:text-gray-400 text-white" href="https://www.linkedin.com/in/kevin-pratama-9454b0250/"><LinkedInIcon style={{ fontSize: 18 }}></LinkedInIcon></a></li>
                        </ul>
                    </div>
                )}
            </div>
            <div className="fixed top-0 z-10 w-full bg-[#0A0E0F] md:hidden">
                <div className="flex items-center w-full  px-5">
                    <h3 className="font-bold">
                        <a href="#intro">
                            <span className="text-(--primary-color) underline text-3xl">K</span>
                        </a>
                    </h3>
                    <ul className="ml-auto flex gap-2.5 p-2.5">
                        <li><EmailIcon sx={{ fontSize: 18 }} /></li>
                        <li><GitHubIcon sx={{ fontSize: 18 }} /></li>
                        <li><LinkedInIcon sx={{ fontSize: 18 }} /></li>
                    </ul>
                </div>
            </div>
        </>
        
        // sticky top-0 to make navbar stick to top when scrolling
        // z-50 to make sure navbar is on top of other elements
        // <div ref={ref} className="navbar sticky top-0 w-full z-50 bg-[#0A0E0F]">
        //     <div className="flex flex-row justify-between items-center">
        //         <div className="navbar-container flex flex-row gap-5 p-2.5 w-auto">
        //             <h3 className="font-bold">
        //                 <a className="text-(--secondary-color)" href="#intro">
        //                     <span className="text-(--primary-color) underline text-3xl">K</span>evin Pratama
        //                 </a>
        //             </h3>

        //             <ul className="navbar-links flex flex-row gap-2.5 w-auto h-auto items-end">
        //                 <li><a className="hover:text-gray-400 text-white" href="#about-me">About</a></li>
        //                 <li><a className="hover:text-gray-400 text-white" href="#projects">Projects</a></li>
        //                 <li><a className="hover:text-gray-400 text-white" href="mailto:kpratama1201@gmail.com">Contact</a></li>
        //             </ul>
        //         </div>

        //          <ul className="flex flex-row items-end gap-2.5 p-2.5 pt-5">
        //             <li><a className="hover:text-gray-400 text-white" href="mailto:kpratama1201@gmail.com"><EmailIcon style={{ fontSize: 18 }}></EmailIcon></a></li>
        //             <li><a className="hover:text-gray-400 text-white" href="https://github.com/kevinma21/"><GitHubIcon style={{ fontSize: 18 }}></GitHubIcon></a></li>
        //             <li><a className="hover:text-gray-400 text-white" href="https://www.linkedin.com/in/kevin-pratama-9454b0250/"><LinkedInIcon style={{ fontSize: 18 }}></LinkedInIcon></a></li>
        //         </ul>
        //     </div>
        // </div>
    );
}
