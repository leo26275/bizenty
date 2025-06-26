import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, router } from "@inertiajs/react";
import React, { useState, useRef } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ContextMenu } from 'primereact/contextmenu';
import { Tag } from 'primereact/tag';
import { Fieldset } from "primereact/fieldset";
import { Calendar } from "primereact/calendar";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Paginator } from 'primereact/paginator';
import { toDateFormat } from "@/Shared/Utils";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { Avatar } from "primereact/avatar";

export default function Dashboard() {

    const { invoices, filters } = usePage().props;
    const [first, setFirst] = useState((invoices.current_page - 1) * invoices.per_page);
    const [showDlgEmail, setShowDlgEmail] = useState(false);
    const [emailDestination, setEmailDestination] = useState("");
    const [emailInvoiceId, setEmailInvoiceId] = useState(0);

    const [filterValues, setFilterValues] = useState({
        startDate: null,
        endDate: null,
        invoice_status: null,
        invoice_id: null,
    });

    const handleChange = (name, value) => {
        setFilterValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const statusOptions = [
        {
            code: 'draft',
            name: "Draft",
        },
        {
            code: 'paid',
            name: "Paid",
        }
    ];


    const cm = useRef(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const menuModel = [
        { label: 'Edit', icon: 'pi pi-fw pi-pencil', command: () => editItem(selectedProduct) },
        { label: 'View', icon: 'pi pi-fw pi-search', command: () => viewItem(selectedProduct) },
        { label: 'Duplicate', icon: 'pi pi-fw pi-clone', command: () => duplicateItem(selectedProduct) },
        { label: 'Send', icon: 'pi pi-fw pi-send', command: () => sendItem(selectedProduct) },
        { label: 'Download PDF', icon: 'pi pi-fw pi-file-pdf', command: () => downloadItem(selectedProduct) },
        { label: 'Delete', icon: 'pi pi-fw pi-trash', command: () => deleteItem(selectedProduct) }
    ];

    /*--- Context Options Functions --- */
    const editItem = (item) => {
        router.get(route('invoice.create') + `?invoice_id=${item.id}&edit=true`);
    }

    const viewItem = (item) => {
        router.get(route('invoice.create') + `?invoice_id=${item.id}&edit=false`);
    }

    const duplicateItem = (item) => {
        router.post(route('invoice.duplicate', {invoice_id: item.id}));
    }

    const sendItem = (item) => {
        setEmailInvoiceId(item.id);
        setShowDlgEmail(true);
    };

    const downloadItem = (item) => {
        const params = {invoice_id: item.id};
        const url = route('reports.invoice.download', params)
        window.open(url, '_blank');
    }

    const deleteItem = (item) => {
         router.patch(route('quotation.delete', {invoice_id: item.id}));
    }
    /*--- End / Context Options Functions --- */


    const handleDownload = () => {
        router.visit(route('reports.invoice.download'), {
            method: 'get',
            preserveScroll: true
        });
    };


    const priceBodyTemplate = (rowData) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rowData.total);
    };

    const balanceBodyTemplate = (rowData) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rowData.total);
    };

    const fullNameTemplate = (rowData) => {
        const { first_name, middle_name, last_name } = rowData.customer || {};
        return `${first_name ?? ''} ${middle_name ?? ''} ${last_name ?? ''}`.trim();
    }

    const getSeverity = (value) => {
        switch (value) {
            case 'draft':
                return 'info';

            case 'invoiced':
                return 'success';

            default:
                return null;
        }
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.status} severity={getSeverity(rowData.status)}></Tag>;
    };


    const onExecuteFilter = () => {

        router.get(route('invoice.index'), filterValues, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const onCleanFilter = () => {
        setFilterValues({
            startDate: null,
            endDate: null,
            invoice_status: null,
            invoice_id: null
        });

        router.get(route('invoice.index'), {}, {
            preserveState: false,
            preserveScroll: true,
        });
    };

    const dateTemplate = (rowData, field) => {
        return toDateFormat(rowData[field], 'yyyy-MM-dd');
    }


    const onSendEmail = () => {
        if(emailInvoiceId == null || emailInvoiceId == 0){
            alert("An error has ocurred, the item id is not defined");
            return;
        }

        let data = {
            destination: emailDestination
        }

        router.post(`/invoice/email/${emailInvoiceId}`,data, {
            onSuccess: () => {
                //Correo enviado
            },
            onError: () => {
                console.error("Ocurrio un error");
            },
            onFinish: () => {
                setShowDlgEmail(false);
                setEmailQuoteId(0);
            }
        });

    }

    const headerDlgEmail = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <Avatar
                image={"/images/marketing.png"}
                className="mr-2"
                shape="circle"
            />
            <span className="font-bold white-space-nowrap">
                Mail sending parameters
            </span>
        </div>
    );

    const footerDlgEmail = (
        <div>
            <Button
                label="Cancel"
                severity="secondary"
                outlined
                icon="pi pi-times"
                onClick={() => setShowDlgEmail(false)}
            />
            <Button
                label="Send"
                outlined
                icon="pi pi-send"
                onClick={onSendEmail}
            />
        </div>
    );


    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Invoices
                </h2>
            }
        >
            <Head title="Cotizaciones" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <Card>

                            <div className="mb-5">
                                <Button
                                    label="+ Create Invoice"
                                    severity="success"
                                    size="small"
                                    onClick={() => router.get(route('invoice.create')) }
                                />
                            </div>

                            <Dialog
                                visible={showDlgEmail}
                                modal
                                header={headerDlgEmail}
                                footer={footerDlgEmail}
                                style={{ width: "50rem" }}
                                onHide={() => {
                                    if (!showDlgEmail) return;
                                    setShowDlgEmail(false);
                                }}
                            >
                                <Fieldset
                                    legend="Destination"
                                    className="mb-3 p-fluid"
                                >
                                    <FloatLabel>
                                        <InputText
                                            id="emailDestination"
                                            name="emailDestination"
                                            className="p-inputtext-sm"
                                            value={emailDestination}
                                            onChange={(e) => setEmailDestination(e.target.value)}
                                        />
                                        <label htmlFor="emailDestination">
                                            Email destination
                                        </label>
                                    </FloatLabel>
                                </Fieldset>
                            </Dialog>

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
                                                id="invoice_id"
                                                name="invoice_id"
                                                className="p-inputtext-sm"
                                                value={filterValues.invoice_id}
                                                onChange={(e) =>
                                                    handleChange(
                                                        "invoice_id",
                                                        e.target.value
                                                    )
                                                }
                                                keyfilter="int"
                                            />
                                            <label htmlFor="invoice_id">
                                                Invoice #Id
                                            </label>
                                        </FloatLabel>
                                    </div>
                                    <div className="flex-auto">
                                        <FloatLabel>
                                            <Dropdown
                                                id="invoice_status"
                                                name="invoice_status"
                                                className="p-inputtext-sm"
                                                value={
                                                    filterValues.invoice_status
                                                }
                                                options={statusOptions}
                                                onChange={(e) =>
                                                    handleChange(
                                                        "invoice_status",
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
                                            icon="pi pi-search"
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
                                            icon="pi pi-circle"
                                            outlined
                                            onClick={onCleanFilter}
                                            raised
                                        />
                                    </div>
                                </div>
                                 <div className="card flex flex-wrap gap-3">

                                 </div>
                            </Fieldset>
                            <ContextMenu model={menuModel} ref={cm} onHide={() => setSelectedProduct(null)} />
                            <DataTable
                                value={invoices.data}
                                onContextMenu={(e) => cm.current.show(e.originalEvent)} contextMenuSelection={selectedProduct} onContextMenuSelectionChange={(e) => setSelectedProduct(e.value)}
                                size="small"
                                tableStyle={{ minWidth: "50rem" }}
                                showGridlines
                                paginator rows={10}
                            >
                                <Column
                                    field="id"
                                    header="Invoice"
                                ></Column>
                                <Column
                                    body={fullNameTemplate}
                                    header="Customer"
                                ></Column>
                                <Column field="mov_date" header="Date"   body={(rowData) => dateTemplate(rowData, 'mov_date')}></Column>
                                <Column
                                    field="expiration_date"
                                    header="Expiration"
                                    body={(rowData) => dateTemplate(rowData, 'expiration_date')}
                                ></Column>
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
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
