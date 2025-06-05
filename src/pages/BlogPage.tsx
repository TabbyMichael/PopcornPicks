import React from 'react';

const BlogPage: React.FC = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Top 10 Movies to Watch This Summer",
      date: "July 26, 2024",
      author: "Jane Doe",
      excerpt: "Discover the must-see films that will make your summer unforgettable.",
      imageUrl: "https://via.placeholder.com/400x200",
    },
    {
      id: 2,
      title: "The Evolution of Sci-Fi Cinema",
      date: "July 20, 2024",
      author: "John Smith",
      excerpt: "A deep dive into how science fiction movies have changed over the decades.",
      imageUrl: "https://via.placeholder.com/400x200",
    },
    {
      id: 3,
      title: "Behind the Scenes: Making of a Blockbuster",
      date: "July 15, 2024",
      author: "Emily White",
      excerpt: "An exclusive look at the challenges and triumphs of creating a major film.",
      imageUrl: "https://via.placeholder.com/400x200",
    },
  ];

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">Our Blog</h1>
        <p className="mt-5 text-xl text-gray-500">Stay updated with the latest news, reviews, and insights from the world of cinema.</p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        {blogPosts.map((post) => (
          <div key={post.id} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
            <div className="flex-shrink-0">
              <img className="h-48 w-full object-cover" src={post.imageUrl} alt={post.title} />
            </div>
            <div className="flex-1 bg-white p-6 flex flex-col justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-indigo-600">
                  <a href="#" className="hover:underline">Article</a>
                </p>
                <a href="#" className="block mt-2">
                  <p className="text-xl font-semibold text-gray-900">{post.title}</p>
                  <p className="mt-3 text-base text-gray-500">{post.excerpt}</p>
                </a>
              </div>
              <div className="mt-6 flex items-center">
                <div className="flex-shrink-0">
                  <a href="#">
                    <span className="sr-only">{post.author}</span>
                    <img className="h-10 w-10 rounded-full" src="https://via.placeholder.com/150" alt="" />
                  </a>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    <a href="#" className="hover:underline">{post.author}</a>
                  </p>
                  <div className="flex space-x-1 text-sm text-gray-500">
                    <time dateTime={post.date}>{post.date}</time>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;