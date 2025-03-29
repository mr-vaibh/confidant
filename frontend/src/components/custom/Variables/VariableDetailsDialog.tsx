import React, { useEffect, useState, ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Variable, Version } from '@/types';
import { fetcher } from '@/app/fetcher';

interface VariableDetailsDialogProps {
  variable: Variable;
  children: ReactNode;
}

const VariableDetailsDialog: React.FC<VariableDetailsDialogProps> = ({ variable, children }) => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(false);
  const [newVersion, setNewVersion] = useState('');
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const data = await fetcher<Version[]>(`/variables/${variable.id}/versions`);
        setVersions(data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())); // 🔥 Sort latest first
      } catch (error) {
        console.error('Error fetching versions:', error);
      }
    };

    fetchVersions();
  }, [variable.id]);

  const handleDelete = async (versionId: number) => {
    if (!window.confirm('Are you sure you want to delete this version?')) return;

    try {
      setLoading(true);
      await fetcher(`/versions/${versionId}/`, 'DELETE');
      setVersions((prev) => prev.filter((version) => version.id !== versionId));
    } catch (error) {
      console.error('Error deleting version:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVersion = async () => {
    if (!newValue) {
      alert('Please enter both some value.');
      return;
    }
  
    try {
      setLoading(true);
      const newEntry = await fetcher(`/versions/`, 'POST', {
        version: newVersion,
        value: newValue,
        created_by: variable.created_by, // ✅ Auto-set the creator
        variable_id: variable.id, // ✅ Explicitly link the version to the variable
      });

      setVersions((prev) => [newEntry, ...prev]); // ✅ Add new version at the top
      setNewVersion('');
      setNewValue('');
    } catch (error) {
      console.error('Error adding version:', error);
    } finally {
      setLoading(false);
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

        <div className="p-4 max-h-[400px] overflow-auto border-b"> {/* 🔥 Make table scrollable */}
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
                    <td className="px-4 py-2 border-b">{version.version}</td>
                    <td className="px-4 py-2 border-b">{version.value}</td>
                    <td className="px-4 py-2 border-b">{new Date(version.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-2 border-b">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(version.id)}
                        disabled={loading}
                      >
                        {loading ? 'Deleting...' : 'Delete'}
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

export default VariableDetailsDialog;
