import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import Navbar from '../components/Navbar';
import { User, Briefcase, GraduationCap, Globe, TrendingUp, Users, Eye, Award } from 'lucide-react';

interface UserProfile {
  _id: string;
  id?: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  headline?: string;
  location?: string;
  profilePicture?: string;
  coverPhoto?: string;
  createdAt: string;
}

export default function ProfileDashboard() {
  const { userId } = useParams();
  const { profile: currentProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    // Use userId from URL params, or current user's ID from localStorage or currentProfile
    const profileId = userId || localStorage.getItem('userId') || currentProfile?.id;
    if (profileId) {
      loadProfile(profileId);
      const currentUserId = localStorage.getItem('userId') || currentProfile?.id;
      setIsOwnProfile(profileId === currentUserId);
    } else {
      setLoading(false);
    }
  }, [userId, currentProfile]);

  const loadProfile = async (id: string) => {
    try {
      const response = await api.get(`/users/${id}`);
      const userData = response.data.user || response.data;
      
      // Map _id to id for consistency
      if (userData._id && !userData.id) {
        userData.id = userData._id;
      }
      
      setProfile(userData);
    } catch (error) {
      console.error('Error loading profile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <p className="text-gray-600">Profile not found</p>
        </div>
      </div>
    );
  }
  const profileStats = {
    views: 2847,
    connections: 542,
    profileVisits: [45, 52, 48, 65, 72, 68, 85]
  };

  const experience = [
    {
      title: "Senior Software Engineer",
      company: "Tech Corp",
      period: "2022 - Present",
      description: "Leading development of cloud-based solutions"
    },
    {
      title: "Software Engineer",
      company: "StartUp Inc",
      period: "2020 - 2022",
      description: "Full-stack development and team collaboration"
    }
  ];

  const education = [
    {
      degree: "Master of Computer Science",
      school: "University of Technology",
      year: "2020"
    },
    {
      degree: "Bachelor of Engineering",
      school: "State University",
      year: "2018"
    }
  ];

  const skills = [
    "React", "TypeScript", "Node.js", "Python", "AWS",
    "Docker", "PostgreSQL", "GraphQL", "CI/CD"
  ];

  const languages = [
    { name: "English", level: "Native" },
    { name: "Spanish", level: "Professional" },
    { name: "French", level: "Intermediate" }
  ];

  const following = [
    { name: "Tech Innovators", type: "Company" },
    { name: "Design Masters", type: "Group" },
    { name: "AI Research", type: "Community" }
  ];

  return (
    <div className="min-h-screen bg-teal-50">
      {/* Header */}
      <header className="bg-teal-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Professional Network</h1>
            <div className="flex items-center gap-4">
              <button className="hover:bg-teal-700 px-4 py-2 rounded-lg transition">
                Home
              </button>
              <button className="hover:bg-teal-700 px-4 py-2 rounded-lg transition">
                Network
              </button>
              <button className="hover:bg-teal-700 px-4 py-2 rounded-lg transition">
                Messages
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-teal-300 via-teal-400 to-teal-500 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-md p-8">
            <div className="flex items-start gap-6">
              {profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt={profile.name}
                  className="w-32 h-32 rounded-full object-cover shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 bg-teal-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900">{profile.name}</h2>
                <p className="text-xl text-teal-600 mt-1">{profile.headline || 'Professional'}</p>
                <p className="text-gray-600 mt-2">{profile.location || 'Location not specified'}</p>
                {!isOwnProfile && (
                  <div className="flex gap-3 mt-4">
                    <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition">
                      Connect
                    </button>
                    <button className="border-2 border-teal-600 text-teal-600 hover:bg-teal-50 px-6 py-2 rounded-lg transition">
                      Message
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-3 space-y-6">
            {/* Profile Stats */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Analytics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-teal-600" />
                    <span className="text-gray-700">Profile Views</span>
                  </div>
                  <span className="font-bold text-teal-600">{profileStats.views}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-teal-600" />
                    <span className="text-gray-700">Connections</span>
                  </div>
                  <span className="font-bold text-teal-600">{profileStats.connections}</span>
                </div>
              </div>
            </div>

            {/* Profile Visits Graph */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-600" />
                Weekly Views
              </h3>
              <div className="flex items-end justify-between h-32 gap-2">
                {profileStats.profileVisits.map((value, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-teal-600 rounded-t-lg transition-all hover:bg-teal-700"
                      style={{ height: `${(value / 100) * 100}%` }}
                    ></div>
                    <span className="text-xs text-gray-500">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Following */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Following</h3>
              <div className="space-y-3">
                {following.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Panel */}
          <div className="col-span-6 space-y-6">
            {/* About */}
            {profile.bio && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">About</h3>
                <p className="text-gray-700 leading-relaxed">
                  {profile.bio}
                </p>
              </div>
            )}

            {/* Experience */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-teal-600" />
                Experience
              </h3>
              <div className="space-y-6">
                {experience.map((exp, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-6 h-6 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{exp.title}</h4>
                      <p className="text-teal-600 font-medium">{exp.company}</p>
                      <p className="text-sm text-gray-500 mt-1">{exp.period}</p>
                      <p className="text-gray-700 mt-2">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-teal-600" />
                Education
              </h3>
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                      <p className="text-teal-600 font-medium">{edu.school}</p>
                      <p className="text-sm text-gray-500 mt-1">{edu.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="col-span-3 space-y-6">
            {/* Skills */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-teal-600" />
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-teal-50 text-teal-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-teal-100 transition cursor-pointer"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-teal-600" />
                Languages
              </h3>
              <div className="space-y-3">
                {languages.map((lang, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-900 font-medium">{lang.name}</span>
                    <span className="text-sm text-teal-600 font-medium">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Completeness */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Strength</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Completeness</span>
                  <span className="text-teal-600 font-bold">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-teal-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Add 3 more skills to reach All-Star level
                </p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recommendations</h3>
              <div className="space-y-3">
                <div className="p-3 bg-teal-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    "Jane is an exceptional engineer with strong problem-solving skills."
                  </p>
                  <p className="text-xs text-teal-600 mt-2 font-medium">- John Smith, CTO</p>
                </div>
                <div className="p-3 bg-teal-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    "Great team player and mentor. Highly recommended!"
                  </p>
                  <p className="text-xs text-teal-600 mt-2 font-medium">- Sarah Lee, Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}