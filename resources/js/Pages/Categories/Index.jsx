import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React from "react";
import { router } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

const List = () => {
    const { categories } = usePage().props;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Categorias / Todas
                </h2>
            }
        >
            <Card title="Lista de Categorías">
                <Button
                    label="+ Agregar"
                    severity="success"
                    size="small"
                    onClick={() => router.get(route("categories.create"))}
                />

                <DataTable value={categories} paginator rows={10}>
                    <Column field="id" header="ID" />
                    <Column field="name" header="Nombre" />
                    <Column field="created_at" header="Creado" />
                </DataTable>
            </Card>
        </AuthenticatedLayout>
    );
};

export default List;
