import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

const PaymentCanceled = () => {
  return (
    <div className="container mx-auto max-w-3xl py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <XCircle className="w-6 h-6" /> Betalning avbruten
          </CardTitle>
          <CardDescription>
            Du avbröt betalningen. Du kan gå tillbaka och försöka igen.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Link to="/">
            <Button>Till startsidan</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCanceled;
