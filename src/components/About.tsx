import Kevin from '/assets/kevin-pratama.png'
import FadeSection from './FadeSection';

export default function About() {
    const contents = {
        "first": (
            <p>
                I am an undergraduate student at <a className="text-(--primary-color)" href="https://www.mercubuana.ac.id/">Mercu Buana University</a> who enjoys building things on 
                the web and figuring out how stuff works behind the scenes. I love learning new 
                technologies, creating small projects, and exploring ideas that challenge 
                how things are built.
            </p>
        ),
        "second": (
            <p>
                Here are some of the technologies I have been working with lately:
            </p>
        )
    }
    const tech_stack = [
        "TypeScript",
        "React.js",
        "JavaScript ES6+",
        "Laravel",
        "Python"
    ]
    return (
        <div id="about-me" className="flex md:px-25 md:py-2.5 md:gap-7.5 scroll-mt-50">
            <div className="flex flex-col p-1.25 gap-2.5 md:p-2.5 md:gap-5">
                {contents.first}
                {contents.second}
                <ul className="grid grid-cols-2 gap-1">
                    {tech_stack.map((item, i) => {
                        return (
                            <FadeSection delay={`${i + 1}00ms`}>
                                <li key={i} className="text-(--primary-color)">▹ {item}</li>
                            </FadeSection>
                        );
                    })}
                </ul>
            </div>
            <img 
                src={Kevin} 
                className="hidden md:block transition-transform duration-200 ease-in-out hover:scale-105" 
                alt="Kevin Pratama" 
            />
        </div>
    );
}