import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, router } from "@inertiajs/react";
import React, { useState, useRef, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { useFormik } from "formik";
import { classNames } from "primereact/utils";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { v4 as uuidv4 } from "uuid";
import { Divider } from "primereact/divider";
import "@/Pages/Quotation/styles/style.page.scss";
import { Badge } from "primereact/badge";
import CustomerList from "../Components/CustomersList";
import { Tag } from "primereact/tag";
import { toDateFormat } from "@/Shared/Utils";

export default function Create() {
    const prefix_new = "NEW_";

    const [editMode, setEditMode] = useState(false);
    const [itemsTable, setItemsTable] = useState([]);
    const {
        categories,
        companyConfig,
        quotation_id,
        edit,
        quotation,
        quotationDtls,
        serverDate
    } = usePage().props;

    console.log(quotation);


    const categoryOptions = categories.map((cat) => ({
        name: cat.name,
        code: cat.id,
    }));

    const ValidTerms = [
        {
            code: 10,
            name: "10 Days"
        },
        {
            code: 20,
            name: "20 Days"
        },
        {
            code: 30,
            name: "30 Days"
        },
    ];


    const [dialogVisible, setDialogVisible] = useState(false);
    const [deleteIDs, setDeleteIDs] = useState([]);

    const onOpenCustomerModal = () => {
        setDialogVisible(true);
    };

    useEffect(() => {
        calculeSummary();
    }, [itemsTable]);

    const calculeSummary = () => {
        let subTotalLine = itemsTable.reduce(
            (acc, item) => acc + parseFloat(item.total_amount),
            0
        );

        formik.values.subtotal = subTotalLine;
        formik.values.total = formik.values.subtotal;
        formik.values.balance_due =
            formik.values.total - formik.values.amount_paid;
    };

    const getTermObject = (validityTerm) => {
        let objOption = null;
        ValidTerms.forEach((e, index) => {
            if(e.code == validityTerm){
                objOption = e;
            }
        });

        return objOption;
    }

    const customerNameNode = (customer) => {
        let fullname = null;
        if(customer){
            fullname = customer.first_name + " " + customer.middle_name + " " + customer.address;
        }
        return fullname;
    }


    const formik = useFormik({
        initialValues: {
            customer_id: quotation?.customer_id || 0,
            customer_name: customerNameNode(quotation?.customer) || "",
            customer_address: quotation?.customer?.address || "",
            company_name: companyConfig?.company_name,
            company_address: companyConfig?.address,
            quotation_id: quotation?.id || 0,
            quotation_date: toDateFormat((quotation?.mov_date || serverDate), 'yyyy-MM-dd'),
            validity_term: getTermObject(quotation?.validity_term),
            subtotal: parseFloat(quotation?.subtotal || 0),
            total: parseFloat(quotation?.total || 0),
            amount_paid: parseFloat(quotation?.amount_paid || 0),
            balance_due: parseFloat(quotation?.balance_due || 0),
            notes: quotation?.notes || "",
        },
        validate: (data) => {
            let errors = {};

            if (!data.customer_name) {
                errors.customer_name = "El nombre es requerido";
            }

            return errors;
        },
        onSubmit: (data) => {

            data.validity_term = data.validity_term.code;
            const payload = {
                header: data,
                details: itemsTable,
                deletes: deleteIDs,
            };

            //console.log(payload);
            router.post("/quotation", payload);
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

    useEffect(() => {
        if (quotation_id != undefined && !isNaN(parseInt(quotation_id))) {
            setItemsTable(quotationDtls.map((e, index) => {
                return {
                    id: e.id,
                    description: e.description,
                    unit_price: e.unit_price,
                    quantity: e.quantity,
                    total_amount: e.total_amount,
                    category: {
                        code: e.category.id,
                        name: e.category.name
                    }
                }
            }));
        } else {
            setEditMode(true);
        }

        if(edit == true){
          onEnableEditMode();
        }
    }, []);

    const onEnableEditMode = () => {
        //Check status form, if form status is valid status for example
        setEditMode(true);
    }

    const isPositiveInteger = (val) => {
        let str = String(val);

        str = str.trim();

        if (!str) {
            return false;
        }

        str = str.replace(/^0+/, "") || "0";
        let n = Math.floor(Number(str));

        return n !== Infinity && String(n) === str && n >= 0;
    };

    const headerCardTemplate = (quotation_id) => {
        return (
            <div className="flex justify-content-between align-items-center">
                <h3>
                    Cotizacion Num.{" "}
                    {quotation_id == null || quotation_id == 0 ? (
                        <Badge value="NEW" severity="success"></Badge>
                    ) : (
                        quotation_id
                    )}{" "}
                </h3>
            </div>
        );
    };

    const handleCustomerSelected = (customer) => {
        formik.values.customer_id = customer.id;
        formik.values.customer_name = customer.fullname;
        formik.values.customer_address = customer.address;
    };

    const bodyDecimalTemplate = (currentValue) => {
        let decimal = (parseFloat(currentValue) || 0).toFixed(2);

        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(decimal);
    };

    const handleChange = (index, field, value) => {
        const updated = [...itemsTable];

        if (field == "unit_price" || field == "quantity") {
            const numericValue = parseFloat(value) || 0;
            updated[index][field] = numericValue;

            const unit_price = parseFloat(updated[index].unit_price) || 0;
            const quantity = parseFloat(updated[index].quantity) || 0;
            updated[index].total_amount = unit_price * quantity;
        }
        if (field == "category") {
            updated[index].category = value;
        } else {
            updated[index][field] = value;
        }

        setItemsTable(updated);
    };

    /*Start Actions on Details Table */
    const addItem = () => {
        const newId = prefix_new + uuidv4();

        const newItem = {
            id: newId,
            category: {
                code: null,
                name: "",
            },
            edit_mode: true,
            description: "",
            unit_price: 0,
            quantity: 1,
            total_amount: 0,
        };

        setItemsTable((prev) => [...prev, newItem]);
    };

    const editItem = (id) => {
        let indexFound = -1;
        const updated = [...itemsTable];
        updated.forEach((item, index) => {
            if (item.id === id) {
                indexFound = index;
            }
        });

        if (indexFound >= 0) {
            updated[indexFound].edit_mode = true;
            setItemsTable(updated);
        }
    };

    const saveItem = (id) => {
        let indexFound = -1;
        const updated = [...itemsTable];
        updated.forEach((item, index) => {
            if (item.id === id) {
                indexFound = index;
            }
        });

        if (indexFound >= 0) {
            updated[indexFound].edit_mode = false;
            setItemsTable(updated);
        }
    };

    const deleteItem = (id) => {

        const deletesTemp = [...deleteIDs];
        if (id !== prefix_new && !isNaN(parseInt(id))) {
            deletesTemp.push(id);
        }
        setDeleteIDs(deletesTemp);
        const updatedItems = itemsTable.filter((item) => item.id !== id);
        setItemsTable(updatedItems);
    };
    /*End Actions on Details Table */

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create Quotation
                </h2>
            }
        >
            <Head title="Cotizaciones" />
            <CustomerList
                dialogVisible={dialogVisible}
                setDialogVisible={setDialogVisible}
                onCustomerSelected={handleCustomerSelected}
            />
            <Card title={headerCardTemplate(formik.values.quotation_id)}>
                <form onSubmit={formik.handleSubmit} className="">
                    <div className="flex flex-wrap justify-content-end gap-3">
                        {!editMode && (
                            <Button
                                label="Edit"
                                severity="success"
                                type="button"
                                onClick={onEnableEditMode}
                            />
                        )}

                        {editMode && (
                            <Button
                                label="Save"
                                severity="success"
                                type="submit"
                            />
                        )}
                    </div>

                    <div className="">
                        <div className="formgrid grid">
                            <div className="field col-5">
                                <label
                                    htmlFor="integeronly"
                                    className="font-bold block mb-2"
                                >
                                    Empresa
                                </label>
                                <div className="field">
                                    <InputText
                                        value={formik.values.company_name}
                                        onChange={formik.handleChange}
                                        disabled
                                        className={classNames(
                                            "p-inputtext-sm",
                                            "w-full",
                                            {
                                                "p-invalid":
                                                    isFormFieldValid(
                                                        "company_name"
                                                    ),
                                            }
                                        )}
                                    />
                                    {getFormErrorMessage("company_name")}
                                </div>
                                <div className="field">
                                    <InputTextarea
                                        id="company_address"
                                        name="company_address"
                                        disabled
                                        value={formik.values.company_address}
                                        onChange={formik.handleChange}
                                        rows={5}
                                        cols={23}
                                        className={classNames(
                                            "p-inputtext-sm",
                                            "w-full",
                                            {
                                                "p-invalid":
                                                    isFormFieldValid(
                                                        "company_address"
                                                    ),
                                            }
                                        )}
                                    />
                                    {getFormErrorMessage("company_address")}
                                </div>

                                <Divider />

                                <label
                                    htmlFor="customer_name"
                                    className="font-bold block mb-2"
                                >
                                    Cliente
                                </label>
                                <div className="field p-inputgroup flex-1">
                                    <InputText
                                        id="customer_name"
                                        name="customer_name"
                                        disabled
                                        value={formik.values.customer_name}
                                        onChange={formik.handleChange}
                                        className={classNames(
                                            "p-inputtext-sm",
                                            {
                                                "p-invalid":
                                                    isFormFieldValid(
                                                        "customer_name"
                                                    ),
                                            }
                                        )}
                                    />
                                    <Button
                                        icon="pi pi-search"
                                        type="button"
                                        disabled={!editMode}
                                        className="p-button-warning"
                                        onClick={onOpenCustomerModal}
                                    />
                                </div>
                                {getFormErrorMessage("customer_name")}

                                <div className="field">
                                    <InputTextarea
                                        id="customer_address"
                                        name="customer_address"
                                        value={formik.values.customer_address}
                                        onChange={formik.handleChange}
                                        disabled
                                        rows={5}
                                        cols={50}
                                        className={classNames(
                                            "p-inputtext-sm",
                                            "w-full",
                                            {
                                                "p-invalid":
                                                    isFormFieldValid(
                                                        "customer_address"
                                                    ),
                                            }
                                        )}
                                    />
                                    {getFormErrorMessage("customer_address")}
                                </div>
                            </div>

                            <div className="field col-7">
                                <div className="pl-6">
                                    <label
                                        htmlFor="customer_name"
                                        className="font-bold block mb-2"
                                    >
                                        Logotipo
                                    </label>
                                    <div className="border-2 border-dashed surface-border border-round surface-ground flex flex-column justify-content-center align-items-center font-medium">
                                        <div className="p-2">
                                            <img
                                                className="logo"
                                                src="https://img.freepik.com/vector-premium/diseno-logotipo-triangulo-minimo-colores-degradados_720439-7.jpg"
                                                alt=""
                                            />
                                        </div>
                                        <div className="p-2 text-center">
                                            Para cambiar el logo actual, navegue
                                            hasta el apartado de configuración
                                            para su empresa.
                                        </div>
                                    </div>
                                    <div className="flex  flex-column justify-content-end align-items-end align-content-end pt-4">
                                        <div className="field">
                                            <label
                                                htmlFor="quotation_date"
                                                className="col-fixed"
                                            >
                                                Quotation date
                                            </label>
                                            <InputText
                                                id="quotation_date"
                                                name="quotation_date"
                                                value={
                                                    formik.values.quotation_date
                                                }
                                                disabled
                                                onChange={formik.handleChange}
                                                className={classNames(
                                                    "p-inputtext-sm",
                                                    {
                                                        "p-invalid":
                                                            isFormFieldValid(
                                                                "quotation_date"
                                                            ),
                                                    }
                                                )}
                                            />
                                            {getFormErrorMessage(
                                                "quotation_date"
                                            )}
                                        </div>

                                        <div className="field">
                                            <label
                                                htmlFor="validity_term"
                                                className="col-fixed"
                                            >
                                                Validity Term
                                            </label>

                                            <Dropdown
                                                id="validity_term"
                                                name="validity_term"
                                                value={formik.values.validity_term}
                                                options={ValidTerms}
                                                onChange={formik.handleChange}
                                                optionLabel="name"
                                                placeholder="Select a Term"
                                            />
                                            {getFormErrorMessage(
                                                "validity_term"
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Divider />
                    <h3>List of quoted services</h3>
                    {/*Table Items Content*/}
                    <table className="tablez2">
                        <thead>
                            <tr>
                                <th className="tcol1">Category</th>
                                <th className="tcol2">Description</th>
                                <th className="tcol3">Unit price</th>
                                <th className="tcol4">Quantity</th>
                                <th className="tcol5">Total</th>
                                <th className="tcol6">Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itemsTable.map((item, index) => (
                                <tr key={item.id}>
                                    <td>
                                        {item.edit_mode ? (
                                            <Dropdown
                                                value={item.category}
                                                onChange={(e) =>
                                                    handleChange(
                                                        index,
                                                        "category",
                                                        e.value
                                                    )
                                                }
                                                options={categoryOptions}
                                                optionLabel="name"
                                                placeholder="Select a City"
                                                className="w-full"
                                            />
                                        ) : (
                                            item.category.name
                                        )}
                                    </td>
                                    <td>
                                        {item.edit_mode ? (
                                            <InputTextarea
                                                className="w-full p-inputtext-sm"
                                                value={item.description}
                                                maxLength={500}
                                                onChange={(e) =>
                                                    handleChange(
                                                        index,
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                                onKeyDown={(e) =>
                                                    e.stopPropagation()
                                                }
                                                max
                                                rows={3}
                                                cols={30}
                                            />
                                        ) : (
                                            item.description
                                        )}
                                    </td>
                                    <td>
                                        {item.edit_mode ? (
                                            <InputNumber
                                                value={item.unit_price}
                                                className="w-full p-inputtext-sm"
                                                mode="currency"
                                                currency="USD"
                                                locale="en-US"
                                                minFractionDigits={2}
                                                onValueChange={(e) =>
                                                    handleChange(
                                                        index,
                                                        "unit_price",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        ) : (
                                            bodyDecimalTemplate(item.unit_price)
                                        )}
                                    </td>
                                    <td>
                                        {item.edit_mode ? (
                                            <InputText
                                                value={item.quantity}
                                                className="w-full p-inputtext-sm"
                                                onChange={(e) =>
                                                    handleChange(
                                                        index,
                                                        "quantity",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        ) : (
                                            item.quantity
                                        )}
                                    </td>
                                    <td>
                                        {bodyDecimalTemplate(item.total_amount)}
                                    </td>
                                    <td>
                                        {!item.edit_mode && (
                                            <i
                                                className="pi pi-file-edit p-2 bg-bluegray-50 hover:bg-bluegray-100 cursor-pointer shadow-1 m-1 border-circle text-xl"
                                                style={{ color: "slateblue" }}
                                                onClick={() =>
                                                    editItem(item.id)
                                                }
                                            />
                                        )}

                                        {item.edit_mode && (
                                            <i
                                                className="pi pi-save p-2 bg-bluegray-50 hover:bg-bluegray-100 cursor-pointer shadow-1 m-1 border-circle text-xl"
                                                style={{ color: "slateblue" }}
                                                onClick={() =>
                                                    saveItem(item.id)
                                                }
                                            />
                                        )}

                                        {!item.edit_mode && (
                                            <i
                                                className="pi pi-trash p-2 bg-bluegray-50 hover:bg-bluegray-100 cursor-pointer shadow-1 m-1 border-circle text-xl"
                                                style={{ color: "slateblue" }}
                                                onClick={() =>
                                                    deleteItem(item.id)
                                                }
                                            />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div>
                        <div className="pt-2 local">
                            {editMode && (
                                <Button
                                    size="small"
                                    type="button"
                                    label="Add new detail"
                                    icon="pi pi-plus"
                                    className="bg-gray-500 hover:bg-gray-400 border-gray-600"
                                    onClick={addItem}
                                />
                            )}
                        </div>
                    </div>
                    {/*Table Summary Content*/}
                    <div className="pt-6 grid">
                        <div className="col flex">
                            <label
                                style={{ width: "100px" }}
                                htmlFor="txt_notes"
                                className="col-fixed"
                            >
                                Notes
                            </label>
                            <InputTextarea
                                id="notes"
                                name="notes"
                                className="w-full"
                                disabled={!editMode}
                                value={formik.values.notes}
                                onChange={formik.handleChange}
                                rows={5}
                                cols={30}
                            />
                        </div>
                        <div className="col flex justify-content-end">
                            <table className="table01">
                                <tbody>
                                    <tr>
                                        <td>Sub Total</td>
                                        <td>
                                            ${" "}
                                            {formik.values.subtotal.toFixed(2)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Total</td>
                                        <td>
                                            $ {formik.values.total.toFixed(2)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Monto Pagado</td>
                                        <td>
                                            ${" "}
                                            {formik.values.amount_paid.toFixed(2)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Total restante</td>
                                        <td>
                                            ${" "}
                                            {formik.values.balance_due.toFixed(2)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </form>
            </Card>
        </AuthenticatedLayout>
    );
}
