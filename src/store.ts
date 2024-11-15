import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { rtkQueryErrorLogger } from 'middleware'
import { blogAPI } from 'pages/Blog/blog.service'
import blogReducer from 'pages/Blog/blog.slice'

export const store = configureStore({
  reducer: {
    blog: blogReducer,
    [blogAPI.reducerPath]: blogAPI.reducer //thêm reducer được tạo từ api slice
  },
  //thêm api middleware để enable các tính năng như caching, invalidation, polling của RTK Query
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(blogAPI.middleware, rtkQueryErrorLogger)
})

//Optional, nhưng bắt buộc nếu dùng tính năng refetchOnFocus/
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
