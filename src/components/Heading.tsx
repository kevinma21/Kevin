export default function Heading(props: { headingName: string }) {
    return (
        <div className="py-6 md:px-25 md:py-12.5">
            <div className="flex items-end md:w-1/2">
                <h2 className="text-lg md:text-3xl font-extrabold text-gray-200 md:mr-4 md:m-0 md:p-0 leading-none">
                    / {props.headingName}
                </h2>
                <div className="invisible md:visible h-0.5 bg-(--secondary-color) grow opacity-50"></div>
            </div>
        </div>
    );
}


