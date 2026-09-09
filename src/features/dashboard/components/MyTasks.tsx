import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, UserCheck } from "lucide-react";
import { TaskItem } from "../services/dashboardService";
import { ComplianceStatusIndicator } from "@/components/shared/ComplianceStatusIndicator";
import { Badge } from "@/components/ui/Badge";

interface MyTasksProps {
  tasks: TaskItem[];
}

export function MyTasks({ tasks }: MyTasksProps) {
  return (
    <div className="bg-surface rounded-lg border border-border p-5 shadow-subtle flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-primary/10 text-primary">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-text-primary tracking-tight">
              Assigned Requirements & Tasks
            </h2>
            <p className="text-[11px] text-text-secondary">
              Clause items assigned to you for verification & evidence attachment
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-surface-alt text-text-secondary">
          {tasks.length} Action Items
        </span>
      </div>

      {tasks.length === 0 ? (
        <div className="py-8 text-center flex-1 flex flex-col items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-accent/50 mb-2" />
          <p className="text-xs font-medium text-text-secondary">
            All clear! No pending assigned tasks.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border flex-1">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-surface-alt/50 px-2 rounded-md transition-colors"
            >
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[11px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                    {task.tenderRef}
                  </span>
                  <Badge variant="neutral" size="sm">
                    {task.category}
                  </Badge>
                  {task.isMandatory && (
                    <span className="text-[10px] uppercase tracking-wider font-bold text-danger bg-danger/10 px-1.5 py-0.2 rounded">
                      Mandatory
                    </span>
                  )}
                </div>

                <h3 className="text-xs font-semibold text-text-primary line-clamp-1 group-hover:text-primary transition-colors">
                  {task.requirementTitle}
                </h3>
                <span className="text-[11px] text-text-secondary truncate">
                  Tender: {task.tenderTitle}
                  {task.sourcePage && ` • RFP Page ${task.sourcePage}`}
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <ComplianceStatusIndicator status={task.status} size="sm" />
                <Link
                  href={`/tenders/${task.tenderId}`}
                  className="p-1.5 rounded-md hover:bg-primary/10 text-text-secondary hover:text-primary transition-colors"
                  title="Open Tender Workspace"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
