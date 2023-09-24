import { MouseEventHandler } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { IconUser } from "@tabler/icons-react";

const Navbar = ({
    toggleAuthModal,
}: {
    toggleAuthModal: MouseEventHandler<HTMLButtonElement>;
}) => {
    const { auth } = useAuth();
    console.log(auth);

    return (
        <header className="py-4 bg-primary text-white">
            <div className="max-w-5xl px-4 m-auto flex justify-between items-center">
                <a href="/" className="font-extrabold text-4xl text-white">
                    CoCreate
                </a>
                <div className="flex items-center gap-10">
                    <div className="hidden sm:block">
                        <nav>
                            <ul className="flex gap-4">
                                <li>
                                    <a href="#" className="">
                                        Projects
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="">
                                        Profiles
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    {auth?.accessToken ? (
                        <Link
                            to="/profile"
                            className="backdrop-blur-sm bg-white bg-opacity-40 text-white py-2 px-3 rounded-full font-semibold hover:shadow-white hover:[text-shadow:_0_2px_3px_rgb(0_0_0_/_40%)] transition-all"
                        >
                            <IconUser />
                        </Link>
                    ) : (
                        <button
                            className="backdrop-blur-sm bg-white bg-opacity-40 text-white py-2 px-8 rounded-full font-semibold hover:shadow-white hover:[text-shadow:_0_2px_3px_rgb(0_0_0_/_40%)] transition-all"
                            onClick={toggleAuthModal}
                        >
                            Sign Up
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
