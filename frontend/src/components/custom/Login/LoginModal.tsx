import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LoginContent from "./LoginContent";

export default function LoginModal() {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Login</DialogTitle>
        <DialogDescription>
          Welcome back
        </DialogDescription>
      </DialogHeader>

      <LoginContent />
    </DialogContent>
  )
}
