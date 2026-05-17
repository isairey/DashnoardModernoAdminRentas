import { Link } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to="/customer/orders"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>

        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms & Conditions</h1>
          <p className="text-gray-600">Last updated: February 1, 2026</p>
        </div>

        {/* Content */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-8">
          {/* Introduction */}
          <section>
            <p className="text-gray-700 leading-relaxed">
              Welcome to RentalHub. By accessing and using our rental services, you agree to be bound by these Terms and Conditions. 
              Please read them carefully before placing any rental orders.
            </p>
          </section>

          {/* 1. Rental Agreement */}
          <section>
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Rental Agreement</h2>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start gap-2">
                    <FiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Rental Period:</strong> All rentals are subject to the agreed rental period specified at the time of booking. 
                      The rental period begins from the pickup/delivery time and ends at the return time.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <FiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Extensions:</strong> If you wish to extend your rental period, you must contact us at least 24 hours before 
                      the scheduled return date. Extensions are subject to availability and additional charges.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <FiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Early Returns:</strong> Early returns do not qualify for refunds unless otherwise specified in writing. 
                      The full rental amount for the agreed period will be charged.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Payment Terms */}
          <section>
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-bold text-sm">2</span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Payment Terms</h2>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start gap-2">
                    <FiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Payment Methods:</strong> We accept credit cards, debit cards, UPI, net banking, and digital wallets. 
                      Full payment must be made at the time of booking to confirm your rental.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <FiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Security Deposit:</strong> A refundable security deposit may be required for certain high-value items. 
                      The deposit will be refunded within 7-10 business days after the item is returned in good condition.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <FiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Late Fees:</strong> Late returns will incur additional charges of 150% of the daily rental rate for each day 
                      or part thereof that the item is overdue.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Product Condition & Responsibility */}
          <section>
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <span className="text-emerald-600 font-bold text-sm">3</span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Product Condition & Responsibility</h2>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start gap-2">
                    <FiAlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Inspection:</strong> You are responsible for inspecting all rented items upon receipt. Any pre-existing 
                      damage must be reported within 2 hours of pickup/delivery, or you may be held liable for it.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <FiAlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Care & Maintenance:</strong> You must use the rented items with reasonable care and in accordance with 
                      their intended purpose. Any damage, loss, or theft during the rental period is your responsibility.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <FiAlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Damage Charges:</strong> You will be charged for any damage beyond normal wear and tear. Charges will be 
                      based on repair costs or replacement value, whichever is applicable.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Cancellation & Refund Policy */}
          <section>
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 font-bold text-sm">4</span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Cancellation & Refund Policy</h2>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start gap-2">
                    <FiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Cancellation by Customer:</strong> Cancellations made more than 48 hours before the rental start date 
                      will receive a full refund minus a 10% processing fee. Cancellations within 48 hours are non-refundable.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <FiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Cancellation by RentalHub:</strong> If we need to cancel your booking due to unforeseen circumstances, 
                      you will receive a full refund or the option to reschedule at no additional cost.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <FiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Refund Processing:</strong> Approved refunds will be processed within 7-10 business days to the original 
                      payment method used for the booking.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Delivery & Pickup */}
          <section>
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                <span className="text-pink-600 font-bold text-sm">5</span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Delivery & Pickup</h2>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start gap-2">
                    <FiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Delivery Service:</strong> We offer delivery and pickup services for an additional fee based on your location. 
                      Delivery times are estimates and may vary due to traffic or other factors.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <FiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Self-Pickup:</strong> If you choose to pick up items yourself, you must present valid government-issued 
                      photo ID and the booking confirmation at our location.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <FiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Return Requirements:</strong> All items must be returned clean and in the same condition as received. 
                      Cleaning fees may apply if items are returned excessively dirty.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6. Liability & Insurance */}
          <section>
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-indigo-600 font-bold text-sm">6</span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Liability & Insurance</h2>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start gap-2">
                    <FiAlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Customer Liability:</strong> You are fully responsible for any loss, theft, or damage to rented items 
                      during the rental period. We recommend obtaining appropriate insurance coverage.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <FiAlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Limitation of Liability:</strong> RentalHub is not liable for any indirect, incidental, or consequential 
                      damages arising from the use of rented items. Our liability is limited to the rental fee paid.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <FiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Optional Insurance:</strong> We offer optional damage protection plans for an additional fee. 
                      This coverage reduces your liability in case of accidental damage (terms apply).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Questions or Concerns?</h3>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms & Conditions, please contact us:
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Email:</strong> support@rentalhub.com</p>
              <p><strong>Phone:</strong> +91 1800-123-4567</p>
              <p><strong>Address:</strong> 123 Business Park, Mumbai, Maharashtra 400001, India</p>
            </div>
          </section>

          {/* Acceptance */}
          <section className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600 italic">
              By using RentalHub's services, you acknowledge that you have read, understood, and agree to be bound by these 
              Terms & Conditions. We reserve the right to modify these terms at any time, and continued use of our services 
              constitutes acceptance of any changes.
            </p>
          </section>
        </div>

        {/* Back to Orders Button */}
        <div className="mt-6 text-center">
          <Link
            to="/customer/orders"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to My Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
