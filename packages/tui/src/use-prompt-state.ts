import { useState, useCallback } from "react"
import {
  type Widget,
  type RichPrompt,
  type SerializedPrompt,
  WidgetRegistry,
  serialize,
  createWidget,
  updateWidgetValue,
} from "@promptkit/core"

export interface PromptState {
  text: string
  widgets: Widget[]
  selectedWidgetIndex: number // -1 = editing text, 0+ = widget selected
}

export function usePromptState(registry: WidgetRegistry) {
  const [state, setState] = useState<PromptState>({
    text: "",
    widgets: [],
    selectedWidgetIndex: -1,
  })

  const setText = useCallback((text: string) => {
    setState((prev) => ({ ...prev, text }))
  }, [])

  const insertWidget = useCallback(
    (type: string) => {
      const widget = createWidget(type, {}, registry)
      const placeholder = `{{widget:${widget.id}}}`
      setState((prev) => ({
        text: prev.text + placeholder,
        widgets: [...prev.widgets, widget],
        selectedWidgetIndex: prev.widgets.length, // Select the new widget
      }))
    },
    [registry]
  )

  const removeWidget = useCallback((index: number) => {
    setState((prev) => {
      const widget = prev.widgets[index]
      if (!widget) return prev
      return {
        text: prev.text.replace(`{{widget:${widget.id}}}`, ""),
        widgets: prev.widgets.filter((_, i) => i !== index),
        selectedWidgetIndex: Math.min(prev.selectedWidgetIndex, prev.widgets.length - 2),
      }
    })
  }, [])

  const updateWidget = useCallback(<T,>(index: number, value: T) => {
    setState((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w, i) =>
        i === index ? updateWidgetValue(w, value) : w
      ),
    }))
  }, [])

  const selectWidget = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      selectedWidgetIndex: Math.max(-1, Math.min(index, prev.widgets.length - 1)),
    }))
  }, [])

  const selectNext = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedWidgetIndex: prev.widgets.length > 0
        ? (prev.selectedWidgetIndex + 1) % prev.widgets.length
        : -1,
    }))
  }, [])

  const selectPrev = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedWidgetIndex: prev.widgets.length > 0
        ? (prev.selectedWidgetIndex - 1 + prev.widgets.length) % prev.widgets.length
        : -1,
    }))
  }, [])

  const deselect = useCallback(() => {
    setState((prev) => ({ ...prev, selectedWidgetIndex: -1 }))
  }, [])

  const getRichPrompt = useCallback((): RichPrompt => ({
    version: "1.0",
    text: state.text,
    widgets: state.widgets,
  }), [state.text, state.widgets])

  const getSerializedPrompt = useCallback((): SerializedPrompt => {
    return serialize(getRichPrompt(), registry)
  }, [getRichPrompt, registry])

  const clear = useCallback(() => {
    setState({ text: "", widgets: [], selectedWidgetIndex: -1 })
  }, [])

  return {
    ...state,
    setText,
    insertWidget,
    removeWidget,
    updateWidget,
    selectWidget,
    selectNext,
    selectPrev,
    deselect,
    getRichPrompt,
    getSerializedPrompt,
    clear,
  }
}
