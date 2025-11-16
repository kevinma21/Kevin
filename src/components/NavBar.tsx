import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';

export default function NavBar() {
    return (
        // sticky top-0 to make navbar stick to top when scrolling
        // z-50 to make sure navbar is on top of other elements
        <div className="navbar sticky top-0 w-full z-50">
            <div className="flex flex-row justify-between items-center">
                <div className="navbar-container flex flex-row gap-5 p-2.5 w-auto">
                    <h3 className="font-bold">
                        <a className="text-(--secondary-color)" href="#home">
                            <span className="text-(--primary-color) underline text-3xl">K</span>evin Pratama
                        </a>
                    </h3>

                    <ul className="navbar-links flex flex-row gap-2.5 w-auto h-auto items-end">
                        <li><a className="hover:text-gray-400 text-white" href="#about-me">About</a></li>
                        <li><a className="hover:text-gray-400 text-white" href="#projects">Projects</a></li>
                        <li><a className="hover:text-gray-400 text-white" href="#contact">Contact</a></li>
                    </ul>
                </div>

                 <ul className="flex flex-row items-end gap-2.5 p-2.5 pt-5">
                    <li><a className="hover:text-gray-400 text-white" href="mailto:kpratama1201@gmail.com"><EmailIcon style={{ fontSize: 18 }}></EmailIcon></a></li>
                    <li><a className="hover:text-gray-400 text-white" href="https://github.com/kevinma21/"><GitHubIcon style={{ fontSize: 18 }}></GitHubIcon></a></li>
                    <li><a className="hover:text-gray-400 text-white" href="https://www.linkedin.com/in/kevin-pratama-9454b0250/"><LinkedInIcon style={{ fontSize: 18 }}></LinkedInIcon></a></li>
                </ul>
            </div>
        </div>
    );
}
