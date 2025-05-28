import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, router } from "@inertiajs/react";
import React, { useState, useRef } from "react";
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

export default function Create() {
    const prefix_new = "NEW_";
    const prefix_del = "DEL_";

    const [products, setProducts] = useState([]);
    const [value, setValue] = useState("");
    const [editingRows, setEditingRows] = useState({});
    const descriptionRefs = useRef({});
    const { categories, companyConfig } = usePage().props;

    const categoryOptions = categories.map((cat) => ({
        name: cat.name,
        id: cat.id,
    }));

    const columns = [
        { field: "type.name", header: "Categoria" },
        { field: "description", header: "Descripción" },
        { field: "unit_price", header: "Precio unidad" },
        { field: "quantity", header: "Cantidad" },
        { field: "total_amount", header: "Total" },
    ];

    const [itemsTable, setItemsTable] = useState([]);

    const onCellEditComplete = (e) => {
        let { rowData, newValue, field, originalEvent: event } = e;

        switch (field) {
            case "quantity":
            case "total_amount":
            case "unit_price":
                if (isPositiveInteger(newValue)) rowData[field] = newValue;
                else event.preventDefault();
                break;

            default:
                if (newValue != undefined && newValue.trim().length > 0)
                    rowData[field] = newValue;
                else event.preventDefault();
                break;
        }
    };

    const formik = useFormik({
        initialValues: {
            customer_name: "",
            customer_address: "",
            company_name: companyConfig.company_name,
            company_address: companyConfig.address,
            quotation_id: "0",
            quotation_date: "ee",
            total: 700,
        },
        validate: (data) => {
            let errors = {};

            if (!data.customer_name) {
                errors.customer_name = "El nombre es requerido";
            }

            return errors;
        },
        onSubmit: (data) => {
            const payload = {
                header: data,
                details: itemsTable,
                deletes: [],
            };

            console.log("payload");
            console.log(payload);

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

    const addItem = () => {
        const newId = prefix_new + uuidv4();

        const newItem = {
            id: newId,
            type: {
                id: 0,
                name: "NUEVO",
            },
            description: "Nuevo ítem",
            unit_price: 0,
            quantity: 1,
            total_amount: 0,
        };

        setItemsTable((prev) => [...prev, newItem]);

        // Activa la edición para el nuevo item
        setEditingRows((prev) => ({
            ...prev,
            [newId]: true,
        }));

        // Enfocar después de un breve retraso (esperar que el DOM se actualice)
        //No esta funcionando
        setTimeout(() => {
            console.log("Procesnado en timeout");
            if (descriptionRefs.current[newId]) {
                console.log("Enviando el foco a " + newId);
                descriptionRefs.current[newId].focus();
            }
        }, 5000);
    };

    const textEditor = (options) => {
        //console.log('Estableciendo este ref: ' + options.rowData.id);
        //onChange={(e) => options.editorCallback(e.target.value)}
        return (
            <InputText
                type="text"
                className="p-inputtext-sm"
                value={options.value}
                onChange={(e) => options.editorCallback(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                ref={(el) => {
                    if (options.field === "description") {
                        descriptionRefs.current[options.rowData.id] = el;
                    }
                }}
            />
        );
    };

    const priceEditor = (options) => {
        return (
            <InputNumber
                value={options.value}
                onValueChange={(e) => options.editorCallback(e.value)}
                mode="currency"
                className="p-inputtext-sm"
                currency="USD"
                locale="en-US"
                onKeyDown={(e) => e.stopPropagation()}
            />
        );
    };

    const onEditorValueChange = (props, value, fieldOverride = null) => {
        const field = fieldOverride || props.field;
        const updatedItems = [...itemsTable];
        const index = updatedItems.findIndex(
            (item) => item.id === props.rowData.id
        );
        if (index !== -1) {
            updatedItems[index] = {
                ...updatedItems[index],
                [field]: value,
            };

            if (field === "unit_price" || field === "quantity") {
                const { unit_price, quantity } = updatedItems[index];
                updatedItems[index].total_amount =
                    (unit_price || 0) * (quantity || 0);
            }

            if (field === "type") {
                updatedItems[index].type = value;
            }

            setItemsTable(updatedItems);
        }
    };

    const dropdownEditor = (props) => (
        <Dropdown
            value={props.rowData.type}
            options={categoryOptions}
            optionLabel="name"
            onChange={(e) => onEditorValueChange(props, e.value, "type")}
            placeholder="Seleccione tipo"
        />
    );

    const deleteItem = (id) => {
        const updatedItems = itemsTable.filter((item) => item.id !== id);
        setItemsTable(updatedItems);
    };

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

    const cellEditor = (options) => {
        if (options.field === "unit_price" || options.field === "total_amount")
            return priceEditor(options);
        else return textEditor(options);
    };

    const priceBodyTemplate = (rowData) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(rowData.unit_price);
    };

    const priceBodyTemplateTotal = (rowData) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(rowData.total_amount);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex">
                <Button
                    size="small"
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-danger"
                    onClick={() => deleteItem(rowData.id)}
                    tooltip="Eliminar"
                />
            </div>
        );
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

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Crear Cotizacion
                </h2>
            }
        >
            <Head title="Cotizaciones" />
            <Card title={headerCardTemplate(0)}>
                <form onSubmit={formik.handleSubmit} className="">
                    <div className="flex flex-wrap justify-content-end gap-3">
                        <Button
                            label="Guardar"
                            severity="success"
                            type="submit"
                        />
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
                                        className="p-button-warning"
                                    />
                                </div>
                                {getFormErrorMessage("customer_name")}

                                <div className="field">
                                    <InputTextarea
                                        id="customer_address"
                                        name="customer_address"
                                        value={formik.values.customer_address}
                                        onChange={formik.handleChange}
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
                                                class="logo"
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
                                                Fecha Cotizacion
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
                                                htmlFor="quotation_date"
                                                className="col-fixed"
                                            >
                                                Termino vencimiento
                                            </label>
                                            <InputText
                                                id="quotation_date"
                                                value={formik.quotation_date}
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Divider />
                    <h3>Lista de servicios cotizados</h3>
                    {/*Table Items Content*/}
                    <div>
                        <div className="p-fluid">
                            <DataTable
                                value={itemsTable}
                                editMode="cell"
                                showGridlines
                                dataKey="id"
                                editingRows={editingRows}
                                size="small"
                                tableStyle={{ minWidth: "50rem" }}
                            >
                                <Column
                                    field="type.name"
                                    header="Categoria"
                                    footer="Categoria"
                                    style={{ minWidth: "100px" }}
                                    editor={dropdownEditor}
                                    onCellEditComplete={onCellEditComplete}
                                ></Column>
                                <Column
                                    field="description"
                                    header="Descripción"
                                    footer="Descripción"
                                    editor={(options) => cellEditor(options)}
                                    style={{ minWidth: "100px" }}
                                    onCellEditComplete={onCellEditComplete}
                                ></Column>

                                <Column
                                    field="unit_price"
                                    header="Precio unidad"
                                    footer="Precio unidad"
                                    body={priceBodyTemplate}
                                    editor={(options) => cellEditor(options)}
                                    style={{ minWidth: "100px" }}
                                    onCellEditComplete={onCellEditComplete}
                                ></Column>
                                <Column
                                    field="quantity"
                                    header="Cantidad"
                                    footer="Cantidad"
                                    editor={(options) => cellEditor(options)}
                                    style={{ minWidth: "100px" }}
                                    onCellEditComplete={onCellEditComplete}
                                ></Column>
                                <Column
                                    field="total_amount"
                                    header="Total"
                                    footer="Total"
                                    body={priceBodyTemplateTotal}
                                    editor={(options) => cellEditor(options)}
                                    style={{ minWidth: "100px" }}
                                    onCellEditComplete={onCellEditComplete}
                                ></Column>
                                <Column
                                    header="Acciones"
                                    footer="Acciones"
                                    body={actionBodyTemplate}
                                    style={{ maxWidth: "70px" }}
                                ></Column>

                                {/*columns.map(({ field, header }) => {
                            return (
                                <Column
                                    key={field}
                                    field={field}
                                    header={header}
                                    style={{ width: "25%" }}
                                    body={
                                        (field === "unit_price"  && priceBodyTemplate) ||
                                        (field === "total_amount"  && priceBodyTemplateTotal)
                                    }
                                    editor={(options) => cellEditor(options)}
                                    onCellEditComplete={onCellEditComplete}
                                />
                            );
                        })*/}
                            </DataTable>
                        </div>

                        <div className="pt-2 local">
                            <Button
                                size="small"
                                type="button"
                                label="Agregar Nueva Linea"
                                icon="pi pi-plus"
                                className="bg-gray-500 hover:bg-gray-400 border-gray-600"
                                onClick={addItem}
                            />
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
                                Notas
                            </label>
                            <InputTextarea
                                id="txt_notes"
                                className="w-full"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                rows={5}
                                cols={30}
                            />
                        </div>
                        <div className="col flex justify-content-end">
                            <table className="table01">
                                <tr>
                                    <td>Sub Total</td>
                                    <td>$ 3254.24</td>
                                </tr>
                                <tr>
                                    <td>Total</td>
                                    <td>$ 3254.24</td>
                                </tr>
                                <tr>
                                    <td>Monto Pagado</td>
                                    <td>$ 3254.24</td>
                                </tr>
                                <tr>
                                    <td>Total restante</td>
                                    <td>$ 3254.24</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </form>
            </Card>
        </AuthenticatedLayout>
    );
}
