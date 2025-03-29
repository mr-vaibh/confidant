// src/types/index.ts

export interface Version {
    id: number;
    value: string;
    version: { id: string | number; value: string };
    created_at: string;
    created_by: number;
}

export interface Variable {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    created_by: number;
    latest_version: number | string;
    versions: Version[];
}
