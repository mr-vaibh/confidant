// hooks/useVersions.ts
import { useState, useEffect } from 'react';
import { fetcher } from '@/app/fetcher';
import { Version } from '@/types';

const useVersions = (variableId: number) => {
    const [versions, setVersions] = useState<Version[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchVersions = async () => {
            setLoading(true);
            try {
                const data = await fetcher<Version[]>(`/variables/${variableId}/versions`);
                setVersions(data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())); // Sort latest first
            } catch (error) {
                console.error('Error fetching versions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVersions();
    }, [variableId]);

    return { versions, loading, setVersions };
};

export default useVersions;
