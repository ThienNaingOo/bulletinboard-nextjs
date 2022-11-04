import { date, object, string } from "yup";

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
    dob: date()
        .min(new Date(1753, 1, 1), "Date format is invalid")
        .max(new Date(), "Date format is invalid (Future Date)")
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
    dob: date()
        .min(new Date(1753, 1, 1), "Date format is invalid")
        .max(new Date(), "Date format is invalid (Future Date)")
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

export const changePasswordSchema = object({
    old_password: string()
        .required("Old password is required"),
    new_password: string()
        .required("New password is required")
        .matches(
            /^.*(?=.{8,})(?=.*\d)((?=.*[A-Z]){1}).*$/,
            "New password must be more than 8 characters long, must contain at least 1 uppercase and 1 numeric"
        ),
})
