import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginContent() {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Email
        </Label>
        <Input id="name" defaultValue="Pedro Duarte" className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="username" className="text-right">
          Password
        </Label>
        <Input type="password" id="username" defaultValue="@peduarte" className="col-span-3" />
      </div>
    </div>
  );
}
