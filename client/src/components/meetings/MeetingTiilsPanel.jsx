import { BookOpen, Download, Eraser, Highlighter, Pencil, Trash2, Type, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const MeetingToolsPanel = ({ roomId, mode, onClose }) => {
  const notesKey = `meeting-notes-${roomId}`
  const boardKey = `meeting-board-${roomId}`

  const [notes, setNotes] = useState(
    () => localStorage.getItem(notesKey) || ''
  )

  const [tool, setTool] = useState('pen')
  const [color, setColor] = useState('#1d4ed8')
  const [penSize, setPenSize] = useState(3)

  const canvasRef = useRef(null)
  const drawingRef = useRef(false)
  const lastPointRef = useRef(null)

  useEffect(() => {
    localStorage.setItem(notesKey, notes)
  }, [notesKey, notes])

  useEffect(() => {
    if (mode !== 'whiteboard') return
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    const pixelRatio = window.devicePixelRatio || 1
    canvas.width = Math.max(1, rect.width * pixelRatio)
    canvas.height = Math.max(1, rect.height * pixelRatio)
    context.scale(pixelRatio, pixelRatio)
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, rect.width, rect.height)
    const savedImage = localStorage.getItem(boardKey)
    if (savedImage) {
      const image = new Image()
      image.onload = () => {
        context.drawImage(image,0, 0,rect.width,rect.height
    )
      }
      image.src = savedImage
    }
  }, [mode, boardKey])

  const getPoint = (event) => {
    const rect = canvasRef.current.getBoundingClientRect()
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  }

  const saveBoard = () => {
    const canvas = canvasRef.current

    if (canvas) {
      localStorage.setItem(
        boardKey,
        canvas.toDataURL('image/png')
      )
    }
  }

  const startDrawing = (event) => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const point = getPoint(event)

    if (tool === 'text') {
      const text = window.prompt('Enter text:')

      if (text) {
        context.globalCompositeOperation = 'source-over'
        context.globalAlpha = 1
        context.fillStyle = color
        context.font = '18px Arial'
        context.fillText(text, point.x, point.y)

        saveBoard()
      }

      return
    }

    drawingRef.current = true
    lastPointRef.current = point

    canvas.setPointerCapture(event.pointerId)
  }

  // Draw lines on the whiteboard.
  const draw = (event) => {
    if (!drawingRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    const point = getPoint(event)
    const lastPoint = lastPointRef.current

    context.beginPath()
    context.moveTo(lastPoint.x, lastPoint.y)
    context.lineTo(point.x, point.y)

    context.lineCap = 'round'
    context.lineJoin = 'round'

    context.lineWidth =
      tool === 'eraser' ? penSize * 5 : penSize

    if (tool === 'eraser') {
      context.globalCompositeOperation = 'destination-out'
      context.globalAlpha = 1
    } else {
      context.globalCompositeOperation = 'source-over'
      context.globalAlpha = tool === 'highlighter' ? 0.3 : 1
    }

    context.strokeStyle =
      tool === 'highlighter' ? '#facc15' : color

    context.stroke()

    lastPointRef.current = point
  }

  // Stop drawing and save the result.
  const stopDrawing = () => {
    if (!drawingRef.current) return

    drawingRef.current = false
    lastPointRef.current = null

    const context = canvasRef.current.getContext('2d')

    context.globalAlpha = 1
    context.globalCompositeOperation = 'source-over'

    saveBoard()
  }

  // Clear all whiteboard content.
  const clearBoard = () => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()

    context.clearRect(0, 0, rect.width, rect.height)

    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, rect.width, rect.height)

    localStorage.removeItem(boardKey)
  }

  // Download the board as a PNG image.
  const downloadBoard = () => {
    const canvas = canvasRef.current

    if (!canvas) return

    const link = document.createElement('a')

    link.download = `whiteboard-${roomId}.png`
    link.href = canvas.toDataURL('image/png')

    link.click()
  }

  return (
    <aside className="w-full md:w-[380px] shrink-0 bg-white border-l border-slate-200 flex flex-col min-h-0 shadow-xl z-20">

      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          {mode === 'notes' ? (
            <BookOpen size={20} />
          ) : (
            <Pencil size={20} />
          )}

          <div>
            <h3 className="font-semibold text-slate-900">
              {mode === 'notes'
                ? 'Meeting Notes'
                : 'Teaching Whiteboard'}
            </h3>

            <p className="text-xs text-slate-500">
              Meeting: {roomId}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-slate-100"
          title="Close panel"
        >
          <X size={18} />
        </button>
      </div>

      {/* Personal notes editor */}
      {mode === 'notes' && (
        <div className="p-4 flex-1 flex flex-col min-h-0">

          <label className="text-sm font-medium text-slate-700 mb-2">
            Your personal notes
          </label>

          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Write important points from the lecture..."
            className="w-full flex-1 min-h-[260px] resize-none rounded-xl border border-slate-200 p-3 text-sm text-slate-800 outline-none focus:border-blue-500"
          />

          <p className="mt-2 text-xs text-emerald-700">
            Notes are automatically saved in this browser.
          </p>

          <button
            onClick={() => {
              navigator.clipboard.writeText(notes)
            }}
            className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Copy Notes
          </button>
        </div>
      )}

      {/* Teaching whiteboard */}
      {mode === 'whiteboard' && (
        <>
          <div className="flex flex-wrap items-center gap-2 p-3 border-b border-slate-100">

            <button
              onClick={() => setTool('pen')}
              className={`p-2 rounded-lg border ${
                tool === 'pen'
                  ? 'bg-blue-100 border-blue-400'
                  : 'border-slate-200'
              }`}
              title="Pen"
            >
              <Pencil size={18} />
            </button>

            <button
              onClick={() => setTool('highlighter')}
              className={`p-2 rounded-lg border ${
                tool === 'highlighter'
                  ? 'bg-yellow-100 border-yellow-400'
                  : 'border-slate-200'
              }`}
              title="Highlighter"
            >
              <Highlighter size={18} />
            </button>

            <button
              onClick={() => setTool('eraser')}
              className={`p-2 rounded-lg border ${
                tool === 'eraser'
                  ? 'bg-slate-200 border-slate-400'
                  : 'border-slate-200'
              }`}
              title="Eraser"
            >
              <Eraser size={18} />
            </button>

            <button
              onClick={() => setTool('text')}
              className={`p-2 rounded-lg border ${
                tool === 'text'
                  ? 'bg-blue-100 border-blue-400'
                  : 'border-slate-200'
              }`}
              title="Add text"
            >
              <Type size={18} />
            </button>

            <label
              className="flex items-center gap-1 text-xs"
              title="Pen color"
            >
              <input
                type="color"
                value={color}
                onChange={(event) => setColor(event.target.value)}
                className="w-7 h-7 cursor-pointer"
              />
            </label>

            <label className="flex items-center gap-1 text-xs">
              Size

              <input
                type="range"
                min="1"
                max="12"
                value={penSize}
                onChange={(event) =>
                  setPenSize(Number(event.target.value))
                }
              />
            </label>

            <button
              onClick={clearBoard}
              className="p-2 rounded-lg border border-slate-200 hover:bg-red-50 text-red-600"
              title="Clear board"
            >
              <Trash2 size={18} />
            </button>

            <button
              onClick={downloadBoard}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50"
              title="Download board"
            >
              <Download size={18} />
            </button>
          </div>

          <div className="p-3 flex-1 min-h-0 bg-slate-50">
            <canvas
              ref={canvasRef}
              className="w-full h-full min-h-[300px] bg-white border border-slate-200 rounded-lg touch-none cursor-crosshair"
              onPointerDown={startDrawing}
              onPointerMove={draw}
              onPointerUp={stopDrawing}
              onPointerCancel={stopDrawing}
              onPointerLeave={stopDrawing}
            />
          </div>

          <p className="px-3 pb-3 text-xs text-slate-500">
            Your board is saved locally in this browser.
            Other participants cannot see it yet.
          </p>
        </>
      )}
    </aside>
  )
}

export default MeetingToolsPanel