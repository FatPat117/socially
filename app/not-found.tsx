import Link from "next/link";

const NotFound = () => {
        return (
                <div className="flex flex-col items-center justify-center h-screen">
                        <h2>Not Found</h2>
                        <p>Could not find requested resource</p>
                        <Link href="/">Go back to home</Link>
                </div>
        );
};

export default NotFound;
