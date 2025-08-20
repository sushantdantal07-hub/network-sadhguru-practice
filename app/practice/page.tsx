"use client";

import React, { useRef, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Input,
} from "@/components/ui";

/**
 * Practice – Split-screen lab
 * - GUI (left)
 * - CLI (right)
 * Notes:
 *  - Echo toggle controls whether GUI buttons write into the CLI buffer.
 *  - “Practice / Steps / Hints” live under the CLI.
 */

export default function PracticePage() {
  // CLI text buffer
  const [cli, setCli] = useState<string[]>([
    "> show version",
    "FTD 7.3.0 (mock build)  Model: FTDv  Managed by: FMC  License(s): Threat, URL",
    "",
  ]);
  const [cmd, setCmd] = useState("");
  const cliBoxRef = useRef<HTMLDivElement>(null);

  // Echo GUI buttons into CLI?
  const [echoOn, setEchoOn] = useState<boolean>(false);

  // Scroll helper
  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      cliBoxRef.current?.scrollTo({ top: cliBoxRef.current.scrollHeight, behavior: "smooth" });
    });
  };

  const push = (line: string | string[]) => {
    setCli((old) => {
      const next = Array.isArray(line) ? [...old, ...line] : [...old, line];
      return next;
    });
    scrollToBottom();
  };

  // ---------------------
  // GUI button handlers
  // ---------------------
  const onAddNat = () => {
    if (!echoOn) return;
    push([
      "> configure terminal",
      "nat (inside,outside) source static OBJ_IN OBJ_OUT destination",
      "static any any",
      "write memory",
      "",
    ]);
  };

  const onCreateVpn = () => {
    if (!echoOn) return;
    push([
      "> vpn wizard",
      "peer 203.0.113.10 pre-shared-key *****",
      "ikev2 enable",
      "crypto map OUTSIDE-MAP 10 match address VPN-ACL",
      "write memory",
      "",
    ]);
  };

  const onApplyPolicy = () => {
    if (!echoOn) return;
    push([
      "> policy deploy",
      "Pushing Access Control Policy to FTD...",
      "Success.",
      "",
    ]);
  };

  // ---------------------
  // CLI execution
  // ---------------------
  const runCmd = (raw: string) => {
    const c = raw.trim();
    if (!c) return;

    // Echo the entered command
    push(`> ${c}`);

    // Mock responses
    if (c === "show version") {
      push([
        "FTD 7.3.0 (mock build)  Model: FTDv  Managed by: FMC  License(s): Threat, URL",
        "",
      ]);
    } else if (c === "show interface") {
      push([
        "Gig0/0 (inside) 10.1.1.1/24 up   Gig0/1 (outside) 172.16.0.1/24 up   Mgmt 192.168.1.10/24 up",
        "",
      ]);
    } else if (c.startsWith("ping ")) {
      push([
        "Sending 5, 100-byte ICMP Echos...",
        "!!!!!  Success rate is 100 percent (5/5), round-trip min/avg/max = 2/4/9 ms",
        "",
      ]);
    } else if (c === "clear") {
      setCli([]);
    } else {
      push(["(mock) command accepted.", ""]);
    }

    setCmd("");
  };

  // Quick-add chips
  const tryChip = (txt: string) => runCmd(txt);

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LEFT – GUI */}
      <Card className="h-full">
        <CardHeader className="items-start">
          <div className="flex w-full items-center justify-between">
            <CardTitle>GUI (Firewall Simulator)</CardTitle>

            <div className="flex gap-2">
              <Badge>Practice</Badge>
              <Button
                className={echoOn ? "bg-indigo-600 text-white" : ""}
                onClick={() => setEchoOn((v) => !v)}
                title="Toggle whether GUI actions should echo into CLI"
              >
                Echo GUI → CLI: {echoOn ? "ON" : "OFF"}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <Button onClick={onAddNat}>
            <span className="mr-2">➕</span> Add NAT Rule
          </Button>

          <Button onClick={onCreateVpn}>
            <span className="mr-2">🔒</span> Create VPN
          </Button>

          <Button onClick={onApplyPolicy}>
            <span className="mr-2">🛡️</span> Apply Policy
          </Button>
        </CardContent>
      </Card>

      {/* RIGHT – CLI */}
      <Card className="h-full">
        <CardHeader className="items-start">
          <div className="flex w-full items-center justify-between">
            <CardTitle>CLI Simulator</CardTitle>

            <div className="flex gap-2">
              <Badge>Try:</Badge>
              <Button onClick={() => tryChip("show version")}>show version</Button>
              <Button onClick={() => tryChip("show interface")}>show interface</Button>
              <Button onClick={() => tryChip("ping 8.8.8.8")}>ping 8.8.8.8</Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* CLI output */}
          <div
            ref={cliBoxRef}
            className="h-72 w-full rounded-xl bg-black text-green-300 font-mono text-sm p-4 overflow-auto"
          >
            {cli.map((line, i) => (
              <div key={i} className="whitespace-pre-wrap">
                {line}
              </div>
            ))}
          </div>

          {/* CLI input */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter command… (try: show version, show interface, ping 8.8.8.8, clear)"
              value={cmd}
              onChange={(e) => setCmd(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") runCmd(cmd);
              }}
            />
            <Button onClick={() => runCmd(cmd)}>Run</Button>
          </div>

          {/* Practice / Steps / Hints */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Steps</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <div>1) Add a NAT rule (GUI) then verify with <code>show interface</code>.</div>
                <div>2) Create a site-to-site VPN (GUI).</div>
                <div>3) Deploy policy (GUI) and ping 8.8.8.8.</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Hints</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <div>• Toggle <b>Echo GUI → CLI</b> to inject GUI actions into CLI output.</div>
                <div>• Use <code>clear</code> to wipe the terminal.</div>
                <div>• These commands are mocked for practice flow.</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
