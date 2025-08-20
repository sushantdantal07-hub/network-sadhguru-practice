// components/ui.tsx
import React from "react";

export const Card = ({ className = "", children }: any) =>
  <div className={`rounded-2xl shadow-sm border border-gray-200 bg-white ${className}`}>{children}</div>;

export const CardHeader = ({ children }: any) =>
  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">{children}</div>;

export const CardTitle = ({ children }: any) =>
  <h3 className="text-lg font-semibold tracking-tight">{children}</h3>;

export const CardContent = ({ className = "", children }: any) =>
  <div className={`p-5 ${className}`}>{children}</div>;

export const Button = ({ className = "", children, ...props }: any) =>
  <button className={`px-4 py-2 rounded-xl shadow-sm border border-gray-200 hover:shadow transition text-sm ${className}`} {...props}>{children}</button>;

export const Badge = ({ children }: any) =>
  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-gray-100 border border-gray-200">{children}</span>;

export const Input = ({ className = "", ...props }: any) =>
  <input className={`w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 ${className}`} {...props} />;
