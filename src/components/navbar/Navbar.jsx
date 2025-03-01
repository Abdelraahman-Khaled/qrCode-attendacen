import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import useLogout from "../../hooks/useLogout";
import logo from "../../assets/logo.webp"
import { LogIn, LogOut } from "lucide-react";

const Navbar = () => {
    // call logout function from the hook
    const { logout } = useLogout();
    const { user } = useAuthContext();
    // handle function to handle the logout using the logout hook
    const handleClick = () => {
        logout();
    };
    return (
        <header>
            <div className="container">
                <Link to="/">
                    <img src={logo} alt="Logo" width={183} />
                </Link>
                <nav>
                    {user && (
                        <div>
                            <span>{user.name}</span>
                            <button onClick={handleClick}>
                                <LogOut className="w-5 h-5" />
                                Log out
                            </button>
                        </div>
                    )}
                    {!user && (
                        <div className="flex">
                            <Link
                                to="/login"
                                className="px-5 py-2 flex items-center gap-2 text-[var(--primary)] bg-white/10 border border-[var(--primary)] rounded"
                            >
                                <LogIn className="w-5 h-5" />
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="px-4 py-2 flex items-center gap-2 text-white bg-[var(--primary)] border border-[var(--primary)] rounded"
                            >
                                <LogOut className="w-5 h-5" />
                                Signup
                            </Link>

                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
