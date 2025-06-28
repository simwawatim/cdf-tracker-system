"use client";

import { useEffect, useState } from "react";
import { getAuthHeaders } from "../utils/users-auth";

const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

interface Category {
  id: string;
  name: string;
}

const SideNav = () => {
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        const res = await fetch(
          "http://127.0.0.1:8000/api/v1/get_category_by_name/",
          getAuthHeaders()
        );
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategoryList(data);
      } catch (error) {
        console.error("Failed to fetch category list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryList();
  }, []);

  const navLinkClass =
    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors";

  return (
    <aside className="w-full max-w-xs bg-white shadow-xl rounded-xl p-4 flex flex-col">
      <h2 className="text-xl font-bold text-slate-800 mb-4 px-2">Navigation</h2>
      <nav className="flex-grow space-y-2">
        {/* Static Links */}
        <a href="/users" className={navLinkClass}>
          👤 Users
        </a>
        <a href="/project-category" className={navLinkClass}>
          🗂 Project Category
        </a>

        <hr className="my-3 border-slate-200" />

        {/* Dynamic Categories */}
        {!loading && categoryList.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase px-2 mb-2">
              Categories
            </h3>
            <ul className="space-y-1">
              {categoryList.map((category) => (
                <li key={category.id}>
                  <a
                    href={`/project-based-on-category/${category.id}`}
                    className="block px-4 py-2 rounded-md text-sm text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-all break-words"
                  >
                    {capitalize(category.name)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default SideNav;
