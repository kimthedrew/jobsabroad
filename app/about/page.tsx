import Link from 'next/link'
import { FaGlobe, FaHandshake, FaHeart, FaRocket } from 'react-icons/fa'

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About JobsAbroad
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
            Connecting talented Kenyan professionals with global opportunities
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              JobsAbroad was created to bridge the gap between exceptional Kenyan talent and employers 
              worldwide seeking dedicated, skilled professionals. We believe that Kenyan workers, 
              renowned for their strong work ethic and dedication, deserve access to global opportunities, 
              and employers worldwide deserve access to this incredible talent pool.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaGlobe className="text-primary-600 text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Global Reach</h3>
              <p className="text-gray-600">
                Connecting Kenya with the world
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHandshake className="text-primary-600 text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Trust</h3>
              <p className="text-gray-600">
                Building lasting professional relationships
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeart className="text-primary-600 text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Passion</h3>
              <p className="text-gray-600">
                Dedicated to empowering Kenyan talent
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaRocket className="text-primary-600 text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Growth</h3>
              <p className="text-gray-600">
                Creating opportunities for advancement
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Kenya Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Why Kenyan Talent?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Exceptional Work Ethic</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Kenyan professionals are globally recognized for their dedication, reliability, and 
                commitment to excellence. They bring a strong work ethic that drives results and 
                ensures project success.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">English Proficiency</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                With English as an official language and a key part of education, Kenyan professionals 
                communicate effectively with international teams and clients.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Quality Education</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Kenya has a robust education system producing skilled graduates in technology, 
                business, creative fields, and more.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Competitive Advantage</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Access top-tier talent at competitive rates while supporting economic growth 
                and creating meaningful employment opportunities in Kenya.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join our platform today and be part of this global movement
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register?type=jobseeker"
              className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition"
            >
              I'm Looking for Work
            </Link>
            <Link
              href="/auth/register?type=employer"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition border-2 border-primary-600"
            >
              I'm Hiring
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

