import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { useFormik } from "formik";
import { classNames } from "primereact/utils";
import { Card } from "primereact/card";
export default function Create() {
    const [products, setProducts] = useState([]);
    const [value, setValue] = useState("");

    const formik = useFormik({
        initialValues: {
            customer_name: "",
            customer_address: "",
            company_name: "",
            company_address: "",
            quotation_id: "",
            quotation_date: "",
        },
        validate: (data) => {
            let errors = {};

            if (!data.customer_name) {
                errors.customer_name = "El nombre es requerido";
            }

            return errors;
        },
        onSubmit: (data) => {
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
                    Crear Cotizacion
                </h2>
            }
        >
            <Head title="Cotizaciones" />
            <Card title="Crear Cotizacion">
                <div>
                    <div className="">
                        <div className="">
                            <form
                                onSubmit={formik.handleSubmit}
                                className="formgrid grid"
                            >
                                <div className="field col">
                                    <label
                                        htmlFor="integeronly"
                                        className="font-bold block mb-2"
                                    >
                                        Cliente
                                    </label>
                                    <div className="field">
                                        <InputText
                                            value={formik.customer_name}
                                            onChange={formik.handleChange}
                                            className={classNames({
                                                "p-invalid":
                                                    isFormFieldValid(
                                                        "customer_name"
                                                    ),
                                            })}
                                        />
                                        {getFormErrorMessage("customer_name")}
                                    </div>
                                    <div className="field">
                                        <InputText
                                            value={formik.customer_address}
                                            onChange={formik.handleChange}
                                            className={classNames({
                                                "p-invalid":
                                                    isFormFieldValid(
                                                        "customer_address"
                                                    ),
                                            })}
                                        />
                                        {getFormErrorMessage(
                                            "customer_address"
                                        )}
                                    </div>

                                    <label
                                        htmlFor="integeronly"
                                        className="font-bold block mb-2"
                                    >
                                        Empresa
                                    </label>
                                    <div className="field">
                                        <InputText
                                            value={formik.customer_name}
                                            onChange={formik.handleChange}
                                            className={classNames({
                                                "p-invalid":
                                                    isFormFieldValid(
                                                        "customer_name"
                                                    ),
                                            })}
                                        />
                                        {getFormErrorMessage("customer_name")}
                                    </div>
                                    <div className="field">
                                        <InputText
                                            value={formik.customer_address}
                                            onChange={formik.handleChange}
                                            className={classNames({
                                                "p-invalid":
                                                    isFormFieldValid(
                                                        "customer_address"
                                                    ),
                                            })}
                                        />
                                        {getFormErrorMessage(
                                            "customer_address"
                                        )}
                                    </div>
                                </div>
                                <div className="field col">
                                    <div className="field grid">
                                        <label
                                            htmlFor="quotation_id"
                                            className="col-fixed"
                                        >
                                            No. Cotizacion
                                        </label>
                                        <InputText
                                            id="quotation_id"
                                            value={formik.quotation_id}
                                            onChange={formik.handleChange}
                                            className={classNames({
                                                "p-invalid":
                                                    isFormFieldValid(
                                                        "quotation_id"
                                                    ),
                                            })}
                                        />
                                        {getFormErrorMessage("quotation_id")}
                                    </div>

                                    <div className="field grid">
                                        <label
                                            htmlFor="quotation_date"
                                            className="col-fixed"
                                        >
                                            Fecha Cotizacion
                                        </label>
                                        <InputText
                                            id="quotation_date"
                                            value={formik.quotation_date}
                                            onChange={formik.handleChange}
                                            className={classNames({
                                                "p-invalid":
                                                    isFormFieldValid(
                                                        "quotation_date"
                                                    ),
                                            })}
                                        />
                                        {getFormErrorMessage("quotation_date")}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/*Table Items Content*/}
                <div>Table</div>
                {/*Table Summary Content*/}
                <div>Totals</div>
            </Card>
        </AuthenticatedLayout>
    );
}
