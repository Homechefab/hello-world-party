import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type ApplicationStatus = "pending" | "under_review" | "approved" | "rejected";

interface ChefApplication {
  id: string;
  business_name: string;
  application_status: ApplicationStatus;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export default function ApplicationStatus() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [application, setApplication] = useState<ChefApplication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchApplication();
    }
  }, [user]);

  const fetchApplication = async () => {
    try {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from("chefs")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No application found
          setApplication(null);
        } else {
          throw error;
        }
      } else if (data) {
        // Map to ChefApplication interface
        setApplication({
          id: data.id,
          business_name: data.business_name,
          application_status: (data.application_status as ApplicationStatus) || 'pending',
          rejection_reason: data.rejection_reason,
          created_at: data.created_at,
          updated_at: data.updated_at
        });
      }
    } catch (error) {
      console.error("Error fetching application:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: ApplicationStatus) => {
    switch (status) {
      case "pending":
        return {
          icon: <Clock className="h-5 w-5" />,
          color: "bg-yellow-500",
          label: "Inväntar granskning",
          description: "Din ansökan har mottagits och väntar på att granskas av vårt team."
        };
      case "under_review":
        return {
          icon: <AlertCircle className="h-5 w-5" />,
          color: "bg-blue-500",
          label: "Under granskning",
          description: "Vårt team granskar för närvarande din ansökan och dina dokument."
        };
      case "approved":
        return {
          icon: <CheckCircle2 className="h-5 w-5" />,
          color: "bg-green-500",
          label: "Godkänd",
          description: "Grattis! Din ansökan har godkänts. Du kan nu börja lägga till rätter och ta emot beställningar."
        };
      case "rejected":
        return {
          icon: <XCircle className="h-5 w-5" />,
          color: "bg-red-500",
          label: "Avslagen",
          description: "Tyvärr har din ansökan avvisats. Se anledningen nedan."
        };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Ingen ansökan hittades</CardTitle>
            <CardDescription>
              Du har inte skickat in någon kockansökan ännu.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/chef/application")}>
              Skicka in ansökan
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusInfo = getStatusInfo(application.application_status);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Status för din kockansökan</CardTitle>
          <CardDescription>
            Följ framstegen för din ansökan här
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-3">
            <div className={`${statusInfo.color} p-2 rounded-full text-white`}>
              {statusInfo.icon}
            </div>
            <div>
              <Badge variant="outline" className="text-base">
                {statusInfo.label}
              </Badge>
            </div>
          </div>

          {/* Status Description */}
          <Alert>
            <AlertTitle>Status</AlertTitle>
            <AlertDescription>{statusInfo.description}</AlertDescription>
          </Alert>

          {/* Business Name */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Företagsnamn
            </h3>
            <p className="text-lg">{application.business_name}</p>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Inskickad
              </h3>
              <p>{new Date(application.created_at).toLocaleDateString("sv-SE")}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Senast uppdaterad
              </h3>
              <p>{new Date(application.updated_at).toLocaleDateString("sv-SE")}</p>
            </div>
          </div>

          {/* Rejection Reason */}
          {application.application_status === "rejected" && application.rejection_reason && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Anledning till avslag</AlertTitle>
              <AlertDescription>{application.rejection_reason}</AlertDescription>
            </Alert>
          )}

          {/* Timeline */}
          <div className="space-y-4 pt-4">
            <h3 className="font-semibold">Ansökningsprocess</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className={`mt-1 rounded-full p-1 ${
                  ["pending", "under_review", "approved", "rejected"].includes(application.application_status)
                    ? "bg-green-500"
                    : "bg-gray-300"
                } text-white`}>
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Ansökan inskickad</p>
                  <p className="text-sm text-muted-foreground">Din ansökan har mottagits</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className={`mt-1 rounded-full p-1 ${
                  ["under_review", "approved", "rejected"].includes(application.application_status)
                    ? "bg-green-500"
                    : "bg-gray-300"
                } text-white`}>
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Granskning påbörjad</p>
                  <p className="text-sm text-muted-foreground">Teamet granskar din ansökan</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className={`mt-1 rounded-full p-1 ${
                  application.application_status === "approved"
                    ? "bg-green-500"
                    : application.application_status === "rejected"
                    ? "bg-red-500"
                    : "bg-gray-300"
                } text-white`}>
                  {application.application_status === "approved" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : application.application_status === "rejected" ? (
                    <XCircle className="h-4 w-4" />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="font-medium">Beslut fattat</p>
                  <p className="text-sm text-muted-foreground">
                    {application.application_status === "approved"
                      ? "Din ansökan har godkänts!"
                      : application.application_status === "rejected"
                      ? "Din ansökan har tyvärr avvisats"
                      : "Väntar på beslut"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          {application.application_status === "approved" && (
            <Button onClick={() => navigate("/chef/dashboard")} className="w-full">
              Gå till kockpanelen
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
