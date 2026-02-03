export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <div className="md:px-25 py-12.5 text-sm text-center text-gray-500">
            <p>© <span>{currentYear}</span> Kevin Pratama. <br/>
            All rights reserved.</p>
        </div>
    );
}