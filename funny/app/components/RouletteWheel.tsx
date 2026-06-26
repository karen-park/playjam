"use client";

import { useRef, useState } from "react";

export interface RouletteItem {
  label: string;
  color: string;
}

interface RouletteWheelProps {
  items: RouletteItem[];
  onResult: (item: RouletteItem, index: number) => void;
}

const SPIN_DURATION = 4000;

export default function RouletteWheel({ items, onResult }: RouletteWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const currentRotation = useRef(0);

  const count = items.length;
  const sliceAngle = 360 / count;
  const radius = 220;
  const cx = 240;
  const cy = 240;

  function polarToCartesian(angle: number, r: number) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  }

  function describeSlice(index: number) {
    const startAngle = index * sliceAngle;
    const endAngle = startAngle + sliceAngle;
    const start = polarToCartesian(startAngle, radius);
    const end = polarToCartesian(endAngle, radius);
    const largeArc = sliceAngle > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
  }

  function getLabelPosition(index: number) {
    const angle = index * sliceAngle + sliceAngle / 2;
    const r = radius * 0.62;
    return polarToCartesian(angle, r);
  }

  function getLabelAngle(index: number) {
    return index * sliceAngle + sliceAngle / 2;
  }

  function spin() {
    if (spinning || count === 0) return;
    setSpinning(true);

    const extraSpins = 5 + Math.floor(Math.random() * 5);
    const randomAngle = Math.random() * 360;
    const totalRotation = currentRotation.current + extraSpins * 360 + randomAngle;

    setRotation(totalRotation);
    currentRotation.current = totalRotation;

    setTimeout(() => {
      const normalizedAngle = ((totalRotation % 360) + 360) % 360;
      // Pointer is at top (270° in standard coords, but wheel spins so effective angle is 360 - normalizedAngle)
      const pointerAngle = (360 - normalizedAngle + 360) % 360;
      const winIndex = Math.floor(pointerAngle / sliceAngle) % count;
      setSpinning(false);
      onResult(items[winIndex], winIndex);
    }, SPIN_DURATION + 100);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10">
          <svg width="32" height="44" viewBox="0 0 32 44">
            <polygon
              points="16,44 2,4 30,4"
              fill="#ef4444"
              stroke="white"
              strokeWidth="2"
            />
            <circle cx="16" cy="4" r="6" fill="#ef4444" stroke="white" strokeWidth="2" />
          </svg>
        </div>

        {/* Wheel */}
        <svg
          width="480"
          height="480"
          viewBox="0 0 480 480"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? `transform ${SPIN_DURATION}ms cubic-bezier(0.17, 0.67, 0.12, 1)`
              : "none",
          }}
        >
          {/* Shadow */}
          <circle cx={cx} cy={cy} r={radius + 6} fill="rgba(0,0,0,0.15)" />

          {/* Slices */}
          {items.map((item, i) => (
            <g key={i}>
              <path d={describeSlice(i)} fill={item.color} stroke="white" strokeWidth="2" />
              <text
                x={getLabelPosition(i).x}
                y={getLabelPosition(i).y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={count <= 8 ? "16" : count <= 12 ? "13" : "11"}
                fontWeight="bold"
                fill="white"
                style={{
                  textShadow: "1px 1px 2px rgba(0,0,0,0.6)",
                  transform: `rotate(${getLabelAngle(i)}deg)`,
                  transformOrigin: `${cx}px ${cy}px`,
                }}
              >
                {item.label}
              </text>
            </g>
          ))}

          {/* Center circle */}
          <circle cx={cx} cy={cy} r="28" fill="white" stroke="#e5e7eb" strokeWidth="3" />
          <circle cx={cx} cy={cy} r="14" fill="#6b7280" />
        </svg>
      </div>

      <button
        onClick={spin}
        disabled={spinning || count < 2}
        className={`px-10 py-4 rounded-full text-white text-xl font-bold shadow-lg transition-all
          ${spinning || count < 2
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 active:scale-95 cursor-pointer"
          }`}
      >
        {spinning ? "돌아가는 중..." : "돌리기!"}
      </button>
    </div>
  );
}
