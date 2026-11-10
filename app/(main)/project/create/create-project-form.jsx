"use client";

import { useState } from "react";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createProject } from "@/actions/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CreateProjectForm() {
  const { isLoaded: organizationLoaded, organization } = useOrganization();
  const { isLoaded: userLoaded, user } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      await createProject({
        name: formData.get("name").trim(),
        key: formData.get("key").trim().toUpperCase(),
        description: formData.get("description").trim() || null,
      });

      router.push(`/organization/${organization.slug}`);
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to create the project.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!organizationLoaded || !userLoaded) {
    return <p>Loading your organization...</p>;
  }

  if (!user || !organization) {
    return <p>Select an organization before creating a project.</p>;
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Project name
        </label>
        <Input id="name" name="name" required maxLength={100} />
      </div>
      <div className="space-y-2">
        <label htmlFor="key" className="text-sm font-medium">
          Project key
        </label>
        <Input
          id="key"
          name="key"
          required
          maxLength={10}
          pattern="[A-Za-z0-9]+"
          title="Use only letters and numbers."
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Textarea id="description" name="description" maxLength={2000} />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create project"}
      </Button>
    </form>
  );
}
