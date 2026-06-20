'use client';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

const sections = [
  {
    title: '1. Acceptance of Terms',
    body: 'By accessing or using the ShopSphere website, mobile app, or any related services, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, you must not use our services. We reserve the right to modify these terms at any time with reasonable notice.',
  },
  {
    title: '2. Account Registration',
    body: 'You must be at least 18 years old to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorised use of your account. We reserve the right to terminate accounts that violate these terms.',
  },
  {
    title: '3. Products & Pricing',
    body: 'All product descriptions, images, and prices are as accurate as possible. We reserve the right to correct any errors and to change prices without notice. Prices are displayed in USD and may vary by region. We are not responsible for typographical errors. Product availability is subject to change.',
  },
  {
    title: '4. Orders & Payment',
    body: 'Placing an order constitutes an offer to purchase. We reserve the right to refuse or cancel any order for reasons including product unavailability, pricing errors, or suspected fraud. Payment is required in full at the time of purchase. We accept major credit cards, PayPal, and other listed payment methods. All transactions are encrypted and secure.',
  },
  {
    title: '5. Shipping & Delivery',
    body: 'Delivery times are estimates and not guaranteed. ShopSphere is not responsible for delays caused by carriers, customs, or events beyond our control. Risk of loss and title for items pass to you upon delivery to the carrier. For lost or damaged shipments, please contact us within 7 days of the expected delivery date.',
  },
  {
    title: '6. Returns & Refunds',
    body: 'Our return policy allows returns within 30 days of delivery for eligible items. Refunds are issued to the original payment method within 5–10 business days of receiving your return. Items must be unused and in original packaging. Certain items are non-returnable as described in our Return Policy.',
  },
  {
    title: '7. Intellectual Property',
    body: 'All content on ShopSphere, including text, graphics, logos, images, and software, is the property of ShopSphere or its licensors and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without express written permission.',
  },
  {
    title: '8. User Conduct',
    body: 'You agree not to use our services for any unlawful purpose, to transmit harmful content, to attempt to gain unauthorised access to our systems, to scrape or harvest data, or to interfere with the normal operation of the website. Violations may result in immediate account termination and legal action.',
  },
  {
    title: '9. Limitation of Liability',
    body: 'To the maximum extent permitted by law, ShopSphere shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of our services, even if advised of the possibility of such damages. Our total liability to you shall not exceed the amount paid for the specific order giving rise to the claim.',
  },
  {
    title: '10. Governing Law',
    body: 'These Terms shall be governed by and construed in accordance with the laws of the State of New York, USA, without regard to conflict of law principles. Any disputes shall be resolved exclusively in the state or federal courts located in New York County, and you consent to personal jurisdiction in such courts.',
  },
  {
    title: '11. Contact',
    body: 'For questions about these Terms of Service, contact our legal team at legal@shopsphere.com or write to ShopSphere, 123 Commerce Ave, Suite 400, New York, NY 10001.',
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-purple-700 to-indigo-700 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText size={26} className="text-white" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl font-black text-white mb-3">Terms of Service</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-purple-200 text-sm">Effective date: January 1, 2026 · Last updated: June 1, 2026</motion.p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-sm text-gray-500 leading-relaxed">
            These Terms of Service (&quot;Terms&quot;) govern your access to and use of the ShopSphere website, applications, and services. Please read these Terms carefully before using our services.
          </p>
        </motion.div>

        {sections.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-3">{s.title}</h2>
            <p className="text-sm text-gray-500 leading-relaxed">{s.body}</p>
          </motion.div>
        ))}

        <p className="text-center text-sm text-gray-400 pt-2">
          Questions? <a href="/contact" className="text-purple-600 font-semibold hover:underline">Contact us →</a>
        </p>
      </div>
    </div>
  );
}
