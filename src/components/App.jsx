import { useState, useEffect } from 'react';
import css from './App.module.css';

import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Modal } from './Modal/Modal';
import { Loader } from './Loader/Loader';
import { Button } from './Button/Button';

import { getImages } from 'services/api';

export const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [largeImgUrl, setLargeImgUrl] = useState('');
  const [isEmpty, setIsEmpty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    if (!searchQuery) {
      return;
    }
    getImages(searchQuery, page)
      .then(({ hits, totalHits }) => {
        setIsLoading(true);
        if (hits.length === 0) {
          setIsEmpty(true);
          return;
        }
        setSearchData(prevState => [...prevState, ...hits]);
        setShowBtn(page < Math.ceil(totalHits / 12));
      })
      .catch(error => setError(error.message))
      .finally(() => setIsLoading(false));
  }, [page, searchQuery]);

  const onImageClick = largeImgUrl => {
    setLargeImgUrl(largeImgUrl);
  };

  const loadMoreImages = () => {
    setPage(prevState => prevState + 1);
  };

  const handleSubmit = searchQuery => {
    setSearchQuery(searchQuery);
    setSearchData([]);
    setError(null);
    setPage(1);
    setLargeImgUrl('');
    setIsEmpty(false);
    setIsLoading(false);
    setShowBtn(false);
  };

  return (
    <div className={css.app}>
      <Searchbar onSubmit={handleSubmit} />
      {searchData.length > 0 && (
        <ImageGallery searchData={searchData} onImageClick={onImageClick} />
      )}
      {isLoading && (
        <div className={css.backdrop}>
          <Loader />
        </div>
      )}
      {isEmpty && (
        <p className={css.text}>
          Nothing was found by the request '{searchQuery}'.
        </p>
      )}
      {error && <p className={css.text}>Something wrong! {error}</p>}
      {showBtn && <Button loadMoreImages={loadMoreImages} />}
      {largeImgUrl && (
        <Modal onImageClick={onImageClick} largeImgUrl={largeImgUrl} />
      )}
    </div>
  );
};
