import { syncUser } from "@/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
const Navbar = async () => {
        const user = await currentUser();

        if (user) {
                await syncUser();
        }
        return (
                <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
                        <div className="max-w-7xl mx-auto px-4">
                                <div className="flex items-center justify-between">
                                        {/* Logo */}
                                        <Link
                                                href="/"
                                                className="text-xl font-bold text-primary font-mono tracking-wider"
                                        >
                                                Socially
                                        </Link>
                                        {/* Desktop Navbar */}
                                        <DesktopNavbar />
                                        {/* Mobile Navbar */}
                                        <MobileNavbar />
                                </div>
                        </div>
                </nav>
        );
};

export default Navbar;
