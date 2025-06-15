import React, {
    forwardRef,
    useContext,
    useImperativeHandle,
    useRef,
} from "react";
import { router, usePage } from "@inertiajs/react";
import { LayoutContext } from "@/Layouts/Context/layoutcontext";
import { MegaMenu } from "primereact/megamenu";
import { classNames } from "primereact/utils";
import { Ripple } from "primereact/ripple";
import { Chip } from "primereact/chip";
import { Button } from "primereact/button";

const AppTopbar = forwardRef((props, ref) => {
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const { layoutConfig, layoutState } = useContext(LayoutContext);
    const user = usePage().props.auth.user;

    //console.log('Datos desde el hook');
    //console.log(usePage().props.auth);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current,
    }));

    const optionsSplit = [
        {
            label: "Update",
            icon: "pi pi-refresh",
        },
        {
            label: "Delete",
            icon: "pi pi-times",
        },
    ];

    const itemRenderer = (item, options) => {
        if (item.root) {
            return (
                <a
                    className="flex align-items-center cursor-pointer px-3 py-2 overflow-hidden relative font-semibold text-lg uppercase p-ripple hover:surface-ground"
                    onClick={(e) => options.onClick(e)}
                >
                    <span className={item.icon} />
                    <span className="ml-2">{item.label}</span>
                    <Ripple />
                </a>
            );
        } else if (!item.image) {
            return (
                <a
                    className="flex align-items-center p-3 cursor-pointer mb-2 gap-2 "
                    onClick={options.onClick}
                >
                    <span className="inline-flex align-items-center justify-content-center border-circle bg-primary w-3rem h-3rem">
                        <i className={`${item.icon} text-lg`}></i>
                    </span>
                    <span className="inline-flex flex-column gap-1">
                        <span className="font-medium text-lg text-900">
                            {item.label}
                        </span>
                        <span className="white-space-nowrap">
                            {item.subtext}
                        </span>
                    </span>
                </a>
            );
        } else {
            return (
                <div
                    className="flex flex-column align-items-start gap-3"
                    onClick={options.onClick}
                >
                    <img
                        alt="megamenu-demo"
                        src={item.image}
                        className="w-full"
                    />
                    <span>{item.subtext}</span>
                    <Button
                        className="p-button p-component p-button-outlined"
                        label={item.label}
                    />
                </div>
            );
        }
    };

    const items = [
        {
            label: "Quotations",
            icon: "pi pi-th-large",
            items: [
                [
                    {
                        label: "Operations",
                        items: [
                            {
                                label: "Create",
                                command: () => {
                                    router.get(route("quotation.create"));
                                },
                            },
                            {
                                label: "All records",
                                command: () => {
                                    router.get(route("quotation.index"));
                                },
                            },
                        ],
                    },
                ]
            ],
        },
        {
            label: "Invoices",
            icon: "pi pi-money-bill",
            items: [
                [
                    {
                        label: "Operations",
                        items: [
                            {
                                label: "Create",
                                command: () => {
                                    router.get(route('invoice.create'))
                                }
                            },
                            {
                                label: "All records",
                                command: () => {
                                    router.get(route('invoice.index'))
                                }
                            },
                        ],
                    },
                ]
            ],
        },
        {
            label: "Customers",
            icon: "pi pi-folder",
            items: [
                [
                    {
                        label: "Operations",
                        items: [
                            {
                                label: "Create",
                                command: () => {
                                    router.get(route("customers.create"));
                                },
                            },
                            {
                                label: "All records",
                                command: () => {
                                    router.get(route("customers.index"));
                                },
                            },
                        ],
                    },
                ]
            ],
        },
        {
            label: "Categories",
            icon: "pi pi-box",
            items: [
                [
                    {
                        label: "Operations",
                        items: [
                            {
                                label: "Create",
                                command: () => {
                                    router.get(route("categories.create"));
                                },
                            },
                            {
                                label: "All records",
                                command: () => {
                                    router.get(route("categories.index"));
                                },
                            },
                        ],
                    },
                ]
            ],
        },
        {
            label: "Company",
            icon: "pi pi-shop",
            items: [
                [
                    {
                        label: "Information",
                        items: [
                            {
                                label: "Setting",
                                command: () => {
                                    router.get(route("categories.create"));
                                },
                            }
                        ],
                    },
                ]
            ],
        },
    ];

    return (
        <div className="layout-topbar">
            <div className="ct-toolbar ">
                <div className="ct-pnl01 p-2">
                    <div href="/" className="layout-topbar-logo">
                        <img
                            src={`/layout/images/logo-${
                                layoutConfig.colorScheme !== "light"
                                    ? "white"
                                    : "dark"
                            }.svg`}
                            width="47.22px"
                            height={"35px"}
                            alt="logo"
                        />
                        <span>EnterpriseOne</span>
                    </div>
                    <div
                        ref={topbarmenuRef}
                        className={classNames("layout-topbar-menu", {
                            "layout-topbar-menu-mobile-active":
                                layoutState.profileSidebarVisible,
                        })}
                    >
                        <div className="flex align-items-center justify-content-center">
                            <Chip
                                label={user.name}
                                image="/images/avatar/default.jpg"
                            />
                        </div>

                        <Button
                            icon="pi pi-cog"
                            rounded
                            text
                            severity="secondary"
                            aria-label="Settings"
                        />

                        <Button
                            icon="pi pi-sign-out"
                            rounded
                            text
                            onClick={(e) => {
                                router.post(route('logout'));
                            }}
                            severity="secondary"
                            aria-label="Logout"
                        />
                    </div>
                </div>
                <div className="ct-pnl02 p-2">
                    {/*<MegaMenu
                        model={itemsMega}
                        orientation="horizontal"
                        breakpoint="960px"
                    />*/}

                    <MegaMenu model={items} breakpoint="960px" />
                </div>
            </div>
        </div>
    );
});

AppTopbar.displayName = "AppTopbar";

export default AppTopbar;
