"use client";

import React, { useEffect, useState } from "react";
import InputEmployee from "../InputEmployee";
import styles from "./employeesCreate.module.css";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import PulseLoader from "react-spinners/PulseLoader";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

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
  userId: yup.string().required("Debe seleccionar un supervisor"),
});

interface Boss {
  id: string;
  nombre: string;
  apellido: string;
}

const EmployeeCreate = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [bosses, setBosses] = useState<Boss[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema)
  });

  const fetchData = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Error trayendo datos");
      }
      const data = await response.json();
      setBosses(data);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async (data) => {
    console.log(data);
    setLoading(true);
    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error al crear empleado");
      }

      toast({
        title: "Empleado creado correctamente",
        duration: 2000,
        className: "bg-green-800",
      });

      router.push("/employees");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error al crear el empleado",
        duration: 2000,
        className: "bg-red-800",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
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
        <div className={styles.supervisorContainer}>
          <label className={styles.inputLabel}>Supervisor</label>
          <Controller
            name="userId"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <select {...field} className={styles.inputSelect}>
                <option value="" disabled>
                  Selecciona un supervisor
                </option>
                {bosses.map((boss) => (
                  <option key={boss.id} value={boss.id}>
                    {boss.nombre} {boss.apellido}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.userId && <p className={styles.error}>{errors.userId.message}</p>}
        </div>
        <Button type="submit" className={styles.btnEnviar}>
          {loading ? <PulseLoader size={10} color="white" /> : "Crear"}
        </Button>
      </form>
    </div>
  );
};

export default EmployeeCreate;
