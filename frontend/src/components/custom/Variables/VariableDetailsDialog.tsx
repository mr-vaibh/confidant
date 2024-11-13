// src/components/VariableDetailsDialog.tsx
import React, { useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Variable, Version } from '@/types';
import { fetcher } from '@/app/fetcher';

interface VariableDetailsDialogProps {
  variable: Variable;
  children: ReactNode;
}

const VariableDetailsDialog: React.FC<VariableDetailsDialogProps> = ({ variable, children }) => {
  const [versions, setVersions] = useState<Version[]>([]);

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const data = await fetcher<Version[]>(`/variables/${variable.id}/versions`);
        setVersions(data);
      } catch (error) {
        console.error('Error fetching versions:', error);
      }
    };

    fetchVersions();
  }, [variable.id]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-blue-600">
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Versions for {variable.name}</DialogTitle>
          <DialogDescription>Previous versions and values for this variable</DialogDescription>
        </DialogHeader>
        <div className="p-4 overflow-auto">
          {versions.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-200 shadow-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b text-left font-medium text-gray-700">Version</th>
                  <th className="px-4 py-2 border-b text-left font-medium text-gray-700">Value</th>
                  <th className="px-4 py-2 border-b text-left font-medium text-gray-700">Created At</th>
                </tr>
              </thead>
              <tbody>
                {versions.map((version) => (
                  <tr key={version.id} className="hover:bg-gray-100">
                    <td className="px-4 py-2 border-b">{version.version}</td>
                    <td className="px-4 py-2 border-b">{version.value}</td>
                    <td className="px-4 py-2 border-b">{new Date(version.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No versions available.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VariableDetailsDialog;