import { Request, Response } from "express";
import { UserDoc } from "../interfaces/interfaces";
import dotenv from "dotenv";
import Course from "../models/Course";
import slugify from "../utils/slugify";
import User from "../models/User";
import { title } from "process";
dotenv.config();

const handleErrors = (err: any) => {
    const courseErrors: { [key: string]: string | undefined } = {
        title: "",
        description: "",
    };

    // Course with that name already exists
    if (err.code === 11000) {
        courseErrors.title = "This title is already in use";
        return courseErrors;
    }

    if (err.message.includes("validation failed")) {
        const validationErrors = err.errors as {
            [key: string]: { message: string; path?: string };
        };

        Object.values(validationErrors).forEach(
            ({
                path,
                properties,
            }: {
                path?: string;
                properties?: { message: string };
            }) => {
                if (path) {
                    courseErrors[path] = properties?.message;
                }
            }
        );
    }

    return courseErrors;
};

export const createCourse = async (req: Request, res: Response) => {
    const { title, description } = req.body;
    try {
        const tutor = req.user as UserDoc;
        const tutorId = tutor._id;
        const slug = slugify(title);

        const isTakenName = await Course.find({ slug, tutorId });
        if (isTakenName?.length)
            return res.status(400).json({ title: "Name already taken" });

        const newCourse = await Course.create({
            title,
            description,
            slug,
            tutorId,
        });

        if (!newCourse) return res.sendStatus(400);

        res.status(201).send(newCourse);
    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).send(errors);
    }
};

export const getCourses = async (req: Request, res: Response) => {
    try {
        const user = req.user as UserDoc;
        const userType = user.userType;
        const courseIds = user.courses;
        const userId = user._id;
        let query: object = { tutorId: userId };

        if (userType === "student") {
            query = { _id: { $in: courseIds } };
        }
        const courses = await Course.find(query);

        if (!courses.length) return res.sendStatus(404);
        res.status(200).send(courses);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const getSingleCourse = async (req: Request, res: Response) => {
    const { slug } = req.body;
    const user = req.user as UserDoc;

    try {
        if (!slug) return res.sendStatus(400);
        const course = await Course.findOne({ slug, tutorId: user._id });
        if (!course) return res.sendStatus(404);
        res.status(200).send(course);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const getSingleCourseStudent = async (req: Request, res: Response) => {
    const { slug } = req.body;
    const user = req.user as UserDoc;

    try {
        if (!slug) return res.sendStatus(400);
        const course = await Course.findOne({ slug });
        if (!course) return res.sendStatus(404);

        const student = await User.findOne({ _id: user._id });
        if (!student) return res.status(401).send("No student found");

        const courseIds = student.courses;
        if (!courseIds.length) return res.sendStatus(404);

        const hasAccess = courseIds.filter((el) => el === course._id);
        if (!hasAccess) return res.sendStatus(404);

        res.status(200).send(course);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const giveAccessToCourse = async (req: Request, res: Response) => {
    const { email, courseId } = req.body;
    try {
        const user = req.user as UserDoc;
        if (!user || user.userType !== "tutor") {
            return res.status(401).json({ msg: "You're not a tutor:(" });
        }

        if (!email)
            return res.status(400).json({ email: "Please enter an email" });

        const student = await User.findOne({ email });
        if (!student)
            return res.status(404).json({ email: "No user with this email" });
        if (!courseId) return res.status(400).send("No course ID");

        // Check if already has access
        const hasCourse = student.courses.filter((el) => el === courseId);
        if (hasCourse.length)
            return res
                .status(400)
                .json({ msg: "Student already has the course" });

        const foundTutor = await User.findOne({ _id: user._id });

        if (!foundTutor) return res.status(400).send("Tutor not found");
        const hasStudent = foundTutor.students.filter(
            (el) => el === student._id
        );
        if (!hasStudent.length) {
            foundTutor.students.push(student._id);
            await foundTutor.save();
        }

        student.courses.push(courseId);
        await student.save();

        res.status(204).send("Data saved successfully");
    } catch (error) {
        console.log(error);
    }
};

export const updateCourse = async (req: Request, res: Response) => {
    const { singleData, slug } = req.body;
    const { _id: tutorId } = req.user as UserDoc;

    try {
        if (!singleData) return res.sendStatus(400);

        const course = await Course.findOne({ slug, tutorId });
        if (!course) return res.sendStatus(404);

        if (!singleData.title) {
            return res.status(400).json({ title: "Please provide a title" });
        }

        if (course.title !== singleData.title) {
            const newSlug = slugify(singleData.title);
            const isTakenName = await Course.find({ slug: newSlug, tutorId });
            if (isTakenName?.length)
                return res.status(400).json({ title: "This title is taken" });

            course.title = singleData.title;
            course.slug = newSlug;
        }

        if (course.description !== singleData.description) {
            course.description = singleData.description;
        }

        await course.save();

        res.send(course);
    } catch (error) {
        // console.log(error);
        res.status(500).send(error);
    }
};
