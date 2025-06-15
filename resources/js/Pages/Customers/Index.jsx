import React, { useMemo, useRef, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage } from "@inertiajs/react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { router } from "@inertiajs/react";
import { ContextMenu } from "primereact/contextmenu";
import { toDateFormat } from "@/Shared/Utils";

const Index = () => {
    const { customers } = usePage().props;
    const transformedCustomers = useMemo(() => {
        return customers.map((customer) => ({
            ...customer,
            fullname: [customer.first_name, customer.middle_name]
                .filter(Boolean)
                .join(" "),
        }));
    }, [customers]);

    const cm = useRef(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const menuModel = [
        {
            label: "Edit",
            icon: "pi pi-fw pi-pencil",
            command: () => editItem(selectedCustomer),
        },
        {
            label: "View",
            icon: "pi pi-fw pi-search",
            command: () => viewItem(selectedCustomer),
        },
    ];

    /*--- Context Options Functions --- */
    const editItem = (item) => {
        router.get(
            route("invoice.create") + `?invoice_id=${item.id}&edit=true`
        );
    };
    const viewItem = (item) => {
        router.get(
            route("invoice.create") + `?invoice_id=${item.id}&edit=true`
        );
    };
    /*--- End Context Options Functions --- */
    const dateTemplate = (rowData) => {
        return toDateFormat(rowData.created_at, 'yyyy-MM-dd');
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Customers
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-5">
                                <Button
                                    label="+ Create Customer"
                                    severity="success"
                                    size="small"
                                    onClick={() =>
                                        router.get(route("customers.create"))
                                    }
                                />
                            </div>
                            <ContextMenu
                                model={menuModel}
                                ref={cm}
                                onHide={() => setSelectedCustomer(null)}
                            />

                            <DataTable
                                value={transformedCustomers}
                                paginator
                                size="small"
                                onContextMenu={(e) =>
                                    cm.current.show(e.originalEvent)
                                }
                                contextMenuSelection={selectedCustomer}
                                onContextMenuSelectionChange={(e) =>
                                    setSelectedCustomer(e.value)
                                }
                                showGridlines
                                rows={10}
                            >
                                <Column field="id" header="Id" />
                                <Column field="fullname" header="Names" />
                                <Column field="last_name" header="Lastname" />
                                <Column field="phone" header="Phone" />
                                <Column field="address" header="Address" />
                                <Column
                                    field="created_at"
                                    header="Created at"
                                    body={dateTemplate}
                                />
                            </DataTable>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
