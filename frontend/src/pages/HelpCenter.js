import { useState } from "react";
import { Search, ChevronDown, ChevronUp, BookOpen, CreditCard, User } from "react-feather";
import "./HelpCenter.css";

const faqData = [
  // Course Enrollment Help
  {
    category: "enrollment",
    categoryLabel: "Course Enrollment Help",
    icon: <BookOpen size={18} />,
    q: "How do I enroll in a course?",
    a: "Browse the course list by clicking the 'Courses' page, choose your desired course, and click 'Enroll Now'. Fill out the checkout payment form, and you will be immediately enrolled and redirected to the classroom."
  },
  {
    category: "enrollment",
    categoryLabel: "Course Enrollment Help",
    icon: <BookOpen size={18} />,
    q: "Can I enroll in multiple courses?",
    a: "Yes! There are no limits to how many courses you can enroll in at the same time. All your enrolled courses can be viewed directly on the Courses page with a 'Go To Classroom' option."
  },
  {
    category: "enrollment",
    categoryLabel: "Course Enrollment Help",
    icon: <BookOpen size={18} />,
    q: "Where do I access my classroom materials after enrollment?",
    a: "Simply go to the 'Courses' page. Any course you are enrolled in will display a green 'Go To Classroom' button. Clicking it opens the secure classroom containing the video player and downloadable lecture notes."
  },

  // Payment Help
  {
    category: "payment",
    categoryLabel: "Payment & Checkout Help",
    icon: <CreditCard size={18} />,
    q: "What payment methods are supported?",
    a: "We support major Credit and Debit Cards (Visa, MasterCard), Bank Transfers, and Cash Payments. Free courses do not require payment and are processed instantly."
  },
  {
    category: "payment",
    categoryLabel: "Payment & Checkout Help",
    icon: <CreditCard size={18} />,
    q: "Are credit card details stored securely?",
    a: "Absolutely. We do not store full credit card details on our servers. Transactions are securely processed, and only masked summaries are saved for receipts."
  },
  {
    category: "payment",
    categoryLabel: "Payment & Checkout Help",
    icon: <CreditCard size={18} />,
    q: "Can I request a refund for a course?",
    a: "Refunds are eligible within 7 days of enrollment, provided you have not completed more than 10% of the course videos or downloaded any notes materials. Contact support for refund queries."
  },

  // Account Management Help
  {
    category: "account",
    categoryLabel: "Account Management Help",
    icon: <User size={18} />,
    q: "How do I register a new account?",
    a: "Click 'Register' at the top-right navigation bar, fill out your Name, Email, Phone Number, and password, and click submit. You can then log in using your email and password."
  },
  {
    category: "account",
    categoryLabel: "Account Management Help",
    icon: <User size={18} />,
    q: "What should I do if I forget my password?",
    a: "If you forget your password, click on the forgot password link in the login form, or contact support at support@tledu.com for account recovery procedures."
  },
  {
    category: "account",
    categoryLabel: "Account Management Help",
    icon: <User size={18} />,
    q: "Can I share my account with others?",
    a: "No, account sharing is strictly prohibited under our Terms and Conditions. Sharing accounts may lead to temporary suspension or permanent restrictions."
  }
];

function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleFAQ = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const filteredFaqs = faqData.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group filtered faqs by category
  const categories = ["enrollment", "payment", "account"];
  const categoryLabels = {
    enrollment: "Course Enrollment Help",
    payment: "Payment & Billing",
    account: "Account Management Help"
  };
  const categoryIcons = {
    enrollment: <BookOpen className="cat-icon" />,
    payment: <CreditCard className="cat-icon" />,
    account: <User className="cat-icon" />
  };

  return (
    <div className="help-center-container">
      {/* Banner */}
      <div className="help-banner">
        <h1>Help Center</h1>
        <p>Search questions, troubleshoot settings, and learn how to use the platform.</p>
        
        {/* Search */}
        <div className="search-bar-wrapper">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Type your question here..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="help-content-wrapper">
        {searchQuery && filteredFaqs.length === 0 ? (
          <div className="no-faqs-found">
            <h3>No results found for "{searchQuery}"</h3>
            <p>Try searching using different keywords, or contact our support team directly.</p>
          </div>
        ) : (
          categories.map((cat) => {
            const catFaqs = filteredFaqs.filter((f) => f.category === cat);
            if (catFaqs.length === 0) return null;

            return (
              <section className="faq-category-section" key={cat}>
                <div className="category-header">
                  {categoryIcons[cat]}
                  <h2>{categoryLabels[cat]}</h2>
                </div>

                <div className="faq-list">
                  {catFaqs.map((faq, idx) => {
                    const globalIdx = faqData.findIndex((fd) => fd.q === faq.q);
                    const isOpen = expandedIndex === globalIdx;

                    return (
                      <div 
                        className={`faq-item ${isOpen ? "open" : ""}`} 
                        key={globalIdx}
                        onClick={() => toggleFAQ(globalIdx)}
                      >
                        <div className="faq-question-row">
                          <span className="faq-question">{faq.q}</span>
                          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                        {isOpen && (
                          <div className="faq-answer-row">
                            <p>{faq.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}

export default HelpCenter;
