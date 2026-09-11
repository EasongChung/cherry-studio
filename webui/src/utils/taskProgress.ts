import type { WebUiAgentStatus, WebUiAgentTask } from './agentStatus'

export type TaskProgressSummary = {
  readonly total: number
  readonly completed: number
  readonly active: number
  readonly percent: number
}

/** Aggregate the Agent task steps into a headline progress summary for the widget. */
export const summarizeTaskProgress = (status: WebUiAgentStatus): TaskProgressSummary => {
  const total = status.tasks.length
  const completed = status.tasks.filter((task) => task.status === 'completed').length
  const active = status.tasks.filter((task) => task.status === 'in_progress').length
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)
  return { total, completed, active, percent }
}

/** The widget only appears once the Agent turn has surfaced at least one task step. */
export const shouldShowTaskWidget = (status: WebUiAgentStatus): boolean => status.tasks.length > 0

/** Latest in-progress step for the collapsed headline; falls back to the final step. */
export const currentTaskStep = (tasks: readonly WebUiAgentTask[]): WebUiAgentTask | undefined => {
  const running = tasks.find((task) => task.status === 'in_progress')
  return running ?? tasks[tasks.length - 1]
}