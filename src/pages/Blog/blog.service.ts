import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Post } from 'types/blog.types'

export const blogAPI = createApi({
  reducerPath: 'blogAPI', //tên feild của Redux State
  tagTypes: ['Posts'], //những kiểu tag cho phép dùng trong blogAPI
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/' }),
  endpoints: (build) => ({
    //Generic type theo thứ tự là kiểu response trả về và agrument
    getPosts: build.query<Post[], void>({
      query: () => 'posts', //method không có agrument
      providesTags(result) {
        if (result) {
          const final = [
            ...result.map(({ id }) => ({ type: 'Posts' as const, id })),
            { type: 'Posts' as const, id: 'LIST' }
          ]
          return final
        }
        //const final = [{ type: 'Posts' as const, id: 'LIST' }]
        //return final
        return [{ type: 'Posts', id: 'LIST' }]
      }
    }),
    addPost: build.mutation<Post, Omit<Post, 'id'>>({
      query(body) {
        return {
          url: 'posts',
          method: 'POST',
          body
        }
      },
      invalidatesTags: (result, error, body) => [
        {
          type: 'Posts',
          id: 'LIST'
        }
      ]
    }),
    getPostItem: build.query<Post, string>({
      query: (id) => `posts/${id}`
    }),
    updatePost: build.mutation<Post, { id: string; body: Post }>({
      query(data) {
        return {
          url: `posts/${data.id}`,
          method: 'PUT',
          body: data.body
        }
      },
      //trong trường hợp này thì getPosts sẽ chạy lại
      invalidatesTags: (result, error, data) => [
        {
          type: 'Posts',
          id: data.id
        }
      ]
    }),
    deletePost: build.mutation<{}, string>({
      query(postId) {
        return {
          url: `posts/${postId}`,
          method: 'DELETE'
        }
      },
      invalidatesTags: (result, error, id) => [
        {
          type: 'Posts',
          id
        }
      ]
    })
  })
})

export const {
  useGetPostsQuery,
  useAddPostMutation,
  useGetPostItemQuery,
  useUpdatePostMutation,
  useDeletePostMutation
} = blogAPI
