'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export function AutocompleteSearch({ isMobile, categories = [] }: { isMobile: boolean, categories?: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLFormElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced API fetch
  useEffect(() => {
    if (searchQuery.trim().length < 1) {
      setSuggestions([]);
      setIsDropdownOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        if (data.suggestions?.length > 0) {
          setSuggestions(data.suggestions);
          setIsDropdownOpen(true);
        } else {
          setSuggestions([]);
          setIsDropdownOpen(false);
        }
      } catch (error) {
        console.error("Failed to fetch suggestions");
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() || selectedCategory) {
      setIsDropdownOpen(false);
      let url = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      if (selectedCategory) {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }
      router.push(url);
    }
  };

  // The dropdown UI component
  const DropdownUI = () => (
    isDropdownOpen && suggestions.length > 0 ? (
      <div className="search-dropdown-wrapper">
        {suggestions.map((item) => (
          <Link 
            key={item.id} 
            href={`/product/${item.slug}`} 
            className="search-suggestion-item"
            onClick={() => {
              setIsDropdownOpen(false);
              setSearchQuery("");
            }}
          >
            <Image src={item.mainImage || 'https://images.unsplash.com/photo-1596700540445-5f333fb9e9f1?w=48'} alt={item.title} width={48} height={48} className="search-suggestion-img" style={{ objectFit: 'cover' }} />
            <div className="search-suggestion-content">
              <h4 className="search-suggestion-title">{item.title}</h4>
              <div className="search-suggestion-price">${Number(item.basePrice).toFixed(2)}</div>
            </div>
          </Link>
        ))}
      </div>
    ) : null
  );

  if (isMobile) {
    return (
      <form className="mobile-header-search" onSubmit={handleSearch} ref={searchRef} style={{ position: 'relative', zIndex: 100 }}>
        <div className="mobile-search-box">
          <input 
            type="text" 
            className="mobile-search-input" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => { if (suggestions.length > 0) setIsDropdownOpen(true); }}
          />
          <button type="submit" className="mobile-search-btn" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
        </div>
        <DropdownUI />
      </form>
    );
  }

  return (
    <form className="mega-search-container" onSubmit={handleSearch} ref={searchRef} style={{ position: 'relative', overflow: 'visible', zIndex: 100 }}>
      <select 
        className="mega-search-select" 
        style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px', maxWidth: '160px', textOverflow: 'ellipsis' }}
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        aria-label="Search Category"
      >
        <option value="">All</option>
        {categories.map((cat: any) => (
          <React.Fragment key={cat.id}>
            <option value={cat.slug}>{cat.name}</option>
            {cat.children?.map((child: any) => (
              <React.Fragment key={child.id}>
                <option value={child.slug}>
                  &nbsp;&nbsp;&nbsp;{child.name}
                </option>
                {child.children?.map((subChild: any) => (
                  <option key={subChild.id} value={subChild.slug}>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{subChild.name}
                  </option>
                ))}
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
      </select>
      <input 
        type="text" 
        className="mega-search-input" 
        placeholder="Search for products, brands, and more..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => { if (suggestions.length > 0) setIsDropdownOpen(true); }}
      />
      <button type="submit" className="mega-search-button" aria-label="Search" style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      </button>
      <DropdownUI />
    </form>
  );
}
