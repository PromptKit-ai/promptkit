import { useState, useCallback } from "react"
import {
  type Widget,
  type RichPrompt,
  type SerializedPrompt,
  serialize,
  createWidget,
  updateWidgetValue,
} from "@promptkit/core"
import { usePromptKit } from "../context/promptkit-provider"

interface RichPromptState {
  /** The raw text with widget placeholders */
  text: string
  /** All widgets in the prompt */
  widgets: Widget[]
}

interface UseRichPromptReturn {
  /** Current text value */
  text: string
  /** Current widgets */
  widgets: Widget[]
  /** Set the text content */
  setText: (text: string) => void
  /** Insert a widget at cursor position (returns placeholder to insert in text) */
  insertWidget: (type: string, cursorPos: number) => string
  /** Remove a widget */
  removeWidget: (widgetId: string) => void
  /** Update a widget's value */
  updateWidget: <T>(widgetId: string, value: T) => void
  /** Get the full RichPrompt */
  getRichPrompt: () => RichPrompt
  /** Get the serialized output for AI consumption */
  getSerializedPrompt: () => SerializedPrompt
  /** Reset everything */
  clear: () => void
}

export function useRichPrompt(): UseRichPromptReturn {
  const { registry } = usePromptKit()
  const [state, setState] = useState<RichPromptState>({
    text: "",
    widgets: [],
  })

  const setText = useCallback((text: string) => {
    setState((prev) => ({ ...prev, text }))
  }, [])

  const insertWidget = useCallback(
    (type: string, cursorPos: number): string => {
      const widget = createWidget(type, {}, registry)
      const placeholder = `{{widget:${widget.id}}}`

      setState((prev) => {
        const newText =
          prev.text.slice(0, cursorPos) + placeholder + prev.text.slice(cursorPos)
        return {
          text: newText,
          widgets: [...prev.widgets, widget],
        }
      })

      return placeholder
    },
    [registry]
  )

  const removeWidget = useCallback((widgetId: string) => {
    setState((prev) => ({
      text: prev.text.replace(`{{widget:${widgetId}}}`, ""),
      widgets: prev.widgets.filter((w) => w.id !== widgetId),
    }))
  }, [])

  const updateWidget = useCallback(<T,>(widgetId: string, value: T) => {
    setState((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) =>
        w.id === widgetId ? updateWidgetValue(w, value) : w
      ),
    }))
  }, [])

  const getRichPrompt = useCallback((): RichPrompt => {
    return {
      version: "1.0",
      text: state.text,
      widgets: state.widgets,
    }
  }, [state])

  const getSerializedPrompt = useCallback((): SerializedPrompt => {
    return serialize(getRichPrompt(), registry)
  }, [getRichPrompt, registry])

  const clear = useCallback(() => {
    setState({ text: "", widgets: [] })
  }, [])

  return {
    text: state.text,
    widgets: state.widgets,
    setText,
    insertWidget,
    removeWidget,
    updateWidget,
    getRichPrompt,
    getSerializedPrompt,
    clear,
  }
}
