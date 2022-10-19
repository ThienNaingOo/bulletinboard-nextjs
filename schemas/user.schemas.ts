import { object, string } from "yup";

export const storeUserSchema = object({
    name: string()
        .required("Name is required")
        .max(255, "Name is too long (max is 255 character)"),
    email: string()
        .required("Email address is required")
        .email("Should be email format")
        .max(255, "Email is too long (max is 255 character)"),
    password: string()
        .required("Password is required")
        .matches(
            /^.*(?=.{8,})(?=.*\d)((?=.*[A-Z]){1}).*$/,
            "Password must be more than 8 characters long, must contain at least 1 uppercase and 1 numeric"
        ),
    phone: string()
        .required("Phone is required")
        .max(20, "Phone is too long (max is 20)"),
    type: string()
        .equals(['0', '1'], "Type format is invalid"),
    // dob: date()
});

export const updateUserSchema = object({
    id: string()
        .required("ID is required"),
    name: string()
        .required("Name is required")
        .max(255, "Name is too long (max is 255 character)"),
    email: string()
        .required("Email address is required")
        .email("Should be email format")
        .max(255, "Email is too long (max is 255 character)"),
    phone: string()
        .required("Phone is required")
        .max(20, "Phone is too long (max is 20)"),
    type: string()
        .equals(['0', '1'], "Type format is invalid"),
});

export const updateProfileSchema = object({
    name: string()
        .required("Name is required")
        .max(255, "Name is too long (max is 255 character)"),
    email: string()
        .required("Email address is required")
        .email("Should be email format")
        .max(255, "Email is too long (max is 255 character)"),
    phone: string()
        .required("Phone is required")
        .max(20, "Phone is too long (max is 20)"),
});
