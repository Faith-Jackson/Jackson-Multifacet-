import { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import { motion } from 'motion/react';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

const data = [
  { name: 'Jan', value: 400, growth: 240, margin: 24 },
  { name: 'Feb', value: 300, growth: 139, margin: 22 },
  { name: 'Mar', value: 200, growth: 980, margin: 26 },
  { name: 'Apr', value: 278, growth: 390, margin: 25 },
  { name: 'May', value: 189, growth: 480, margin: 28 },
  { name: 'Jun', value: 239, growth: 380, margin: 30 },
  { name: 'Jul', value: 349, growth: 430, margin: 32 },
];

export default function AnalyticsView() {
  return (
    <div className="space-y-6 md:space-y-10 animate-in">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2 font-display">Analytics & ROI</h1>
        <p className="text-sm md:text-base text-white/40">Business performance metrics and real-time operational data.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Revenue (MTD)', value: '$124.5k', trend: '+12.5%', icon: DollarSign },
          { label: 'Active Pipeline', value: '42', trend: '+8.2%', icon: TrendingUp },
          { label: 'Network Velocity', value: '84.2', trend: '-2.1%', icon: Activity },
          { label: 'Avg Satisfaction', value: '4.9/5', trend: '+0.1', icon: Users },
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden backdrop-blur-sm group hover:border-white/20 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <stat.icon className="w-5 h-5 text-indigo-400" />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${stat.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
              <div className="h-full bg-indigo-500/50 w-1/2 group-hover:w-3/4 transition-all duration-700" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 pb-20">
        <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-[2rem] md:rounded-3xl space-y-6 md:space-y-8 backdrop-blur-xl">
          <div className="flex justify-between items-center">
            <h3 className="text-lg md:text-xl font-bold text-white font-display">Project Velocity</h3>
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-white/10" />
            </div>
          </div>
          <div className="h-[250px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff30" fontSize={10} tickLine={false} axisLine={false} tick={{ fontWeight: 'bold', letterSpacing: '0.1em' }} />
                <YAxis stroke="#ffffff30" fontSize={10} tickLine={false} axisLine={false} tick={{ fontWeight: 'bold' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0c0c14', border: '1px solid #ffffff10', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#ffffff', fontSize: '12px', fontWeight: 'bold' }}
                  cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
                />
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-[2rem] md:rounded-3xl space-y-6 md:space-y-8 backdrop-blur-xl">
          <h3 className="text-lg md:text-xl font-bold text-white font-display">Client Acquisition</h3>
          <div className="h-[250px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff30" fontSize={10} tickLine={false} axisLine={false} tick={{ fontWeight: 'bold', letterSpacing: '0.1em' }} />
                <YAxis stroke="#ffffff30" fontSize={10} tickLine={false} axisLine={false} tick={{ fontWeight: 'bold' }} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0c0c14', border: '1px solid #ffffff10', borderRadius: '12px' }}
                   itemStyle={{ color: '#ffffff', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Bar dataKey="growth" fill="#ffffff20" radius={[4, 4, 0, 0]} barSize={40} className="hover:fill-indigo-500 transition-all duration-300" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
