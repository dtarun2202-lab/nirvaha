import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export function SettingsPage() {
  const [platformName, setPlatformName] = useState("Nirvaha Wellness");
  const [supportEmail, setSupportEmail] = useState("support@nirvaha.com");
  const [onboardingEnabled, setOnboardingEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const handleSave = () => {
    const timestamp = new Date().toLocaleString();
    setLastSaved(timestamp);
  };

  return (
    <div className="p-6 bg-[#F4FAF6] min-h-screen -m-6 rounded-tl-3xl">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#1F4131] mb-2">Settings</h1>
          <p className="text-[#64C08E] font-medium">Configure platform preferences for admins and companions</p>
        </div>

        <Card className="bg-white border-[#D5EEDD] p-8 space-y-8 rounded-3xl shadow-sm">
          <div className="space-y-3">
            <Label htmlFor="platformName" className="text-[#1A4F35] font-bold text-sm uppercase tracking-wider">Platform Name</Label>
            <Input
              id="platformName"
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              className="bg-[#F8FCF9] border-[#BDE8CE] text-[#1F4131] placeholder:text-[#86CDA6] rounded-xl h-12 px-4 focus-visible:ring-[#5ABF88] font-medium transition-all hover:bg-white"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="supportEmail" className="text-[#1A4F35] font-bold text-sm uppercase tracking-wider">Support Email</Label>
            <Input
              id="supportEmail"
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="bg-[#F8FCF9] border-[#BDE8CE] text-[#1F4131] placeholder:text-[#86CDA6] rounded-xl h-12 px-4 focus-visible:ring-[#5ABF88] font-medium transition-all hover:bg-white"
            />
          </div>

          <div className="flex items-center justify-between p-6 rounded-2xl border border-[#BDE8CE] bg-gradient-to-r from-[#F4FAF6] to-[#EAFBF0] shadow-sm">
            <div>
              <p className="text-[#1F4131] font-bold text-lg">Enable Companion Onboarding</p>
              <p className="text-[#64C08E] font-medium mt-1">Allow new companions to submit applications</p>
            </div>
            <Switch
              checked={onboardingEnabled}
              onCheckedChange={setOnboardingEnabled}
              aria-label="Toggle companion onboarding"
              className="data-[state=checked]:bg-[#5ABF88] data-[state=unchecked]:bg-[#BDE8CE]"
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Button
              className="bg-gradient-to-r from-[#4EAA77] to-[#3C9162] hover:from-[#3C9162] hover:to-[#2F734D] text-white rounded-full px-8 py-6 text-base font-bold shadow-md transition-all hover:shadow-lg"
              onClick={handleSave}
            >
              Save Settings
            </Button>
            {lastSaved && (
              <span className="text-[#64C08E] font-medium text-sm bg-[#EAFBF0] px-4 py-2 rounded-full border border-[#BDE8CE]">
                Last saved at {lastSaved}
              </span>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

