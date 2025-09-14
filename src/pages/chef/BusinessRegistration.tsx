import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BusinessSetup from "@/components/chef/BusinessSetup";

const BusinessRegistration = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/chef/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tillbaka till Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Registrera näringsverksamhet
          </h1>
          <p className="text-muted-foreground">
            Allt du behöver veta för att starta ditt matföretag
          </p>
        </div>
        
        <BusinessSetup />
      </div>
    </div>
  );
};

export default BusinessRegistration;