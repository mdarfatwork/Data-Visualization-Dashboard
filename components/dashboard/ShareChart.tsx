import { useState } from "react";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Filter {
  gender: string;
  age: string;
  dateRange: { from: string; to: string } | null;
}

interface DialogDemoProps {
  filter: Filter;
  selectedProduct: string | null;
}

export function ShareChart({ filter, selectedProduct }: DialogDemoProps) {
  const [email, setEmail] = useState("");
  const [chartName, setChartName] = useState("");
  const [shareUrl, setShareUrl] = useState<string | null>(null); // Store generated URL
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleShareChart = async () => {
    try {
      const response = await fetch("/api/create-chart-url", { // Adjust the endpoint as needed
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, chartName, filter, selectedProduct }),
      });

      if (!response.ok) {
        throw new Error("Failed to share the chart");
      }

      const data = await response.json(); // Assuming the response includes the shareUrl
      setShareUrl(data.shareUrl); // Store the generated URL

      // Optionally handle the response, e.g., show a success message
      console.log("Chart shared successfully!");
    } catch (error) {
      console.error("Error sharing chart:", error);
      // Optionally handle the error, e.g., show an error message
    }
  };

  const handleCopy = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl); // Copy URL to clipboard
      setCopied(true); // Show copy confirmation
      setTimeout(() => setCopied(false), 2000); // Reset copied status after 2 seconds
    }
  };

  const handleDialogChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setShareUrl(null);
      setCopied(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Share Chart</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Chart</DialogTitle>
          <DialogDescription>
            Share the Chart with your teammates.
          </DialogDescription>
        </DialogHeader>
        {shareUrl ? ( // Conditionally show the generated URL and copy button
          <div className="mt-4">
            <Label>Generated Share URL:</Label>
            <div className="flex items-center space-x-2">
              <Input readOnly value={shareUrl} className="flex-1" />
              <Button onClick={handleCopy} variant="outline">
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="chartName" className="text-right">
                  Chart Name
                </Label>
                <Input
                  id="chartName"
                  value={chartName}
                  onChange={(e) => setChartName(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Update email state on input change
                  className="col-span-3"
                  type="email"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleShareChart} type="submit">Share</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}