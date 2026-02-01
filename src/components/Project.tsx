import FolderIcon from '@mui/icons-material/Folder';
import GitHubIcon from '@mui/icons-material/GitHub';
import FadeSection from './FadeSection';

export default function Project() {
    const projects = {
        "Sentiment Analysis Using SVM Algorithm": {
            desc: "In analyzing public perception of a policy, sentiments are typically classified as positive, negative, or neutral.",
            tech: "Python",
            link: "https://github.com/kevinma21/Sentiment-Analysis-Twitter"
        },
        "Website Dentist Appointment": {
            desc: "A system provide feedback, while admins can manage appointments, review feedback, and view data insights through a dashboard.",
            tech: "Laravel, Javascript, Bootstrap, Mysql",
            link: "https://github.com/kevinma21/Dentist-Appointment-System"
        },
        "Book Shelf Api": {
            desc: "CRUD API manages a bookshelf system with features to add, view, update, and delete books.",
            tech: "JavaScript, Hapi.js",
            link: "https://github.com/kevinma21/Book-Shelf-API"
        },
        "Annotation Web": {
            desc: "Manual labeling tool for tweet replies to support sentiment analysis research.",
            tech: "Next.js, Tailwind, Prisma, PosgreSQL, Supabase",
            link: "https://github.com/kevinma21/Annotation-Web"
        },
        "Frontend-CMS": {
            desc: "A frontend CMS web application that allows administrators to manage and display website content with multi-language support and theme customization.",
            tech: "Next.js, Tailwind",
            link: "https://github.com/kevinma21/content-management-system"
        },
        "Classificaton Pollutan": {
            desc: "i aim to classify pollutants using two powerful machine learning algorithms: Support Vector Machine (SVM) and Random Forest.",
            tech: "Python",
            link: "https://github.com/kevinma21/Classification-Pollutan"
        }
    }
    
    return (
        <div id="projects" className="px-25 py-2.5 scroll-mt-50">
            <ul className="grid grid-cols-3 gap-2">
                {Object.entries(projects).map(([title, props], i) => (
                    <FadeSection delay={`${i + 1}00ms`}>
                        <li className="bg-(--bg-color-black-3) border border-(--secondary-color) rounded-4xl p-6 flex flex-col gap-2">
                            <div className="flex flex-col h-[150px] p-5">
                                <div className="flex flex-rows justify-between p-2">
                                    <FolderIcon style={ { fontSize: 40, color: "var(--primary-color)" } } />
                                    <a className="hover:text-white" href={props.link}><GitHubIcon /></a>
                                </div>
                                <h2 className="text-2xl text-white p-2">
                                    {title}
                                </h2>
                            </div>
                            <div className="p-5 h-[150px]" >
                                <p>
                                    {props.desc}
                                </p>
                            </div>
                            <p className="text-(--primary-color) p-5 h-20">
                                    {props.tech}
                            </p>
                        </li>
                    </FadeSection>
                    
                ))}
            </ul>
        </div>
    );
}
