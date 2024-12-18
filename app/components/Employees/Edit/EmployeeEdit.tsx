"use client";

import React, { useEffect, useState } from "react";
import WelcomeBanner from "../../Globals/Welcome/WelcomeBanner";
import { UserPenIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputEmployee from "../InputEmployee";
import styles from "./employeeEdit.module.css";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import ClockLoader from "react-spinners/ClockLoader";
import PulseLoader from "react-spinners/PulseLoader";

type keys = "nombre" | "apellido" | "email" | "gerencia" | "puesto" | "seniority" | "legajo"

const schema = yup.object().shape({
    legajo: yup.string().required("El número de legajo es obligatorio"),
    email: yup
        .string()
        .email("Debe ser un correo válido")
        .required("El correo es obligatorio"),
    nombre: yup.string().required("El nombre es obligatorio"),
    apellido: yup.string().required("El apellido es obligatorio"),
    gerencia: yup.string().required("La gerencia es obligatoria"),
    puesto: yup.string().required("El puesto es obligatorio"),
    seniority: yup.string().required("El seniority es obligatorio"),
});

const EmployeeEdit = ({ id }) => {
    const { toast } = useToast();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [sendLoading, setSendLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        const fetchEmployee = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/employees/${id}`);

                if (!response.ok) {
                    throw new Error("Error al traer empleado");
                }

                const data = await response.json();

                Object.keys(data).forEach((key) => {
                    setValue(key as keys, data[key]);
                  });
            } catch {
                toast({
                    title: "Error al obtener el empleado a editar",
                    duration: 2000,
                    className: "bg-red-800",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmployee();
    }, [id, setValue, toast]);

    const onSubmit = async (formData) => {
        setSendLoading(true);
        try {
            const response = await fetch(`/api/employees/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Error al actualizar empleado");
            }

            toast({
                title: "Empleado editado correctamente",
                duration: 2000,
                className: "bg-green-800",
            });

            router.push("/employees");
        } catch {
            toast({
                title: "Error al editar el empleado",
                duration: 2000,
                className: "bg-red-800",
            });
        } finally {
            setSendLoading(false);
        }
    };

    return (
        <div>
            <WelcomeBanner
                title={isLoading ? "Cargando..." : `Editar empleado`}
                bagde="RRHH"
                icon={UserPenIcon}
            />

            {isLoading ? (
                <div className="flex justify-center items-center mt-48">
                    <ClockLoader size={100} color="#0DE6B4" />
                </div>
            ) : (
                <div className={styles.container}>
                    <h3 className={styles.title}>Editar empleado</h3>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className={styles.inputContainer}
                    >
                        <InputEmployee
                            label="Nro Legajo"
                            name="legajo"
                            register={register("legajo")}
                            error={errors.legajo?.message}
                            styles={styles}
                        />
                        <InputEmployee
                            label="Correo"
                            name="email"
                            register={register("email")}
                            error={errors.email?.message}
                            styles={styles}
                        />
                        <InputEmployee
                            label="Nombre"
                            name="nombre"
                            register={register("nombre")}
                            error={errors.nombre?.message}
                            styles={styles}
                        />
                        <InputEmployee
                            label="Apellido"
                            name="apellido"
                            register={register("apellido")}
                            error={errors.apellido?.message}
                            styles={styles}
                        />
                        <InputEmployee
                            label="Gerencia"
                            name="gerencia"
                            register={register("gerencia")}
                            error={errors.gerencia?.message}
                            styles={styles}
                        />
                        <InputEmployee
                            label="Puesto"
                            name="puesto"
                            register={register("puesto")}
                            error={errors.puesto?.message}
                            styles={styles}
                        />
                        <InputEmployee
                            label="Seniority"
                            name="seniority"
                            register={register("seniority")}
                            error={errors.seniority?.message}
                            styles={styles}
                        />

                        <Button type="submit" className={styles.btnEnviar}>
                            {sendLoading ? <PulseLoader size={10} color="white" /> : "Guardar"}
                        </Button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default EmployeeEdit;
