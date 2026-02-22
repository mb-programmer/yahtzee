<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Post;
use App\Http\Requests\PostRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $posts = Post::with(['category'])->get();


        return response()->json([
            'posts' => $posts,
            'test' => 'test'
        ]);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(PostRequest $request)
    {
        DB::beginTransaction();

        try {
            $imageName = time().'.'.$request->thumbnail->extension();
            $request->thumbnail->move(public_path('images'), $imageName);

            // FOR AMAZON AWS
            // $request->image->storeAs('images', $imageName, 's3');

            $post = Post::create(array_merge($request->validated(), [
                'thumbnail' => $imageName
            ]));

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post): JsonResponse
    {
        $post = Post::with(['category'])->where('id', '=', $post->id)->first();

        return response()->json([
            'post' => $post,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PostRequest $request, Post $post): JsonResponse
    {
        DB::beginTransaction();

        try {
            if ($request->thumbnail) {
                $imageName = time().'.'.$request->thumbnail->extension();
                $request->thumbnail->move(public_path('images'), $imageName);

                $post->title = $request->title;
                $post->slug = $request->slug;
                $post->category_id = $request->category_id;
                $post->thumbnail = $imageName;
                $post->body = $request->body;
                $post->published_at = $request->published_at;
                $post->save();
            } else {
                $post->update($request->validated());
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
        }
        return response()->json($post);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post): \Illuminate\Http\Response
    {
        $post->delete();

        return response()->noContent();
    }
}
