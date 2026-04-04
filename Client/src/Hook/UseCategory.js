import { useState, useEffect } from "react";
import axios from "axios";

export default function useCategory() {
  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    try {
      const { data } = await axios.get(
        "https://watchecom-backend.onrender.com/api/auth/category/getall-category"
      );

      console.log("Fetched categories:", data);

      // ✅ FIXED LINE
      setCategories(data?.category || []);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return categories;
}