"use client";

import { createProject } from "@/app/actions/project";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export function CreateProjectForm() {
  const [loading, setLoading] = useState(false);

  return (
    <Card className="max-w-md w-full shrink-0">
      <CardHeader>
        <CardTitle>New Client Project</CardTitle>
        <CardDescription>Generate a new portal link instantly.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          action={async (data) => {
            setLoading(true);
            await createProject(data);
            setLoading(false);
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              name="clientName"
              placeholder="Acme Corp"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              name="projectName"
              placeholder="Website Redesign"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="scopeOfWork">Scope of Work</Label>
            <Textarea
              id="scopeOfWork"
              name="scopeOfWork"
              placeholder="1. Wireframes 2. High fidelity designs..."
              required
              rows={4}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Generating..." : "Create Project Link"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
