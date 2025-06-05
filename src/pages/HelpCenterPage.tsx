import React from 'react';

const HelpCenterPage: React.FC = () => {
  const faqs = [
    {
      question: "How do I create an account?",
      answer: "You can create an account by clicking on the 'Sign In' button in the navigation bar and then selecting the 'Sign Up' option. Follow the prompts to enter your details and create your profile.",
    },
    {
      question: "How can I search for movies?",
      answer: "Use the search bar at the top of the page to find movies by title, genre, or actors. Our powerful search engine will help you discover exactly what you're looking for.",
    },
    {
      question: "Can I create a watchlist?",
      answer: "Yes, once you're logged in, you can add movies to your personal watchlist. Simply click the 'Add to Watchlist' button on any movie's detail page.",
    },
    {
      question: "How do movie recommendations work?",
      answer: "Our recommendation engine uses your viewing history and ratings to suggest movies you might enjoy. The more you interact with the platform, the better our recommendations become.",
    },
    {
      question: "Is PopcornPicks free to use?",
      answer: "Yes, PopcornPicks is completely free to use. We offer a wide range of features and content without any subscription fees.",
    },
  ];

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">Help Center</h1>
        <p className="mt-5 text-xl text-gray-500">Find answers to your most common questions about PopcornPicks.</p>
      </div>

      <div className="mt-12 max-w-3xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <dl className="space-y-8 divide-y divide-gray-200">
              {faqs.map((faq, index) => (
                <div key={index} className="pt-6">
                  <dt className="text-lg leading-6 font-medium text-gray-900">
                    {faq.question}
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
        <p className="text-lg text-gray-700">
          If you can't find the answer you're looking for, feel free to <a href="/contact" className="text-blue-600 hover:underline">contact us directly</a>.
        </p>
      </div>
    </div>
  );
};

export default HelpCenterPage;