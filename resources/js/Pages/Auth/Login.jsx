import "@/Pages/Auth/styles/auth.style.scss";
import TextInput from "@/Components/TextInput";
import { InputText } from "primereact/inputtext";
import InputLabel from "@/Components/InputLabel";
import { Head, Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";

const LoginPage = ({ status, canResetPassword }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <div className="flex align-items-center justify-content-center min-h-screen surface-ground px-4">
            <div className="panel-auth shadow-2">
                <div className="grid">
                    <div className="col-7 p-0">
                        <div className="panel-l h-full"></div>
                    </div>
                    <div className="col-5 p-0">
                        <div className="surface-card h-full p-4">
                            <div className="flex justify-content-center pb-3">
                                <h3>EnterpriseOne</h3>
                            </div>

                            <p className="pb-3">
                                Welcome to EnterpriseOne, Ingrese sus
                                credenciales para iniciar sesion
                            </p>
                            <form onSubmit={submit}>
                                <div>
                                    <InputLabel htmlFor="email" value="Email" />

                                    <InputText
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="mt-1 block w-full"
                                        autoComplete="username"
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                    />

                                    <InputError
                                        message={errors.email}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mt-4">
                                    <InputLabel
                                        htmlFor="password"
                                        value="Password"
                                    />

                                    <InputText
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="mt-1 block w-full"
                                        autoComplete="current-password"
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                    />

                                    <InputError
                                        message={errors.password}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="mt-4">
                                    {canResetPassword && (
                                        <Link
                                            href={route("password.request")}
                                            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            Forgot your password?
                                        </Link>
                                    )}

                                </div>
                                <div className="mt-4 flex justify-content-center">
                                    <PrimaryButton
                                        className="ms-4"
                                        disabled={processing}
                                    >
                                        Log in
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
