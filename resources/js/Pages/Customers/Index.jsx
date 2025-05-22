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
                    Clientes
                </h2>
            }
        >
            <Card title="Lista de Clientes">
                <Button
                    label="+ Agregar"
                    severity="success"
                    size="small"
                    onClick={() => router.get(route("customers.create"))}
                />

                <DataTable value={transformedCustomers} paginator rows={10}>
                    <Column field="id" header="Id" />
                    <Column field="fullname" header="Nombres" />
                    <Column field="last_name" header="Apellidos" />
                    <Column field="address" header="Dirección" />
                    <Column field="created_at" header="Creado" />
                </DataTable>
            </Card>
        </AuthenticatedLayout>
    );
};

export default Index;
