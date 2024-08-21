import { SignIn } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <Fragment>
      <Dialog defaultOpen={true}>
        <DialogContent className="sm:max-w-[425px] ">
          <DialogHeader>
            <DialogTitle>Kära besökare</DialogTitle>
            <DialogDescription>Registrera dig med testkontot</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            Om du vill använda testkontot för att få en helt anonym upplevelse
            av appen, vänligen klicka på&nbsp;
            <span className="font-semibold ">Registrera</span> och registrera
            dig med den automatgenererade informationen.
          </div>
          <DialogFooter>
            <Link className="w-full" href={"/sign-up"}>
              <Button className="w-full bg-green-400 text-black hover:bg-green-500">
                Registrera
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SignIn signUpForceRedirectUrl={"/read-me"} />
    </Fragment>
  );
}
