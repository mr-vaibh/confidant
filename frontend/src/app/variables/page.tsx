"use client";

import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import VersionListDialog from "@/components/custom/Variables/VersionListDialog";
import { Variable, Version } from "@/types";
import { fetcher } from "@/app/fetcher";
import PageHeading from "@/components/custom/PageHeading";
import { Plus, Trash } from "lucide-react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const VariablesPage: React.FC = () => {
    const [variables, setVariables] = useState<Variable[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [creating, setCreating] = useState(false);

    const fetchVariables = useCallback(async (): Promise<void> => {
        try {
            setLoading(true);
            const data = await fetcher<Variable[]>("/variables");
            setVariables(data);
        } catch (error) {
            toast.error("Error fetching variables");
            console.error("Error fetching variables:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchVariables();
    }, [fetchVariables]);

    // Create a new secret
    const handleNewSecret = async () => {
        if (!name.trim()) {
            toast.error("Secret name is required.");
            return;
        }

        try {
            setCreating(true);
            await fetcher("/variables/", "POST", { name, description: "" });
            toast.success("New secret created!");
            fetchVariables();
            setIsOpen(false);
            setName("");
        } catch (error) {
            console.error("Error creating secret:", error);
        } finally {
            setCreating(false);
        }
    };

    // Delete a variable
    const handleDeleteVariable = async (id: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this variable?");
        if (!confirmDelete) return;

        try {
            await fetcher(`/variables/${id}/`, "DELETE");
            toast.success("Variable deleted successfully!");
            fetchVariables();
        } catch (error) {
            console.error("Error deleting variable:", error);
            toast.error("Failed to delete variable.");
        }
    };

    return (
        <div className="container mx-auto p-8">
            <div className="flex justify-between items-center">
                <PageHeading text="Variables List" />
                
                {/* New Secret Button */}
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-200 ease-in-out">
                            <Plus className="mr-2" size={18} /> New Secret
                        </button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Secret</DialogTitle>
                        </DialogHeader>

                        <div className="flex flex-col space-y-3">
                            <label className="text-gray-600 text-sm">Secret Name</label>
                            <Input
                                type="text"
                                placeholder="Enter secret name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                            <Button onClick={handleNewSecret} disabled={creating}>
                                {creating ? "Creating..." : "Create"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

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
                        const latestVersion: Version | undefined = variable.versions.find(
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
                                <td className="px-4 py-2 border-b flex items-center space-x-4">
                                    <VersionListDialog variable={variable} refreshVariables={fetchVariables}>
                                        <span className="text-blue-600 cursor-pointer">View Versions</span>
                                    </VersionListDialog>

                                    <button
                                        onClick={() => handleDeleteVariable(String(variable.id))}
                                        className="text-gray-600 hover:text-red-600 transition"
                                    >
                                        <Trash className="inline" size={20} />
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
