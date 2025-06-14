import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, router } from "@inertiajs/react";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ContextMenu } from 'primereact/contextmenu';
import { Tag } from 'primereact/tag';

export default function Dashboard() {

    const { invoices } = usePage().props;

    console.log(invoices);


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

    }

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

    const headerTable = () => {
        return (
            <div>
                Filtros
            </div>
        )
    }

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
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">

                            <div className="mb-5">
                                <Button
                                    label="+ New Invoice"
                                    severity="success"
                                    size="small"
                                    onClick={() => router.get(route('invoice.create')) }
                                />
                            </div>

                            <ContextMenu model={menuModel} ref={cm} onHide={() => setSelectedProduct(null)} />
                            <DataTable
                                value={invoices}
                                onContextMenu={(e) => cm.current.show(e.originalEvent)} contextMenuSelection={selectedProduct} onContextMenuSelectionChange={(e) => setSelectedProduct(e.value)}
                                size="small"
                                tableStyle={{ minWidth: "50rem" }}
                                showGridlines
                                header={headerTable}
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
