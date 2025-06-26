import { Card } from "primereact/card";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useFormik } from "formik";
import { usePage, router } from "@inertiajs/react";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { FileUpload } from "primereact/fileupload";
import "@/Pages/Company/styles/style.page.scss";
import { useEffect, useState, useRef } from "react";
import { Button } from "primereact/button";
import { Toast } from 'primereact/toast';

const Setting = () => {
    const { settingData, logoURL } = usePage().props;
    const [imageUrl, setImageUrl] = useState(null);
    const [companyLogo, setCompanyLogo] = useState('');

    const toast = useRef(null);
    const formik = useFormik({
        initialValues: {
            company_name: settingData.company_name,
            legal_name: settingData.legal_name,
            address: settingData.address,
            website: settingData.website,
            phone: settingData.phone,
            logo: settingData.logo,
            logo_base64: null
        },
        validate: (data) => {
            let errors = {};

            if (!data.company_name) {
                errors.company_name = "Company name is required";
            }

            if (!data.legal_name) {
                errors.legal_name = "Legal name is required";
            }

            if (!data.address) {
                errors.address = "Address is required";
            }

            if (!data.website) {
                errors.website = "Website is required";
            }

            if (!data.phone) {
                errors.phone = "Phone is required";
            }

            return errors;
        },
        onSubmit: (data) => {

            if(companyLogo != undefined){
                data.logo_base64 = companyLogo;
            }

            //formData.append("company_name", data.company_name);

            router.post("/company/setting", data, {
                onSuccess: () => {
                    window.location.reload();
                },
                onError: (errors) => {
                    const firstKey = Object.keys(errors)[0];
                    if(firstKey != undefined){
                        showError(errors[firstKey]);
                    }
                },
            });
        },
    });

    const showError = (detailsMsg) => {
        toast.current.show({severity:'error', summary: 'An error has ocurred', detail:detailsMsg , life: 3000});
    }

    const isFormFieldValid = (name) =>
        !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return (
            isFormFieldValid(name) && (
                <small className="p-error">{formik.errors[name]}</small>
            )
        );
    };

    const handleFileSelect = (e) => {
        const file = e.files[0];

        setImageUrl(URL.createObjectURL(file));

         const reader = new FileReader();
         reader.onloadend = () => {
            setCompanyLogo(reader.result);
         };
         reader.readAsDataURL(file);
    };


    useEffect(() => {
        if (logoURL) {
            setImageUrl(logoURL);
        }
    }, []);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Company Settings
                </h2>
            }
        >
            <Toast ref={toast} />
            <form onSubmit={formik.handleSubmit} className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <Card title="Company Settings">
                            <div class="formgrid grid p-fluid">
                                <div class="field col">
                                    <div class="field col-12 pb-3">
                                        <span className="p-float-label">
                                            <InputText
                                                id="company_name"
                                                name="company_name"
                                                value={
                                                    formik.values.company_name
                                                }
                                                onChange={formik.handleChange}
                                                autoFocus
                                                className={classNames({
                                                    "p-invalid":
                                                        isFormFieldValid(
                                                            "company_name"
                                                        ),
                                                })}
                                            />
                                            <label
                                                htmlFor="company_name"
                                                className={classNames({
                                                    "p-error":
                                                        isFormFieldValid(
                                                            "company_name"
                                                        ),
                                                })}
                                            >
                                                Company name*
                                            </label>
                                        </span>
                                        {getFormErrorMessage("company_name")}
                                    </div>
                                    <div class="field col-12 pb-3">
                                        <span className="p-float-label">
                                            <InputText
                                                id="legal_name"
                                                name="legal_name"
                                                value={formik.values.legal_name}
                                                onChange={formik.handleChange}
                                                autoFocus
                                                className={classNames({
                                                    "p-invalid":
                                                        isFormFieldValid(
                                                            "legal_name"
                                                        ),
                                                })}
                                            />
                                            <label
                                                htmlFor="legal_name"
                                                className={classNames({
                                                    "p-error":
                                                        isFormFieldValid(
                                                            "legal_name"
                                                        ),
                                                })}
                                            >
                                                Legal name*
                                            </label>
                                        </span>
                                        {getFormErrorMessage("legal_name")}
                                    </div>
                                    <div class="field col-12 pb-3">
                                        <span className="p-float-label">
                                            <InputText
                                                id="address"
                                                name="address"
                                                value={formik.values.address}
                                                onChange={formik.handleChange}
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
                                    <div class="field col-12 pb-3">
                                        <span className="p-float-label">
                                            <InputText
                                                id="website"
                                                name="website"
                                                value={formik.values.website}
                                                onChange={formik.handleChange}
                                                autoFocus
                                                className={classNames({
                                                    "p-invalid":
                                                        isFormFieldValid(
                                                            "website"
                                                        ),
                                                })}
                                            />
                                            <label
                                                htmlFor="website"
                                                className={classNames({
                                                    "p-error":
                                                        isFormFieldValid(
                                                            "website"
                                                        ),
                                                })}
                                            >
                                                Website*
                                            </label>
                                        </span>
                                        {getFormErrorMessage("website")}
                                    </div>
                                    <div class="field col-12 pb-3">
                                        <span className="p-float-label">
                                            <InputText
                                                id="phone"
                                                name="phone"
                                                value={formik.values.phone}
                                                onChange={formik.handleChange}
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
                                </div>
                                <div class="field col">
                                    <label
                                        htmlFor="customer_name"
                                        className="font-bold block mb-2"
                                    >
                                        Preview
                                    </label>
                                    <div className="border-2 border-dashed surface-border border-round surface-ground flex flex-column justify-content-center align-items-center font-medium mb-3">
                                        <div className="p-2">
                                            <img
                                                src={imageUrl}
                                                alt="Preview"
                                                className="preview-load-img"
                                            />
                                        </div>
                                    </div>
                                    <FileUpload
                                        mode="basic"
                                        chooseLabel="Select a image"
                                        accept="image/*"
                                        customUpload
                                        uploadHandler={handleFileSelect}
                                    />
                                </div>
                            </div>
                                                        <Button
                                                            label="Save"
                                                            severity="success"
                                                            type="submit"
                                                        />
                        </Card>
                    </div>
                </div>
            </form>
        </AuthenticatedLayout>
    );
};

export default Setting;
