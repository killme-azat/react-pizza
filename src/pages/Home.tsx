import React from "react";
import qs from "qs";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  selectFilter,
  setCategoryId,
  setCurrentPage,
  //setFilters,
} from "../redux/slices/filterSlice";
import Categories from "../components/Categories";
import Sort from "../components/Sort";
import PizzaBlock from "../components/PizzaBlock";
import Skeleton from "../components/PizzaBlock/Skeleton";
import Pagination from "../components/Pagination/index";
import { fetchPizzas, selectPizzaData } from "../redux/slices/pizzaSlice";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, status } = useSelector(selectPizzaData);
  const { categoryId, sort, currentPage, searchValue } =
    useSelector(selectFilter);
  const sortType = sort.sortProperty;

  const onChangeCategory = (id: number) => {
    dispatch(setCategoryId(id));
  };

  const onChangePage = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  // React.useEffect(() => {
  //   if (window.location.search) {
  //     const params = qs.parse(window.location.search.substring(1));
  //     const sort = list.find((obj) => obj.sortProperty === params.sortProperty);
  //     dispatch(
  //       setFilters({
  //         ...params,
  //         sort,
  //       })
  //     );
  //   } // eslint-disable-next-line
  // }, []);

  const getPizzas = async () => {
    const category = categoryId > 0 ? `category=${categoryId}` : "";
    const sortBy = sortType.replace("-", "");
    const order = sortType.includes("-") ? `asc` : `desc`;
    const search = searchValue ? `search=${searchValue}` : "";

    dispatch(
      // @ts-ignore
      fetchPizzas({
        category,
        sortBy,
        order,
        search,
        currentPage,
      })
    );

    window.scrollTo(0, 0);
  };

  React.useEffect(() => {
    if (window.location.search) getPizzas();
    // eslint-disable-next-line
  }, [categoryId, sortType, searchValue, currentPage]);

  React.useEffect(() => {
    const queryString = qs.stringify({
      sortType,
      categoryId,
      currentPage,
    });
    navigate(`?${queryString}`); // eslint-disable-next-line
  }, [categoryId, sortType, currentPage]);

  const skeletons = [...new Array(4)].map((_, index) => (
    <Skeleton key={index} />
  ));

  const pizzas = items.map((obj: any) => (
    //<Link  to={`/pizza/${obj.id}`}>
    <PizzaBlock key={obj.id} {...obj} />
    //</Link>
  ));
  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={onChangeCategory} />
        <Sort />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      {status === "error" ? (
        <div className="content__error-info">
          <h2>Произошла ошибка 😕</h2>
          <p>
            К сожалению, не удалось получить питсы.
            <br />
            Попробуйте повторить попытку позже.
          </p>
        </div>
      ) : (
        <div className="content__items">
          {status === "loading" ? skeletons : pizzas}
        </div>
      )}

      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  );
};

export default Home;
