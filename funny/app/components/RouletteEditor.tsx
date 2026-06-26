"use client";

import { useState } from "react";
import { RouletteItem } from "./RouletteWheel";

const PALETTE = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#14b8a6", "#3b82f6", "#8b5cf6", "#ec4899",
  "#f43f5e", "#84cc16", "#06b6d4", "#a855f7",
  "#fb923c", "#facc15", "#4ade80", "#60a5fa",
];

interface RouletteEditorProps {
  items: RouletteItem[];
  onChange: (items: RouletteItem[]) => void;
  onClose: () => void;
}

export default function RouletteEditor({ items, onChange, onClose }: RouletteEditorProps) {
  const [draft, setDraft] = useState<RouletteItem[]>(items.map((it) => ({ ...it })));

  function updateLabel(i: number, label: string) {
    const next = draft.map((it, idx) => (idx === i ? { ...it, label } : it));
    setDraft(next);
  }

  function updateColor(i: number, color: string) {
    const next = draft.map((it, idx) => (idx === i ? { ...it, color } : it));
    setDraft(next);
  }

  function addItem() {
    if (draft.length >= 20) return;
    const color = PALETTE[draft.length % PALETTE.length];
    setDraft([...draft, { label: `항목 ${draft.length + 1}`, color }]);
  }

  function removeItem(i: number) {
    if (draft.length <= 2) return;
    setDraft(draft.filter((_, idx) => idx !== i));
  }

  function save() {
    const valid = draft.filter((it) => it.label.trim() !== "");
    onChange(valid.length >= 2 ? valid : draft);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-xl font-bold text-gray-800">룰렛 항목 편집</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none cursor-pointer"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-3">
          {draft.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-gray-400 w-5 text-sm text-right">{i + 1}</span>

              {/* Color picker */}
              <div className="relative">
                <input
                  type="color"
                  value={item.color}
                  onChange={(e) => updateColor(i, e.target.value)}
                  className="w-9 h-9 rounded-lg cursor-pointer border border-gray-200 p-0.5"
                  title="색상 선택"
                />
              </div>

              <input
                type="text"
                value={item.label}
                onChange={(e) => updateLabel(i, e.target.value)}
                maxLength={12}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                placeholder="항목 이름"
              />

              <button
                onClick={() => removeItem(i)}
                disabled={draft.length <= 2}
                className={`text-lg w-8 h-8 flex items-center justify-center rounded-full transition-colors
                  ${draft.length <= 2
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-red-400 hover:bg-red-50 cursor-pointer"
                  }`}
                title="삭제"
              >
                −
              </button>
            </div>
          ))}
        </div>

        <div className="p-5 border-t space-y-3">
          <button
            onClick={addItem}
            disabled={draft.length >= 20}
            className={`w-full py-2.5 rounded-xl border-2 border-dashed text-sm font-medium transition-colors
              ${draft.length >= 20
                ? "border-gray-200 text-gray-300 cursor-not-allowed"
                : "border-pink-300 text-pink-500 hover:bg-pink-50 cursor-pointer"
              }`}
          >
            + 항목 추가 ({draft.length}/20)
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
            >
              취소
            </button>
            <button
              onClick={save}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-orange-400 text-white text-sm font-medium hover:from-pink-600 hover:to-orange-500 transition-all cursor-pointer"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
