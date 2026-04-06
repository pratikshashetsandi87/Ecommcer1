import { useState, useEffect } from "react";
import api from "../api";

export default function useCategory() {
  const [categories, setCategories] = useState(null);

  const getCategories = async () => {
    try {
      const { data } = await api.get("/category/getall-category");

      console.log("Fetched categories:", data);

      if (data?.success) {
        setCategories(data.categories || []);
      } else {
        setCategories([]);
      }

    } catch (error) {
      console.log("Category Error:", error);
      setCategories([]);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return categories;
}
