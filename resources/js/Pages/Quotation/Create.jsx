import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
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

export default function Create() {
    const [products, setProducts] = useState([]);
    const [value, setValue] = useState("");
    const [editingRows, setEditingRows] = useState({});
    const descriptionRefs = useRef({});

    const columns = [
        { field: "type.name", header: "Categoria" },
        { field: "description", header: "Descripción" },
        { field: "unit_price", header: "Precio unidad" },
        { field: "quantity", header: "Cantidad" },
        { field: "total_amount", header: "Total" },
    ];

    const [itemsTable, setItemsTable] = useState([
        {
            id: 100,
            type: {
                id: 10,
                name: "PINTURA",
            },
            description: "Encielado y puesta de balcones",
            unit_price: 100,
            quantity: 7,
            total_amount: 700,
        },
        {
            id: 101,
            type: {
                id: 10,
                name: "ARMADURIA",
            },
            description: "Ajuste de puertas e instalacion",
            unit_price: 100,
            quantity: 7,
            total_amount: 700,
        },
    ]);

    const typeOptions = [
        { id: 1, name: "PINTURA" },
        { id: 2, name: "ARMADURIA" },
        { id: 3, name: "ELECTRICIDAD" },
    ];

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


    const addItem = () => {
        const newId = Date.now();

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
            console.log('Procesnado en timeout');
            if (descriptionRefs.current[newId]) {
                console.log('Enviando el foco a ' + newId);
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
        const index = updatedItems.findIndex((item) => item.id === props.rowData.id);
        if (index !== -1) {
            updatedItems[index] = {
                ...updatedItems[index],
                [field]: value,
            };

            if (field === "unit_price" || field === "quantity") {
                const { unit_price, quantity } = updatedItems[index];
                updatedItems[index].total_amount = (unit_price || 0) * (quantity || 0);
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
            options={typeOptions}
            optionLabel="name"
            onChange={(e) => onEditorValueChange(props, e.value, "type")}
            placeholder="Seleccione tipo"
        />
    );


    const deleteItem = (id) => {
        const updatedItems = itemsTable.filter(item => item.id !== id);
        setItemsTable(updatedItems);
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


    const onSaveData = () => {
        const dataPayload = {

        }

    }

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
                                            style={{ width: "100px" }}
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
                                            style={{ width: "100px" }}
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

                                    <div className="field grid">
                                        <label
                                            style={{ width: "100px" }}
                                            htmlFor="quotation_date"
                                            className="col-fixed"
                                        >
                                            Termino vencimiento
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

                    <div className="pt-2local">
                        <Button
                            size="small"
                            label="Agregar Nueva Linea"
                            icon="pi pi-plus"
                            className="bg-gray-500 hover:bg-gray-400 border-gray-600"
                            onClick={addItem}
                        />
                    </div>
                </div>
                {/*Table Summary Content*/}
                <div className="pt-5 grid">
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
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            rows={5}
                            cols={30}
                        />
                    </div>
                    <div className="col">
                        <table>
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

                <div>
                    <Button label="Guardar" severity="success" onClick={onSaveData}/>
                    <Button label="Cancelar" severity="danger" />
                </div>
            </Card>
        </AuthenticatedLayout>
    );
}
