export default function Heading(props: { headingName: string }) {
    return (
        <div className="px-25 py-12.5">
            <div className="flex items-end w-1/2">
                <h2 className="text-3xl text-white mr-4 m-0 p-0 leading-none">
                    / {props.headingName}
                </h2>
                <div className="h-0.5 bg-(--secondary-color) grow opacity-50"></div>
            </div>
        </div>
    );
}
