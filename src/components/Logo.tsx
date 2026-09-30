import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'invoice';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md'
}) => {
  const heights = {
    sm: 38,
    md: 48,
    lg: 60,
    invoice: 52
  }[size];

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        viewBox="0 0 460 140"
        height={heights}
        className="w-auto h-auto max-h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left Geometric Icon: Navy Blue & Cyan Wings */}
        <g id="logo-icon">
          {/* Left Navy Column */}
          <path d="M42 22 L72 44 L72 62 L42 40 Z" fill="#0C4A85" />
          <path d="M42 48 L72 70 L72 88 L42 66 Z" fill="#0C4A85" />
          <path d="M42 74 L72 96 L72 114 L42 92 Z" fill="#0C4A85" />

          {/* Far Left Navy Lower Wings */}
          <path d="M12 44 L36 62 L36 78 L12 60 Z" fill="#0E4277" />
          <path d="M12 70 L36 88 L36 104 L12 86 Z" fill="#0E4277" />
          <path d="M12 96 L36 114 L36 130 L12 112 Z" fill="#0E4277" />

          {/* Right Cyan Column */}
          <path d="M102 22 L72 44 L72 62 L102 40 Z" fill="#00A2E8" />
          <path d="M102 48 L72 70 L72 88 L102 66 Z" fill="#00A2E8" />
          <path d="M102 74 L72 96 L72 114 L102 92 Z" fill="#00A2E8" />

          {/* Far Right Cyan Lower Wings */}
          <path d="M132 44 L108 62 L108 78 L132 60 Z" fill="#29B6F6" />
          <path d="M132 70 L108 88 L108 104 L132 86 Z" fill="#29B6F6" />
          <path d="M132 96 L108 114 L108 130 L132 112 Z" fill="#29B6F6" />
        </g>

        {/* Center/Right Wordmark 'msb' with fluid signature script */}
        <g id="logo-text">
          {/* 'm' - bold flowing brush loops */}
          <path
            d="M175 96 C 165 96, 156 82, 168 54 C 178 30, 202 18, 222 18 C 234 18, 240 25, 237 36 C 248 24, 260 18, 272 18 C 286 18, 292 27, 287 40 C 298 25, 312 18, 326 18 C 342 18, 350 29, 344 48 C 337 72, 327 96, 312 96 C 304 96, 301 91, 306 74 L 314 46 C 317 38, 314 33, 307 33 C 297 33, 284 45, 277 66 L 268 96 C 260 96, 257 91, 262 74 L 270 46 C 273 38, 270 33, 263 33 C 253 33, 240 45, 233 66 L 223 96 C 215 96, 212 91, 217 74 L 225 46 C 228 38, 225 33, 218 33 C 208 33, 195 45, 188 66 L 180 94 C 179 95, 177 96, 175 96 Z"
            fill="#104D8C"
          />

          {/* 's' - looped cursive s */}
          <path
            d="M348 94 C 342 94, 338 88, 344 72 L 358 36 C 363 24, 372 18, 383 18 C 395 18, 402 24, 399 35 C 396 46, 387 56, 372 63 C 367 76, 371 82, 381 82 C 392 82, 404 74, 412 62 L 416 67 C 405 84, 388 94, 372 94 C 361 94, 354 89, 357 78 C 362 67, 370 60, 378 54 C 385 49, 389 44, 390 38 C 391 32, 388 28, 383 28 C 378 28, 371 33, 367 43 L 353 78 C 351 88, 350 94, 348 94 Z"
            fill="#104D8C"
          />

          {/* 'b' - tall ascending loop */}
          <path
            d="M400 96 C 394 96, 391 90, 396 74 L 424 10 C 428 2, 436 -2, 442 -2 C 448 -2, 451 4, 448 14 L 434 50 C 445 42, 456 38, 467 38 C 481 38, 490 48, 484 66 C 478 84, 463 96, 444 96 C 432 96, 423 90, 420 81 L 416 94 C 415 95, 413 96, 400 96 Z M 438 78 C 452 78, 462 70, 466 58 C 470 48, 465 44, 456 44 C 446 44, 436 50, 429 60 L 424 74 C 427 77, 432 78, 438 78 Z"
            fill="#104D8C"
          />
        </g>

        {/* Bottom Subtitle: PT. MASTER SINERGI BERSAUDARA */}
        <text
          x="146"
          y="126"
          fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
          fontWeight="800"
          fontSize="18.5"
          letterSpacing="0.09em"
          fill="#104D8C"
        >
          PT. MASTER SINERGI BERSAUDARA
        </text>
      </svg>
    </div>
  );
};
