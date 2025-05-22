import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { Button } from 'primereact/button';
import { router } from "@inertiajs/react";
import "./FormDemo.css";

const Create = () => {
    const formik = useFormik({
        initialValues: {
            first_name: "",
            middle_name: "",
            last_name: "",
            address: ""
        },
        validate: (data) => {
            let errors = {};

            if (!data.first_name) {
                errors.first_name = "El nombre es requerido";
            }


            if (!data.last_name) {
                errors.last_name = "Los apellidos son requeridos";
            }

            if (!data.address) {
                errors.address = "La direccion es requerida";
            }

            return errors;
        },
        onSubmit: (data) => {
            console.log(data);
            router.post('/customers', data);
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
                    Crear Cliente
                </h2>
            }
        >

            <div className="form-demo">
                <div className="flex justify-content-center">
                    <div className="card">
                        <h5 className="text-center">DATOS DEL CLIENTE</h5>
                        <form
                            onSubmit={formik.handleSubmit}
                            className="p-fluid"
                        >
                            <div className="field">
                                <span className="p-float-label">
                                    <InputText
                                        id="first_name"
                                        name="first_name"
                                        value={formik.values.first_name}
                                        onChange={formik.handleChange}
                                        autoFocus
                                        className={classNames({
                                            "p-invalid":
                                                isFormFieldValid("first_name"),
                                        })}
                                    />
                                    <label
                                        htmlFor="first_name"
                                        className={classNames({
                                            "p-error": isFormFieldValid("first_name"),
                                        })}
                                    >
                                        Primer Nombre*
                                    </label>
                                </span>
                                {getFormErrorMessage("first_name")}
                            </div>

                            <div className="field">
                                <span className="p-float-label">
                                    <InputText
                                        id="middle_name"
                                        name="middle_name"
                                        value={formik.values.middle_name}
                                        onChange={formik.handleChange}
                                        autoFocus
                                        className={classNames({
                                            "p-invalid":
                                                isFormFieldValid("middle_name"),
                                        })}
                                    />
                                    <label
                                        htmlFor="middle_name"
                                        className={classNames({
                                            "p-error": isFormFieldValid("middle_name"),
                                        })}
                                    >
                                        Segundo Nombre
                                    </label>
                                </span>
                                {getFormErrorMessage("middle_name")}
                            </div>

                            <div className="field">
                                <span className="p-float-label">
                                    <InputText
                                        id="last_name"
                                        name="last_name"
                                        value={formik.values.last_name}
                                        onChange={formik.handleChange}
                                        autoFocus
                                        className={classNames({
                                            "p-invalid":
                                                isFormFieldValid("last_name"),
                                        })}
                                    />
                                    <label
                                        htmlFor="last_name"
                                        className={classNames({
                                            "p-error": isFormFieldValid("last_name"),
                                        })}
                                    >
                                        Apellidos*
                                    </label>
                                </span>
                                {getFormErrorMessage("last_name")}
                            </div>

                            <div className="field">
                                <span className="p-float-label">
                                    <InputText
                                        id="address"
                                        name="address"
                                        value={formik.values.address}
                                        onChange={formik.handleChange}
                                        autoFocus
                                        className={classNames({
                                            "p-invalid":
                                                isFormFieldValid("address"),
                                        })}
                                    />
                                    <label
                                        htmlFor="address"
                                        className={classNames({
                                            "p-error": isFormFieldValid("address"),
                                        })}
                                    >
                                        Direccion*
                                    </label>
                                </span>
                                {getFormErrorMessage("address")}
                            </div>

                            <Button
                                type="submit"
                                label="Submit"
                                className="mt-2"
                            />
                        </form>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
};


export default Create;
