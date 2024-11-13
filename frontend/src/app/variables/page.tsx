// src/pages/VariablesPage.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import VariableDetailsDialog from '@/components/custom/Variables/VariableDetailsDialog';
import { Variable } from '@/types';
import { fetcher } from '@/app/fetcher';

const VariablesPage: React.FC = () => {
    const [variables, setVariables] = useState<Variable[]>([]);

    useEffect(() => {
        const fetchVariables = async () => {
            try {
                const data = await fetcher<Variable[]>('/variables');
                setVariables(data);
            } catch (error) {
                console.error('Error fetching variables:', error);
            }
        };

        fetchVariables();
    }, []);

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-2xl font-bold mb-6">Variables List</h1>
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
                                <td className="px-4 py-2 border-b">{variable.description || '-'}</td>
                                <td className="px-4 py-2 border-b">
                                    {latestVersion
                                        ? latestVersion.value
                                        : <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">null</code>
                                    }
                                </td>
                                <td className="px-4 py-2 border-b">
                                    <VariableDetailsDialog variable={variable}>
                                        <span className="text-blue-600 cursor-pointer">View Versions</span>
                                    </VariableDetailsDialog>
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