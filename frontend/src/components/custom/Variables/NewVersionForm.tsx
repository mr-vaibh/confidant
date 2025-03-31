// components/NewVersionForm.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NewVersionFormProps {
	newVersion: string;
	newValue: string;
	setNewVersion: React.Dispatch<React.SetStateAction<string>>;
	setNewValue: React.Dispatch<React.SetStateAction<string>>;
	handleAddVersion: () => void;
	loading: boolean;
}

const NewVersionForm: React.FC<NewVersionFormProps> = ({ newVersion, newValue, setNewVersion, setNewValue, handleAddVersion, loading }) => (
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
);

export default NewVersionForm;
