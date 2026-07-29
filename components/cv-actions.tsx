"use client";

import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CvActions() {
  return (
    <div className="cv-actions" aria-label="CV actions">
      <Button asChild>
        <a href="/Basil-Ihuoma-CV.pdf" download="Basil-Ihuoma-CV.pdf">
          Download PDF <Download aria-hidden="true" size={16} strokeWidth={1.8} />
        </a>
      </Button>
      <Button variant="secondary" type="button" onClick={() => window.print()}>
        Print / Save as PDF <Printer aria-hidden="true" size={16} strokeWidth={1.8} />
      </Button>
    </div>
  );
}
