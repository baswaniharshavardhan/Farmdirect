import React, { useState } from 'react';
import {
  Tractor,
  MessageSquare,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  X,
  Plus,
  Send,
  User,
  Clock,
  ShieldCheck,
} from 'lucide-react';

interface MachineryRentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'en' | 'hi' | 'pa';
}

interface RentalMachine {
  id: string;
  name: string;
  model: string;
  category: string;
  ownerName: string;
  village: string;
  distanceKm: number;
  ratePerHour: number;
  phone: string;
  available: boolean;
  image: string;
  rating: number;
}

interface ChaupalPost {
  id: string;
  author: string;
  village: string;
  crop: string;
  timeAgo: string;
  content: string;
  likes: number;
  replies: number;
}

export const MachineryRentalModal: React.FC<MachineryRentalModalProps> = ({
  isOpen,
  onClose,
  language = 'en',
}) => {
  const [activeTab, setActiveTab] = useState<'rentals' | 'chaupal'>('rentals');
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const machines: RentalMachine[] = [
    {
      id: 'mac-1',
      name: 'Mahindra 575 DI (45 HP) + Rotavator',
      model: '2024 Sarpanch Edition',
      category: 'Tractor & Tillage',
      ownerName: 'Gurdeep Singh Sandhu',
      village: 'Taraori (2.4 km away)',
      distanceKm: 2.4,
      ratePerHour: 650,
      phone: '+91 98120 44321',
      available: true,
      image:
        'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=500&q=80',
      rating: 4.9,
    },
    {
      id: 'mac-2',
      name: 'DJI Agras T40 Agricultural Drone',
      model: 'Precision Spraying (40kg payload)',
      category: 'Drone Spraying',
      ownerName: 'Karnal FPO Custom Hiring Center',
      village: 'Nilokheri Sub-Center (1.1 km away)',
      distanceKm: 1.1,
      ratePerHour: 400, // per acre
      phone: '+91 94160 88219',
      available: true,
      image:
        'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=500&q=80',
      rating: 4.95,
    },
    {
      id: 'mac-3',
      name: 'John Deere 5310 + Happy Seeder / Laser Leveler',
      model: 'Direct Seed Drill + Leveler',
      category: 'Seeding & Leveling',
      ownerName: 'Kulwant Sharma',
      village: 'Indri Road (4.5 km away)',
      distanceKm: 4.5,
      ratePerHour: 750,
      phone: '+91 97290 11984',
      available: true,
      image:
        'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&w=500&q=80',
      rating: 4.85,
    },
    {
      id: 'mac-4',
      name: 'Preet 987 Self Propelled Combine Harvester',
      model: 'With Super SMS Straw Management',
      category: 'Harvesting',
      ownerName: 'Baldev Agro Services',
      village: 'Gharaunda (8.0 km away)',
      distanceKm: 8.0,
      ratePerHour: 1400,
      phone: '+91 98960 77120',
      available: false,
      image:
        'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=500&q=80',
      rating: 4.9,
    },
  ];

  const chaupalPosts: ChaupalPost[] = [
    {
      id: 'cp-1',
      author: 'Sukhwinder Singh',
      village: 'Nilokheri, Karnal',
      crop: 'Wheat HD-3226',
      timeAgo: '2 hours ago',
      content:
        'Kisan bhaiyo, anyone noticed early yellow rust symptoms near the canal borders? Our KVK officer recommended spraying Tilt @ 200ml per acre before tomorrow night.',
      likes: 18,
      replies: 7,
    },
    {
      id: 'cp-2',
      author: 'Rameshwar Lal Sharma',
      village: 'Nilokheri, Karnal',
      crop: 'Mustard RH-749',
      timeAgo: 'Yesterday',
      content:
        'Did the drone foliar spray of Nano Urea yesterday morning with Karnal FPO drone. Covered 8.5 acres in just 45 minutes, very uniform spray and saved 7 bags of conventional urea!',
      likes: 34,
      replies: 12,
    },
    {
      id: 'cp-3',
      author: 'Mohit Rana',
      village: 'Taraori Mandi',
      crop: 'Paddy & Wheat',
      timeAgo: '2 days ago',
      content:
        'Today Karnal Mandi wheat prices touched ₹2,615/Q. Private buyers are matching APMC prices directly at farm gate if moisture is below 12%.',
      likes: 42,
      replies: 15,
    },
  ];

  const [newPostContent, setNewPostContent] = useState('');
  const [posts, setPosts] = useState<ChaupalPost[]>(chaupalPosts);

  if (!isOpen) return null;

  const handleBook = (machine: RentalMachine) => {
    setBookingSuccess(`Booking request sent to ${machine.ownerName} (${machine.name})! They will call you at your registered phone within 15 minutes.`);
    setTimeout(() => setBookingSuccess(null), 5000);
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    const newPost: ChaupalPost = {
      id: `cp-${Date.now()}`,
      author: 'Rameshwar Lal Sharma',
      village: 'Nilokheri, Karnal',
      crop: 'Wheat & Mustard',
      timeAgo: 'Just now',
      content: newPostContent.trim(),
      likes: 1,
      replies: 0,
    };
    setPosts([newPost, ...posts]);
    setNewPostContent('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-neutral-900 text-white w-full max-w-4xl rounded-2xl border border-neutral-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#032e22] px-6 py-4 border-b border-emerald-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center font-bold shadow-md">
              <Tractor className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight text-white font-display">
                  Custom Hiring Center &amp; Kisan Chaupal
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-900 text-emerald-300 border border-emerald-600/60">
                  SMAM Subsidized
                </span>
              </div>
              <p className="text-xs text-emerald-200/80">
                Rent heavy farm machinery nearby &amp; discuss field agronomy
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="bg-neutral-950 px-6 py-2.5 border-b border-neutral-800 flex items-center gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('rentals')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'rentals'
                ? 'bg-amber-400 text-neutral-950'
                : 'text-neutral-400 hover:text-white bg-neutral-900'
            }`}
          >
            <Tractor className="w-4 h-4" />
            <span>Nearby Machinery Rentals (4 Nearby)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('chaupal')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'chaupal'
                ? 'bg-amber-400 text-neutral-950'
                : 'text-neutral-400 hover:text-white bg-neutral-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Kisan Chaupal Community Forum</span>
          </button>
        </div>

        {/* Success Alert */}
        {bookingSuccess && (
          <div className="bg-emerald-950/90 border-b border-emerald-500/50 px-6 py-3 text-xs text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{bookingSuccess}</span>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-neutral-950">
          {activeTab === 'rentals' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {machines.map((mac) => (
                <div
                  key={mac.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-amber-500/40 transition-all flex flex-col"
                >
                  <div className="relative h-40 w-full overflow-hidden bg-neutral-950">
                    <img
                      src={mac.image}
                      alt={mac.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/75 text-amber-300 border border-amber-500/40 backdrop-blur-xs">
                        {mac.category}
                      </span>
                    </div>
                    <div className="absolute top-2.5 right-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          mac.available
                            ? 'bg-emerald-600 text-white'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {mac.available ? 'Available Now' : 'In Field (Busy)'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-white text-sm">{mac.name}</h4>
                        <span className="text-xs font-bold text-amber-300">★ {mac.rating}</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mb-2">{mac.model}</p>

                      <div className="space-y-1 text-xs text-neutral-300">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-neutral-500" />
                          <span>Owner: {mac.ownerName}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" />
                          <span>{mac.village}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-neutral-400 block">Rate</span>
                        <span className="text-base font-black text-amber-400 font-mono">
                          ₹{mac.ratePerHour}
                          <span className="text-xs text-neutral-400 font-normal">
                            /{mac.category.includes('Drone') ? 'acre' : 'hour'}
                          </span>
                        </span>
                      </div>

                      <button
                        type="button"
                        disabled={!mac.available}
                        onClick={() => handleBook(mac)}
                        className="px-4 py-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-neutral-950 font-bold rounded-xl text-xs cursor-pointer transition-colors shadow-md"
                      >
                        Book Machine
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {/* New Post Box */}
              <form
                onSubmit={handleAddPost}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4"
              >
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-neutral-300">
                  <User className="w-4 h-4 text-amber-400" />
                  <span>Share an update or question with Karnal Farmers:</span>
                </div>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="E.g. What variety of wheat did you sow? Any mandi update or pesticide results?"
                  rows={2}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400 resize-none"
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    disabled={!newPostContent.trim()}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span>Post to Chaupal</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              {/* Forum Feed */}
              <div className="space-y-3">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center font-bold text-xs">
                          {post.author[0]}
                        </div>
                        <div>
                          <h5 className="font-bold text-white text-xs">{post.author}</h5>
                          <span className="text-[10px] text-neutral-400">
                            {post.village} · {post.crop}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-neutral-500">{post.timeAgo}</span>
                    </div>

                    <p className="text-xs text-neutral-200 leading-relaxed pl-10">
                      {post.content}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-neutral-800/80 flex items-center gap-4 pl-10 text-xs text-neutral-400">
                      <button
                        type="button"
                        onClick={() => {
                          setPosts(
                            posts.map((p) =>
                              p.id === post.id ? { ...p, likes: p.likes + 1 } : p
                            )
                          );
                        }}
                        className="hover:text-amber-400 flex items-center gap-1 cursor-pointer"
                      >
                        <span>👍 Helpful ({post.likes})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          alert(`Viewing replies for discussion by ${post.author}...`);
                        }}
                        className="hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Replies ({post.replies})</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#032e22] px-6 py-3.5 border-t border-emerald-800/60 flex items-center justify-between">
          <span className="text-xs text-emerald-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Administered by District Agriculture Office, Karnal</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
