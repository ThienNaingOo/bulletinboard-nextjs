import { object, string } from "yup";

export const storePostSchema = object({
    title: string()
        .required("Name is required")
        .max(255, "Name is too long (max is 255 character)"),
    description: string().required("Description is required").max(255, "Des is too long (max is 255 character)"),
})

export const updatePostSchema = object({
    post_id: string()
        .required("Post ID is required"),
    title: string()
        .required("Name is required")
        .max(255, "Name is too long (max is 255 character)"),
    description: string().required("Description is required"),
    status: string()
        .required("Status is required")
        .equals(['0', '1'], "Status format is invalid")
})