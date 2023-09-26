import { Link } from "react-router-dom";

const Home = () => {
    return (
        <>
            <section className="py-32 bg-heroBg bg-cover">
                <div className="max-w-5xl mx-auto px-4">
                    <h1 className="text-3xl font-bold">Lorem ipsum!</h1>
                    <p className="text-lg mt-1 mb-3">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </p>
                    <Link
                        to="/courses"
                        className="bg-primary inline-block text-white py-2 px-8 rounded-full font-semibold hover:shadow-black hover:[text-shadow:_0_2px_3px_rgb(0_0_0_/_40%)] transition-all"
                    >
                        Ipsum?
                    </Link>
                </div>
            </section>
        </>
    );
};

export default Home;