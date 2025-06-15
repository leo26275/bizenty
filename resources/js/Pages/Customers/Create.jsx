import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { router } from "@inertiajs/react";
import "./FormDemo.css";
import { Card } from "primereact/card";

const Create = () => {
    const formik = useFormik({
        initialValues: {
            first_name: "",
            middle_name: "",
            last_name: "",
            address: "",
            phone: "",
        },
        validate: (data) => {
            let errors = {};

            if (!data.first_name) {
                errors.first_name = "First name is required";
            }

            if (!data.last_name) {
                errors.last_name = "Last name is required";
            }

            if (!data.address) {
                errors.address = "Address is required";
            }

            if (!data.phone) {
                errors.phone = "The phone field is required";
            }

            return errors;
        },
        onSubmit: (data) => {
            console.log(data);
            router.post("/customers", data);
            formik.resetForm();
        },
    });

    const isFormFieldValid = (name) =>
        !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return (
            isFormFieldValid(name) && (
                <small className="p-error">{formik.errors[name]}</small>
            )
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create Customer
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <Card>
                            <div className="form-demo">
                                <div className="flex justify-content-center">
                                    <div className="card">
                                        <h5 className="text-center">
                                            Customer information
                                        </h5>
                                        <form
                                            onSubmit={formik.handleSubmit}
                                            className="p-fluid"
                                        >
                                            <div className="field">
                                                <span className="p-float-label">
                                                    <InputText
                                                        id="first_name"
                                                        name="first_name"
                                                        value={
                                                            formik.values
                                                                .first_name
                                                        }
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                        autoFocus
                                                        className={classNames({
                                                            "p-invalid":
                                                                isFormFieldValid(
                                                                    "first_name"
                                                                ),
                                                        })}
                                                    />
                                                    <label
                                                        htmlFor="first_name"
                                                        className={classNames({
                                                            "p-error":
                                                                isFormFieldValid(
                                                                    "first_name"
                                                                ),
                                                        })}
                                                    >
                                                        First name*
                                                    </label>
                                                </span>
                                                {getFormErrorMessage(
                                                    "first_name"
                                                )}
                                            </div>

                                            <div className="field">
                                                <span className="p-float-label">
                                                    <InputText
                                                        id="middle_name"
                                                        name="middle_name"
                                                        value={
                                                            formik.values
                                                                .middle_name
                                                        }
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                        autoFocus
                                                        className={classNames({
                                                            "p-invalid":
                                                                isFormFieldValid(
                                                                    "middle_name"
                                                                ),
                                                        })}
                                                    />
                                                    <label
                                                        htmlFor="middle_name"
                                                        className={classNames({
                                                            "p-error":
                                                                isFormFieldValid(
                                                                    "middle_name"
                                                                ),
                                                        })}
                                                    >
                                                        Middle name
                                                    </label>
                                                </span>
                                                {getFormErrorMessage(
                                                    "middle_name"
                                                )}
                                            </div>

                                            <div className="field">
                                                <span className="p-float-label">
                                                    <InputText
                                                        id="last_name"
                                                        name="last_name"
                                                        value={
                                                            formik.values
                                                                .last_name
                                                        }
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                        autoFocus
                                                        className={classNames({
                                                            "p-invalid":
                                                                isFormFieldValid(
                                                                    "last_name"
                                                                ),
                                                        })}
                                                    />
                                                    <label
                                                        htmlFor="last_name"
                                                        className={classNames({
                                                            "p-error":
                                                                isFormFieldValid(
                                                                    "last_name"
                                                                ),
                                                        })}
                                                    >
                                                        Last name*
                                                    </label>
                                                </span>
                                                {getFormErrorMessage(
                                                    "last_name"
                                                )}
                                            </div>

                                            <div className="field">
                                                <span className="p-float-label">
                                                    <InputText
                                                        id="address"
                                                        name="address"
                                                        value={
                                                            formik.values
                                                                .address
                                                        }
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                        autoFocus
                                                        className={classNames({
                                                            "p-invalid":
                                                                isFormFieldValid(
                                                                    "address"
                                                                ),
                                                        })}
                                                    />
                                                    <label
                                                        htmlFor="address"
                                                        className={classNames({
                                                            "p-error":
                                                                isFormFieldValid(
                                                                    "address"
                                                                ),
                                                        })}
                                                    >
                                                        Address*
                                                    </label>
                                                </span>
                                                {getFormErrorMessage("address")}
                                            </div>

                                            <div className="field">
                                                <span className="p-float-label">
                                                    <InputText
                                                        id="phone"
                                                        name="phone"
                                                        value={
                                                            formik.values.phone
                                                        }
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                        autoFocus
                                                        className={classNames({
                                                            "p-invalid":
                                                                isFormFieldValid(
                                                                    "phone"
                                                                ),
                                                        })}
                                                    />
                                                    <label
                                                        htmlFor="phone"
                                                        className={classNames({
                                                            "p-error":
                                                                isFormFieldValid(
                                                                    "phone"
                                                                ),
                                                        })}
                                                    >
                                                        Phone*
                                                    </label>
                                                </span>
                                                {getFormErrorMessage("phone")}
                                            </div>

                                            <Button
                                                type="submit"
                                                label="Save"
                                                className="mt-2"
                                            />
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Create;
