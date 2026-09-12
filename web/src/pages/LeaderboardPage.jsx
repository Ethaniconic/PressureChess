import React, { useState, useEffect } from 'react';
import { useMultiplayer } from '../context/MultiplayerContext';
import { useBeta } from '../context/BetaContext';
import { GlassCard } from '../components/GlassCard';
import { COUNTRIES } from '../data/multiplayerData';
import { MULTI_METRIC_LEADERBOARDS } from '../data/betaData';
import {
  Trophy,
  Crown,
  Medal,
  Flame,
  Search,
  ChevronLeft,
  Filter,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Globe,
  Users,
  Zap,
  Award,
  Calendar,
  ShieldCheck,
  Star
} from 'lucide-react';

export const LeaderboardPage = ({ onNavigate }) => {
  const { getLeaderboard } = useMultiplayer();
  const { isFoundingPlayer } = useBeta();

  // Metric Categories: multiplayer | weekly_xp | monthly_xp | puzzle_streak | beta_founders
  const [rankingCategory, setRankingCategory] = useState('multiplayer');

  // Multiplayer filters
  const [timeframe, setTimeframe] = useState('global'); // daily | weekly | global | friends
  const [mode, setMode] = useState('all'); // all | bullet | blitz | rapid | classical
  const [searchQuery, setSearchQuery] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const loadData = async () => {
      try {
        if (rankingCategory === 'multiplayer') {
          const data = await getLeaderboard(timeframe, mode);
          const list = Array.isArray(data) ? data : [];
          let filtered = list;
          if (mode !== 'all') {
            filtered = list.filter(p => !p.mode || p.mode === mode);
          }
          if (isMounted) {
            setLeaderboard(filtered);
            setIsLoading(false);
          }
        } else {
          const data = MULTI_METRIC_LEADERBOARDS[rankingCategory] || [];
          if (isMounted) {
            setLeaderboard(Array.isArray(data) ? data : []);
            setIsLoading(false);
          }
        }
      } catch (err) {
        if (isMounted) {
          setLeaderboard([]);
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [rankingCategory, timeframe, mode]);

  const safeLeaderboard = Array.isArray(leaderboard) ? leaderboard : [];
  const filteredList = safeLeaderboard.filter((p) =>
    p?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topThree = filteredList.slice(0, 3);
  const restList = filteredList.slice(3);

  const getCountryFlag = (countryCode) => {
    if (!countryCode) return '🌐';
    if (COUNTRIES[countryCode]) return COUNTRIES[countryCode].flag;
    if (Array.isArray(COUNTRIES)) {
      const found = COUNTRIES.find((c) => c.code === countryCode);
      return found ? found.flag : '🌐';
    }
    return '🌐';
  };

  const METRIC_TABS = [
    { id: 'multiplayer', label: '⚔️ Multiplayer Elo', desc: 'FIDE standard ratings' },
    { id: 'weekly_xp', label: '⚡ Weekly XP', desc: 'Active lesson learners' },
    { id: 'monthly_xp', label: '🌟 Monthly XP', desc: 'Top monthly grinders' },
    { id: 'puzzle_streak', label: '🧩 Puzzle Streak', desc: 'Consecutive solves' },
    { id: 'beta_founders', label: '✨ Beta Founders', desc: 'Founding player roster' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate?.('multiplayer')}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all"
            title="Lobby"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-400">
              <Trophy className="w-3.5 h-3.5" />
              <span>Hall of Grandmasters • Beta Standings</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">Competitive Leaderboards</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate?.('multiplayer')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-brand to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-black font-black text-xs flex items-center gap-2 shadow-glow-cyan transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Play Ranked Match</span>
          </button>
        </div>
      </div>

      {/* Metric Categories Switcher */}
      <div className="flex rounded-2xl bg-dark-900/90 p-1.5 border border-white/10 overflow-x-auto gap-1">
        {METRIC_TABS.map((tab) => {
          const isSelected = rankingCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setRankingCategory(tab.id)}
              className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-black shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] font-normal ${isSelected ? 'text-black/80' : 'text-slate-500'}`}>
                {tab.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sub-Filters: Only shown for Multiplayer Category */}
      {rankingCategory === 'multiplayer' && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Timeframe Switcher */}
          <div className="flex rounded-2xl bg-slate-900 p-1 border border-white/10 max-w-md">
            {[
              { id: 'global', label: 'Global' },
              { id: 'weekly', label: 'Weekly' },
              { id: 'daily', label: 'Daily' },
              { id: 'friends', label: 'Friends' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTimeframe(tab.id)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all ${
                  timeframe === tab.id
                    ? 'bg-amber-400 text-black shadow-glow-gold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Mode Filter Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'all', label: 'All Modes' },
              { id: 'bullet', label: '⚡ Bullet' },
              { id: 'blitz', label: '🔥 Blitz' },
              { id: 'rapid', label: '⏱️ Rapid' },
              { id: 'classical', label: '🏛️ Classical' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  mode === m.id
                    ? 'bg-cyan-brand/20 border-cyan-brand text-cyan-300 shadow-glow-cyan/40'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search by player username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-brand/50"
        />
      </div>

      {/* TOP 3 PODIUM */}
      {topThree.length >= 3 && !searchQuery && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Silver #2 */}
          <GlassCard className="p-5 border-slate-300/30 bg-gradient-to-b from-slate-300/10 via-slate-900 to-slate-900 text-center space-y-2 order-2 md:order-1 relative overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-slate-400/20 text-slate-200 border border-slate-300/40 flex items-center justify-center mx-auto text-base font-black">
              🥈 2
            </div>
            <div>
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-base">{getCountryFlag(topThree[1].country)}</span>
                <h3 className="text-sm font-black text-white">{topThree[1].username}</h3>
              </div>
              <div className="text-2xl font-black font-mono text-slate-200 mt-1">
                {topThree[1].rating || topThree[1].score}{' '}
                {topThree[1].rating && <span className="text-xs text-slate-400 font-normal">Elo</span>}
              </div>
            </div>
            <div className="text-[11px] text-slate-400 font-semibold pt-1 border-t border-white/5 flex justify-around">
              <span>{topThree[1].tag || `${topThree[1].winRate || 64}% Win Rate`}</span>
              {topThree[1].wins !== undefined && (
                <span>{topThree[1].wins}W / {topThree[1].losses}L</span>
              )}
            </div>
          </GlassCard>

          {/* Gold #1 (Highest elevation) */}
          <GlassCard className="p-6 border-amber-400/50 bg-gradient-to-b from-amber-400/15 via-slate-900 to-slate-900 text-center space-y-2.5 order-1 md:order-2 shadow-2xl shadow-amber-500/10 relative overflow-hidden scale-[1.03]">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/50 flex items-center justify-center mx-auto text-xl font-black shadow-glow-gold">
              👑 1
            </div>
            <div>
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-lg">{getCountryFlag(topThree[0].country)}</span>
                <h3 className="text-base font-black text-white">{topThree[0].username}</h3>
              </div>
              <div className="text-3xl font-black font-mono text-amber-400 mt-1">
                {topThree[0].rating || topThree[0].score}{' '}
                {topThree[0].rating && <span className="text-xs text-slate-400 font-normal">Elo</span>}
              </div>
            </div>
            <div className="text-xs text-amber-300/80 font-bold pt-1 border-t border-white/5 flex justify-around">
              <span>{topThree[0].tag || `${topThree[0].winRate || 66}% Win Rate`}</span>
              {topThree[0].wins !== undefined && (
                <span>{topThree[0].wins}W / {topThree[0].losses}L</span>
              )}
            </div>
          </GlassCard>

          {/* Bronze #3 */}
          <GlassCard className="p-5 border-amber-700/30 bg-gradient-to-b from-amber-700/10 via-slate-900 to-slate-900 text-center space-y-2 order-3 relative overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-amber-700/20 text-amber-400 border border-amber-700/40 flex items-center justify-center mx-auto text-base font-black">
              🥉 3
            </div>
            <div>
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-base">{getCountryFlag(topThree[2].country)}</span>
                <h3 className="text-sm font-black text-white">{topThree[2].username}</h3>
              </div>
              <div className="text-2xl font-black font-mono text-amber-300 mt-1">
                {topThree[2].rating || topThree[2].score}{' '}
                {topThree[2].rating && <span className="text-xs text-slate-400 font-normal">Elo</span>}
              </div>
            </div>
            <div className="text-[11px] text-slate-400 font-semibold pt-1 border-t border-white/5 flex justify-around">
              <span>{topThree[2].tag || `${topThree[2].winRate || 60}% Win Rate`}</span>
              {topThree[2].wins !== undefined && (
                <span>{topThree[2].wins}W / {topThree[2].losses}L</span>
              )}
            </div>
          </GlassCard>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08]">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            Rankings ({filteredList.length} Players)
          </h3>
          <span className="text-xs text-slate-400">Official Beta Calculations</span>
        </div>

        {filteredList.length === 0 ? (
          <div className="py-12 text-center text-slate-500 space-y-2">
            <div className="text-3xl">♟️</div>
            <div className="text-xs">No players found matching your search.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-white/5 pb-2">
                  <th className="py-2.5 font-medium w-16">Rank</th>
                  <th className="py-2.5 font-medium">Player</th>
                  <th className="py-2.5 font-medium text-right">
                    {rankingCategory === 'multiplayer' ? 'Elo Rating' : 'Score / Status'}
                  </th>
                  {rankingCategory === 'multiplayer' ? (
                    <>
                      <th className="py-2.5 font-medium text-right">Win Rate</th>
                      <th className="py-2.5 font-medium text-right">W / L / D</th>
                    </>
                  ) : (
                    <th className="py-2.5 font-medium text-right">Special Tag</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredList.map((player, idx) => {
                  const rank = player.rank || idx + 1;
                  const isTopThree = rank <= 3;
                  const isMe = player.isCurrentUser;

                  return (
                    <tr
                      key={player.id || idx}
                      className={`hover:bg-white/[0.02] transition-colors ${
                        isMe ? 'bg-cyan-500/10 font-bold border-l-2 border-cyan-400' : ''
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-3 font-mono font-bold">
                        {rank === 1 ? (
                          <span className="text-amber-400 flex items-center gap-1 font-black">
                            <Crown className="w-3.5 h-3.5" /> 1
                          </span>
                        ) : rank === 2 ? (
                          <span className="text-slate-300 flex items-center gap-1 font-black">
                            <Medal className="w-3.5 h-3.5" /> 2
                          </span>
                        ) : rank === 3 ? (
                          <span className="text-amber-600 flex items-center gap-1 font-black">
                            <Medal className="w-3.5 h-3.5" /> 3
                          </span>
                        ) : (
                          <span className="text-slate-400">#{rank}</span>
                        )}
                      </td>

                      {/* Player */}
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{getCountryFlag(player.country)}</span>
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              {player.username}
                              {isMe && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-normal">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {player.tier || player.tag || 'Founding Player'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Rating or Score */}
                      <td className="py-3 text-right font-mono font-bold text-white">
                        {player.rating || player.score}
                      </td>

                      {/* Multiplayer details or Tag */}
                      {rankingCategory === 'multiplayer' ? (
                        <>
                          <td className="py-3 text-right">
                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[11px] text-slate-300">
                              {player.winRate || (player.wins ? Math.round((player.wins / (player.wins + (player.losses || 0) + (player.draws || 0))) * 100) : 60)}%
                            </span>
                          </td>
                          <td className="py-3 text-right text-slate-400 font-mono">
                            {player.wins || 0}W / {player.losses || 0}L / {player.draws || 0}D
                          </td>
                        </>
                      ) : (
                        <td className="py-3 text-right text-slate-300">
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-[10px] text-cyan-300 font-bold">
                            {player.tag}
                          </span>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

    </div>
  );
};
