// components/VersionList.tsx
import { Button } from '@/components/ui/button';
import { Version } from '@/types';

interface VersionListProps {
    versions: Version[];
    loadingVersions: Set<number>;
    onDelete: (versionId: number) => void;
}

const VersionList: React.FC<VersionListProps> = ({ versions, loadingVersions, onDelete }) => {
    return (
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
                                        disabled={loadingVersions.has(version.id)}
                                        onClick={() => onDelete(version.id)}
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
    );
};

export default VersionList;
