"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Badge,
} from "@/components/ui";

export default function PracticePage() {
  const [cliOutput, setCliOutput] = useState<string[]>([]);
  const [cliInput, setCliInput] = useState("");

  // --- Smarter CLI: respond based on the command
  const runCommand = () => {
    if (!cliInput.trim()) return;

    const cmd = cliInput.trim();
    let output = "";

    switch (cmd) {
      case "show version":
        output =
          "FTD 7.3.0 (mock build)\nModel: FTDv\nManaged by: FMC\nLicense(s): Threat, URL";
        break;

      case "show interface":
        output =
          "Gig0/0  (inside)  10.1.1.1/24   up\nGig0/1  (outside) 172.16.0.1/24  up\nMgmt    192.168.1.10/24         up";
        break;

      case "ping 8.8.8.8":
        output =
          "Sending 5, 100-byte ICMP Echos to 8.8.8.8\n!!!!!\nSuccess rate is 100% (5/5)";
        break;

      default:
        output =
          "Unknown command. Try: 'show version', 'show interface', or 'ping 8.8.8.8'.";
    }

    setCliOutput((prev) => [...prev, `> ${cmd}`, output]);
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
            <Button
              onClick={() =>
                setCliOutput((o) => [...o, "Clicked: Add NAT Rule"])
              }
            >
              ➕ Add NAT Rule
            </Button>

            <Button
              onClick={() =>
                setCliOutput((o) => [...o, "Clicked: Create VPN"])
              }
            >
              🔐 Create VPN
            </Button>

            <Button
              onClick={() =>
                setCliOutput((o) => [...o, "Clicked: Apply Security Policy"])
              }
            >
              🛡️ Apply Policy
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* CLI Section */}
      <Card>
        <CardHeader>
          <CardTitle>CLI Simulator</CardTitle>
          <Badge>Try: show version · show interface · ping 8.8.8.8</Badge>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-black text-green-400 font-mono text-sm p-3 rounded overflow-y-auto">
            {cliOutput.length === 0 ? (
              <p className="text-gray-500">No commands yet…</p>
            ) : (
              cliOutput.map((line, idx) => <div key={idx}>{line}</div>)
            )}
          </div>

          <div className="mt-3 flex gap-2">
            <Input
              value={cliInput}
              onChange={(e: any) => setCliInput(e.target.value)}
              placeholder="Enter command…"
              onKeyDown={(e: any) => {
                if (e.key === "Enter") runCommand();
              }}
            />
            <Button onClick={runCommand}>Run</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
