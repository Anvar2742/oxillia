import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Link, useLocation } from "react-router-dom";
import { CourseDoc } from "../interfaces/interfaces";
import { AxiosError } from "axios";
import TitleCreateModal from "../components/TitleCreateModal";
import TitleLoader from "../components/TitleLoader";

const Courses = () => {
    const location = useLocation();
    const [isCreateModal, setIsCreateModal] = useState<boolean>(false);
    const [coursesArr, setCoursesArr] = useState<CourseDoc[]>([]);
    const [coursesEls, setCoursesEls] = useState<JSX.Element[] | JSX.Element>(
        []
    );
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getCourses = async () => {
        try {
            const resp = await axiosPrivate.get("/courses");
            if (resp.status === 200) {
                setCoursesArr(resp.data);
                setIsLoading(false);
            }
        } catch (error: AxiosError | any) {
            console.log(error);

            if (error.response.status === 404) {
                setCoursesEls(
                    <div>
                        <h2 className="font-medium text-xl">
                            You don't have any courses yet
                        </h2>
                        <p className="text-md">Let's create one</p>
                    </div>
                );
            }
            setIsLoading(false);
        }
    };
    const axiosPrivate = useAxiosPrivate();

    const toggleCreateModal = () => {
        setIsCreateModal((prev) => !prev);
    };

    useEffect(() => {
        getCourses();
    }, [location?.pathname]);

    useEffect(() => {
        if (coursesArr.length) {
            setCoursesEls(() => {
                return coursesArr.map((course) => {
                    return (
                        <Link
                            to={`/courses/${course.slug}`}
                            state={{ course }}
                            key={course._id}
                            className="border-2 border-primary rounded-md bg-gray-100 py-2 px-4 block"
                        >
                            <h3 className="font-bold text-2xl">
                                {course.title}
                            </h3>
                            <p>{course.description}</p>
                        </Link>
                    );
                });
            });
        }
    }, [coursesArr]);

    return (
        <section className=" py-24">
            <div className="max-w-5xl px-4 m-auto">
                <h1 className="font-bold text-5xl">Your courses</h1>
                <div className="mt-8 grid gap-4">
                    {isLoading ? <TitleLoader /> : coursesEls}
                </div>
                <button
                    onClick={toggleCreateModal}
                    className="bg-primary block text-white py-2 px-8 rounded-full font-semibold hover:shadow-black hover:[text-shadow:_0_2px_3px_rgb(0_0_0_/_40%)] transition-all mt-6 mx-auto"
                >
                    New Course
                </button>
                <TitleCreateModal
                    toggleCreateModal={toggleCreateModal}
                    isCreateModal={isCreateModal}
                    typeOfTitle="course"
                    courseId={null}
                />
            </div>
        </section>
    );
};

export default Courses;
