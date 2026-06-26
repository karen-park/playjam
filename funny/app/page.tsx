"use client";

import { useState } from "react";
import RouletteWheel, { RouletteItem } from "./components/RouletteWheel";
import RouletteEditor from "./components/RouletteEditor";

const DEFAULT_ITEMS: RouletteItem[] = [
  { label: "1원",      color: "#ef4444" },
  { label: "10원",     color: "#f97316" },
  { label: "100원",    color: "#eab308" },
  { label: "1,000원",  color: "#22c55e" },
  { label: "5,000원",  color: "#14b8a6" },
  { label: "10,000원", color: "#3b82f6" },
  { label: "50,000원", color: "#8b5cf6" },
  { label: "100,000원",color: "#ec4899" },
];

export default function Home() {
  const [items, setItems] = useState<RouletteItem[]>(DEFAULT_ITEMS);
  const [editing, setEditing] = useState(false);
  const [result, setResult] = useState<{ item: RouletteItem; index: number } | null>(null);

  function handleResult(item: RouletteItem, index: number) {
    setResult({ item, index });
  }

  function closeResult() {
    setResult(null);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-500 mb-2">
        행운의 룰렛
      </h1>
      <p className="text-gray-500 mb-8 text-sm">버튼을 눌러 당신의 운을 시험해보세요!</p>

      <RouletteWheel items={items} onResult={handleResult} />

      <button
        onClick={() => setEditing(true)}
        className="mt-8 px-6 py-2.5 rounded-full border-2 border-indigo-300 text-indigo-600 font-medium text-sm hover:bg-indigo-50 transition-colors cursor-pointer"
      >
        ✏️ 항목 편집
      </button>

      {result && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={closeResult}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-4 max-w-xs w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-lg"
              style={{ backgroundColor: result.item.color }}
            >
              🎉
            </div>
            <p className="text-gray-500 text-sm font-medium">당첨!</p>
            <p
              className="text-3xl font-extrabold"
              style={{ color: result.item.color }}
            >
              {result.item.label}
            </p>
            <button
              onClick={closeResult}
              className="mt-2 px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold hover:from-pink-600 hover:to-orange-500 transition-all cursor-pointer"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {editing && (
        <RouletteEditor
          items={items}
          onChange={setItems}
          onClose={() => setEditing(false)}
        />
      )}
    </main>
  );
}
