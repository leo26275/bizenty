import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, router } from "@inertiajs/react";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ContextMenu } from "primereact/contextmenu";
import { Tag } from "primereact/tag";
import { Fieldset } from "primereact/fieldset";
import { Calendar } from "primereact/calendar";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

export default function Dashboard() {
    const { quotations } = usePage().props;

    const [filterValues, setFilterValues] = useState({
        startDate: null,
        endDate: null,
        quote_status: null,
        quote_id: null,
    });

    const handleChange = (name, value) => {
        setFilterValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const statusOptions = [
        {
            code: 3,
            name: "Draft",
        },
    ];

    const cm = useRef(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const menuModel = [
        {
            label: "Edit",
            icon: "pi pi-fw pi-pencil",
            command: () => editItem(selectedProduct),
        },
        {
            label: "View",
            icon: "pi pi-fw pi-search",
            command: () => viewItem(selectedProduct),
        },
        {
            label: "Duplicate",
            icon: "pi pi-fw pi-clone",
            command: () => duplicateItem(selectedProduct),
        },
        {
            label: "Invoice",
            icon: "pi pi-fw pi-money-bill",
            command: () => invoice(selectedProduct),
        },
        {
            label: "Send",
            icon: "pi pi-fw pi-send",
            command: () => sendItem(selectedProduct),
        },
        {
            label: "Download PDF",
            icon: "pi pi-fw pi-file-pdf",
            command: () => downloadItem(selectedProduct),
        },
        {
            label: "Delete",
            icon: "pi pi-fw pi-trash",
            command: () => deleteItem(selectedProduct),
        },
    ];

    /*--- Context Options Functions --- */
    const editItem = (item) => {
        router.get(
            route("quotation.create") + `?quotation_id=${item.id}&edit=true`
        );
    };

    const viewItem = (item) => {
        router.get(
            route("quotation.create") + `?quotation_id=${item.id}&edit=false`
        );
    };

    const duplicateItem = (item) => {
        router.post(route("quotation.duplicate", { quotation_id: item.id }));
    };

    const invoice = (item) => {
        router.post(route("quotation.invoicing", { quotation_id: item.id }));
    };

    const sendItem = (item) => {};

    const downloadItem = (item) => {
        const params = { quotation_id: item.id };
        const url = route("reports.quotation.download", params);
        window.open(url, "_blank");
    };

    const deleteItem = (item) => {
        router.patch(route("quotation.delete", { quotation_id: item.id }));
    };
    /*--- End / Context Options Functions --- */

    const onExecuteFilter = () => {};

    const onCleanFilter = () => {};

    const priceBodyTemplate = (rowData) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(rowData.total);
    };

    const balanceBodyTemplate = (rowData) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(rowData.total);
    };

    const fullNameTemplate = (rowData) => {
        const { first_name, middle_name, last_name } = rowData.customer || {};
        return `${first_name ?? ""} ${middle_name ?? ""} ${
            last_name ?? ""
        }`.trim();
    };

    const getSeverity = (value) => {
        switch (value) {
            case "draft":
                return "info";

            case "invoiced":
                return "success";

            default:
                return null;
        }
    };

    const statusBodyTemplate = (rowData) => {
        return (
            <Tag
                value={rowData.status}
                severity={getSeverity(rowData.status)}
            ></Tag>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Cotizaciones
                </h2>
            }
        >
            <Head title="Cotizaciones" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-5">
                                <Button
                                    label="+ Create Quotation"
                                    severity="success"
                                    size="small"
                                    onClick={() =>
                                        router.get(route("quotation.create"))
                                    }
                                />
                            </div>

                            <Fieldset legend="Search filters" className="mb-3">
                                <div className="card flex flex-wrap gap-3 p-fluid">
                                    <div className="flex-auto">
                                        <FloatLabel>
                                            <Calendar
                                                inputId="startDate"
                                                className="p-inputtext-sm"
                                                value={filterValues.startDate}
                                                onChange={(e) =>
                                                    handleChange(
                                                        "startDate",
                                                        e.value
                                                    )
                                                }
                                                dateFormat="yy-mm-dd"
                                            />
                                            <label htmlFor="startDate">
                                                Start date
                                            </label>
                                        </FloatLabel>
                                    </div>
                                    <div className="flex-auto">
                                        <FloatLabel>
                                            <Calendar
                                                inputId="endDate"
                                                className="p-inputtext-sm"
                                                value={filterValues.endDate}
                                                onChange={(e) =>
                                                    handleChange(
                                                        "endDate",
                                                        e.value
                                                    )
                                                }
                                                dateFormat="yy-mm-dd"
                                            />
                                            <label htmlFor="endDate">
                                                End date
                                            </label>
                                        </FloatLabel>
                                    </div>
                                    <div className="flex-auto">
                                        <FloatLabel>
                                            <InputText
                                                id="integer"
                                                className="p-inputtext-sm"
                                                value={filterValues.quote_id}
                                                onChange={(e) =>
                                                    handleChange(
                                                        "quote_id",
                                                        e.value
                                                    )
                                                }
                                                keyfilter="int"
                                            />
                                            <label htmlFor="quote_id">
                                                Quote #Id
                                            </label>
                                        </FloatLabel>
                                    </div>
                                    <div className="flex-auto">
                                        <FloatLabel>
                                            <Dropdown
                                                id="status"
                                                name="status"
                                                className="p-inputtext-sm"
                                                value={
                                                    filterValues.quote_status
                                                }
                                                options={statusOptions}
                                                onChange={(e) =>
                                                    handleChange(
                                                        "quote_status",
                                                        e.value
                                                    )
                                                }
                                                optionLabel="name"
                                                placeholder="Select"
                                            />

                                            <label htmlFor="status">
                                                Status
                                            </label>
                                        </FloatLabel>
                                    </div>
                                    <div className="flex-auto">
                                        <Button
                                            label="Search"
                                            severity="secondary"
                                            size="small"
                                            icon="pi pi-check"
                                            onClick={onExecuteFilter}
                                            outlined
                                            raised
                                        />
                                    </div>
                                    <div className="flex-auto">
                                        <Button
                                            label="Clean"
                                            severity="secondary"
                                            size="small"
                                            icon="pi pi-check"
                                            outlined
                                            onClick={onCleanFilter}
                                            raised
                                        />
                                    </div>
                                </div>
                                 <div className="card flex flex-wrap gap-3">

                                 </div>
                            </Fieldset>
                            <ContextMenu
                                model={menuModel}
                                ref={cm}
                                onHide={() => setSelectedProduct(null)}
                            />
                            <DataTable
                                value={quotations}
                                onContextMenu={(e) =>
                                    cm.current.show(e.originalEvent)
                                }
                                contextMenuSelection={selectedProduct}
                                onContextMenuSelectionChange={(e) =>
                                    setSelectedProduct(e.value)
                                }
                                size="small"
                                tableStyle={{ minWidth: "50rem" }}
                                showGridlines
                                paginator
                                rows={10}
                            >
                                <Column field="id" header="Quotation"></Column>
                                <Column
                                    body={fullNameTemplate}
                                    header="Customer"
                                ></Column>
                                <Column field="mov_date" header="Date"></Column>
                                <Column
                                    field="total"
                                    header="Total"
                                    body={priceBodyTemplate}
                                ></Column>
                                <Column
                                    field="balance"
                                    header="Balance"
                                    body={balanceBodyTemplate}
                                ></Column>
                                <Column
                                    field="status"
                                    header="Status"
                                    body={statusBodyTemplate}
                                ></Column>
                            </DataTable>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
