import CreateProjectForm from "./create-project-form";

export default function CreateProjectPage() {
  return (
    <main className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create a project</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Set up a project for your organization.
        </p>
      </div>
      <CreateProjectForm />
    </main>
  );
}