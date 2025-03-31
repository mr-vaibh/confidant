// components/VersionListDialog.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Variable, Version } from '@/types';
import useVersions from '@/hooks/useVersions';
import { fetcher } from '@/app/fetcher';

interface VersionListDialogProps {
  variable: Variable;
  children: React.ReactNode;
  refreshVariables: () => void;
}

const VersionListDialog: React.FC<VersionListDialogProps> = ({ variable, children, refreshVariables }) => {
  const { versions, loading, setVersions } = useVersions(variable.id); // Use custom hook
  const [newVersion, setNewVersion] = useState('');
  const [newValue, setNewValue] = useState('');
  const [loadingVersions, setLoadingVersions] = useState<Set<number>>(new Set()); // Track loading state per version

  const handleAddVersion = async () => {
    if (!newValue || !newVersion) {
      alert('Please enter both version and value.');
      return;
    }

    try {
      const newEntry: Version = await fetcher<Version>('/versions/', 'POST', {
        version: newVersion,
        value: newValue,
        created_by: variable.created_by,
        variable_id: variable.id,
      });

      setVersions((prev) => [newEntry, ...prev]); // Add new version at the top
      setNewVersion('');
      setNewValue('');
      refreshVariables();  // Update the Variables List table
    } catch (error) {
      console.error('Error adding version:', error);
    }
  };

  const handleDelete = async (versionId: number) => {
    if (!window.confirm('Are you sure you want to delete this version?')) return;

    try {
      setLoadingVersions((prev) => new Set(prev).add(versionId)); // Mark this version as loading
      await fetcher(`/versions/${versionId}/`, 'DELETE');
      setVersions((prev) => prev.filter((version) => version.id !== versionId));
    } catch (error) {
      console.error('Error deleting version:', error);
    } finally {
      setLoadingVersions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(versionId); // Remove the loading state for this version
        return newSet;
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-blue-600">
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Versions for {variable.name}</DialogTitle>
          <DialogDescription>Previous versions and values for this variable</DialogDescription>
        </DialogHeader>

        {/* Versions Table */}
        <div className="p-4 max-h-[400px] overflow-auto border-b">
          {versions.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-200 shadow-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b text-left font-medium text-gray-700">Version</th>
                  <th className="px-4 py-2 border-b text-left font-medium text-gray-700">Value</th>
                  <th className="px-4 py-2 border-b text-left font-medium text-gray-700">Created At</th>
                  <th className="px-4 py-2 border-b text-left font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {versions.map((version) => (
                  <tr key={version.id} className="hover:bg-gray-100">
                    <td className="px-4 py-2 border-b">{typeof version.version === 'object' ? JSON.stringify(version.version) : String(version.version)}</td>
                    <td className="px-4 py-2 border-b">{version.value}</td>
                    <td className="px-4 py-2 border-b">{new Date(version.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-2 border-b">
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={loadingVersions.has(version.id)} // Disable if this version is loading
                        onClick={() => handleDelete(version.id)}
                      >
                        {loadingVersions.has(version.id) ? 'Deleting...' : 'Delete'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No versions available.</p>
          )}
        </div>

        {/* Add New Version Form */}
        <div className="p-4">
          <h3 className="text-lg font-medium">Add New Version</h3>
          <div className="mt-2 flex gap-4">
            <Input
              type="text"
              placeholder="Version (e.g. v1.0)"
              value={newVersion}
              onChange={(e) => setNewVersion(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Value"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
            <Button onClick={handleAddVersion} disabled={loading}>
              {loading ? 'Adding...' : 'Add'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VersionListDialog;
