"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VariableDetailsDialog from "@/components/custom/Variables/VariableDetailsDialog";
import { Variable } from "@/types";
import { fetcher } from "@/app/fetcher";

const VariablesPage: React.FC = () => {
    const [variables, setVariables] = useState<Variable[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Fetch variables function
    const fetchVariables = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetcher<Variable[]>("/variables");
            setVariables(data);
        } catch (error) {
            console.error("Error fetching variables:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch variables on mount
    useEffect(() => {
        fetchVariables();
    }, [fetchVariables]);

    // Function to delete a variable version
    const handleDelete = async (variableId: string, versionId: string) => {
        try {
            await fetcher(`/versions/${versionId}/`, "DELETE");

            // Refetch data after deletion
            fetchVariables();
        } catch (error) {
            console.error("Error deleting version:", error);
        }
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-2xl font-bold mb-6">Variables List</h1>

            {loading && <p>Loading...</p>}

            <table className="min-w-full bg-white border border-gray-200 shadow-lg">
                <thead>
                    <tr>
                        <th className="px-6 py-4 border-b text-left font-medium text-gray-700">Name</th>
                        <th className="px-6 py-4 border-b text-left font-medium text-gray-700">Description</th>
                        <th className="px-6 py-4 border-b text-left font-medium text-gray-700">Latest Version</th>
                        <th className="px-6 py-4 border-b text-left font-medium text-gray-700">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {variables.map((variable) => {
                        const latestVersion = variable.versions.find(
                            (version) => version.id === variable.latest_version
                        );

                        return (
                            <tr key={variable.id} className="hover:bg-gray-100">
                                <td className="px-4 py-2 border-b">{variable.name}</td>
                                <td className="px-4 py-2 border-b">{variable.description || "-"}</td>
                                <td className="px-4 py-2 border-b">
                                    {latestVersion ? (
                                        latestVersion.value
                                    ) : (
                                        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                                            null
                                        </code>
                                    )}
                                </td>
                                <td className="px-4 py-2 border-b">
                                    <VariableDetailsDialog variable={variable} refreshVariables={fetchVariables}>
                                        <span className="text-blue-600 cursor-pointer">View Versions</span>
                                    </VariableDetailsDialog>
                                    <button
                                        onClick={() => handleDelete(variable.id, variable.latest_version)}
                                        className="ml-4 text-red-600"
                                    >
                                        Delete Latest
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default VariablesPage;
