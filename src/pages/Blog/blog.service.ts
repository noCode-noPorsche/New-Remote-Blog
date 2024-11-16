import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Post } from 'types/blog.types'
import { CustomError } from 'utils/helpers'

export const blogAPI = createApi({
  reducerPath: 'blogAPI', //tên feild của Redux State
  tagTypes: ['Posts'], //những kiểu tag cho phép dùng trong blogAPI
  keepUnusedDataFor: 10, //caching: giữ data trong 10s sẽ xóa (mặc định 60s)
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:4000/',
    prepareHeaders(headers) {
      //Truyền header token
      headers.set('Authorization', 'Bearer ABCXYZ')
      return headers
    }
  }),
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
        try {
          return {
            url: 'posts',
            method: 'POST',
            body
          }
        } catch (error: any) {
          throw new CustomError(error.message)
        }
      },
      invalidatesTags: (result, error, body) =>
        error
          ? []
          : [
              {
                type: 'Posts',
                id: 'LIST'
              }
            ]
    }),
    getPostItem: build.query<Post, string>({
      query: (id) => ({
        url: `posts/${id}`, //Truyền header
        headers: {
          hello: 'Im Dustin'
        },
        params: {
          //Truyền Query String Param
          first_name: 'Tsan',
          'last-name': 'Duc'
        }
      })
    }),
    updatePost: build.mutation<Post, { id: string; body: Post }>({
      query(data) {
        // throw Error("hehehehehehe")
        return {
          url: `posts/${data.id}`,
          method: 'PUT',
          body: data.body
        }
      },
      //trong trường hợp này thì getPosts sẽ chạy lại
      invalidatesTags: (result, error, data) =>
        error
          ? []
          : [
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
