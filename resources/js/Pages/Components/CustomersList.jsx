import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { customerGetAll } from "@/Services/customerService";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";

export default function CustomerList({
    dialogVisible,
    setDialogVisible,
    onCustomerSelected,
}) {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [disableOk, setDisableOk] = useState(true);
    const [loading, setLoading] = useState(false);

    const selectCustomer = () => {
        onCustomerSelected(selectedCustomer);
        setDialogVisible(false);
    };

    const loadCustomers = async () => {
        setLoading(true);
        try {
            const customers = (await customerGetAll()).data;
            const formatCustomers = customers.map((e) => {
                return {
                    id: e.id,
                    fullname: `${e.first_name} ${e.middle_name} ${e.last_name}`,
                    address: e.address,
                    phone: "0000-0000",
                };
            });

            console.log(formatCustomers);

            setCustomers(formatCustomers);
        } catch (ex) {
            alert("Ocurrio un error");
            console.error(ex);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (dialogVisible === true) {
            setDisableOk(true);
            setSelectedCustomer(null);
            loadCustomers();
        }
    }, [dialogVisible]);

    useEffect(() => {
        setDisableOk(selectedCustomer === null);
    }, [selectedCustomer]);

    const dialogFooterTemplate = () => {
        return (
            <Button
                label="Ok"
                icon="pi pi-check"
                disabled={disableOk}
                onClick={selectCustomer}
            />
        );
    };

    return (
        <div className="card">
            <Dialog
                header="Available customers"
                visible={dialogVisible}
                style={{ width: "75vw" }}
                maximizable
                modal
                contentStyle={{ height: "300px" }}
                onHide={() => setDialogVisible(false)}
                footer={dialogFooterTemplate}
            >
                {loading && (
                    <div className="card flex justify-content-center mt-4">
                        <ProgressSpinner />
                    </div>
                )}

                {!loading && (
                    <DataTable
                        value={customers}
                        dataKey="id"
                        selection={selectedCustomer}
                        onSelectionChange={(e) => setSelectedCustomer(e.value)}
                        tableStyle={{ minWidth: "50rem" }}
                    >
                        <Column
                            selectionMode="single"
                            headerStyle={{ width: "3rem" }}
                        ></Column>
                        <Column field="fullname" header="Customer"></Column>
                        <Column field="address" header="Address"></Column>
                        <Column field="phone" header="Phone"></Column>
                    </DataTable>
                )}
            </Dialog>
        </div>
    );
}
