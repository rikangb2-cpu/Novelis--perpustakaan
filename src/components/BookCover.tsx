import React, { useState } from 'react';
import { Novel } from '../types/novel';
import { Sparkles, Compass, Feather, BookOpen, Layers } from 'lucide-react';

interface BookCoverProps {
  novel: Novel;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showProgress?: boolean;
  className?: string;
}

export const BookCover: React.FC<BookCoverProps> = ({
  novel,
  size = 'md',
  showProgress = false,
  className = ''
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-20 h-28 text-xs',
    md: 'w-28 h-40 text-xs',
    lg: 'w-36 h-52 text-sm',
    xl: 'w-48 h-68 text-base'
  };

  const patternIcons = {
    stars: Sparkles,
    botanical: Feather,
    geometric: Layers,
    classic: BookOpen,
    minimalist: Compass
  };

  const PatternIcon = patternIcons[novel.coverPattern] || BookOpen;
  const progressPercent = Math.min(100, Math.round((novel.currentPage / (novel.totalPages || 1)) * 100));

  const hasImage = Boolean(novel.coverImageUrl && !imgError);

  return (
    <div
      className={`relative select-none overflow-hidden rounded-r-md rounded-l-xs shadow-md transition-transform duration-200 active:scale-[0.98] ${sizeClasses[size]} ${className}`}
      style={{
        boxShadow: '3px 4px 12px -2px rgba(15, 23, 42, 0.25), 1px 1px 4px rgba(0,0,0,0.1)'
      }}
    >
      {/* Real Cover Artwork Image */}
      {hasImage ? (
        <img
          src={novel.coverImageUrl}
          alt={`Sampul novel ${novel.title}`}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-center"
        />
      ) : (
        /* Fallback Graphic Hardcover */
        <div className={`w-full h-full bg-gradient-to-br ${novel.coverColor} flex flex-col justify-between p-2`}>
          {/* Top genre mark */}
          <div className="flex items-center justify-between opacity-80">
            <PatternIcon className="w-3.5 h-3.5 text-white/90" />
            <span className="text-[9px] tracking-wider uppercase font-semibold text-white/90">
              {novel.genre.split('&')[0].trim()}
            </span>
          </div>

          {/* Center Title & Author */}
          <div className="my-auto text-center px-1">
            <h4 className="font-serif-novel font-bold text-white tracking-wide leading-tight drop-shadow-sm line-clamp-2">
              {novel.title}
            </h4>
            <p className="mt-1 text-[10px] text-white/80 font-medium tracking-tight truncate">
              {novel.author}
            </p>
          </div>

          {/* Bottom decorative ornament */}
          <div className="flex items-center justify-center gap-1 opacity-60">
            <div className="h-px w-4 bg-white/50" />
            <div className="w-1 h-1 rounded-full bg-white/70" />
            <div className="h-px w-4 bg-white/50" />
          </div>
        </div>
      )}

      {/* Book spine lighting & fold effect (Gives genuine 3D printed book feel) */}
      <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/50 via-white/20 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 left-2 w-px bg-white/20 z-10 pointer-events-none" />
      
      {/* Subtle outer glossy rim */}
      <div className="absolute inset-0 ring-1 ring-inset ring-black/15 rounded-r-md pointer-events-none" />

      {/* Decorative top ribbon for favorites */}
      {novel.isFavorite && (
        <div className="absolute -top-0.5 right-2 w-3.5 h-6 bg-amber-500 rounded-b-sm shadow-md z-20 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-900/60" />
        </div>
      )}

      {/* Bottom reading progress indicator on cover if requested */}
      {showProgress && novel.status === 'reading' && (
        <div className="absolute bottom-0 inset-x-0 h-1.5 bg-slate-950/60 z-20">
          <div 
            className="h-full bg-amber-400 transition-all duration-300" 
            style={{ width: `${progressPercent}%` }} 
          />
        </div>
      )}
    </div>
  );
};
