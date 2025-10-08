import Link from 'next/link'
import { FaSearch, FaUsers, FaGlobe, FaCheckCircle, FaStar, FaHandshake } from 'react-icons/fa'

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Connect Kenyan Talent with Global Opportunities
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Discover hardworking, skilled professionals from Kenya ready to transform your business
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register?type=jobseeker"
                className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
              >
                I'm Looking for Work
              </Link>
              <Link
                href="/auth/register?type=employer"
                className="bg-primary-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-800 transition border-2 border-white"
              >
                I'm Hiring
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Kenyan Talent?
            </h2>
            <p className="text-xl text-gray-600">
              Renowned globally for exceptional work ethic and dedication
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <FaStar className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Exceptional Work Ethic</h3>
              <p className="text-gray-600">
                Kenyan professionals are known worldwide for their dedication, reliability, and commitment to excellence.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <FaGlobe className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Global Mindset</h3>
              <p className="text-gray-600">
                With strong English proficiency and cultural awareness, Kenyan workers seamlessly integrate into international teams.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <FaHandshake className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Cost-Effective</h3>
              <p className="text-gray-600">
                Access top-tier talent at competitive rates while supporting economic growth in Kenya.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* For Job Seekers */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">For Job Seekers</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Create Your Profile</h4>
                    <p className="text-gray-600">Showcase your skills, experience, and portfolio</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Browse Opportunities</h4>
                    <p className="text-gray-600">Find jobs from employers worldwide</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Apply & Connect</h4>
                    <p className="text-gray-600">Submit applications and communicate directly with employers</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Start Working</h4>
                    <p className="text-gray-600">Begin your journey with international employers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Employers */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">For Employers</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Post a Job</h4>
                    <p className="text-gray-600">Describe your requirements and ideal candidate</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Review Applications</h4>
                    <p className="text-gray-600">Browse qualified Kenyan professionals</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Interview Candidates</h4>
                    <p className="text-gray-600">Connect with top talent through our platform</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Hire & Grow</h4>
                    <p className="text-gray-600">Build your team with exceptional talent</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">10,000+</div>
              <div className="text-xl text-primary-100">Skilled Professionals</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-xl text-primary-100">Global Companies</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">95%</div>
              <div className="text-xl text-primary-100">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of successful connections between Kenyan talent and global employers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition"
            >
              Create Free Account
            </Link>
            <Link
              href="/about"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition border-2 border-primary-600"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FaGlobe className="text-primary-500 text-2xl" />
                <span className="text-xl font-bold">JobsAbroad</span>
              </div>
              <p className="text-gray-400">
                Connecting Kenyan talent with global opportunities.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">For Job Seekers</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/jobs" className="hover:text-white">Browse Jobs</Link></li>
                <li><Link href="/auth/register?type=jobseeker" className="hover:text-white">Create Profile</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">For Employers</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/talent" className="hover:text-white">Find Talent</Link></li>
                <li><Link href="/auth/register?type=employer" className="hover:text-white">Post a Job</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 JobsAbroad. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

