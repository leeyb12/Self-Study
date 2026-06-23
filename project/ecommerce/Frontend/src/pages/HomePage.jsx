import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProducts, searchProducts, getByCategory } from '../api/products';
import { getCategories } from '../api/categories';
import Pagination from '../components/Pagination';

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');

  const selectedCategory = searchParams.get('category') || '';
  const currentPage = Number(searchParams.get('page') || 0);

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page: currentPage, size: 20 };
    const kw = searchParams.get('keyword') || '';
    const cat = searchParams.get('category') || '';

    const fetch = kw
      ? searchProducts(kw, params)
      : cat
      ? getByCategory(cat, params)
      : getProducts(params);

    fetch
      .then((res) => {
        setProducts(res.data?.content || []);
        setPageInfo({ page: res.data?.page ?? 0, totalPages: res.data?.totalPages ?? 1 });
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(keyword ? { keyword } : {});
  };

  const handleCategory = (catId) => {
    setKeyword('');
    setSearchParams(catId ? { category: catId } : {});
  };

  const handlePage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', p);
    setSearchParams(next);
  };

  return (
    <div className="page">
      <div className="home-search-bar">
        <form onSubmit={handleSearch} className="search-form">
          <input
            className="form-input search-input"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="상품 검색..."
          />
          <button className="btn btn--primary" type="submit">검색</button>
        </form>
      </div>

      <div className="home-layout">
        <aside className="category-sidebar">
          <h3 className="sidebar-title">카테고리</h3>
          <button
            className={`category-item ${!selectedCategory ? 'category-item--active' : ''}`}
            onClick={() => handleCategory('')}
          >
            전체
          </button>
          {categories.map((c) => (
            <button
              key={c.categoryId}
              className={`category-item ${selectedCategory === String(c.categoryId) ? 'category-item--active' : ''}`}
              onClick={() => handleCategory(c.categoryId)}
            >
              {c.name}
            </button>
          ))}
        </aside>

        <section className="product-section">
          {loading ? (
            <div className="loading">불러오는 중...</div>
          ) : products.length === 0 ? (
            <div className="empty">상품이 없습니다.</div>
          ) : (
            <div className="product-grid">
              {products.map((p) => (
                <Link key={p.productId} to={`/products/${p.productId}`} className="product-card">
                  <div className="product-card-img">📦</div>
                  <div className="product-card-body">
                    <p className="product-card-category">{p.categoryName}</p>
                    <h3 className="product-card-name">{p.name}</h3>
                    <div className="product-card-footer">
                      <span className="product-card-price">{p.price?.toLocaleString()}원</span>
                      {p.averageRating && (
                        <span className="product-card-rating">⭐ {p.averageRating.toFixed(1)}</span>
                      )}
                    </div>
                    <span className={`badge ${p.status === 'ON_SALE' ? 'badge--green' : 'badge--gray'}`}>
                      {p.status === 'ON_SALE' ? '판매중' : '품절'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <Pagination page={pageInfo.page} totalPages={pageInfo.totalPages} onPageChange={handlePage} />
        </section>
      </div>
    </div>
  );
}
