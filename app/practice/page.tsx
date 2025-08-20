"use client";

import React, { useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Input,
} from "@/components/ui";

// ---------- Types ----------
type PracticeKey = "onboard" | "acp" | "nat" | "s2s";

type DeviceRow = {
  ip: string;
  regKey: string;
  licenses: string[];
  state: "Pending" | "Registered" | "Approved";
};

// ---------- Helpers ----------
const pill = (txt: string) => (
  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200">
    {txt}
  </span>
);

const hintLinesOnboard = [
  "CLI: system support diagnostic-cli → show version",
  "CLI: configure manager add <FMC_IP> <REG_KEY> → FMC: Add + Approve",
];

// ---------- Page ----------
export default function PracticeContextual() {
  // UI state
  const [practice, setPractice] = useState<PracticeKey>("onboard");
  const [steps, setSteps] = useState<boolean[]>([false, false, false]);
  const [cliMode, setCliMode] = useState<"GUI" | "CLI">("GUI");
  const [contextualTabsOnly, setContextualTabsOnly] = useState<boolean>(true);

  // inputs
  const [ftdIp, setFtdIp] = useState<string>("192.168.1.10");
  const [regKey, setRegKey] = useState<string>("REGKEY123");

  // device table
  const [devices, setDevices] = useState<DeviceRow[]>([]);
  const [showHints, setShowHints] = useState(false);

  // progress calc
  const progress = useMemo(() => steps.filter(Boolean).length, [steps]);

  const resetSteps = () => setSteps([false, false, false]);
  const resetState = () => {
    setDevices([]);
    setFtdIp("192.168.1.10");
    setRegKey("REGKEY123");
    setCliMode("GUI");
    setContextualTabsOnly(true);
  };

  // actions
  const handleAddDevice = () => {
    if (!ftdIp || !regKey) return;
    const exists = devices.some((d) => d.ip === ftdIp);
    if (exists) return;
    const row: DeviceRow = {
      ip: ftdIp.trim(),
      regKey: regKey.trim(),
      licenses: [],
      state: "Pending",
    };
    setDevices((prev) => [...prev, row]);
  };

  const handleAssignLicenses = () => {
    setDevices((prev) =>
      prev.map((d) =>
        d.state === "Pending" || d.state === "Registered"
          ? { ...d, licenses: ["Threat", "URL"] }
          : d
      )
    );
  };

  const approveDevice = (ip: string) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.ip === ip ? { ...d, state: "Approved" } : d
      )
    );
  };

  // mark a step as done/undone
  const toggleStep = (idx: number) => {
    setSteps((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  // easy practice label
  const practiceLabel = useMemo(() => {
    switch (practice) {
      case "onboard":
        return "Practice: Onboard";
      case "acp":
        return "Practice: Access Control";
      case "nat":
        return "Practice: NAT Policy";
      case "s2s":
        return "Practice: Site-to-Site VPN";
      default:
        return "Practice";
    }
  }, [practice]);

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LEFT – Practice Selector + Guided Practice */}
      <div className="flex flex-col gap-6">
        {/* Practice Selector */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Practice Selector</CardTitle>
              <span className="text-sm text-gray-500">{progress}/3 done</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button
                className={`${
                  practice === "onboard" ? "bg-indigo-600 text-white" : ""
                }`}
                onClick={() => setPractice("onboard")}
              >
                Onboard to FMC
              </Button>
              <Button
                className={`${practice === "acp" ? "bg-indigo-600 text-white" : ""}`}
                onClick={() => setPractice("acp")}
              >
                Access Control Policy
              </Button>
              <Button
                className={`${practice === "nat" ? "bg-indigo-600 text-white" : ""}`}
                onClick={() => setPractice("nat")}
              >
                NAT Policy
              </Button>
              <Button
                className={`${practice === "s2s" ? "bg-indigo-600 text-white" : ""}`}
                onClick={() => setPractice("s2s")}
              >
                Site-to-Site VPN
              </Button>
            </div>

            <div className="mt-4 flex gap-3">
              <Button variant="secondary" onClick={resetSteps}>
                Reset Steps
              </Button>
              <Button variant="secondary" onClick={resetState}>
                Reset State
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Guided Practice */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>FTD Guided Practice</CardTitle>
              <div className="flex gap-2 items-center">
                {pill(practiceLabel)}
                {progress === 3 ? pill("Ready") : null}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Step 1 */}
            <div className="flex items-start gap-3 mb-4">
              <input
                type="checkbox"
                className="mt-1"
                checked={steps[0]}
                onChange={() => toggleStep(0)}
              />
              <div>
                <div className="font-medium">
                  Step 1: Enter diagnostic CLI and check version
                </div>
                <div className="text-sm text-gray-500">
                  Follow on the right. Mark complete when done.
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3 mb-4">
              <input
                type="checkbox"
                className="mt-1"
                checked={steps[1]}
                onChange={() => toggleStep(1)}
              />
              <div>
                <div className="font-medium">
                  Step 2: Add FMC manager from CLI with key
                </div>
                <div className="text-sm text-gray-500">
                  Follow on the right. Mark complete when done.
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-1"
                checked={steps[2]}
                onChange={() => toggleStep(2)}
              />
              <div>
                <div className="font-medium">
                  Step 3: Add device in FMC and Approve
                </div>
                <div className="text-sm text-gray-500">
                  Follow on the right. Mark complete when done.
                </div>
              </div>
            </div>

            {practice === "onboard" ? (
              <div className="text-xs text-gray-500 mt-6">
                Only the relevant GUI tabs are shown for this practice to avoid
                distraction.
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      {/* RIGHT – Practice Surface */}
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Practice Surface</CardTitle>
            <div className="flex gap-2 items-center">
              <Button
                className={`${cliMode === "GUI" ? "bg-indigo-600 text-white" : ""}`}
                onClick={() => setCliMode("GUI")}
              >
                GUI
              </Button>
              <Button
                className={`${cliMode === "CLI" ? "bg-indigo-600 text-white" : ""}`}
                onClick={() => setCliMode("CLI")}
              >
                CLI
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* FMC GUI (Onboard) */}
          {cliMode === "GUI" && practice === "onboard" && (
            <div className="rounded-2xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <CardTitle className="text-base">
                  FMC GUI (Practice: Onboard)
                </CardTitle>
                <Button
                  variant="secondary"
                  onClick={() => setContextualTabsOnly((v) => !v)}
                >
                  {contextualTabsOnly ? "Contextual Tabs Only" : "All Tabs"}
                </Button>
              </div>

              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <div className="text-sm text-gray-600 mb-1">FTD Mgmt IP</div>
                  <Input value={ftdIp} onChange={(e) => setFtdIp(e.target.value)} />
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Registration Key</div>
                  <Input value={regKey} onChange={(e) => setRegKey(e.target.value)} />
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Button onClick={handleAddDevice}>Add Device</Button>
                <Button onClick={handleAssignLicenses}>Assign Licenses</Button>
              </div>

              <div className="text-sm text-gray-500 mt-3">
                Awaiting device registration…
              </div>

              {/* table */}
              <div className="mt-4 border rounded-xl overflow-hidden">
                <div className="grid grid-cols-5 bg-gray-50 text-sm font-medium py-2 px-3">
                  <div>IP</div>
                  <div>Reg Key</div>
                  <div>Licenses</div>
                  <div>State</div>
                  <div>Action</div>
                </div>
                {devices.length === 0 ? (
                  <div className="p-3 text-sm text-gray-500">No devices yet.</div>
                ) : (
                  devices.map((d) => (
                    <div
                      key={d.ip}
                      className="grid grid-cols-5 items-center border-t py-2 px-3 text-sm"
                    >
                      <div>{d.ip}</div>
                      <div>{d.regKey}</div>
                      <div>{d.licenses.join(", ") || "-"}</div>
                      <div>{d.state}</div>
                      <div className="flex gap-2">
                        {d.state !== "Approved" && (
                          <Button size="sm" onClick={() => approveDevice(d.ip)}>
                            Approve
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* CLI view (mock) */}
          {cliMode === "CLI" && (
            <div className="rounded-2xl border border-gray-200 p-4 space-y-3">
              <CardTitle className="text-base">FTD Diagnostic CLI</CardTitle>
              <div className="h-72 bg-black text-green-300 rounded-xl p-4 font-mono text-sm overflow-auto">
                <div>&gt; system support diagnostic-cli</div>
                <div># show version</div>
                <div>FTD 7.3.0 (mock build)  Model: FTDv</div>
                <div># configure manager add {ftdIp || "192.168.1.10"} {regKey || "REGKEY123"}</div>
                <div>Manager added. Awaiting approval in FMC…</div>
                <div className="mt-2"># exit</div>
              </div>
            </div>
          )}

          {/* Practice Hints */}
          <div className="mt-6">
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-base">Hints</CardTitle>
                <Button variant="secondary" onClick={() => setShowHints((v) => !v)}>
                  {showHints ? "Hide hints" : "Peek if stuck"}
                </Button>
              </CardHeader>
              {showHints && (
                <CardContent>
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    {practice === "onboard" ? (
                      hintLinesOnboard.map((h) => <li key={h}>{h}</li>)
                    ) : (
                      <li>Guidance for this practice will appear here.</li>
                    )}
                  </ul>
                </CardContent>
              )}
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
