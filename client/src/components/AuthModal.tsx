import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "../api/axios";
import useAuth from "./../hooks/useAuth";
import { IconX } from "@tabler/icons-react";

const AuthModal = ({
    toggleAuthModal,
    isAuthModal,
}: {
    toggleAuthModal: CallableFunction;
    isAuthModal: boolean;
}) => {
    interface formData {
        [key: string]: string;
    }
    const initialFormData = {
        email: "",
        password: "",
        passwordRep: "",
    };

    const { setAuth } = useAuth();

    const [isSignup, setIsSignup] = useState(true);
    const [formData, setformData] = useState<formData>(initialFormData);
    const [formErrors, setformErrors] = useState(initialFormData);

    const toggleForm = (isSignupClick: boolean) => {
        setIsSignup(isSignupClick);
        setformErrors(initialFormData);
    };

    const handleErrors = (formData: formData) => {
        const authErrors = { email: "", password: "", passwordRep: "" };

        if (!formData.email) {
            authErrors.email = "Please enter an email";
            setformErrors(authErrors);
            return false;
        }

        if (!formData.password) {
            authErrors.password = "Please enter a password";
            setformErrors(authErrors);
            return false;
        }

        if (!formData.passwordRep && isSignup) {
            authErrors.passwordRep = "Repeat your password please";
            setformErrors(authErrors);
            return false;
        }

        return true;
    };

    const submitForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (!handleErrors(formData)) {
                return;
            }
            const resp = await axios.post(
                isSignup ? "/signup" : "/login",
                formData,
                {
                    withCredentials: true,
                }
            );

            // console.log(resp);
            if (resp.status === 200 || resp.status === 201) {
                const accessToken = resp.data?.accessToken;
                setAuth({ accessToken });
                toggleAuthModal();
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleFormData = async (e: ChangeEvent<HTMLInputElement>) => {
        setformData((prevFormData) => {
            return {
                ...prevFormData,
                [e.target?.name]: e.target?.value,
            };
        });
    };

    useEffect(() => {
        setformData(initialFormData);
    }, [isAuthModal]);

    return (
        <div
            className={`text-blueGray fixed top-1/2 -translate-y-1/2 left-0 right-0 mx-auto max-w-xs bg-white pt-8 pb-14 flex items-center flex-col bg-cover z-10 rounded-2xl transition-all`}
        >
            <div className="flex justify-center bg-primary bg-opacity-60 backdrop-blur-sm text-white rounded-2xl mb-4">
                <button
                    onClick={() => toggleForm(true)}
                    className={`font-semibold py-2 px-8 border-2 rounded-2xl transition-all ${
                        isSignup
                            ? " bg-primary bg-opacity-100 border-primary"
                            : "border-transparent"
                    }`}
                >
                    Sign up
                </button>
                <button
                    onClick={() => toggleForm(false)}
                    className={`font-semibold py-2 px-8 border-2 rounded-2xl transition-all ${
                        !isSignup
                            ? " bg-primary bg-opacity-100 border-primary"
                            : "border-transparent"
                    }`}
                >
                    Log in
                </button>
            </div>
            <form
                className="mt-4 w-full px-10 flex flex-col items-center"
                onSubmit={(e) => submitForm(e)}
            >
                <div className="mb-2">
                    <label htmlFor="email" className="block font-semibold">
                        Email
                    </label>
                    <input
                        type="text"
                        id="email"
                        className="bg-input text-blueGray py-2 px-4 rounded-lg mt-1 w-full shadow-md"
                        placeholder="Your email"
                        name="email"
                        onChange={handleFormData}
                        value={formData.email}
                    />
                    {formErrors?.email ? (
                        <p className="text-red-400 mt-2">{formErrors?.email}</p>
                    ) : (
                        ""
                    )}
                </div>
                <div className="">
                    <label htmlFor="password" className="block font-semibold">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="bg-input text-blueGray py-2 px-4 rounded-lg mt-1 w-full shadow-md"
                        placeholder="Not 1234 please:)"
                        name="password"
                        onChange={handleFormData}
                        value={formData.password}
                    />
                    {formErrors?.password ? (
                        <p className="text-red-400 mt-2">
                            {formErrors?.password}
                        </p>
                    ) : (
                        ""
                    )}
                </div>
                <div
                    className={`transition-all ${
                        !isSignup
                            ? " opacity-0 pointer-events-none -z-10 select-none max-h-0"
                            : " max-h-60 mt-2"
                    }`}
                >
                    <label
                        htmlFor="passwordRep"
                        className="block font-semibold"
                    >
                        Repeat password
                    </label>
                    <input
                        type="password"
                        id="passwordRep"
                        className="bg-input text-blueGray py-2 px-4 rounded-lg mt-1 w-full shadow-md"
                        placeholder="Repeat the same passwordRep"
                        name="passwordRep"
                        onChange={handleFormData}
                        value={formData.passwordRep}
                    />
                    {formErrors?.passwordRep ? (
                        <p className="text-red-400 mt-2">
                            {formErrors?.passwordRep}
                        </p>
                    ) : (
                        ""
                    )}
                </div>
                <button
                    type="submit"
                    className="bg-primary text-white py-2 px-8 rounded-xl text-lg font-semibold mt-6"
                >
                    Submit
                </button>
            </form>
            <button
                className="absolute -bottom-3 bg-secRed w-9 h-9 flex items-center justify-center rounded-full"
                onClick={() => toggleAuthModal()}
            >
                <IconX color="white" />
            </button>
        </div>
    );
};

export default AuthModal;
