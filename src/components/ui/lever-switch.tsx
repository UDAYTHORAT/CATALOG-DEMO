'use client';

import React from 'react';

interface LeverSwitchProps {
  isActivated: boolean;
  onChange: (state: boolean) => void;
}

export function LeverSwitch({ isActivated, onChange }: LeverSwitchProps) {
  return (
    <>
      <style>{`
      .toggle-container {
        display: inline-block;
        position: relative;
        width: 100px;
        height: 75px;
        cursor: pointer;
        user-select: none;
      }

      .toggle-input {
        position: absolute;
        opacity: 0;
        width: 100%;
        height: 100%;
        z-index: 40;
        cursor: pointer;
        margin: 0;
      }

      .toggle-base {
        position: absolute;
        bottom: 8px;
        left: 50%;
        transform: translateX(-50%);
        width: 68px;
        height: 18px;
        border-radius: 9px;
        background: #f1f5f9;
        border: 2px solid #e2e8f0;
        box-shadow: 
          0 4px 6px -1px rgba(0, 0, 0, 0.05),
          0 2px 4px -1px rgba(0, 0, 0, 0.03),
          inset 0 1px 2px rgba(255, 255, 255, 0.9);
        padding: 2px;
        z-index: 10;
        pointer-events: none;
      }

      .toggle-base-inside {
        width: 100%;
        height: 100%;
        border-radius: 6px;
        transition: background-color 0.3s ease;
        box-shadow: inset 0 1.5px 3px rgba(0, 0, 0, 0.15);
      }

      .toggle-input:not(:checked) ~ .toggle-base .toggle-base-inside {
        background-color: #cbd5e1;
      }

      .toggle-input:checked ~ .toggle-base .toggle-base-inside {
        background-color: #2563eb;
      }

      .toggle-handle-wrapper {
        position: absolute;
        bottom: 15px; /* Pivot height relative to the slot */
        left: 50%;
        width: 0px;
        height: 0px;
        z-index: 20;
        pointer-events: auto;
        cursor: pointer;
        transform-origin: bottom center;
        transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
      }

      .toggle-input:not(:checked) ~ .toggle-handle-wrapper {
        transform: translateX(-18px) rotate(-22deg);
      }

      .toggle-input:checked ~ .toggle-handle-wrapper {
        transform: translateX(18px) rotate(22deg);
      }

      .toggle-handle-shaft {
        position: absolute;
        bottom: 0;
        left: -3.5px;
        width: 7px;
        height: 32px;
        background: linear-gradient(90deg, #cbd5e1 0%, #ffffff 40%, #94a3b8 100%);
        border-radius: 3.5px;
        box-shadow: 
          0 2px 4px rgba(0, 0, 0, 0.15),
          inset 0 1px 1px rgba(255, 255, 255, 0.4);
      }

      .toggle-handle-knob {
        position: absolute;
        bottom: 28px;
        left: -13.5px;
        width: 27px;
        height: 27px;
        border-radius: 50%;
        background: radial-gradient(circle at 35% 35%, #ff8888 0%, #ef4444 38%, #b91c1c 78%, #7f1d1d 100%);
        box-shadow: 
          0 4px 8px rgba(0, 0, 0, 0.3),
          inset 0 -2px 4px rgba(0, 0, 0, 0.4),
          inset 0 1.5px 3px rgba(255, 255, 255, 0.5);
      }

      .toggle-handle-ghost {
        position: absolute;
        bottom: 15px;
        left: 50%;
        width: 0px;
        height: 0px;
        z-index: 15;
        pointer-events: none;
        transform-origin: bottom center;
        opacity: 0.25;
      }

      .toggle-handle-ghost-left {
        transform: translateX(-18px) rotate(-22deg);
      }

      .toggle-handle-ghost-right {
        transform: translateX(18px) rotate(22deg);
      }

      .toggle-handle-shaft-ghost {
        position: absolute;
        bottom: 0;
        left: -3.5px;
        width: 7px;
        height: 32px;
        background: linear-gradient(90deg, #cbd5e1 0%, #ffffff 40%, #94a3b8 100%);
        border-radius: 3.5px;
        box-shadow: 
          0 2px 4px rgba(0, 0, 0, 0.15),
          inset 0 1px 1px rgba(255, 255, 255, 0.4);
      }

      .toggle-handle-knob-ghost {
        position: absolute;
        bottom: 28px;
        left: -13.5px;
        width: 27px;
        height: 27px;
        border-radius: 50%;
        background: radial-gradient(circle at 35% 35%, #ff8888 0%, #ef4444 38%, #b91c1c 78%, #7f1d1d 100%);
        box-shadow: 
          0 4px 8px rgba(0, 0, 0, 0.3),
          inset 0 -2px 4px rgba(0, 0, 0, 0.4),
          inset 0 1.5px 3px rgba(255, 255, 255, 0.5);
      }
    `}</style>

      <label className="toggle-container">
        <input 
          className="toggle-input" 
          type="checkbox"
          checked={isActivated}
          onChange={(e) => onChange(e.target.checked)}
        />
        {/* Ghost/Outline at active position shown only when deactivated */}
        {!isActivated && (
          <div className="toggle-handle-ghost toggle-handle-ghost-right">
            <div className="toggle-handle-shaft-ghost"></div>
            <div className="toggle-handle-knob-ghost"></div>
          </div>
        )}
        <div className="toggle-handle-wrapper">
          <div className="toggle-handle-shaft"></div>
          <div className="toggle-handle-knob"></div>
        </div>
        <div className="toggle-base">
          <div className="toggle-base-inside"></div>
        </div>
      </label>
    </>
  );
}

export default LeverSwitch;
