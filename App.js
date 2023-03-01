import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useRef } from "react";
import PostService from "./API/PostService";
import ClassCounter from "./components/ClassCounter";
import Counter from './components/Counter';
import PostFilter from "./components/PostFilter";
import PostForm from "./components/PostForm";
import PostItem from "./components/Postitem";
import PostList from "./components/Postlist";
import MyInput from "./components/UI/button/input/MyInput";
import Loader from "./components/UI/button/Loader/Loader";
import MyButton from "./components/UI/button/MyButton";
import MyModal from "./components/UI/button/MyModal/MyModal";
import MySelect from "./components/UI/button/select/MySelect";
import { useFetching } from "./hooks/useFetching";
import { usePosts } from "./hooks/usePosts";
import './styles/App.css';
import { getPageCount } from "./utils/pages";

function App() {
        const [posts, setPosts] = useState([])

  const removePost = (post) => {
    setPosts(posts.filter(p => p.id !== post.id))
  }
  const [filter, setFilter] = useState({sort: '', query: ''})
  const [modal, setModal] = useState(false);
  const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query)
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  let pagesArray = []
  for (let i = 0; i < totalPages; i++) {
    pagesArray.push(i + 1)
  }
  console.log(pagesArray)

  const [fetchPosts, isPostsLoading, postError] = useFetching(async() => {
    const response = await PostService.getAll(limit, page)
    setPosts(response.data)
    const totalCount = response.headers['x-total-count']
    setTotalPages(getPageCount(totalCount, limit));
  })


  useEffect(() => {
    fetchPosts()
  }, [])

  const createPost = (newPost) => {
    setPosts([...posts, newPost])
    setModal(false)
  }
  return (
    <div className="App">
      <button onClick={fetchPosts}>GET POSTS</button>
      <MyButton style={{marginTop: 30}} onClick={() => setModal(true)}>
          Создать пользователя
      </MyButton>
      <MyModal visible={modal} setVisible={setModal}>
          <PostForm create={createPost}/>
      </MyModal>
      <hr style={{margin: '15px 0'}}/>
      <PostFilter 
          filter={filter} 
          setFilter={setFilter}
      />
      {postError &&
        <h1>Произошла ошибка ${postError}</h1>
      }
      {isPostsLoading
        ? <div style={{display: 'flex', justifyContent: 'center', marginTop: 50}}><Loader/></div>
        : <PostList remove={removePost} posts={sortedAndSearchedPosts} title='Посты про JS'/>
      }
    </div>
  );
}


export default App;