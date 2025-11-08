import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Post } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { TrendingUp, UserPlus, Award, Bookmark, Calendar, Users, Eye, Sparkles, Hash, Flame, Bell, MessageCircle, Briefcase, Home, X, Send, Check, XCircle, LogOut, Settings, User as UserIcon, ChevronDown } from 'lucide-react';

type FeedFilter = 'all' | 'following' | 'trending';
type ActiveSection = 'home' | 'network' | 'jobs' | 'messages' | 'notifications';

interface Profile {
  id: string;
  name: string;
  username: string;
  avatar_url?: string;
}

interface ConnectionRequest {
  id: string;
  name: string;
  username: string;
  designation: string;
  avatar_url: string;
}

interface SuggestedUser {
  id: string;
  name: string;
  username: string;
  designation: string;
  avatar_url: string;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  posted: string;
}

interface Message {
  id: string;
  sender: string;
  senderAvatar: string;
  message: string;
  time: string;
  unread: boolean;
}

interface Notification {
  id: string;
  type: 'request' | 'post' | 'friend' | 'like' | 'comment';
  message: string;
  time: string;
  avatar: string;
  read: boolean;
}

interface PostStats {
  posts: number;
  followers: number;
  following: number;
}

export default function Feed() {
  const { profile: authProfile, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Backend state for posts
  const [posts, setPosts] = useState<Post[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [postStats, setPostStats] = useState<PostStats>({
    posts: 0,
    followers: 0,
    following: 0
  });
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Section navigation state
  const [activeSection, setActiveSection] = useState<ActiveSection>('home');
  const [activeTab, setActiveTab] = useState<FeedFilter>('all');
  const [showJobModal, setShowJobModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());
  const [jobFormData, setJobFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    resume: '',
    coverLetter: ''
  });

  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([
    {
      id: '1',
      name: 'Alex Thompson',
      username: 'alexthompson',
      designation: 'Senior Software Engineer at Google',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
    },
    {
      id: '2',
      name: 'Maria Garcia',
      username: 'mariagarcia',
      designation: 'Product Manager at Microsoft',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria'
    },
    {
      id: '3',
      name: 'James Wilson',
      username: 'jameswilson',
      designation: 'UX Designer at Apple',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James'
    }
  ]);

  const [suggestedConnections] = useState<SuggestedUser[]>([
    {
      id: '4',
      name: 'Sarah Chen',
      username: 'sarachen',
      designation: 'Data Scientist at Amazon',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
    },
    {
      id: '5',
      name: 'Michael Brown',
      username: 'michaelbrown',
      designation: 'Full Stack Developer at Meta',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael'
    },
    {
      id: '6',
      name: 'Emily Davis',
      username: 'emilydavis',
      designation: 'Marketing Director at Netflix',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily'
    },
    {
      id: '7',
      name: 'David Lee',
      username: 'davidlee',
      designation: 'AI Researcher at OpenAI',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David'
    }
  ]);

  const [jobs] = useState<Job[]>([
    {
      id: '1',
      title: 'Senior React Developer',
      company: 'Tech Innovations Inc.',
      location: 'San Francisco, CA (Remote)',
      type: 'Full-time',
      salary: '$120k - $180k',
      description: 'We are seeking an experienced React Developer to join our dynamic team. You will be responsible for developing and maintaining high-quality web applications using React and modern JavaScript frameworks.',
      requirements: [
        '5+ years of experience with React and JavaScript',
        'Strong understanding of state management (Redux, Context API)',
        'Experience with TypeScript',
        'Familiarity with REST APIs and GraphQL',
        'Excellent problem-solving skills'
      ],
      posted: '2 days ago'
    },
    {
      id: '2',
      title: 'Product Manager',
      company: 'Digital Solutions Corp',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$130k - $170k',
      description: 'Join our product team to drive the vision and strategy for our flagship products. You will work closely with engineering, design, and business teams to deliver exceptional user experiences.',
      requirements: [
        '3+ years of product management experience',
        'Strong analytical and data-driven mindset',
        'Experience with Agile methodologies',
        'Excellent communication skills',
        'Technical background preferred'
      ],
      posted: '1 week ago'
    },
    {
      id: '3',
      title: 'UX/UI Designer',
      company: 'Creative Minds Agency',
      location: 'Austin, TX (Hybrid)',
      type: 'Full-time',
      salary: '$90k - $130k',
      description: 'We are looking for a talented UX/UI Designer to create intuitive and visually appealing interfaces for our clients. You will be involved in all stages of the design process from research to final implementation.',
      requirements: [
        'Portfolio showcasing UX/UI work',
        'Proficiency in Figma and Adobe Creative Suite',
        'Understanding of user-centered design principles',
        'Experience with prototyping and wireframing',
        '3+ years of design experience'
      ],
      posted: '3 days ago'
    },
    {
      id: '4',
      title: 'DevOps Engineer',
      company: 'Cloud Systems Ltd',
      location: 'Seattle, WA (Remote)',
      type: 'Full-time',
      salary: '$140k - $190k',
      description: 'Seeking a skilled DevOps Engineer to manage and optimize our cloud infrastructure. You will implement CI/CD pipelines, monitor system performance, and ensure high availability.',
      requirements: [
        'Experience with AWS, Azure, or GCP',
        'Strong knowledge of Docker and Kubernetes',
        'Proficiency in scripting (Python, Bash)',
        'Experience with CI/CD tools (Jenkins, GitLab)',
        '4+ years in DevOps or related field'
      ],
      posted: '5 days ago'
    },
    {
      id: '5',
      title: 'Data Analyst',
      company: 'Analytics Pro',
      location: 'Boston, MA',
      type: 'Full-time',
      salary: '$80k - $110k',
      description: 'We need a Data Analyst to transform raw data into actionable insights. You will work with stakeholders to understand business needs and deliver comprehensive reports and visualizations.',
      requirements: [
        'Strong SQL and database skills',
        'Experience with Python or R for data analysis',
        'Proficiency in data visualization tools (Tableau, Power BI)',
        'Bachelor\'s degree in related field',
        '2+ years of experience'
      ],
      posted: '1 week ago'
    }
  ]);

  const [conversations] = useState([
    { id: '1', name: 'Sarah Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah2', lastMessage: 'Thanks for connecting!', time: '2m ago', unread: 2 },
    { id: '2', name: 'John Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John2', lastMessage: 'Can we schedule a call?', time: '1h ago', unread: 0 },
    { id: '3', name: 'Emma Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma2', lastMessage: 'Great project!', time: '3h ago', unread: 1 }
  ]);

  const [chatMessages] = useState<Record<string, Message[]>>({
    '1': [
      { id: '1', sender: 'Sarah Wilson', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah2', message: 'Hi! I saw your profile and wanted to connect.', time: '10:30 AM', unread: false },
      { id: '2', sender: 'You', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', message: 'Thanks for reaching out! Always happy to connect.', time: '10:32 AM', unread: false },
      { id: '3', sender: 'Sarah Wilson', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah2', message: 'Thanks for connecting!', time: '10:35 AM', unread: true }
    ],
    '2': [
      { id: '1', sender: 'John Smith', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John2', message: 'Hey, I loved your recent post about React!', time: '9:15 AM', unread: false },
      { id: '2', sender: 'You', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', message: 'Thank you! Glad you found it helpful.', time: '9:20 AM', unread: false },
      { id: '3', sender: 'John Smith', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John2', message: 'Can we schedule a call?', time: '9:25 AM', unread: false }
    ]
  });

  const [notifications] = useState<Notification[]>([
    { id: '1', type: 'request', message: 'Alex Thompson sent you a connection request', time: '5m ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', read: false },
    { id: '2', type: 'post', message: 'Sarah Chen posted something new', time: '1h ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', read: false },
    { id: '3', type: 'friend', message: 'You and Michael Brown are now connected', time: '2h ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael', read: true },
    { id: '4', type: 'like', message: 'Emily Davis liked your post', time: '3h ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily', read: true },
    { id: '5', type: 'comment', message: 'David Lee commented on your post', time: '5h ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', read: true }
  ]);

  // Use real profile from auth or fallback to mock
  const profile = authProfile || {
    id: '1',
    name: 'John Doe',
    username: 'johndoe',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
  };

  // Backend functions for posts
  const handlePostUpdated = useCallback((updatedPost: Post) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === updatedPost.id ? { ...post, ...updatedPost } : post
      )
    );
  }, []);

  const handlePostDeleted = useCallback((deletedPostId: string) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== deletedPostId));
    setPostStats(prev => ({
      ...prev,
      posts: Math.max(0, prev.posts - 1)
    }));
  }, []);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'following' ? '/posts/following' : '/posts';
      const response = await api.get(endpoint);
      setPosts(response.data);
    } catch (error) {
      console.error('Error loading posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  const loadUserStats = useCallback(async () => {
    if (!profile) return;
    
    try {
      const response = await api.get(`/users/${profile.id}/stats`);
      setPostStats(response.data);
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  }, [profile]);

  const handleNewPost = useCallback(async () => {
    console.log('[Feed] Refreshing posts and stats after new post');
    try {
      await Promise.all([loadPosts(), loadUserStats()]);
    } catch (error) {
      console.error('Error refreshing feed after new post:', error);
    }
  }, [loadPosts, loadUserStats]);

  const loadSuggestedUsers = useCallback(async () => {
    try {
      const response = await api.get('/users/suggested');
      setSuggestedUsers(response.data);
      
      const followingResponse = await api.get('/users/following/ids');
      setFollowing(new Set(followingResponse.data));
    } catch (error) {
      console.error('Error loading suggested users:', error);
    }
  }, []);

  const handleFollow = async (userId: string) => {
    try {
      await api.post(`/users/${userId}/follow`);
      setFollowing(prev => {
        const newFollowing = new Set(prev);
        if (newFollowing.has(userId)) {
          newFollowing.delete(userId);
        } else {
          newFollowing.add(userId);
        }
        return newFollowing;
      });
      loadSuggestedUsers();
      loadUserStats();
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleViewProfile = () => {
    navigate('/profile');
    setShowDropdown(false);
  };

  const handleAcceptRequest = (requestId: string) => {
    setConnectionRequests(prev => prev.filter(req => req.id !== requestId));
  };

  const handleRejectRequest = (requestId: string) => {
    setConnectionRequests(prev => prev.filter(req => req.id !== requestId));
  };

  const handleSendRequest = (userId: string) => {
    setSentRequests(prev => new Set([...prev, userId]));
  };

  const handleApplyJob = (job: Job) => {
    setSelectedJob(job);
    setShowJobModal(true);
  };

  const handleJobFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Application submitted successfully!');
    setShowJobModal(false);
    setJobFormData({ fullName: '', email: '', phone: '', resume: '', coverLetter: '' });
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Load data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          loadPosts(),
          loadSuggestedUsers(),
          loadUserStats()
        ]);
      } catch (error) {
        console.error('Error initializing feed:', error);
      }
    };
    
    fetchData();
  }, [loadPosts, loadSuggestedUsers, loadUserStats]);

  const renderHome = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <aside className="hidden md:block lg:col-span-3 space-y-4">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
          <div className="h-20 bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600"></div>
          <div className="px-4 pb-4 -mt-10">
            <div className="relative inline-block">
              {profile?.profilePicture ? (
                <img 
                  src={profile.profilePicture} 
                  alt={profile.username} 
                  className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg bg-teal-100 flex items-center justify-center">
                  <span className="text-teal-600 font-bold text-2xl">
                    {profile?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="mt-3">
              <h3 className="font-bold text-gray-900 text-lg">{profile.name}</h3>
              <p className="text-sm text-teal-600">@{profile.username}</p>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <div className="font-bold text-gray-900 text-lg">{postStats.posts}</div>
                <div className="text-xs text-gray-500">Posts</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900 text-lg">{postStats.followers}</div>
                <div className="text-xs text-gray-500">Followers</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900 text-lg">{postStats.following}</div>
                <div className="text-xs text-gray-500">Following</div>
              </div>
            </div>
            
            <button 
              onClick={handleViewProfile}
              className="mt-4 w-full block text-center bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg font-medium transition-all transform hover:scale-105"
            >
              View Profile
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-600" />
            Quick Actions
          </h3>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-teal-50 transition-colors text-left">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <Bookmark className="w-5 h-5 text-teal-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Saved Posts</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors text-left">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Events</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors text-left">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Groups</span>
            </button>
          </div>
        </div>

        {/* Connect - Suggested Users */}
        <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-teal-600" />
              Connect
            </h3>
            <button className="text-xs text-teal-600 hover:text-teal-700 font-medium">
              See all
            </button>
          </div>
          <div className="space-y-3">
            {suggestedUsers.slice(0, 3).map((user) => (
              <div key={user.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <img 
                    src={user.avatar_url} 
                    alt={user.username} 
                    className="w-10 h-10 rounded-full ring-2 ring-transparent group-hover:ring-teal-200 transition-all"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">@{user.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleFollow(user.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all flex-shrink-0 ${
                    following.has(user.id)
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-teal-600 text-white hover:bg-teal-700 transform hover:scale-105'
                  }`}
                >
                  {following.has(user.id) ? 'Following' : 'Follow'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <main className="lg:col-span-6 space-y-6">
        <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Flame className="w-6 h-6 text-teal-600" />
              Feed
            </h2>
          </div>
          <div className="flex space-x-2 bg-gray-50 p-1.5 rounded-xl">
            <button onClick={() => setActiveTab('all')} className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'all' ? 'bg-white shadow-sm text-teal-600' : 'text-gray-600'}`}>
              All Posts
            </button>
            <button onClick={() => setActiveTab('following')} className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'following' ? 'bg-white shadow-sm text-teal-600' : 'text-gray-600'}`}>
              Following
            </button>
            <button onClick={() => setActiveTab('trending')} className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'trending' ? 'bg-white shadow-sm text-teal-600' : 'text-gray-600'}`}>
              Trending
            </button>
          </div>
        </div>

        {/* Post Form */}
        <div className="mb-6">
          <PostForm onPostCreated={handleNewPost} />
        </div>

        {/* Posts */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-600 absolute top-0 left-0"></div>
            </div>
            <p className="mt-4 text-gray-500 font-medium">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-16 text-center">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-10 h-10 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Posts Yet</h3>
            <p className="text-gray-500 mb-6">
              {activeTab === 'following'
                ? "You're not following anyone yet. Follow some users to see their posts!"
                : 'Be the first to share something amazing with the community!'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <PostCard 
                  post={post}
                  onPostDeleted={handlePostDeleted}
                  onPostUpdated={handlePostUpdated}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      <aside className="hidden lg:block lg:col-span-3 space-y-4">
        <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Trending Topics</h3>
          <div className="space-y-3">
            <div className="p-3 rounded-lg hover:bg-teal-50 transition-colors cursor-pointer">
              <p className="text-sm font-bold text-gray-900">#TechInnovation</p>
              <p className="text-xs text-gray-500 mt-1">1.2k posts</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );

  const renderNetwork = () => (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <UserPlus className="w-6 h-6 text-teal-600" />
          Connection Requests ({connectionRequests.length})
        </h2>
        {connectionRequests.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No pending connection requests</p>
        ) : (
          <div className="space-y-4">
            {connectionRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <img src={request.avatar_url} alt={request.name} className="w-16 h-16 rounded-full" />
                  <div>
                    <h3 className="font-bold text-gray-900">{request.name}</h3>
                    <p className="text-sm text-gray-600">@{request.username}</p>
                    <p className="text-sm text-teal-600 mt-1">{request.designation}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAcceptRequest(request.id)} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-all">
                    <Check className="w-4 h-4" />
                    Accept
                  </button>
                  <button onClick={() => handleRejectRequest(request.id)} className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all">
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Users className="w-6 h-6 text-teal-600" />
          People You May Know
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestedConnections.map((user) => (
            <div key={user.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
              <div className="flex items-start gap-3">
                <img src={user.avatar_url} alt={user.name} className="w-14 h-14 rounded-full" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">{user.name}</h3>
                  <p className="text-xs text-gray-600 truncate">@{user.username}</p>
                  <p className="text-sm text-teal-600 mt-1">{user.designation}</p>
                </div>
              </div>
              <button
                onClick={() => handleSendRequest(user.id)}
                disabled={sentRequests.has(user.id)}
                className={`w-full mt-4 py-2 rounded-lg font-medium transition-all ${
                  sentRequests.has(user.id)
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
              >
                {sentRequests.has(user.id) ? 'Request Sent' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderJobs = () => (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-teal-600" />
          Recommended Jobs
        </h2>
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all">
              <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
              <p className="text-teal-600 font-medium mt-1">{job.company}</p>
              <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-600">
                <span>📍 {job.location}</span>
                <span>💼 {job.type}</span>
                <span>💰 {job.salary}</span>
              </div>
              <p className="text-gray-700 mt-3">{job.description}</p>
              <p className="text-sm text-gray-500 mt-2">Posted {job.posted}</p>
              <button
                onClick={() => handleApplyJob(job)}
                className="mt-4 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-all"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden h-[600px]">
        <div className="grid grid-cols-12 h-full">
          <div className="col-span-4 border-r border-gray-200 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-teal-600" />
                Messages
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedChat(conv.id)}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${selectedChat === conv.id ? 'bg-teal-50' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={conv.avatar} alt={conv.name} className="w-12 h-12 rounded-full" />
                      {conv.unread > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-teal-600 text-white text-xs rounded-full flex items-center justify-center">
                          {conv.unread}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{conv.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                    </div>
                    <span className="text-xs text-gray-400">{conv.time}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="col-span-8 flex flex-col">
            {selectedChat ? (
              <>
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <img
                      src={conversations.find(c => c.id === selectedChat)?.avatar}
                      alt="avatar"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900">{conversations.find(c => c.id === selectedChat)?.name}</h3>
                      <p className="text-xs text-green-500">● Online</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {(chatMessages[selectedChat] || []).map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex gap-2 max-w-md ${msg.sender === 'You' ? 'flex-row-reverse' : ''}`}>
                        <img src={msg.senderAvatar} alt={msg.sender} className="w-8 h-8 rounded-full" />
                        <div>
                          <div className={`p-3 rounded-lg ${msg.sender === 'You' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                            <p className="text-sm">{msg.message}</p>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <button className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-lg transition-all">
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Bell className="w-6 h-6 text-teal-600" />
          Notifications
        </h2>
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                notification.read ? 'bg-white' : 'bg-teal-50'
              } hover:shadow-md`}
            >
              <img src={notification.avatar} alt="avatar" className="w-12 h-12 rounded-full" />
              <div className="flex-1">
                <p className="text-sm text-gray-900">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
              </div>
              {!notification.read && (
                <div className="w-3 h-3 bg-teal-600 rounded-full"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-teal-600">Social</h1>
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setActiveSection('home')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeSection === 'home' ? 'text-teal-600 bg-teal-50' : 'text-gray-600 hover:text-teal-600'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="hidden md:inline">Home</span>
              </button>
              <button
                onClick={() => setActiveSection('network')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeSection === 'network' ? 'text-teal-600 bg-teal-50' : 'text-gray-600 hover:text-teal-600'
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="hidden md:inline">Network</span>
              </button>
              <button
                onClick={() => setActiveSection('jobs')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeSection === 'jobs' ? 'text-teal-600 bg-teal-50' : 'text-gray-600 hover:text-teal-600'
                }`}
              >
                <Briefcase className="w-5 h-5" />
                <span className="hidden md:inline">Jobs</span>
              </button>
              <button
                onClick={() => setActiveSection('messages')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeSection === 'messages' ? 'text-teal-600 bg-teal-50' : 'text-gray-600 hover:text-teal-600'
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                <span className="hidden md:inline">Messages</span>
              </button>
              <button
                onClick={() => setActiveSection('notifications')}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeSection === 'notifications' ? 'text-teal-600 bg-teal-50' : 'text-gray-600 hover:text-teal-600'
                }`}
              >
                <Bell className="w-5 h-5" />
                <span className="hidden md:inline">Notifications</span>
                {unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>
              
              {/* User Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg p-2 transition-colors"
                >
                  {profile?.profilePicture ? (
                    <img 
                      src={profile.profilePicture} 
                      alt={profile.username} 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                      <span className="text-teal-600 font-semibold text-sm">
                        {profile?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-10">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-900">{profile?.name}</p>
                      <p className="text-sm text-gray-500">@{profile?.username}</p>
                    </div>

                    <button
                      onClick={handleViewProfile}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>View Profile</span>
                    </button>

                    <button
                      onClick={() => setShowDropdown(false)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>

                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === 'home' && renderHome()}
        {activeSection === 'network' && renderNetwork()}
        {activeSection === 'jobs' && renderJobs()}
        {activeSection === 'messages' && renderMessages()}
        {activeSection === 'notifications' && renderNotifications()}
      </div>

      {showJobModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
                <p className="text-teal-600 font-medium mt-1">{selectedJob.company}</p>
              </div>
              <button
                onClick={() => setShowJobModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Job Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">Location:</span>
                      <span className="text-gray-600">{selectedJob.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">Type:</span>
                      <span className="text-gray-600">{selectedJob.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">Salary:</span>
                      <span className="text-gray-600">{selectedJob.salary}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">Posted:</span>
                      <span className="text-gray-600">{selectedJob.posted}</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-bold text-gray-900 mb-3">Requirements</h4>
                    <ul className="space-y-2">
                      {selectedJob.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-teal-600 mt-1">✓</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Application Form</h3>
                  <form onSubmit={handleJobFormSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={jobFormData.fullName}
                        onChange={(e) => setJobFormData({ ...jobFormData, fullName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={jobFormData.email}
                        onChange={(e) => setJobFormData({ ...jobFormData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={jobFormData.phone}
                        onChange={(e) => setJobFormData({ ...jobFormData, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Resume/CV Link *
                      </label>
                      <input
                        type="url"
                        required
                        value={jobFormData.resume}
                        onChange={(e) => setJobFormData({ ...jobFormData, resume: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="https://example.com/resume.pdf"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cover Letter
                      </label>
                      <textarea
                        value={jobFormData.coverLetter}
                        onChange={(e) => setJobFormData({ ...jobFormData, coverLetter: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                        placeholder="Tell us why you're a great fit..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
                    >
                      Submit Application
                    </button>
                  </form>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3">Job Description</h3>
                <p className="text-gray-700 leading-relaxed">{selectedJob.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}