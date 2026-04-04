import React from 'react';

const Searchinput = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = async () => {
    try {
      const { data } = await axios.get(
        "https://watchecom-backend.onrender.com/api/auth/product/search",
        {
          params: { query: searchQuery }
        }
      );
      onSearch(data.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="search-input">
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default Searchinput;
