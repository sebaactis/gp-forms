"use client";

import React, { useEffect, useState, useCallback } from "react";
import WelcomeBanner from "../Globals/Welcome/WelcomeBanner";
import AssignmentsBoss from "./AssignmentsBoss";
import { Separator } from "@/components/ui/separator";
import AssignmentsForms from "./AssignmentsForms";
import AssignmentsCompletedForm from "./AssignmentsCompletedForm";
import { EmployeeWithRelations } from "@/types";
import { useToast } from '@/hooks/use-toast';

const AssignmentsMain = () => {
    const { toast } = useToast()
    const [fetchLoading, setFetchLoading] = useState(false);
    const [employees, setEmployees] = useState<EmployeeWithRelations[] | []>([]);

    const fetchData = useCallback(async () => {
        setFetchLoading(true);
        try {
            const employeesResponse = await fetch("/api/employees", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!employeesResponse.ok) {
                console.log(employeesResponse);
                throw new Error("Error trayendo datos");
            }

            const employeesData = await employeesResponse.json();

            setEmployees(employeesData);
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error trayendo los datos correspondientes',
                className: 'bg-red-800',
                duration: 3000,
            });
        } finally {
            setFetchLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div>
            <WelcomeBanner
                title="Asignaciones"
                bagde="RRHH"
                icon="list-collapse" />

            <AssignmentsBoss />
            <Separator />
            <AssignmentsForms
                employees={employees}
                fetchLoading={fetchLoading}
                setFetchLoading={setFetchLoading}
                fetchData={fetchData}
            />
            <Separator />
            <AssignmentsCompletedForm employees={employees} fetchLoading={fetchLoading} />
        </div>
    );
};

export default AssignmentsMain;
