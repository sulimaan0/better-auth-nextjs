import {
  Sparkles,
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">Scrubly</span>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Professional cleaning services you can trust. Making homes
              spotless, one booking at a time.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-slate-400 hover:text-violet-400 cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-slate-400 hover:text-violet-400 cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-slate-400 hover:text-violet-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#" className="hover:text-violet-400 transition-colors">
                  Standard Cleaning
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-violet-400 transition-colors">
                  Deep Cleaning
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-violet-400 transition-colors">
                  Move-In/Out
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-violet-400 transition-colors">
                  Post-Construction
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-violet-400 transition-colors">
                  Office Cleaning
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#" className="hover:text-violet-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-violet-400 transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-violet-400 transition-colors">
                  Insurance
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-violet-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-violet-400 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <div className="space-y-3 text-slate-400">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4" />
                <span>0800 123 CLEAN</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4" />
                <span>hello@scrubly.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4" />
                <span>Available across the UK</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-12 pt-8 text-center text-slate-400">
          <p>
            &copy; 2024 Scrubly. All rights reserved. | Licensed, Bonded &
            Insured
          </p>
        </div>
      </div>
    </footer>
  );
}
