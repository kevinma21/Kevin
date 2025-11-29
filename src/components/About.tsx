import Kevin from '/assets/kevin-pratama.png'

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
        ),
        "third": (
            <p>
                Outside of coding, I’m interested in the development of science and like spending time 
                watching TV shows.
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
        <div className="flex px-25 py-2.5 gap-7.5">
            <div className="flex flex-col p-2.5 gap-5">
                {contents.first}
                {contents.second}
                <ul className="grid grid-cols-2">
                    {tech_stack.map((item) => {
                        return (
                            <li className="text-(--primary-color)">▹ {item}</li>
                        );
                    })}
                </ul>
                {contents.third}
            </div>
            <img src={Kevin} alt="Kevin Pratama" />
        </div>
    );
}