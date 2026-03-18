import { useRef, useCallback, type KeyboardEvent } from "react"
import type { SerializedPrompt, Widget } from "@promptkit/protocol"
import { useRichPrompt } from "../hooks/use-rich-prompt"
import { InlineWidget } from "./inline-widget"

export interface RichPromptEditorProps {
  /** Placeholder text when empty */
  placeholder?: string
  /** Called when user submits (Enter or button) */
  onSubmit?: (prompt: SerializedPrompt) => void
  /** Disable editing */
  disabled?: boolean
  /** Additional className */
  className?: string
}

/** Regex to split text around widget placeholders */
const PLACEHOLDER_REGEX = /(\{\{widget:[^}]+\}\})/g
const PLACEHOLDER_ID_REGEX = /\{\{widget:([^}]+)\}\}/

export function RichPromptEditor({
  placeholder = "Describe what you want to build...",
  onSubmit,
  disabled = false,
  className = "",
}: RichPromptEditorProps) {
  const {
    text,
    widgets,
    setText,
    insertWidget,
    removeWidget,
    updateWidget,
    getSerializedPrompt,
  } = useRichPrompt()

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = useCallback(() => {
    if (!text.trim() && widgets.length === 0) return
    const serialized = getSerializedPrompt()
    onSubmit?.(serialized)
  }, [text, widgets, getSerializedPrompt, onSubmit])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
    },
    [handleSubmit]
  )

  /** Insert a widget type at current cursor position */
  const handleInsertWidget = useCallback(
    (type: string) => {
      const pos = textareaRef.current?.selectionStart ?? text.length
      insertWidget(type, pos)
      // Refocus the textarea
      setTimeout(() => textareaRef.current?.focus(), 0)
    },
    [insertWidget, text.length]
  )

  // Build the widget map for quick lookup
  const widgetMap = new Map(widgets.map((w) => [w.id, w]))

  // Split text into segments: plain text and widget placeholders
  const segments = text.split(PLACEHOLDER_REGEX)

  return (
    <div
      className={`pk-editor ${className}`}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        width: "100%",
      }}
    >
      {/* Rich display (read-only visual with inline widgets) */}
      {widgets.length > 0 && (
        <div
          className="pk-editor-display"
          style={{
            padding: "12px 16px",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.03)",
            fontSize: "15px",
            lineHeight: "2",
            color: "rgba(255,255,255,0.9)",
            wordWrap: "break-word",
          }}
        >
          {segments.map((segment, i) => {
            const match = segment.match(PLACEHOLDER_ID_REGEX)
            if (match) {
              const widget = widgetMap.get(match[1])
              if (widget) {
                return (
                  <InlineWidget
                    key={widget.id}
                    widget={widget}
                    onChange={(val) => updateWidget(widget.id, val)}
                    onRemove={() => removeWidget(widget.id)}
                    disabled={disabled}
                  />
                )
              }
              return <span key={i}>[?]</span>
            }
            return <span key={i}>{segment}</span>
          })}
        </div>
      )}

      {/* Text input area */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "flex-end",
        }}
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={2}
          style={{
            flex: 1,
            padding: "12px 16px",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.05)",
            color: "inherit",
            fontSize: "15px",
            lineHeight: "1.5",
            resize: "vertical",
            outline: "none",
            fontFamily: "inherit",
          }}
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled || (!text.trim() && widgets.length === 0)}
          style={{
            padding: "12px 20px",
            borderRadius: "12px",
            border: "none",
            background: "#3B82F6",
            color: "white",
            fontSize: "14px",
            fontWeight: 600,
            cursor: disabled ? "default" : "pointer",
            opacity: disabled || (!text.trim() && widgets.length === 0) ? 0.4 : 1,
            transition: "opacity 0.15s",
            whiteSpace: "nowrap",
          }}
        >
          Send
        </button>
      </div>
    </div>
  )
}

// Export the insert function type for external use
export type InsertWidgetFn = (type: string) => void
