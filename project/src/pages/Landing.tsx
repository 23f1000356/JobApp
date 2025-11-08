import { Link } from 'react-router-dom';
import { Search, Briefcase, PenTool, DollarSign, Users, Heart, Globe } from 'lucide-react';

export default function Landing() {
  const categories = [
    { icon: Briefcase, title: 'Software', count: '352 Jobs' },
    { icon: PenTool, title: 'Design', count: '158 Jobs' },
    { icon: DollarSign, title: 'Finance', count: '297 Jobs' },
    { icon: Users, title: 'HR', count: '124 Jobs' },
    { icon: Heart, title: 'Healthcare', count: '198 Jobs' },
    { icon: Globe, title: 'Marketing', count: '245 Jobs' },
  ];

  const featuredJobs = [
    {
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salary: '$120k - $180k',
      logo: '🏢',
    },
    {
      title: 'Product Designer',
      company: 'DesignHub',
      location: 'Remote',
      salary: '$90k - $130k',
      logo: '🎨',
    },
    {
      title: 'Marketing Manager',
      company: 'GrowthLabs',
      location: 'New York, NY',
      salary: '$85k - $110k',
      logo: '📈',
    },
    {
      title: 'Financial Analyst',
      company: 'Capital One',
      location: 'Chicago, IL',
      salary: '$75k - $95k',
      logo: '💰',
    },
    {
      title: 'HR Manager',
      company: 'PeopleFirst',
      location: 'Boston, MA',
      salary: '$80k - $100k',
      logo: '👥',
    },
    {
      title: 'Frontend Developer',
      company: 'WebTech Solutions',
      location: 'Remote',
      salary: '$90k - $120k',
      logo: '💻',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-xl">
                  C
                </div>
                <span className="text-xl font-bold text-gray-900">Connexus Jobs</span>
              </Link>
              <nav className="hidden md:ml-8 md:flex md:space-x-6">
                <Link to="/" className="text-gray-600 hover:text-teal-600">Home</Link>
                <Link to="/jobs" className="text-gray-600 hover:text-teal-600">Jobs</Link>
                <Link to="/companies" className="text-gray-600 hover:text-teal-600">Companies</Link>
                <Link to="/resources" className="text-gray-600 hover:text-teal-600">Resources</Link>
                <Link to="/contact" className="text-gray-600 hover:text-teal-600">Contact</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-teal-600 font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:from-teal-600 hover:to-teal-700 transition-all"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:pt-32 sm:pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute top-20 right-20 w-96 h-96 bg-teal-100/50 rounded-full blur-3xl"></div>
              <div className="absolute bottom-20 left-20 w-80 h-80 bg-teal-200/30 rounded-full blur-3xl"></div>
              <div className="relative">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                  The Easiest Way to Get Your New Job
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Find thousands of opportunities from verified companies and apply seamlessly.
                </p>
                <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Job Title or Keywords"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Location"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                    <select className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                      <option value="">Job Type</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="remote">Remote</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                  <button className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                    Search Jobs
                  </button>
                </div>
                <div className="mt-6">
                  <p className="text-sm text-gray-600 mb-2">Popular Searches:</p>
                  <div className="flex flex-wrap gap-2">
                    <button className="text-teal-600 hover:text-teal-700 text-sm">Software Engineer</button>
                    <span className="text-gray-300">•</span>
                    <button className="text-teal-600 hover:text-teal-700 text-sm">Product Manager</button>
                    <span className="text-gray-300">•</span>
                    <button className="text-teal-600 hover:text-teal-700 text-sm">Data Scientist</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src="/hero-illustration.svg"
                alt="Job Search Illustration"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-gray-600">Explore opportunities across different industries</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 transition-all hover:bg-teal-50 cursor-pointer"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                    <category.icon className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{category.title}</h3>
                    <p className="text-sm text-gray-500">{category.count}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Jobs of the Day</h2>
            <p className="text-gray-600">Search and connect with top organizations hiring today</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 transition-all border border-gray-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{job.logo}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{job.company}</h3>
                      <p className="text-sm text-gray-500">{job.location}</p>
                    </div>
                  </div>
                  <button className="text-teal-600 hover:text-teal-700">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
                <h4 className="font-medium text-lg text-gray-900 mb-2">{job.title}</h4>
                <p className="text-teal-600 font-medium mb-4">{job.salary}</p>
                <button className="w-full bg-teal-50 text-teal-600 py-2 rounded-lg font-medium hover:bg-teal-100 transition-colors">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-teal-500 to-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="text-center lg:text-left mb-8 lg:mb-0">
              <h2 className="text-3xl font-bold text-white mb-4">
                We Are Hiring! Join Our Network
              </h2>
              <p className="text-teal-50">
                Post your job and reach thousands of qualified candidates
              </p>
            </div>
            <button className="bg-white text-teal-600 px-8 py-3 rounded-lg font-medium hover:bg-teal-50 transition-colors">
              Post a Job
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">About Connexus</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-teal-600">About Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-teal-600">Careers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-teal-600">Press</a></li>
                <li><a href="#" className="text-gray-600 hover:text-teal-600">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">For Employers</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-teal-600">Post a Job</a></li>
                <li><a href="#" className="text-gray-600 hover:text-teal-600">Pricing</a></li>
                <li><a href="#" className="text-gray-600 hover:text-teal-600">Solutions</a></li>
                <li><a href="#" className="text-gray-600 hover:text-teal-600">Resources</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-teal-600">Help Center</a></li>
                <li><a href="#" className="text-gray-600 hover:text-teal-600">Guides</a></li>
                <li><a href="#" className="text-gray-600 hover:text-teal-600">Partners</a></li>
                <li><a href="#" className="text-gray-600 hover:text-teal-600">Developers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-teal-600">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-teal-600">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-teal-600">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-gray-200">
            <p className="text-gray-600">© 2025 Connexus Jobs — All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}