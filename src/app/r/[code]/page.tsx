import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { ReferralForm } from "./referral-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ReferralPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const ambassador = await prisma.ambassador.findUnique({
    where: { referralCode: code },
  });
  if (!ambassador) notFound();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f7fb] p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#0073ea] flex items-center justify-center text-white font-bold text-xl">
              F
            </div>
          </div>
          <CardTitle className="text-2xl">FIBC Real Estate</CardTitle>
          <p className="text-muted-foreground text-sm mt-2">
            הופנית על ידי{" "}
            <span className="font-semibold text-foreground">
              {ambassador.fullName}
            </span>
          </p>
        </CardHeader>
        <CardContent>
          <ReferralForm
            ambassadorId={ambassador.id}
            referralCode={code}
          />
        </CardContent>
      </Card>
    </div>
  );
}
