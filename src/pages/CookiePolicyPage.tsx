import React from 'react';

const CookiePolicyPage: React.FC = () => {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">Cookie Policy</h1>
        <p className="mt-5 text-xl text-gray-500">Our Cookie Policy explains what cookies are, how We use cookies, how third-parties We may partner with may use cookies on the Service, Your choices regarding cookies and further information about cookies.</p>
      </div>

      <div className="mt-12 max-w-3xl mx-auto bg-white shadow overflow-hidden sm:rounded-lg p-6 prose prose-lg text-gray-500">
        <p>
          Cookies are small pieces of text sent by your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third-party to recognize you and make your next visit easier and the Service more useful to you.
        </p>
        <p>
          Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your personal computer or mobile device when you go offline, while session cookies are deleted as soon as you close your web browser.
        </p>
        <h2>How PopcornPicks uses cookies</h2>
        <p>
          When you use and access the Service, We may place a number of cookies files in your web browser.
        </p>
        <p>
          We use cookies for the following purposes:
        </p>
        <ul>
          <li>To enable certain functions of the Service</li>
          <li>To provide analytics</li>
          <li>To store your preferences</li>
          <li>To enable advertisements delivery, including behavioral advertising</li>
        </ul>
        <p>
          We use both session and persistent cookies on the Service and We use different types of cookies to run the Service:
        </p>
        <ul>
          <li>
            <strong>Essential cookies.</strong> We may use essential cookies to authenticate users and prevent fraudulent use of accounts.
          </li>
          <li>
            <strong>Analytics cookies.</strong> We may use analytics cookies to track information how the Service is used so that we can make improvements. We may also use analytics cookies to test new advertisements, pages, features or new functionality of the Service to see how our users react to them.
          </li>
          <li>
            <strong>Advertising cookies.</strong> These cookies are used to display advertisements that are more relevant to you and your interests. They are also used to limit the number of times you see an advertisement and help measure the effectiveness of advertising campaigns. They remember that you have visited a website and this information may be shared with other organizations such as advertisers. Often they are linked to site functionality provided by the other organization.
          </li>
        </ul>
        <h2>Third-party cookies</h2>
        <p>
          In addition to Our own cookies, we may also use various third-parties cookies to report usage statistics of the Service, deliver advertisements on and through the Service, and so on.
        </p>
        <h2>What are your choices regarding cookies?</h2>
        <p>
          If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser.
        </p>
        <ul>
          <li>
            For the Chrome web browser, please visit this page from Google:
            <a href="https://support.google.com/accounts/answer/32050" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              https://support.google.com/accounts/answer/32050
            </a>
          </li>
          <li>
            For the Internet Explorer web browser, please visit this page from Microsoft:
            <a href="http://support.microsoft.com/kb/278835" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              http://support.microsoft.com/kb/278835
            </a>
          </li>
          <li>
            For the Firefox web browser, please visit this page from Mozilla:
            <a href="https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored
            </a>
          </li>
          <li>
            For the Safari web browser, please visit this page from Apple:
            <a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac
            </a>
          </li>
        </ul>
        <p>
          For any other web browser, please visit your web browser's official web pages.
        </p>
        <h2>Where can you find more information about cookies?</h2>
        <p>
          You can learn more about cookies here:
          <a href="https://www.privacypolicies.com/blog/cookies/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            All About Cookies by PrivacyPolicies.com
          </a>.
        </p>
        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Cookie Policy, You can contact us:
        </p>
        <ul>
          <li>By email: cookies@popcornpicks.com</li>
        </ul>
      </div>
    </div>
  );
};

export default CookiePolicyPage;