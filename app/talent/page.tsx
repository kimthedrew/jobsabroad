import Link from 'next/link'
import { FaUserGraduate, FaCode, FaPaintBrush, FaBullhorn, FaChartLine, FaPenNib } from 'react-icons/fa'

export default function Talent() {
  const categories = [
    {
      icon: FaCode,
      title: 'Technology',
      description: 'Software developers, DevOps engineers, data scientists, and IT professionals',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: FaPaintBrush,
      title: 'Design',
      description: 'UI/UX designers, graphic designers, illustrators, and creative professionals',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: FaBullhorn,
      title: 'Marketing',
      description: 'Digital marketers, content strategists, SEO specialists, and brand managers',
      color: 'bg-pink-100 text-pink-600',
    },
    {
      icon: FaChartLine,
      title: 'Business & Finance',
      description: 'Accountants, financial analysts, business consultants, and project managers',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: FaPenNib,
      title: 'Writing & Content',
      description: 'Content writers, copywriters, editors, and technical writers',
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      icon: FaUserGraduate,
      title: 'Customer Support',
      description: 'Customer service representatives, support specialists, and success managers',
      color: 'bg-red-100 text-red-600',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Find Exceptional Kenyan Talent
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Access a pool of skilled, dedicated professionals ready to contribute to your success
            </p>
            <Link
              href="/auth/register?type=employer"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
            >
              Start Hiring Today
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Talent Across All Industries
            </h2>
            <p className="text-xl text-gray-600">
              Find the right professionals for your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div key={index} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-primary-300 hover:shadow-lg transition">
                <div className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
                  <category.icon className="text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{category.title}</h3>
                <p className="text-gray-600">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Why Hire Through JobsAbroad?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Pre-Vetted Talent</h3>
              <p className="text-gray-600">
                All professionals on our platform are verified and screened to ensure quality and reliability.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Hiring Process</h3>
              <p className="text-gray-600">
                Post a job, review applications, and hire within days. Our streamlined process saves you time.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Support & Security</h3>
              <p className="text-gray-600">
                Our team provides ongoing support to ensure successful placements and working relationships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Create Account</h3>
              <p className="text-gray-600">Sign up as an employer in minutes</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Post a Job</h3>
              <p className="text-gray-600">Describe your requirements and ideal candidate</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Review Candidates</h3>
              <p className="text-gray-600">Browse applications from qualified professionals</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Hire & Grow</h3>
              <p className="text-gray-600">Build your team with exceptional talent</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Hire Amazing Talent?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join hundreds of companies finding their perfect team members
          </p>
          <Link
            href="/auth/register?type=employer"
            className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  )
}

