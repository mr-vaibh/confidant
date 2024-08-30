import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupContent() {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className="text-right">
          Email
        </Label>
        <Input id="email" placeholder="mail@example.com" className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="password" className="text-right">
          Password
        </Label>
        <Input type="password" id="password" placeholder="••••••••" className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="password" className="text-right">
          Confirm Password
        </Label>
        <Input type="password" id="password" placeholder="••••••••" className="col-span-3" />
      </div>
    </div>
  );
}
