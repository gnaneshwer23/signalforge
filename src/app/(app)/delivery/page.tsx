"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { LoadingState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";
import type {
  BacklogStatus,
  ChangeDecision,
  Priority,
} from "@/lib/types";

export default function DeliveryPage() {
  const {
    state,
    hydrated,
    createBacklogItem,
    updateBacklogStatus,
    createChangeRequest,
    decideChangeRequest,
  } = useStore();
  const [priorityFilter, setPriorityFilter] = useState<Priority | "">("");
  const [statusFilter, setStatusFilter] = useState<BacklogStatus | "">("");
  const [storyMsg, setStoryMsg] = useState<string | null>(null);
  const [crMsg, setCrMsg] = useState<string | null>(null);

  const [story, setStory] = useState({
    storyId: "",
    description: "",
    priority: "P1" as Priority,
    acceptanceCriteria: "",
    estimate: "",
    dependency: "",
    owner: "",
    status: "backlog" as BacklogStatus,
  });

  const [cr, setCr] = useState({
    title: "",
    scope: "",
    costImpact: "",
    timelineImpact: "",
    risk: "",
    classification: "in_scope_refinement" as
      | "in_scope_refinement"
      | "material_change",
  });

  const backlog = useMemo(() => {
    return state.backlog.filter((b) => {
      if (priorityFilter && b.priority !== priorityFilter) return false;
      if (statusFilter && b.status !== statusFilter) return false;
      return true;
    });
  }, [state.backlog, priorityFilter, statusFilter]);

  if (!hydrated) return <LoadingState />;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Product Owner workspace"
        title="Delivery"
        description={
          <>
            Prioritised backlog, milestones, and change requests for the
            portfolio prototype. Distinguish <strong>prototype delivery</strong>{" "}
            from any future contractual delivery commitment.
          </>
        }
      />

      <section className="surface-panel border-amber-review p-4 text-sm">
        <p className="font-medium text-ink">Prototype vs contractual delivery</p>
        <p className="mt-1 text-muted-foreground">
          This workbench is an independent portfolio MVP with demo data. Milestone
          dates and estimates are planning artefacts for the prototype — not
          contractual obligations, SLAs, or measured production KPIs.
        </p>
      </section>

      <section className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="section-title">Backlog</h2>
          <div className="flex gap-2">
            <select
              className="h-8 rounded-md border border-border bg-card px-2.5 text-sm"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as Priority | "")}
            >
              <option value="">All priorities</option>
              <option value="P0">P0</option>
              <option value="P1">P1</option>
              <option value="P2">P2</option>
            </select>
            <select
              className="h-8 rounded-md border border-border bg-card px-2.5 text-sm"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as BacklogStatus | "")
              }
            >
              <option value="">All statuses</option>
              <option value="backlog">Backlog</option>
              <option value="ready">Ready</option>
              <option value="in_progress">In progress</option>
              <option value="blocked">Blocked</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto surface-panel">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Story</th>
                <th className="px-3 py-2">Priority</th>
                <th className="px-3 py-2">AC</th>
                <th className="px-3 py-2">Est.</th>
                <th className="px-3 py-2">Dependency</th>
                <th className="px-3 py-2">Owner</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {backlog.map((item) => (
                <tr key={item.id} className="border-b border-border/70 align-top last:border-0">
                  <td className="px-3 py-3">
                    <p className="font-medium text-ink">{item.storyId}</p>
                    <p className="mt-1 text-muted-foreground">{item.description}</p>
                  </td>
                  <td className="px-3 py-3">{item.priority}</td>
                  <td className="px-3 py-3">
                    {item.acceptanceCriteria.length === 0 ? (
                      <span className="text-amber-review">None</span>
                    ) : (
                      <ul className="list-disc pl-4 text-xs text-muted-foreground">
                        {item.acceptanceCriteria.map((ac) => (
                          <li key={ac}>{ac}</li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td className="px-3 py-3">{item.estimate}</td>
                  <td className="px-3 py-3 text-muted-foreground">
                    {item.dependency || "—"}
                  </td>
                  <td className="px-3 py-3">{item.owner}</td>
                  <td className="px-3 py-3">
                    <select
                      className="h-8 rounded-md border border-border bg-card px-2 text-sm"
                      value={item.status}
                      onChange={(e) => {
                        const result = updateBacklogStatus(
                          item.id,
                          e.target.value as BacklogStatus,
                        );
                        if (!result.ok) setStoryMsg(result.reason || "Update failed");
                      }}
                    >
                      <option value="backlog">backlog</option>
                      <option value="ready">ready</option>
                      <option value="in_progress">in_progress</option>
                      <option value="blocked">blocked</option>
                      <option value="done">done</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form
          className="surface-panel grid gap-3 p-4 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            const result = createBacklogItem({
              ...story,
              acceptanceCriteria: story.acceptanceCriteria
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean),
            });
            setStoryMsg(
              result.ok
                ? `Created ${story.storyId}`
                : result.reason || "Validation failed",
            );
            if (result.ok) {
              setStory({
                storyId: "",
                description: "",
                priority: "P1",
                acceptanceCriteria: "",
                estimate: "",
                dependency: "",
                owner: "",
                status: "backlog",
              });
            }
          }}
        >
          <h3 className="section-title md:col-span-2">
            Create story
          </h3>
          <Input
            placeholder="Story ID (required)"
            value={story.storyId}
            onChange={(e) => setStory({ ...story, storyId: e.target.value })}
          />
          <Input
            placeholder="Owner (required)"
            value={story.owner}
            onChange={(e) => setStory({ ...story, owner: e.target.value })}
          />
          <Textarea
            className="md:col-span-2"
            placeholder="Description (required)"
            value={story.description}
            onChange={(e) => setStory({ ...story, description: e.target.value })}
          />
          <Textarea
            className="md:col-span-2"
            placeholder="Acceptance criteria (one per line; required to mark ready)"
            value={story.acceptanceCriteria}
            onChange={(e) =>
              setStory({ ...story, acceptanceCriteria: e.target.value })
            }
          />
          <Input
            placeholder="Estimate"
            value={story.estimate}
            onChange={(e) => setStory({ ...story, estimate: e.target.value })}
          />
          <Input
            placeholder="Dependency"
            value={story.dependency}
            onChange={(e) => setStory({ ...story, dependency: e.target.value })}
          />
          <select
            className="h-8 rounded-md border border-border bg-card px-2.5 text-sm"
            value={story.priority}
            onChange={(e) =>
              setStory({ ...story, priority: e.target.value as Priority })
            }
          >
            <option value="P0">P0</option>
            <option value="P1">P1</option>
            <option value="P2">P2</option>
          </select>
          <select
            className="h-8 rounded-md border border-border bg-card px-2.5 text-sm"
            value={story.status}
            onChange={(e) =>
              setStory({ ...story, status: e.target.value as BacklogStatus })
            }
          >
            <option value="backlog">backlog</option>
            <option value="ready">ready</option>
            <option value="in_progress">in_progress</option>
          </select>
          <div className="md:col-span-2 flex items-center gap-3">
            <Button type="submit">Create story</Button>
            {storyMsg && <p className="text-sm text-muted-foreground">{storyMsg}</p>}
          </div>
        </form>
      </section>

      <section>
        <h2 className="section-title">Milestones</h2>
        <ul className="mt-3 space-y-2">
          {state.milestones.map((m) => (
            <li key={m.id} className="surface-panel p-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="capitalize">{m.status.replaceAll("_", " ")}</span>
                <span>·</span>
                <span>Target {formatDate(m.targetDate)}</span>
                {m.dependencies.length > 0 && (
                  <span>· depends on {m.dependencies.join(", ")}</span>
                )}
              </div>
              <h3 className="mt-1 section-title">{m.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{m.description}</p>
              <p className="mt-2 text-xs text-muted-foreground">{m.notes}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="section-title">Change requests</h2>
        <p className="text-sm text-muted-foreground">
          Classify each request as in-scope refinement vs material change.
          Decisions are logged.
        </p>
        <ul className="space-y-2">
          {state.changeRequests.map((item) => (
            <li key={item.id} className="surface-panel p-4">
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="border border-border px-2 py-0.5">
                  {item.classification === "material_change"
                    ? "Material change"
                    : "In-scope refinement"}
                </span>
                <span className="border border-border px-2 py-0.5 capitalize">
                  {item.decision.replaceAll("_", " ")}
                </span>
              </div>
              <h3 className="mt-2 section-title">{item.title}</h3>
              <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-muted-foreground">Scope</dt>
                  <dd>{item.scope}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Cost</dt>
                  <dd>{item.costImpact}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Timeline</dt>
                  <dd>{item.timelineImpact}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Risk</dt>
                  <dd>{item.risk}</dd>
                </div>
              </dl>
              {item.decisionNotes && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Decision notes: {item.decisionNotes}
                </p>
              )}
              {item.decision === "pending" && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {(
                    [
                      "accepted",
                      "deferred",
                      "rejected",
                      "needs_clarification",
                    ] as ChangeDecision[]
                  ).map((d) => (
                    <Button
                      key={d}
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        decideChangeRequest(
                          item.id,
                          d,
                          `PO decision recorded as ${d}`,
                        )
                      }
                    >
                      {d.replaceAll("_", " ")}
                    </Button>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        <form
          className="surface-panel grid gap-3 p-4 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            const result = createChangeRequest(cr);
            setCrMsg(
              result.ok
                ? "Change request recorded"
                : result.reason || "Validation failed",
            );
            if (result.ok) {
              setCr({
                title: "",
                scope: "",
                costImpact: "",
                timelineImpact: "",
                risk: "",
                classification: "in_scope_refinement",
              });
            }
          }}
        >
          <h3 className="section-title md:col-span-2">
            Record change request
          </h3>
          <Input
            className="md:col-span-2"
            placeholder="Title"
            value={cr.title}
            onChange={(e) => setCr({ ...cr, title: e.target.value })}
          />
          <Textarea
            className="md:col-span-2"
            placeholder="Scope"
            value={cr.scope}
            onChange={(e) => setCr({ ...cr, scope: e.target.value })}
          />
          <Input
            placeholder="Cost impact"
            value={cr.costImpact}
            onChange={(e) => setCr({ ...cr, costImpact: e.target.value })}
          />
          <Input
            placeholder="Timeline impact"
            value={cr.timelineImpact}
            onChange={(e) => setCr({ ...cr, timelineImpact: e.target.value })}
          />
          <Input
            placeholder="Risk"
            value={cr.risk}
            onChange={(e) => setCr({ ...cr, risk: e.target.value })}
          />
          <select
            className="h-8 rounded-md border border-border bg-card px-2.5 text-sm"
            value={cr.classification}
            onChange={(e) =>
              setCr({
                ...cr,
                classification: e.target.value as typeof cr.classification,
              })
            }
          >
            <option value="in_scope_refinement">In-scope refinement</option>
            <option value="material_change">Material change</option>
          </select>
          <div className="md:col-span-2 flex items-center gap-3">
            <Button type="submit">Record change</Button>
            {crMsg && <p className="text-sm text-muted-foreground">{crMsg}</p>}
          </div>
        </form>
      </section>

      <section>
        <h2 className="section-title">Decision log</h2>
        <ul className="mt-3 space-y-2">
          {state.auditEvents
            .filter((a) => a.action === "scope_change_recorded")
            .map((a) => (
              <li key={a.id} className="surface-panel p-3 text-sm">
                <p className="text-xs text-muted-foreground">
                  {formatDate(a.timestamp)} · {a.actor}
                </p>
                <p className="mt-1">{a.detail}</p>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
