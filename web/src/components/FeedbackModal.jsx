import React, { useState } from 'react';
import { useBeta } from '../context/BetaContext';
import { 
  X, 
  Send, 
  Star, 
  Bug, 
  Lightbulb, 
  GraduationCap, 
  Zap, 
  Swords, 
  MessageSquare, 
  CheckCircle2 
} from 'lucide-react';

export const FeedbackModal = () => {
  const { 
    showFeedbackModal, 
    closeFeedback, 
    submitFeedback,
    feedbackInitialType,
    feedbackInitialCategory,
    feedbackInitialRating 
  } = useBeta();

  const [feedbackType, setFeedbackType] = useState(feedbackInitialType || 'feature');
  const [rating, setRating] = useState(feedbackInitialRating || 5);
  const [category] = useState(feedbackInitialCategory || 'General');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!showFeedbackModal) return null;

  const FEEDBACK_TYPES = [
    { id: 'bug', label: 'Bug Report', icon: Bug, color: 'text-rose-400' },
    { id: 'feature', label: 'Feature Idea', icon: Lightbulb, color: 'text-[#E5A93C]' },
    { id: 'lesson_rating', label: 'Academy Lesson', icon: GraduationCap, color: 'text-amber-300' },
    { id: 'puzzle_rating', label: 'Tactics Rush', icon: Zap, color: 'text-[#E5A93C]' },
    { id: 'multiplayer_rating', label: 'Multiplayer', icon: Swords, color: 'text-emerald-400' },
    { id: 'general', label: 'General', icon: MessageSquare, color: 'text-slate-300' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    await submitFeedback({
      type: feedbackType,
      rating,
      category,
      message: message.trim()
    });

    setIsSubmitting(false);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setMessage('');
      closeFeedback();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg p-6 rounded-[5px] bg-[#0D0E11] border border-[#272932] border-t-white/20 shadow-2xl shadow-black/90 text-left">
        
        {/* Close Button */}
        <button
          onClick={closeFeedback}
          className="absolute top-4 right-4 p-2 rounded-[4px] text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-10 text-center space-y-3 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 mx-auto rounded-[5px] bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-white">Thank You, Founding Player!</h3>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              Your feedback has been logged directly for the engineering team. Together we make PressureChess supreme!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Header */}
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>💬</span> In-App Feedback Center
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Have an idea, found a glitch, or want to rate an exercise? Let us know!
              </p>
            </div>

            {/* Type Selector Tabs */}
            <div className="grid grid-cols-3 gap-1.5">
              {FEEDBACK_TYPES.map((t) => {
                const isSelected = feedbackType === t.id;
                const Icon = t.icon;
                return (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => setFeedbackType(t.id)}
                    className={`p-2 rounded-[4px] border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-[#E5A93C]/20 border-[#E5A93C]/60 text-white shadow-sm'
                        : 'bg-[#121317] border-[#252830] text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${t.color}`} />
                    <span className="truncate">{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* 5-Star Rating */}
            <div className="flex items-center justify-between p-3 rounded-[5px] bg-[#121317] border border-[#252830]">
              <span className="text-xs font-semibold text-slate-300">How would you rate this?</span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= rating
                          ? 'fill-[#E5A93C] text-[#E5A93C]'
                          : 'text-slate-700 hover:text-slate-500'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Message Area */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Your Feedback / Details
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What happened? What could we improve or add next?"
                className="w-full p-3 rounded-[5px] bg-[#121317] border border-[#252830] focus:border-[#E5A93C]/60 text-xs text-white placeholder:text-slate-500 outline-none resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeFeedback}
                className="px-4 py-2.5 rounded-[5px] bg-white/5 text-slate-300 hover:text-white text-xs font-bold transition-colors border border-[#262830]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="px-5 py-2.5 rounded-[5px] bg-[#E5A93C] hover:bg-[#F3BA54] text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_12px_rgba(229,169,60,0.3)] disabled:opacity-50 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending...' : 'Send Feedback'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
