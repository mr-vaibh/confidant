import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SignupContent from "./SignupContent";

export default function SignupModal() {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Signup</DialogTitle>
        <DialogDescription>
          Get started here
        </DialogDescription>
      </DialogHeader>

      <SignupContent />
    </DialogContent>
  )
}
