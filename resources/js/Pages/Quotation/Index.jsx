import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, router   } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export default function Dashboard() {

    const { quotations } = usePage().props;

    const handleDownload = () => {
        router.visit(route('reports.quotation.download'), {
            method: 'get',
            preserveScroll: true
        });
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
                            <Button
                                label="+ Nueva Cotizacion"
                                severity="success"
                                size="small"
                                onClick={() => router.get(route('quot.create')) }
                            />

                            <Button
                                label="+ Descargar cotizacion"
                                severity="success"
                                size="small"
                                onClick={() => window.open(route('reports.quotation.download'), '_blank')}
                            />

                            <DataTable
                                value={quotations}
                                size="small"
                                tableStyle={{ minWidth: "50rem" }}
                            >
                                <Column
                                    field="id"
                                    header="No. Cotizacion"
                                ></Column>
                                <Column field="name" header="Fecha"></Column>
                                <Column
                                    field="customer_name"
                                    header="Cliente"
                                ></Column>
                                <Column
                                    field="total"
                                    header="Total"
                                ></Column>
                                <Column
                                    field="status"
                                    header="Estado"
                                ></Column>
                            </DataTable>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
