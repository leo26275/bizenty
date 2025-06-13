import React, { useMemo } from 'react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage } from "@inertiajs/react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { router } from "@inertiajs/react";


const Index = () => {
    const { customers } = usePage().props;
  const transformedCustomers = useMemo(() => {
    return customers.map(customer => ({
      ...customer,
      fullname: [customer.first_name, customer.middle_name]
        .filter(Boolean)
        .join(' ')
    }));
  }, [customers]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Customers
                </h2>
            }
        >
            <Card title="Customers records">
                <Button
                    label="+ Add"
                    severity="success"
                    size="small"
                    onClick={() => router.get(route("customers.create"))}
                />

                <DataTable value={transformedCustomers} paginator rows={10}>
                    <Column field="id" header="Id" />
                    <Column field="fullname" header="Names" />
                    <Column field="last_name" header="Lastname" />
                    <Column field="phone" header="Phone" />
                    <Column field="address" header="Address" />
                    <Column field="created_at" header="Created at" />
                </DataTable>
            </Card>
        </AuthenticatedLayout>
    );
};

export default Index;
