import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge } from "@/components/ui";

export default function PracticePage() {
  const [cliOutput, setCliOutput] = useState<string[]>([]);
  const [cliInput, setCliInput] = useState("");

  const runCommand = () => {
    if (!cliInput.trim()) return;
    setCliOutput([...cliOutput, `> ${cliInput}`, "Simulated output..."]);
    setCliInput("");
  };

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* GUI Section */}
      <Card>
        <CardHeader>
          <CardTitle>GUI (Firewall Simulator)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Button onClick={() => setCliOutput([...cliOutput, "Clicked: Add NAT Rule"])}>➕ Add NAT Rule</Button>
            <Button onClick={() => setCliOutput([...cliOutput, "Clicked: Create VPN"])}>🔐 Create VPN</Button>
            <Button onClick={() => setCliOutput([...cliOutput, "Clicked: Apply Security Policy"])}>🛡️ Apply Policy</Button>
          </div>
        </CardContent>
      </Card>

      {/* CLI Section */}
      <Card>
        <CardHeader>
          <CardTitle>CLI Simulator</CardTitle>
          <Badge>Try commands like `show version`</Badge>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-black text-green-400 font-mono text-sm p-3 rounded overflow-y-auto">
            {cliOutput.length === 0 ? (
              <p className="text-gray-500">No commands yet...</p>
            ) : (
              cliOutput.map((line, idx) => <div key={idx}>{line}</div>)
            )}
          </div>
          <div className="mt-3 flex gap-2">
            <Input
              value={cliInput}
              onChange={(e: any) => setCliInput(e.target.value)}
              placeholder="Enter command..."
            />
            <Button onClick={runCommand}>Run</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
