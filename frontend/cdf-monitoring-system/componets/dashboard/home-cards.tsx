const HomeCards = () => {
  const cardData = [
    {
      title: "Youth and Women Empowerment",
      icon: (
        <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 0a5 5 0 00-5 5c0 1.657.895 3.104 2.21 3.9A6.986 6.986 0 005 12c0 1.657.895 3.104 2.21 3.9A5.002 5.002 0 0010 20a5 5 0 000-10 5 5 0 100-10z" />
        </svg>
      ),
      link: "projects",
    },
    {
      title: "Education and Skills Development",
      icon: (
        <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 5l8-3 8 3v2l-8 3-8-3V5zm0 5l8 3 8-3v2l-8 3-8-3v-2zm0 5l8 3 8-3v2l-8 3-8-3v-2z" />
        </svg>
      ),
      link: "projects",
    },
    {
      title: "Other Support",
      icon: (
        <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a6 6 0 00-6 6v4H2l3 3 3-3H6V8a4 4 0 118 0v4h-2l3 3 3-3h-2V8a6 6 0 00-6-6z" />
        </svg>
      ),
      link: "projects",
    },
    {
      title: "Community Projects",
      icon: (
        <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 7H7v6h6V7zM2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
        </svg>
      ),
      link: "projects",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cardData.map((item, index) => (
        <a
          key={index}
          href={item.link}
          className="bg-orange-400 rounded-lg shadow hover:shadow-lg transition-shadow p-6 flex flex-col"
        >
          <div className="mb-4">{item.icon}</div>
          <h3 className="font-bold text-white mb-2">{item.title}</h3>
        </a>
      ))}
    </div>
  );
};

export default HomeCards;
