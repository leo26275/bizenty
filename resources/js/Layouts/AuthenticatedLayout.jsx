import { Link, usePage, router } from "@inertiajs/react";
import React, { useState, useContext, useRef } from "react";

import { Button } from "primereact/button";
import { SplitButton } from "primereact/splitbutton";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { LayoutContext } from "@/Layouts/Context/layoutcontext";
//import "@/Layouts/styles/layout.scss";
import { classNames } from "primereact/utils";
import AppTopbar from "./AppTopBar";
import "@/Layouts/styles/layout.scss";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const { layoutConfig, layoutState } = useContext(LayoutContext);
    const topbarmenuRef = useRef(null);
    const topbarRef = useRef(null);

    const items = [
        {
            label: "Update",
            icon: "pi pi-refresh",
        },
        {
            label: "Delete",
            icon: "pi pi-times",
        },
    ];

    const startContent = (
        <React.Fragment>
            <Button icon="pi pi-plus" className="mr-2" />
            <Button icon="pi pi-print" className="mr-2" />
            <Button icon="pi pi-upload" />
        </React.Fragment>
    );

    const centerContent = (
        <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText placeholder="Search" />
        </IconField>
    );

    const endContent = (
        <React.Fragment>
            <SplitButton
                label="Save"
                model={items}
                icon="pi pi-check"
            ></SplitButton>
        </React.Fragment>
    );

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const containerClass = classNames("layout-wrapper", {
        "layout-overlay": layoutConfig.menuMode === "overlay",
        "layout-static": layoutConfig.menuMode === "static",
        "layout-static-inactive":
            layoutState.staticMenuDesktopInactive &&
            layoutConfig.menuMode === "static",
        "layout-overlay-active": layoutState.overlayMenuActive,
        "layout-mobile-active": layoutState.staticMenuMobileActive,
        "p-input-filled": layoutConfig.inputStyle === "filled",
        "p-ripple-disabled": !layoutConfig.ripple,
    });

    return (
        <div className={containerClass}>
            <AppTopbar ref={topbarRef} />
            <main className="layout-main-container">
                <div className="layout-main">
                    {/*{header && (
                        <header className="bg-primary shadow">
                            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </header>
                    )}*/}
                    {children}
                </div>
                {/*<AppFooter />*/}
            </main>
        </div>
    );
}
