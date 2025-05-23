import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Key } from 'lucide-react';
import Link from "next/link";
import { fetcher } from "@/app/fetcher";

import { DashboardSkeleton } from "@/components/custom/Skeletons/Dashboard.skeleton";

interface ManageSecretsResponse {
    total_variables_count: number;
    last_generated_days: number;
}

interface GenerateKeyResponse {
    message: string;
    public_key: string;
    private_key: string;
    username: string;
}

export default function ManageSecrets() {
    const [loading, setLoading] = useState(true);
    const [secretsData, setSecretsData] = useState<ManageSecretsResponse | null>(null);

    // Fetch the active keys count and last generated days only after user is available
    useEffect(() => {
        const fetchActiveKeysCount = async () => {
            try {
                const data = await fetcher<ManageSecretsResponse>("/variables/manage-secrets/");
                setSecretsData(data); // Store the response object in a single state
            } catch (error) {
                console.error("Error fetching secrets data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchActiveKeysCount();
    }, []);

    const handleDownloadKey = async () => {
        setLoading(true);
        try {
            const response = await fetcher<GenerateKeyResponse>("/generate-key/", "POST");

            if (response.private_key && response.username) {
                // Create the credentials JSON file content
                const credentials = JSON.stringify({
                    username: response.username,
                    public_key: response.public_key,
                    private_key: response.private_key,
                }, null, 2); // Pretty formatting for readability

                const blob = new Blob([credentials], { type: 'application/json' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "credentials.json");
                document.body.appendChild(link);
                link.click();

                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } else {
                console.error("Credentials not found in response");
                alert("Failed to generate the credentials. Please try again.");
            }
        } catch (error) {
            console.error("Error downloading the credentials:", error);
            alert("Failed to download the credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <DashboardSkeleton />

    return (
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle>Manage Secrets</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span>Active API Keys</span>
                        <Badge variant="secondary">
                            {secretsData?.total_variables_count ?? "Loading..."}
                        </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Last Generated</span>
                        <span>{secretsData?.last_generated_days ?? "Loading..."} days ago</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Link href="/variables">
                    <Button variant="outline"><Key className="mr-2 h-4 w-4" /> View Keys</Button>
                </Link>
                <Button onClick={handleDownloadKey} disabled={loading}>
                    <Key className="mr-2 h-4 w-4" />
                    {loading ? "Generating..." : "Generate New Key"}
                </Button>
            </CardFooter>
        </Card>
    );
}
