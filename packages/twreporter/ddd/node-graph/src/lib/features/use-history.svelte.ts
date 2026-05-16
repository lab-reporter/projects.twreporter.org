export type HistoryAction = {
  undo: () => Promise<void>
  redo: () => Promise<void>
}

const historyState = $state({
  undoStack: [] as HistoryAction[],
  redoStack: [] as HistoryAction[],
})

export function useHistory() {
  let busy = $state(false)

  async function undo() {
    if (busy) return

    const action = historyState.undoStack.at(-1)

    if (!action) return

    busy = true

    try {
      await action.undo()
      historyState.undoStack = historyState.undoStack.slice(0, -1)
      historyState.redoStack = [...historyState.redoStack, action]
    } finally {
      busy = false
    }
  }

  async function redo() {
    if (busy) return

    const action = historyState.redoStack.at(-1)

    if (!action) return

    busy = true

    try {
      await action.redo()
      historyState.redoStack = historyState.redoStack.slice(0, -1)
      historyState.undoStack = [...historyState.undoStack, action]
    } finally {
      busy = false
    }
  }

  return {
    get undoDisabled() {
      return busy || historyState.undoStack.length === 0
    },
    get redoDisabled() {
      return busy || historyState.redoStack.length === 0
    },
    record(action: HistoryAction) {
      historyState.undoStack = [...historyState.undoStack, action]
      historyState.redoStack = []
    },
    undo,
    redo,
  }
}
