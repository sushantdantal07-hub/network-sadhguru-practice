"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge } from "@/components/ui";

/**
 * Practice — Split-screen lab
 * - GUI (left)
 * - CLI (right)
 * Defaults: GUI actions do NOT echo into CLI (restores your earlier behavior).
 * A small toggle lets you enable echo when needed.
 */

export default function PracticePage() {
  // CLI state
  const [cliOutput, setCliOutput] = useState<string[]>([
    // start empty and calm — no auto messages
  ]);
  const [cliInput, setCliInput] = useState("");
  const [echoGuiToCli, setEchoGuiToCli] = useState(false); // <-- default OFF (your earlier behavior)

  const cliEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    cliEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [cliOutput]);

  // --- CLI command handling (mock) ---
  function runCommand(raw: string) {
    const cmd = raw.trim();
    if (!cmd) return;

    // show a simple prompt-like prefix
    const prompt = `> ${cmd}`;
    const lines: string[] = [prompt];

    switch (cmd.toLowerCase()) {
      case "show version":
        lines.push(
          "FTD 7.3.0 (mock build)  Model: FTDv  Managed by: FMC  License(s): Threat, URL"
        );
        break;
      case "show interface":
      case "show interfaces":
        lines.push(
          "Gig0/0 (inside) 10.1.1.1/24 up   Gig0/1 (outside) 172.16.0.1/24 up   Mgmt 192.168.1.10/24 up"
        );
        break;
      case "ping 8.8.8.8":
        lines.push("Sending 5, 100-byte ICMP Echos to 8.8.8.8:");
        lines.push("!!!!!  Success rate is 100 percent (5/5), round-trip min/avg/max = 2/4/9 ms");
        break;
      default:
        lines.push("Unknown command (mock). Try: show version | show interface | ping 8.8.8.8");
    }

    setCliOutput((prev) => [...prev, ...lines]);
    setCliInput("");
  }

  // --- GUI actions (do NOT echo to CLI unless toggled) ---
  function guiAction(action: "nat" | "vpn" | "policy") {
    if (!echoGuiToCli) {
      // keep quiet by default — this restores your earlier behavior
      return;
    }
    // If echo is ON, append realistic, short mock sequences (still non-intrusive)
    const map: Record<typeof action, string[]> = {
      nat: [
        "> configure terminal",
        "nat (inside,outside) source static OBJ_IN OBJ_OUT destination static any any",
        "write memory",
      ],
      vpn: [
        "> configure terminal",
        "crypto ikev2 policy 10",
        "tunnel-group 1.1.1.1 type ipsec-l2l",
        "write memory",
      ],
      policy: [
        "> configure terminal",
        "access-control-policy Sadhguru-ACP",
        "deploy",
      ],
    };
    setCliOutput((prev) => [...prev, ...(map[action] || [])]);
  }

  return (
    <div className="min-h-[calc(100vh-80px)] p-5 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: GUI */}
        <Card className="shadow-sm">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>GUI (Firewall Simulator)</CardTitle>
            <div className="flex items-center gap-2 text-xs">
              <Badge>Practice</Badge>
              <Button
                className={echoGuiToCli ? "bg-indigo-50" : ""}
                onClick={() => setEchoGuiToCli((s) => !s)}
              >
                {echoGuiToCli ? "Echo GUI ➜ CLI: ON" : "Echo GUI ➜ CLI: OFF"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full justify-start"
              onClick={() => guiAction("nat")}
              aria-label="Add NAT Rule"
            >
              <span className="mr-2">➕</span> Add NAT Rule
            </Button>

            <Button
              className="w-full justify-start"
              onClick={() => guiAction("vpn")}
              aria-label="Create VPN"
            >
              <span className="mr-2">🔒</span> Create VPN
            </Button>

            <Button
              className="w-full justify-start"
              onClick={() => guiAction("policy")}
              aria-label="Apply Policy"
            >
              <span className="mr-2">🛡️</span> Apply Policy
            </Button>
          </CardContent>
        </Card>

        {/* Right: CLI */}
        <Card className="shadow-sm">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>CLI Simulator</CardTitle>
            <div className="flex items-center gap-2 text-xs">
              <span>Try:</span>
              <Button onClick={() => runCommand("show version")} className="bg-slate-50">
                show version
              </Button>
              <Button onClick={() => runCommand("show interface")} className="bg-slate-50">
                show interface
              </Button>
              <Button onClick={() => runCommand("ping 8.8.8.8")} className="bg-slate-50">
                ping 8.8.8.8
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72 overflow-auto rounded-xl bg-black text-green-300 font-mono text-sm p-3">
              {cliOutput.map((line, i) => (
                <div key={i} className="whitespace-pre-wrap">
                  {line}
                </div>
              ))}
              <div ref={cliEndRef} />
            </div>

            <div className="flex items-center gap-2 mt-3">
              <Input
                placeholder="Enter command…"
                value={cliInput}
                onChange={(e) => setCliInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") runCommand(cliInput);
                }}
              />
              <Button onClick={() => runCommand(cliInput)}>Run</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
