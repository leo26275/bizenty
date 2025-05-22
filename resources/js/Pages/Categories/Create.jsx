import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useFormik } from "formik";
import "./FormDemo.css";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { Button } from 'primereact/button';
import { router } from "@inertiajs/react";

export default function Dashboard() {
    const formik = useFormik({
        initialValues: {
            name: ""
        },
        validate: (data) => {
            let errors = {};

            if (!data.name) {
                errors.name = "El nombre es requerido";
            }

            return errors;
        },
        onSubmit: (data) => {
            console.log(data);
            router.post('/categories', data);
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
                    Crear Categoria
                </h2>
            }
        >
            <div className="form-demo">
                <div className="flex justify-content-center">
                    <div className="card">
                        <h5 className="text-center">CATERGORIA DEL SERVICIO</h5>
                        <form
                            onSubmit={formik.handleSubmit}
                            className="p-fluid"
                        >
                            <div className="field">
                                <span className="p-float-label">
                                    <InputText
                                        id="name"
                                        name="name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        autoFocus
                                        className={classNames({
                                            "p-invalid":
                                                isFormFieldValid("name"),
                                        })}
                                    />
                                    <label
                                        htmlFor="name"
                                        className={classNames({
                                            "p-error": isFormFieldValid("name"),
                                        })}
                                    >
                                        Nombre*
                                    </label>
                                </span>
                                {getFormErrorMessage("name")}
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
}
