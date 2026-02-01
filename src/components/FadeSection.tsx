import { useState, useRef, useEffect } from "react";

export default function FadeSection(props: { 
    children: React.ReactNode,
    delay?: string
}) {
    const [visible, SetVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    SetVisible(true);
                }
            });
        });

        if (ref.current) observer.observe(ref.current);

        return () => observer.disconnect();
    }, []);

    return (
        <div 
            className={`transition-all duration-700 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            style={{ transitionDelay: `${props.delay}`}}
            ref={ref}
        >
            {props.children}
        </div>
    );
}